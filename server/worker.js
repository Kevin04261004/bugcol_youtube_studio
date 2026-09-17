const MAX_PART=8*1024*1024, HASH=/^[a-f0-9]{64}$/, ID=/^[a-f0-9-]{36}$/;
const LIVE_DEFAULT='https://raw.githubusercontent.com/Kevin04261004/bugcol_youtube_studio/live/dist';
const LIVE_PATH=/^\/(?!server\/)(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(html|css|js|json|svg|png|jpe?g|webp|woff2|ico|map)$/i;
const LIVE_TYPES={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',json:'application/json; charset=utf-8',map:'application/json; charset=utf-8',svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',woff2:'font/woff2',ico:'image/x-icon'};
const BUNDLED=typeof STATIC_FILES==='object'?STATIC_FILES:{}, BUILD=typeof BUILD_ID==='string'?BUILD_ID:'dev';
const liveBase=env=>{const base=env?.LIVE_SOURCE??LIVE_DEFAULT;return base&&base!=='off'?base.replace(/\/$/,''):null;};
const LIVE_WINDOW=30000;
async function liveGet(env,path){const base=liveBase(env);if(!base)return null;try{const bust=(path.includes('?')?'&':'?')+'t='+Math.floor(Date.now()/LIVE_WINDOW);const r=await fetch(base+path+bust,{signal:AbortSignal.timeout(2500),cf:{cacheTtl:30,cacheEverything:true}});if(!r.ok)return null;const bytes=new Uint8Array(await r.arrayBuffer());return bytes.length?bytes:null;}catch{return null;}}
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...headers}});
const fail=(status,message)=>Object.assign(new Error(message),{status});
async function digest(data){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(b=>b.toString(16).padStart(2,'0')).join('');}
async function limitedBody(req,max){if(Number(req.headers.get('content-length'))>max)throw fail(413,'파일 조각이 너무 큽니다.');const reader=req.body?.getReader();if(!reader)return new Uint8Array();const chunks=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw fail(413,'요청 크기가 너무 큽니다.');}chunks.push(value);}const bytes=new Uint8Array(size);let off=0;for(const c of chunks){bytes.set(c,off);off+=c.length;}return bytes;}
function validateManifest(doc){
 if(doc?.version!==1||typeof doc.name!=='string'||doc.name.length>200||!Array.isArray(doc.sentences)||doc.sentences.length>2000||!doc.assets||Array.isArray(doc.assets))throw fail(400,'작업 폴더 형식이 올바르지 않습니다.');
 const parts=new Set(),ids=new Set();
 const file=f=>{if(!f||!Number.isInteger(f.size)||f.size<0||!Array.isArray(f.parts)||f.parts.length>2048||f.parts.length!==Math.ceil(f.size/MAX_PART))throw fail(400,'소재 정보 오류');for(const p of f.parts){if(!HASH.test(p))throw fail(400,'파일 ID 오류');parts.add(p);}};
 for(const [name,f]of Object.entries(doc.assets)){if(name.length>300||/(^|\/)\.\.(\/|$)|^\/|\\/.test(name))throw fail(400,'소재 경로 오류');file(f);}
 for(const s of doc.sentences){if(!Number.isInteger(s.id)||s.id<1||ids.has(s.id)||typeof s.text!=='string'||s.text.length>20000||!s.scene)throw fail(400,'문장 정보 오류');ids.add(s.id);if(s.audio){file(s.audio);if(!Number.isInteger(s.audio.samples)||s.audio.samples*4!==s.audio.size)throw fail(400,'녹음 정보 오류');}if(s.scene.asset&&!Object.hasOwn(doc.assets,s.scene.asset))throw fail(400,'장면 소재 누락');}
 if(parts.size>10000)throw fail(413,'작업을 여러 폴더로 나누어 주세요.');return [...parts];
}
export async function api(req,env){
 const u=new URL(req.url),path=u.pathname,uid=req.headers.get('oai-authenticated-user-id'),email=req.headers.get('oai-authenticated-user-email');
 if(path==='/api/session')return json({user:uid&&email?{id:uid,email}:null});
 if(path==='/api/version'){const bytes=await liveGet(env,'/build-id.txt'),live=bytes?new TextDecoder().decode(bytes).trim():null;return json({bundled:BUILD,live,source:live&&live!==BUILD?'live':'bundled'});}
 if(!uid||!email)return json({error:'서버 작업 폴더를 사용하려면 ChatGPT로 로그인하세요.'},401);
 if(!['GET','HEAD'].includes(req.method)&&req.headers.get('origin')!==u.origin)return json({error:'같은 사이트에서만 저장할 수 있습니다.'},403);
 if(!env.BUCKET)return json({error:'서버 저장소를 준비 중입니다. 현재 작업은 기기에 유지됩니다.'},503);
 const owner=await digest(new TextEncoder().encode(uid)),prefix=`users/${owner}/`,bucket=env.BUCKET;
 if(path==='/api/folders'&&req.method==='GET'){
  const data=await bucket.list({prefix:prefix+'folders/',limit:100,cursor:u.searchParams.get('cursor')||undefined,include:['customMetadata']});
  return json({folders:data.objects.map(o=>({id:o.key.split('/').pop().replace('.json',''),name:o.customMetadata?.name||'작업 폴더',updatedAt:o.customMetadata?.updatedAt||o.uploaded,etag:o.etag,count:Number(o.customMetadata?.count||0)})),cursor:data.truncated?data.cursor:null});
 }
 const media=path.match(/^\/api\/media\/([a-f0-9]{64})$/);
 if(media){const key=prefix+'media/'+media[1];
  if(req.method==='HEAD'){const o=await bucket.head(key);return new Response(null,{status:o?200:404,headers:{'Cache-Control':'no-store'}});}
  if(req.method==='GET'){const o=await bucket.get(key);return o?new Response(o.body,{headers:{'Content-Type':'application/octet-stream','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}}):json({error:'소재를 찾을 수 없습니다.'},404);}
  if(req.method==='PUT'){const bytes=await limitedBody(req,MAX_PART);if(await digest(bytes)!==media[1])throw fail(400,'파일 검증 실패');await bucket.put(key,bytes,{onlyIf:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/octet-stream'}});return json({saved:true});}
 }
 const folder=path.match(/^\/api\/folders\/([a-f0-9-]{36})$/);
 if(folder&&ID.test(folder[1])){const key=prefix+'folders/'+folder[1]+'.json';
  if(req.method==='GET'){const o=await bucket.get(key);if(!o)return json({error:'작업 폴더를 찾을 수 없습니다.'},404);return json({project:await o.json(),etag:o.etag});}
  if(req.method==='DELETE'){if(!await bucket.head(key))return json({error:'작업 폴더를 찾을 수 없습니다.'},404);await bucket.delete(key);return json({deleted:true});}
  if(req.method==='PUT'){
   let doc;try{doc=JSON.parse(new TextDecoder().decode(await limitedBody(req,4*1024*1024)));}catch(e){if(e.status)throw e;throw fail(400,'작업 정보가 올바르지 않습니다.');}
   const refs=validateManifest(doc);
   for(let i=0;i<refs.length;i+=16){const found=await Promise.all(refs.slice(i,i+16).map(p=>bucket.head(prefix+'media/'+p)));if(found.some(x=>!x))throw fail(400,'아직 업로드하지 못한 소재가 있습니다. 다시 저장하세요.');}
   const etag=req.headers.get('if-match'),create=req.headers.get('if-none-match')==='*';if(!etag&&!create)throw fail(428,'이전 저장 버전을 확인해야 합니다.');
   doc.updatedAt=new Date().toISOString();const saved=await bucket.put(key,JSON.stringify(doc),{onlyIf:etag?{etagMatches:etag.replaceAll('"','')}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'},customMetadata:{name:doc.name,updatedAt:doc.updatedAt,count:String(doc.sentences.length)}});
   if(!saved)return json({error:'다른 기기에서 이 폴더를 수정했습니다. 새 폴더로 저장하거나 서버 버전을 다시 열어 주세요.'},409);
   return json({etag:saved.etag,updatedAt:doc.updatedAt});
  }
 }
 return json({error:'요청을 찾을 수 없습니다.'},404);
}
export default{async fetch(req,env){try{const url=new URL(req.url);if(url.pathname.startsWith('/api/'))return await api(req,env);const path=url.pathname==='/'?'/index.html':url.pathname,bundled=BUNDLED[path];if(!bundled&&!LIVE_PATH.test(path))return new Response('Not found',{status:404});const live=await liveGet(env,path);if(!live&&!bundled)return new Response('Not found',{status:404});const type=bundled?bundled.type:LIVE_TYPES[path.split('.').pop().toLowerCase()];return new Response(req.method==='HEAD'?null:(live??bundled.body),{headers:{'Content-Type':type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','X-Studio-Source':live?'live':'bundled'}});}catch(e){console.error('Storage request failed',e.message);return json({error:e.status?e.message:'서버 저장을 완료하지 못했습니다. 기기의 작업은 유지됩니다.'},e.status||503);}}};
