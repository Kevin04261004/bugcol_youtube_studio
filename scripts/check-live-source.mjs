import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const buildId=(await readFile('dist/build-id.txt','utf8')).trim();
const BASE='https://live.test/dist';
let calls=[],reply=()=>new Response('Not found',{status:404});
const pathOf=u=>String(u).split('?')[0];
globalThis.fetch=async(url,opts)=>{calls.push(String(url));return reply(pathOf(url),opts);};
const get=(path,env={LIVE_SOURCE:BASE},method='GET')=>{calls=[];return worker.fetch(new Request('https://editor.test'+path,{method}),env);};
const text=async r=>(await r.text()).trim();

// 살아 있는 저장소 사본을 먼저 쓴다
reply=path=>path===BASE+'/index.html'?new Response('<!doctype html><p>새 화면'):new Response('Not found',{status:404});
let r=await get('/');
assert.equal(r.headers.get('X-Studio-Source'),'live');
assert.equal(r.headers.get('Content-Type'),'text/html; charset=utf-8');
assert.match(await text(r),/새 화면/);
assert.equal(calls.length,1);assert.equal(pathOf(calls[0]),BASE+'/index.html');
assert.match(calls[0],/[?&]t=\d+$/,'캐시를 끊는 값이 주소에 붙어야 한다');

// 저장소를 못 읽으면 내장 사본으로 되돌아간다: 404, 빈 응답, 네트워크 오류, 타임아웃
for(const broken of [()=>new Response('Not found',{status:404}),()=>new Response(''),()=>{throw new Error('network down');},async()=>{await new Promise(done=>setTimeout(done,50));throw Object.assign(new Error('timed out'),{name:'TimeoutError'});}]){
 reply=broken;r=await get('/');
 assert.equal(r.headers.get('X-Studio-Source'),'bundled');
 assert.match(await text(r),/버콜 스튜디오/);
}

// LIVE_SOURCE=off 이면 외부 요청 없이 내장 사본만 쓴다
reply=()=>new Response('<p>안 쓰여야 한다');
r=await get('/',{LIVE_SOURCE:'off'});
assert.deepEqual(calls,[]);
assert.equal(r.headers.get('X-Studio-Source'),'bundled');
assert.match(await text(r),/버콜 스튜디오/);

// 저장소에만 있는 새 화면 파일도 배포된다
reply=path=>path===BASE+'/vendor/extra.js'?new Response('export const ok=1;'):new Response('Not found',{status:404});
r=await get('/vendor/extra.js');
assert.equal(r.status,200);
assert.equal(r.headers.get('Content-Type'),'text/javascript; charset=utf-8');
assert.equal(await text(r),'export const ok=1;');

// 서버 코드와 설정, 경로 탈출은 저장소에 있어도 내보내지 않는다
reply=()=>new Response('secret');
for(const path of ['/server/index.js','/server/worker.js','/.openai/hosting.json','/build-id.txt','/vendor/../../server/worker.js','/package.json.bak','/history/IMPLEMENTATION.md']){
 r=await get(path);
 assert.equal(r.status,404,path+' 는 404 여야 한다');
 assert.deepEqual(calls,[],path+' 는 저장소를 조회하지 않아야 한다');
}
// 어떤 주소로 요청해도 저장소 조회는 dist 아래를 벗어나지 않는다
for(const path of ['/%2E%2E/secret.js','/vendor/%2e%2e/app.js','//evil.test/app.js','/a/./b.js']){
 await get(path);
 for(const url of calls)assert.ok(url.startsWith(BASE+'/')&&!url.includes('..'),path+' 가 '+url+' 를 조회했다');
}

// 30초마다 주소가 바뀌어 캐시가 갈아끼워진다
reply=()=>new Response('<p>x');
const bustOf=async()=>{await get('/');return calls[0].match(/[?&]t=(\d+)/)[1];};
const b1=await bustOf();
assert.equal(await bustOf(),b1,'같은 30초 구간에서는 같은 주소를 쓴다');
const real=Date.now;Date.now=()=>real()+31000;
try{assert.notEqual(await bustOf(),b1,'30초가 지나면 주소가 바뀐다');}finally{Date.now=real;}

// /api/version 으로 실제 반영된 버전을 확인할 수 있다
reply=path=>path===BASE+'/build-id.txt'?new Response('abc123456789\n'):new Response('Not found',{status:404});
assert.deepEqual(await(await get('/api/version')).json(),{bundled:buildId,live:'abc123456789',source:'live'});
reply=()=>new Response('Not found',{status:404});
assert.deepEqual(await(await get('/api/version')).json(),{bundled:buildId,live:null,source:'bundled'});
reply=path=>path===BASE+'/build-id.txt'?new Response(buildId):new Response('Not found',{status:404});
assert.equal((await(await get('/api/version')).json()).source,'bundled');

// 로그인 없이도 버전은 확인할 수 있지만 작업 폴더는 여전히 막혀 있다
reply=()=>new Response('Not found',{status:404});
assert.equal((await get('/api/version')).status,200);
assert.equal((await get('/api/folders')).status,401);
console.log('PASS live deploy from repository, bundled fallback, path allowlist, version reporting');
