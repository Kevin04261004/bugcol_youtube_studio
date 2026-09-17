import assert from 'node:assert/strict';
import worker from '../server/worker.js';
import {planAudioImports} from '../dist/core.js';
class Bucket{
 map=new Map();seq=0;
 async put(key,value,opts={}){const old=this.map.get(key),c=opts.onlyIf||{};if(c.etagMatches&&old?.etag!==c.etagMatches||c.etagDoesNotMatch==='*'&&old)return null;const bytes=typeof value==='string'?new TextEncoder().encode(value):value;const o={key,bytes:new Uint8Array(bytes),etag:'version'+(++this.seq),customMetadata:opts.customMetadata,uploaded:new Date()};this.map.set(key,o);return o;}
 async head(key){return this.map.get(key)||null;}
 async delete(key){this.map.delete(key);}
 async get(key){const o=this.map.get(key);return o?{...o,body:o.bytes,json:async()=>JSON.parse(new TextDecoder().decode(o.bytes))}:null;}
 async list({prefix}){return{objects:[...this.map.values()].filter(o=>o.key.startsWith(prefix)),truncated:false};}
}
const bucket=new Bucket(),env={BUCKET:bucket},id='a1234567-1234-1234-1234-123456789abc';
const call=(path,method='GET',body=null,user='alice',extra={})=>worker.fetch(new Request('https://editor.test'+path,{method,headers:{...(user?{'oai-authenticated-user-id':user,'oai-authenticated-user-email':user+'@test.local'}:{}),Origin:'https://editor.test',...extra},...(body!==null?{body:typeof body==='string'||body instanceof Uint8Array?body:JSON.stringify(body)}:{})}),env);
assert.equal((await call('/api/folders','GET',null,null)).status,401);
assert.equal((await call('/api/folders')).status,200);
const bytes=new Uint8Array(new Float32Array([.2,.3,.4]).buffer),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
assert.equal((await call('/api/media/'+hash,'PUT',bytes)).status,200);
assert.equal((await call('/api/media/'+hash,'GET',null,'bob')).status,404);
assert.equal((await call('/api/media/'+hash,'PUT',bytes,'alice',{Origin:'https://evil.test'})).status,403);
assert.equal((await call('/api/media/'+'0'.repeat(64),'PUT',bytes)).status,400);
const doc={version:1,name:'Cross device',sentences:[{id:1,text:'Hello',audio:{parts:[hash],size:12,samples:3},scene:{motion:'none',captions:false}}],assets:{}};
const created=await call('/api/folders/'+id,'PUT',doc,'alice',{'If-None-Match':'*'});assert.equal(created.status,200);const first=await created.json();
assert.equal((await call('/api/folders/'+id,'GET',null,'bob')).status,404);
const restored=await(await call('/api/folders/'+id)).json();assert.equal(restored.project.name,doc.name);assert.deepEqual(new Uint8Array(await(await call('/api/media/'+hash)).arrayBuffer()),bytes);
const update=await call('/api/folders/'+id,'PUT',{...doc,name:'Newer edit'},'alice',{'If-Match':first.etag});assert.equal(update.status,200);
assert.equal((await call('/api/folders/'+id,'PUT',doc,'alice',{'If-Match':first.etag})).status,409);
assert.equal((await call('/api/folders/'+id,'PUT',doc,'alice',{'If-None-Match':'*'})).status,409);
assert.equal((await(await call('/api/folders')).json()).folders.length,1);
assert.equal((await(await call('/api/folders','GET',null,'bob')).json()).folders.length,0);
assert.equal((await call('/api/folders/'+id,'DELETE',null,'alice',{Origin:'https://evil.test'})).status,403);
assert.equal((await call('/api/folders/'+id,'DELETE',null,'bob')).status,404);
assert.equal((await(await call('/api/folders')).json()).folders.length,1);
assert.equal((await call('/api/folders/'+id,'DELETE')).status,200);
assert.equal((await call('/api/folders/'+id,'GET')).status,404);
assert.equal((await call('/api/folders/'+id,'DELETE')).status,404);
assert.equal((await(await call('/api/folders')).json()).folders.length,0);
assert.equal((await call('/api/media/'+hash,'GET')).status,200);
assert.deepEqual(planAudioImports([{name:'002.mp3'},{name:'001.wav'}],[{id:1},{id:2}],1).map(p=>p.id),[2,1]);
assert.equal(planAudioImports([{name:'voice.m4a'}],[{id:7}],7)[0].id,7);
assert.throws(()=>planAudioImports([{name:'001.mp3'},{name:'001.wav'}]));
assert.throws(()=>planAudioImports([{name:'010.mp3'}],[{id:1}],1));
console.log('PASS authenticated folder/media round-trip, user isolation, CSRF, hash verification, save conflicts, folder delete, audio filename mapping');
