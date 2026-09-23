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
let signedIn=false,legacyServer=false,legacyList=false;
window.fetch=async(url,opts={})=>{
 const full=new URL(String(url),'https://editor.test');
 if(legacyServer&&full.pathname==='/api/version')return new Response(JSON.stringify({error:'요청을 찾을 수 없습니다.'}),{status:404,headers:{'Content-Type':'application/json'}});
 const auth=signedIn?{'oai-authenticated-user-id':'alice','oai-authenticated-user-email':'alice@test.local'}:{};
 let body=opts.body;if(body&&body.buffer instanceof ArrayBuffer)body=new Uint8Array(body);
 const res=await worker.fetch(new Request(full,{method:opts.method||'GET',headers:{...auth,Origin:'https://editor.test',...(opts.headers||{})},...(body!=null?{body}:{})}),env);
 // 예전 워커는 목록에 조각·녹음 수를 내려주지 않았다. 그때도 화면에는 숫자가 떠야 한다.
 if(legacyList&&full.pathname==='/api/folders'&&res.status===200){const data=await res.json();
  return new Response(JSON.stringify({...data,folders:data.folders.map(({clips,takes,...rest})=>rest)}),{status:200,headers:{'Content-Type':'application/json'}});}
 return res;
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

// 대화상자가 열려 있어도 오류 메시지가 backdrop 뒤에 가려지지 않는다
$('foldersBtn').click();await wait();
$('newFolderName').value='';$('newCloudFolder').click();await wait(200);
assert.equal($('toast').textContent,'폴더 이름을 입력하세요.');
assert.equal($('toast').parentNode.id,'folderDialog','토스트가 열린 대화상자 안으로 올라와야 한다');
assert.ok($('toast').classList.contains('show'));
$('closeFolders').click();await wait(100);
assert.equal($('toast').parentNode,window.document.body,'대화상자를 닫으면 토스트가 제자리로 돌아온다');

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
assert.match($('syncBadge').textContent,/서버 저장 완료/,'아래 저장 줄을 걷어낸 뒤에는 작업 폴더 옆 배지가 상태를 알린다');
assert.match($('folderStatus').textContent,/서버 저장 완료/,'상태가 대화상자 안에도 보여야 한다');
assert.equal($('folderStatus').hidden,false);
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

// 목록에서 서버본에 타임라인이 들어 있는지 바로 보여야 한다
$('refreshFolders').click();await wait(400);
assert.match(rows()[0].querySelector('small').textContent,/조각 \d+ · 녹음 \d+/,'목록 줄에 조각·녹음 수가 보인다');

// 서버가 그 수를 안 내려주는 예전 버전이어도, 폴더 문서를 읽어 채워 넣는다
legacyList=true;$('refreshFolders').click();await wait(200);
assert.match(rows()[0].querySelector('small').textContent,/타임라인 확인 중…|조각 \d+/);
await wait(600);
assert.match(rows()[0].querySelector('small').textContent,/조각 \d+ · 녹음 \d+/,'예전 서버에서도 숫자를 채워 넣는다');
legacyList=false;

// 계정 공용 소재함 — 한 번 올린 그림은 다음 작업에서 다시 올리지 않는다
{
 const png=new window.File([new Uint8Array([1,2,3,4,5,6])],'공용.png',{type:'image/png'});
 $('edFiles').files={length:1,0:png,[Symbol.iterator]:function*(){yield this[0];}};
 $('edFiles').dispatchEvent(new window.Event('change',{bubbles:true}));
 await wait(900);
 const all=await(await window.fetch('/api/folders')).json();
 const lib=all.folders.find(f=>f.name==='__burcol_library__');
 assert.ok(lib,'계정에 공용 소재함 문서가 만들어진다');
 const doc=(await(await window.fetch('/api/folders/'+lib.id)).json()).project;
 const shared=Object.keys(doc.assets);
 assert.ok(shared.some(k=>k.endsWith('공용.png')),'가져온 그림이 공용 소재함에 올라간다');
 assert.deepEqual(doc.sentences,[],'공용 소재함은 작업이 아니라 소재만 담는다');

 $('refreshFolders').click();await wait(500);
 assert.ok(!names().some(n=>n.includes('__burcol_library__')),'작업 폴더 목록에는 보이지 않는다');

 // 새 작업을 시작해도 계정 소재함은 그대로 있고, 눌러서 바로 가져다 쓴다
 $('newProject').click();await wait(500);
 assert.equal(window.document.querySelector('#edAssets [data-asset$="공용.png"]'),null,'새 작업에는 아직 그 소재가 없다');
 const row=window.document.querySelector('#edAssets [data-lib$="공용.png"]');
 assert.ok(row,'새 작업에서도 계정 소재함에 그 그림이 보인다');
 row.click();await wait(700);
 assert.ok(window.document.querySelector('#edAssets [data-asset$="공용.png"]'),'눌러서 이 작업으로 가져온다');

 // 계정 소재함에서도 이름을 바꾸고 폴더로 옮긴다
 const libDoc=async()=>(await(await window.fetch('/api/folders/'+lib.id)).json()).project;
 {
  const row=window.document.querySelector('#edAssets [data-lib$="공용.png"]');
  row.querySelector('[data-librename]').click();
  const input=row.querySelector('.row-rename');
  assert.ok(input,'공용 소재 줄에서도 이름 칸이 열린다');
  input.value='로고';input.onblur();await wait(600);
  assert.ok(Object.keys((await libDoc()).assets).some(k=>k.endsWith('로고.png')),'계정 소재함에서 이름이 바뀐다');

  window.document.querySelector('#edAssets [data-libnew]').click();await wait(600);
  const made=(await libDoc()).folders.find(f=>f.includes('새 폴더'));
  assert.ok(made,'계정 소재함에도 폴더를 만든다');

  const target=window.document.querySelector(`#edAssets [data-libfolder="${made}"]`);
  const move=new window.Event('drop',{bubbles:true});
  move.dataTransfer={getData:t=>t==='text/libasset'?'media/로고.png':''};
  target.dispatchEvent(move);await wait(700);
  assert.ok(Object.keys((await libDoc()).assets).includes(made+'/로고.png'),'끌어다 놓으면 그 폴더로 옮겨진다');
 }

 // 같은 그림을 또 올려도 서버에는 한 벌만 쌓인다
 const again=(await(await window.fetch('/api/folders/'+lib.id)).json()).project;
 assert.equal(Object.keys(again.assets).length,shared.length,'같은 소재가 공용 소재함에 두 번 쌓이지 않는다');
}

assert.deepEqual(errors,[]);
console.log('PASS folder dialog signed-out guidance, toast above modal, in-dialog status, save to new folder, open another project, rename, delete, blank project, timeline counts on every folder row, an account-wide asset library, and renaming or moving inside it');
await window.happyDOM.abort();
