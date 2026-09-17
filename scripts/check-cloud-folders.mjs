import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
class Bucket{
 map=new Map();seq=0;
 async put(key,value,opts={}){const old=this.map.get(key),c=opts.onlyIf||{};if(c.etagMatches&&old?.etag!==c.etagMatches||c.etagDoesNotMatch==='*'&&old)return null;const bytes=typeof value==='string'?new TextEncoder().encode(value):new Uint8Array(value);const o={key,bytes,etag:'v'+(++this.seq),customMetadata:opts.customMetadata,uploaded:new Date()};this.map.set(key,o);return o;}
 async head(key){return this.map.get(key)||null;}
 async get(key){const o=this.map.get(key);return o?{...o,body:o.bytes,json:async()=>JSON.parse(new TextDecoder().decode(o.bytes))}:null;}
 async delete(key){this.map.delete(key);}
 async list({prefix}){return{objects:[...this.map.values()].filter(o=>o.key.startsWith(prefix)),truncated:false};}
}
const env={BUCKET:new Bucket(),LIVE_SOURCE:'off'};
const window=new Window({url:'https://editor.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
window.document.write(fs.readFileSync('dist/index.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]||(()=>{})});
window.confirm=()=>true;window.structuredClone=structuredClone;window.crypto=globalThis.crypto;
window.document.modelContext={registerTool:async()=>{}};
let signedIn=false,legacyServer=false;
window.fetch=async(url,opts={})=>{
 const full=new URL(String(url),'https://editor.test');
 if(legacyServer&&full.pathname==='/api/version')return new Response(JSON.stringify({error:'요청을 찾을 수 없습니다.'}),{status:404,headers:{'Content-Type':'application/json'}});
 const auth=signedIn?{'oai-authenticated-user-id':'alice','oai-authenticated-user-email':'alice@test.local'}:{};
 let body=opts.body;if(body&&body.buffer instanceof ArrayBuffer)body=new Uint8Array(body);
 return worker.fetch(new Request(full,{method:opts.method||'GET',headers:{...auth,Origin:'https://editor.test',...(opts.headers||{})},...(body!=null?{body}:{})}),env);
};
const errors=[];window.addEventListener('error',e=>errors.push(e.message));
const bundle=await build({entryPoints:['dist/app.js'],bundle:true,write:false,format:'esm'});
window.eval('(async()=>{'+bundle.outputFiles[0].text+'})()');
const wait=(ms=250)=>new Promise(r=>setTimeout(r,ms));
const $=id=>window.document.getElementById(id);
const rows=()=>[...window.document.querySelectorAll('#folderList .cloud-folder')];
const names=()=>rows().map(r=>r.querySelector('strong').textContent);
await wait(200);

// 로그인 전에도 작업 폴더 창이 비어 보이지 않는다
$('foldersBtn').click();await wait();
assert.equal($('folderDialog').open,true);
assert.equal($('cloudSignedOut').hidden,false,'로그인 전에는 안내와 로그인 버튼이 보여야 한다');
assert.equal($('cloudActions').hidden,true);
assert.ok($('cloudSignedOut').textContent.includes('서버 작업 폴더'),'폴더가 무엇인지 설명이 있어야 한다');
assert.ok($('cloudSignIn'),'로그인 버튼이 있어야 한다');
$('closeFolders').click();

// 로그인하면 폴더 관리 화면이 열린다
signedIn=true;
$('sampleBtn').click();await wait(100);
const sampleCount=window.document.querySelectorAll('.sentence-item').length;
assert.ok(sampleCount>=3);
$('foldersBtn').click();await wait();
assert.equal($('cloudSignedOut').hidden,true);
assert.equal($('cloudActions').hidden,false);
assert.ok($('currentFolder').textContent.includes('아직 서버 폴더에 저장하지 않았습니다'));
assert.equal($('currentFolder').classList.contains('linked'),false);
assert.equal(rows().length,0);

// 지금 작업을 새 폴더로 올린다
$('newFolderName').value='첫 작업';$('newCloudFolder').click();await wait(700);
assert.match($('cloudStatus').textContent,/서버 저장 완료/);
assert.deepEqual(names(),['▣ 첫 작업']);
assert.ok($('currentFolder').classList.contains('linked'));
assert.ok(rows()[0].classList.contains('current'),'지금 열린 폴더가 표시되어야 한다');

// 빈 프로젝트로 시작하면 서버 폴더 연결이 끊긴다
$('newProject').click();await wait();
assert.equal(window.document.querySelectorAll('.sentence-item').length,0);
assert.equal($('currentFolder').classList.contains('linked'),false);

// 두 번째 폴더를 만들고 첫 폴더를 다시 가져온다
$('sampleBtn').click();await wait(100);
$('newFolderName').value='두 번째 작업';$('newCloudFolder').click();await wait(700);
assert.deepEqual(names().sort(),['▣ 두 번째 작업','▣ 첫 작업']);
$('projectName').value='두 번째 작업';
rows().find(r=>r.textContent.includes('첫 작업')).querySelector('.folder-open').click();await wait(700);
assert.equal($('folderDialog').open,false,'폴더를 열면 창이 닫힌다');
assert.equal($('projectName').value,'첫 작업');
assert.equal(window.document.querySelectorAll('.sentence-item').length,sampleCount);

// 폴더 이름을 바꾸면 목록과 화면 이름이 함께 바뀐다
window.prompt=()=>'이름 바꾼 작업';
$('foldersBtn').click();await wait();
rows().find(r=>r.textContent.includes('첫 작업')).querySelectorAll('.text-btn')[0].click();await wait(700);
assert.ok(names().includes('▣ 이름 바꾼 작업'),'바뀐 이름이 목록에 보여야 한다');
assert.equal($('projectName').value,'이름 바꾼 작업','지금 열린 폴더면 화면 이름도 바뀐다');

// 지금 열린 폴더를 삭제하면 목록에서 사라지고 서버 연결이 끊긴다
rows().find(r=>r.textContent.includes('이름 바꾼 작업')).querySelectorAll('.text-btn')[1].click();await wait(700);
assert.deepEqual(names(),['▣ 두 번째 작업']);
assert.equal($('currentFolder').classList.contains('linked'),false,'삭제한 폴더와의 연결이 끊겨야 한다');
assert.equal(window.document.querySelectorAll('.sentence-item').length,sampleCount,'기기에 열려 있던 작업은 남는다');

// 삭제 endpoint 가 아직 배포되지 않은 서버에서는 삭제 버튼을 내보내지 않는다
legacyServer=true;$('refreshFolders').click();await wait(400);
assert.equal(rows().length,1);
assert.deepEqual([...rows()[0].querySelectorAll('.text-btn')].map(b=>b.textContent),['이름 바꾸기']);
legacyServer=false;$('refreshFolders').click();await wait(400);
assert.deepEqual([...rows()[0].querySelectorAll('.text-btn')].map(b=>b.textContent),['이름 바꾸기','삭제']);

assert.deepEqual(errors,[]);
console.log('PASS folder dialog signed-out guidance, save to new folder, open another project, rename, delete, blank project');
await window.happyDOM.abort();
