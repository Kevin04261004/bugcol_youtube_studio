import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const w=new Window({url:'https://editor.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
w.document.write(fs.readFileSync('dist/index.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
w.structuredClone=structuredClone;w.crypto=globalThis.crypto;w.confirm=()=>true;
let local={version:1,name:'old',sentences:[],assets:{},cloud:{id:'one',etag:'v1',userId:'alice'},cloudDirty:false};
let remote={project:{name:'phone recording',sentences:[{id:1,text:'recorded',scene:{},audio:{parts:['audio'],size:8,samples:2}}],assets:{}},etag:'v2'};
let busy=false,fail=false,writes=0,conflict=false;
w.fetch=async(path,opts={})=>{
 if(fail)throw Error('offline');
 if(path==='/api/session')return Response.json({user:{id:'alice',email:'alice@test'}});
 if(path==='/api/media/audio')return new Response(new Float32Array([.25,-.5]));
 if(path.startsWith('/api/media/'))return opts.method==='HEAD'?new Response(null,{status:200}):opts.method==='PUT'?new Response(null,{status:204}):new Response(new Uint8Array(4));
 if(path==='/api/folders/one'){
  if(opts.method==='PUT'){writes++;if(conflict||opts.headers['If-Match']!==remote.etag)return Response.json({error:'conflict'},{status:409});remote={project:JSON.parse(opts.body),etag:'v3'};return Response.json({etag:'v3',updatedAt:new Date().toISOString()});}
  return Response.json(remote);
 }
 throw Error('unexpected '+path);
};
w.hooks={getProject:()=>local,isBusy:()=>busy,setBusy:v=>busy=v,toast:()=>{},persistLocal:()=>{},setProject:p=>local=p};
const bundle=await build({stdin:{contents:"import {createCloudEditor} from './dist/cloud.js';window.sync=createCloudEditor(window.hooks);",resolveDir:process.cwd()},bundle:true,write:false,format:'iife'});
w.eval(bundle.outputFiles[0].text);
await w.sync.init();
assert.equal(local.name,'phone recording');assert.deepEqual([...local.sentences[0].audio],[.25,-.5]);assert.equal(writes,0);
local.name='pc edits';local.cloudDirty=true;remote.etag='phone-v3';
await w.sync.reconcile();assert.equal(local.name,'pc edits');assert.equal(writes,0);assert.match(w.document.getElementById('syncBadge').textContent,/양쪽 기기/);
// Reopening a stale clean copy pulls the remote; recording prevents replacement.
local.cloudDirty=false;busy=true;await w.sync.reconcile();assert.equal(local.name,'pc edits');busy=false;
await w.sync.reconcile();assert.equal(local.cloud.etag,'phone-v3');
local.name='pending upload';local.cloudDirty=true;fail=true;await w.sync.reconcile();assert.equal(local.cloudDirty,true);
fail=false;await w.sync.reconcile();assert.equal(remote.project.name,'pending upload');assert.equal(local.cloudDirty,false);
// A server update racing the preflight read must still fail the conditional write.
local.cloudDirty=true;local.name='keep me';conflict=true;await w.sync.reconcile();assert.equal(local.name,'keep me');assert.equal(local.cloudDirty,true);assert.equal(remote.project.name,'pending upload');
// The timeline itself must reach the server and come back — this is what a second device opens.
conflict=false;
local={version:2,name:'timeline work',cloud:{id:'one',etag:remote.etag,userId:'alice'},cloudDirty:true,captions:true,
 folders:['media/Record','media/컷'],sentences:[{id:1,text:'첫 문장',audio:null}],
 video:[{id:'v1',start:0,duration:4.5,scene:{background:'#ffffff',layers:[{id:'L1',asset:'media/컷/a.png',kind:'image',lane:0,start:0,end:0}],materialTracks:[{name:'배경'}]}}],
 audio:[{id:'a1',sentenceId:1,start:1.25,duration:2,offset:.5,text:'첫 문장'}],assets:{'media/컷/a.png':new w.Blob([new Uint8Array(4)])}};
await w.sync.reconcile();
assert.equal(remote.project.name,'timeline work','the save reached the server');
assert.equal(remote.project.video.length,1,'영상 조각이 서버에 올라간다');
assert.equal(remote.project.video[0].duration,4.5);
assert.equal(remote.project.video[0].scene.layers[0].asset,'media/컷/a.png','조각 안의 소재 배치까지 올라간다');
assert.equal(remote.project.video[0].scene.materialTracks[0].name,'배경','소재 라인 이름도 올라간다');
// 끊긴 소재 참조 하나가 저장 전체를 막으면 안 된다 — 서버가 400 으로 되돌려 보내기 때문이다.
local.video[0].scene.asset='media/사라진.png';local.video[0].scene.layers.push({id:'L2',asset:'media/사라진2.png',kind:'image',lane:1,start:0,end:0});
local.cloudDirty=true;local.cloud.etag=remote.etag;
await w.sync.reconcile();
assert.equal(remote.project.video[0].scene.asset,undefined,'없는 소재를 가리키던 자리는 털어 내고 저장한다');
assert.equal(remote.project.video[0].scene.layers[1].asset,'','블록도 빈 칸으로 올라간다');
assert.equal(remote.project.video[0].scene.layers[0].asset,'media/컷/a.png','멀쩡한 참조는 그대로다');
assert.deepEqual([...remote.project.audio.map(c=>[c.start,c.duration,c.offset])],[[1.25,2,.5]],'녹음 트랙도 올라간다');
assert.deepEqual([...remote.project.folders],['media/Record','media/컷'],'소재함 폴더도 올라간다');

// Opening that folder on another device restores the same timeline.
local={version:2,name:'other device',sentences:[],video:[],audio:[],assets:{},cloud:{id:'one',etag:'stale',userId:'alice'},cloudDirty:false};
await w.sync.reconcile();
assert.equal(local.name,'timeline work','서버 폴더를 그대로 받아 온다');
assert.equal(local.video.length,1,'받은 쪽에도 영상 조각이 있다');
assert.equal(local.video[0].scene.layers[0].asset,'media/컷/a.png');
assert.deepEqual([...local.audio.map(c=>c.start)],[1.25],'녹음 트랙 위치도 같다');
assert.deepEqual([...local.folders],['media/Record','media/컷'],'폴더 구조도 같다');

// An unlinked device copy must never silently overwrite or upload an old project.
local={name:'unlinked old copy',sentences:[],assets:{}};const before=writes;await w.sync.reconcile();assert.equal(writes,before);assert.match(w.document.getElementById('syncBadge').textContent,/이 기기에만/);
await w.happyDOM.abort();console.log('PASS cross-device audio refresh, busy protection, conflict preservation, offline retry, conditional-write race, unlinked status, and a full timeline round trip through the server');
