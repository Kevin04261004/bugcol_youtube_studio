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
// An unlinked device copy must never silently overwrite or upload an old project.
local={name:'unlinked old copy',sentences:[],assets:{}};const before=writes;await w.sync.reconcile();assert.equal(writes,before);assert.match(w.document.getElementById('syncBadge').textContent,/이 기기에만/);
await w.happyDOM.abort();console.log('PASS cross-device audio refresh, busy protection, conflict preservation, offline retry, conditional-write race and unlinked status');
