const PART=8*1024*1024;
export function createCloudEditor(hooks){
 const $=id=>document.getElementById(id);let user=null,timer,saving=false,blocked=false,revision=0,cursor=null,checking=false,signingOut=false;const cache=new WeakMap();
 const status=text=>{const line=$('cloudStatus');if(line)line.textContent=text;let badge=$('syncBadge');if(!badge){badge=document.createElement('span');badge.id='syncBadge';badge.style.cssText='max-width:260px;font-size:12px;color:#c4ed88';$('foldersBtn').after(badge);}badge.textContent=text;badge.title=text;const el=$('folderStatus');if(el){el.textContent=text;el.hidden=!text;}};
 async function request(path,options={}){const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});if(!r.ok){let msg;try{msg=(await r.json()).error;}catch{}const e=new Error(msg||'서버에 연결하지 못했습니다.');e.status=r.status;throw e;}return r;}
 const auth=async()=>{const r=await request('/api/session');user=(await r.json()).user;$('cloudAccount').textContent=user?user.email:'다른 기기에서도 같은 계정으로 작업을 이어가세요.';$('cloudSignedOut').hidden=!!user;$('cloudActions').hidden=!user;let logout=$('cloudSignOut');if(!logout){logout=document.createElement('a');logout.id='cloudSignOut';logout.href='/signout-with-chatgpt?return_to=%2F%3Ffolders%3D1';logout.target='_top';logout.textContent='로그아웃';logout.style.cssText='display:inline-block;margin:0 0 16px;padding:10px 16px;border:1px solid #aaa;border-radius:8px;color:inherit';$('cloudAccount').after(logout);logout.onclick=async e=>{e.preventDefault();if(saving||hooks.isBusy())return hooks.toast('녹음이나 서버 저장이 끝난 뒤 로그아웃해 주세요.');if(signingOut)return;signingOut=true;clearTimeout(timer);try{await hooks.flushLocal();window.top.location.href=logout.href;}catch{signingOut=false;status('기기 저장에 실패해 로그아웃을 멈췄습니다. 프로젝트를 백업해 주세요.');}};}logout.hidden=!user;logout.style.display=user?'inline-block':'none';if(!user)status('로그인하면 서버 폴더 사용 가능');return user;};
 async function uploadBlob(blob){if(cache.has(blob))return cache.get(blob);const parts=[];for(let offset=0;offset<blob.size;offset+=PART){const part=blob.slice(offset,offset+PART),bytes=await part.arrayBuffer(),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');const exists=await fetch('/api/media/'+hash,{method:'HEAD',credentials:'same-origin'});if(exists.status===404)await request('/api/media/'+hash,{method:'PUT',body:bytes,headers:{'Content-Type':'application/octet-stream'}});else if(!exists.ok)throw new Error('소재 저장 상태를 확인하지 못했습니다.');parts.push(hash);}const result={parts,size:blob.size,mime:blob.type||'application/octet-stream'};cache.set(blob,result);return result;}
 async function audioFile(audio){if(cache.has(audio))return cache.get(audio);const result={...await uploadBlob(new Blob([audio],{type:'application/octet-stream'})),samples:audio.length};cache.set(audio,result);return result;}
 async function save(asNew=false){if(saving||signingOut)return;const p=hooks.getProject();if(hooks.isBusy()){status('현재 작업이 끝나면 저장합니다.');timer=setTimeout(()=>save(asNew),2500);return;}if(!user){await auth();if(!user){if(!$('folderDialog').open)$('folderDialog').showModal();return;}}if(!asNew&&!p.cloud){$('newFolderName').value=p.name;if(!$('folderDialog').open)$('folderDialog').showModal();await list();return;}if(!asNew&&blocked){status('양쪽 기기에서 변경됨 · 작업 폴더에서 새 폴더로 저장하세요.');return;}if(p.cloud&&p.cloud.userId!==user.id&&!asNew)throw new Error('이 폴더를 저장했던 계정으로 로그인하거나 새 폴더로 저장하세요.');
 saving=true;const rev=revision,id=asNew?crypto.randomUUID():p.cloud.id,etag=asNew?null:p.cloud.etag;const snapshot={name:p.name,captions:p.captions!==false,folders:[...(p.folders||[])],sentences:p.sentences.map(s=>({...s,scene:structuredClone(s.scene)})),video:(p.video||[]).map(c=>{const scene=structuredClone(c.scene)||{};if(scene.asset&&!(scene.asset in p.assets))delete scene.asset;for(const l of scene.layers||[])if(l.asset&&!(l.asset in p.assets))l.asset='';return{...c,scene};}),audio:(p.audio||[]).map(c=>({...c})),assets:{...p.assets}};status('서버에 저장 중…');
 try{const doc={version:2,name:snapshot.name.slice(0,200)||'새 작업 폴더',captions:snapshot.captions!==false,folders:(snapshot.folders||[]).filter(f=>typeof f==='string'&&f.startsWith('media/')).slice(0,500),sentences:[],video:(snapshot.video||[]).map(c=>({id:c.id,start:c.start,duration:c.duration,scene:c.scene})),audio:(snapshot.audio||[]).map(c=>({id:c.id,sentenceId:c.sentenceId,start:c.start,duration:c.duration,offset:c.offset||0,text:c.text})),assets:{}};for(let i=0;i<snapshot.sentences.length;i++){const s=snapshot.sentences[i];status(`녹음 저장 ${i+1} / ${snapshot.sentences.length}`);doc.sentences.push({id:s.id,text:s.text,audio:s.audio?await audioFile(s.audio):null});}for(const [name,blob]of Object.entries(snapshot.assets)){status('이미지·영상 저장 중…');doc.assets[name]=await uploadBlob(blob);}const saved=await(await request('/api/folders/'+id,{method:'PUT',headers:{'Content-Type':'application/json',...(etag?{'If-Match':etag}:{'If-None-Match':'*'})},body:JSON.stringify(doc)})).json();
 counted.delete(id);if(hooks.getProject()===p){p.cloud={id,etag:saved.etag,userId:user.id};p.cloudDirty=revision!==rev;blocked=false;hooks.persistLocal();}status('서버 저장 완료 · '+new Date(saved.updatedAt).toLocaleTimeString('ko-KR'));showCurrent();if($('folderDialog').open)await list();
 }catch(e){if(e.status===409){blocked=true;e.message='양쪽 기기에서 변경됨 · 이 기기 작업은 보존했습니다. 작업 폴더에서 새 폴더로 저장하세요.';}status(e.message);hooks.toast(e.message);if(hooks.getProject()===p){p.cloudDirty=true;hooks.persistLocal();}}finally{saving=false;if(revision!==rev&&!blocked&&hooks.getProject().cloud)timer=setTimeout(()=>save(),2000);}}
 function showCurrent(){const p=hooks.getProject(),el=$('currentFolder');if(!el)return;let saveHere=$('saveCurrentFolder');if(!saveHere){saveHere=document.createElement('button');saveHere.id='saveCurrentFolder';saveHere.className='primary';saveHere.textContent='현재 폴더에 저장 · 다른 기기와 동기화';saveHere.onclick=()=>save().catch(e=>hooks.toast(e.message));el.after(saveHere);}saveHere.hidden=!p.cloud;$('newCloudFolder').textContent=p.cloud?'별도 폴더로 복사 저장 ↑':'지금 작업을 새 폴더로 저장 ↑';el.classList.toggle('linked',!!p.cloud);el.textContent=p.cloud?'지금 열린 폴더 · '+p.name+(p.cloudDirty?' · 저장하지 않은 변경 있음':' · 서버에 저장한 사본'):'아직 서버 폴더에 저장하지 않았습니다. 아래에서 지금 작업을 새 폴더로 저장하세요.';}
 async function supportsDelete(){try{const r=await fetch('/api/version',{credentials:'same-origin'});return r.ok&&typeof (await r.json()).bundled==='string';}catch{return false;}}
 function folderRow(f,canDelete){const current=hooks.getProject().cloud?.id===f.id,row=document.createElement('div');row.className='cloud-folder'+(current?' current':'');
  const pick=document.createElement('button');pick.className='folder-open';const title=document.createElement('strong'),meta=document.createElement('small');
  const counts=n=>f.count+'문장 · '+n+' · '+new Date(f.updatedAt).toLocaleString('ko-KR')+' · 폴더 '+f.id.slice(0,8)+(current?' · 지금 열림':'');
  const known=Number.isFinite(f.clips)&&Number.isFinite(f.takes);
  title.textContent='▣ '+f.name;meta.textContent=counts(known?'조각 '+f.clips+' · 녹음 '+f.takes:'타임라인 확인 중…');
  if(!known)countTimeline(f.id).then(n=>{meta.textContent=counts(n?'조각 '+n.clips+' · 녹음 '+n.takes:'타임라인 확인 실패');
   if(n&&!n.clips&&!n.takes)row.classList.add('empty-timeline');});
  pick.append(title,meta);pick.onclick=()=>open(f.id);
  const actions=document.createElement('div');actions.className='folder-actions';
  for(const [label,cls,run]of [['이름 바꾸기','',()=>rename(f)],...(canDelete?[['삭제','danger',()=>remove(f)]]:[])]){const b=document.createElement('button');b.className='text-btn '+cls;b.textContent=label;b.onclick=()=>run().catch(e=>{status(e.message);hooks.toast(e.message);});actions.append(b);}
  row.append(pick,actions);return row;}
 async function rename(f){if(saving||hooks.isBusy())return hooks.toast('저장이나 녹음이 끝난 뒤에 바꿔 주세요.');
  const name=(prompt('새 폴더 이름',f.name)||'').trim();if(!name||name===f.name)return;
  status('이름 바꾸는 중…');const {project:doc,etag}=await(await request('/api/folders/'+f.id)).json();doc.name=name.slice(0,200);
  const saved=await(await request('/api/folders/'+f.id,{method:'PUT',headers:{'Content-Type':'application/json','If-Match':etag},body:JSON.stringify(doc)})).json();
  const p=hooks.getProject();if(p.cloud?.id===f.id&&p.cloud.etag===etag){p.cloud.etag=saved.etag;p.name=doc.name;hooks.updateName(doc.name);hooks.persistLocal();}
  status('폴더 이름을 바꿨습니다.');await list();}
 async function remove(f){if(saving||hooks.isBusy())return hooks.toast('저장이나 녹음이 끝난 뒤에 삭제해 주세요.');
  if(!confirm('‘'+f.name+'’ 폴더를 서버에서 삭제할까요? 되돌릴 수 없습니다. 이 기기에 열려 있는 작업은 그대로 남습니다.'))return;
  status('폴더 삭제 중…');await request('/api/folders/'+f.id,{method:'DELETE'});
  const p=hooks.getProject();if(p.cloud?.id===f.id){clearTimeout(timer);p.cloud=null;p.cloudDirty=false;blocked=false;hooks.persistLocal();}
  status('폴더를 삭제했습니다.');await list();}
 async function list(append=false){if(!user)return;try{const data=await(await request('/api/folders'+(append&&cursor?'?cursor='+encodeURIComponent(cursor):''))).json();cursor=data.cursor;const canDelete=await supportsDelete();if(!append)$('folderList').replaceChildren();for(const f of data.folders.sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))))$('folderList').append(folderRow(f,canDelete));if(!$('folderList').children.length)$('folderList').textContent='저장된 폴더가 없습니다. 위에서 지금 작업을 새 폴더로 저장하면 여기에 쌓입니다.';$('moreFolders').hidden=!cursor;showCurrent();}catch(e){status(e.message);hooks.toast(e.message);}}
 // 폴더 문서에는 소재 바이트가 아니라 참조만 들어 있어 세어 보는 값이 싸다. 동시에 너무 많이 부르지는 않는다.
 const counted=new Map();let counting=0;
 async function countTimeline(id){if(counted.has(id))return counted.get(id);
  while(counting>=4)await new Promise(r=>setTimeout(r,120));
  counting++;
  try{const {project:doc}=await(await request('/api/folders/'+id)).json();
   const n={clips:doc.video?.length||0,takes:doc.audio?.length||0};counted.set(id,n);return n;}
  catch{return null;}finally{counting--;}}
 async function getBlob(f){const chunks=[];for(const hash of f.parts)chunks.push(await(await request('/api/media/'+hash)).arrayBuffer());const blob=new Blob(chunks,{type:f.mime});if(blob.size!==f.size)throw Error('서버 소재 크기가 일치하지 않습니다.');return blob;}
 async function open(id,automatic=false,remote=null){if(saving||hooks.isBusy())return hooks.toast('현재 저장이나 녹음이 끝난 뒤 열어 주세요.');const old=hooks.getProject();if(automatic&&old.cloudDirty)return;if(old.sentences.length&&(!old.cloud||old.cloudDirty)&&!confirm('현재 기기에만 저장된 변경 사항이 있습니다. 서버 폴더를 열면 현재 화면의 작업이 바뀝니다. 계속할까요?'))return;clearTimeout(timer);hooks.setBusy(true);try{status('작업 폴더 여는 중…');const {project:doc,etag}=remote||await(await request('/api/folders/'+id)).json();
   const mine=(old.video?.length||0)+(old.audio?.length||0),theirs=(doc.video?.length||0)+(doc.audio?.length||0);
   if(automatic&&mine&&!theirs){status('서버본에 타임라인이 비어 있어 이 기기 작업을 지켰습니다. 작업 폴더에서 새 폴더로 저장하세요.');blocked=true;return;}
   if(!automatic&&mine&&!theirs&&!confirm('이 서버 폴더에는 타임라인이 비어 있습니다. 지금 화면의 타임라인이 사라집니다. 계속할까요?'))return;const next={version:doc.version===2?2:1,name:doc.name,captions:doc.captions!==false,folders:Array.isArray(doc.folders)?doc.folders:[],sentences:[],video:doc.video||[],audio:doc.audio||[],assets:{},cloud:{id,etag,userId:user.id},cloudDirty:false};for(const s of doc.sentences){const audio=s.audio?new Float32Array(await(await getBlob(s.audio)).arrayBuffer()):null;if(audio&&audio.length!==s.audio.samples)throw Error('녹음 길이 검증 실패');next.sentences.push({...s,audio});if(audio)cache.set(audio,s.audio);}for(const[name,f]of Object.entries(doc.assets)){const blob=await getBlob(f);next.assets[name]=blob;cache.set(blob,f);}if(hooks.getProject()!==old)return;hooks.setProject(next);blocked=false;revision++;hooks.persistLocal();status('서버 폴더 연결됨 · 자동 저장');showCurrent();$('folderDialog').close();}catch(e){status(e.message);hooks.toast(e.message);}finally{hooks.setBusy(false);}}
 $('foldersBtn').onclick=async()=>{if(hooks.isBusy())return hooks.toast('녹음이나 파일 처리가 끝난 뒤에 열 수 있습니다.');$('newFolderName').value=hooks.getProject().name;showCurrent();if(!$('folderDialog').open)$('folderDialog').showModal();try{await auth();await list();}catch(e){status(e.message);}};
 $('newProject').onclick=()=>{if(saving||hooks.isBusy())return hooks.toast('저장이나 녹음이 끝난 뒤에 시작해 주세요.');const p=hooks.getProject();if(p.sentences.length&&(!p.cloud||p.cloudDirty)&&!confirm('이 기기에만 저장된 변경 사항이 있습니다. 빈 프로젝트로 시작하면 현재 화면의 작업이 비워집니다. 계속할까요?'))return;clearTimeout(timer);hooks.newProject();blocked=false;revision++;$('newFolderName').value=hooks.getProject().name;showCurrent();status('빈 프로젝트 · 아직 서버 폴더에 저장하지 않음');};
 $('closeFolders').onclick=()=>$('folderDialog').close();$('refreshFolders').onclick=()=>list();$('moreFolders').onclick=()=>list(true);
 if($('saveCloud'))$('saveCloud').onclick=()=>save().catch(e=>hooks.toast(e.message));$('newCloudFolder').onclick=async()=>{if(saving)return hooks.toast('이미 서버에 저장하는 중입니다.');if(hooks.isBusy())return hooks.toast('녹음이나 파일 처리가 끝난 뒤에 저장할 수 있습니다.');const name=$('newFolderName').value.trim();if(!name)return hooks.toast('폴더 이름을 입력하세요.');hooks.getProject().name=name;hooks.updateName(name);revision++;await save(true);};
 $('cloudSignIn').onclick=async e=>{e.preventDefault();if(hooks.isBusy())return;await hooks.flushLocal();window.top.location.href='/signin-with-chatgpt?return_to=%2F%3Ffolders%3D1';};
 function edited(){revision++;const p=hooks.getProject();if(!p.cloud){status(user?'이 기기에만 저장됨 · 작업 폴더에서 서버 저장을 연결하세요.':'이 기기에만 저장됨 · 로그인 후 서버 저장을 연결하세요.');return;}p.cloudDirty=true;clearTimeout(timer);status(blocked?'저장 충돌 · 새 폴더로 저장하거나 서버 버전을 열어 주세요.':'서버 저장 대기…');if(!blocked)timer=setTimeout(()=>save().catch(e=>status(e.message)),2000);}
 async function reconcile(){
  if(signingOut||checking||saving||hooks.isBusy()||document.visibilityState==='hidden')return;
  checking=true;
  try{
   if(!user)await auth();
   const p=hooks.getProject();
   if(!user||!p.cloud){if(user)status('이 기기에만 저장됨 · 작업 폴더에서 서버 저장을 연결하세요.');return;}
   if(p.cloud.userId!==user.id){status('다른 계정의 기기 작업 · 원래 계정으로 로그인하세요.');return;}
   const rev=revision,remote=await(await request('/api/folders/'+p.cloud.id)).json();
   if(hooks.getProject()!==p||revision!==rev||saving||hooks.isBusy())return;
   if(remote.etag!==p.cloud.etag){
    if(p.cloudDirty){blocked=true;clearTimeout(timer);status('양쪽 기기에서 변경됨 · 이 기기 작업 보존 중. 작업 폴더에서 새 폴더로 저장하세요.');}
    else await open(p.cloud.id,true,remote);
   }else if(p.cloudDirty){blocked=false;await save();}
   else{blocked=false;status('서버 최신본 확인됨 · '+new Date().toLocaleTimeString('ko-KR'));}
  }catch(e){status(e.status===404?'서버 폴더를 찾을 수 없음 · 기기 작업 보존 중':'서버 연결 실패 · 기기 작업 보존 중, 자동 재시도');}
  finally{checking=false;}
 }
 async function init(){try{await auth();await reconcile();if(new URLSearchParams(location.search).has('folders')){$('folderDialog').showModal();await list();}}catch{status('서버 연결 대기 · 기기 작업은 유지됩니다.');}}
 window.addEventListener('online',reconcile);
 window.addEventListener('focus',reconcile);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='hidden')reconcile();});
 setInterval(reconcile,15000);
 window.addEventListener('beforeunload',e=>{if(saving||hooks.getProject().cloudDirty){e.preventDefault();e.returnValue='';}});
 return {edited,init,reconcile};
}
