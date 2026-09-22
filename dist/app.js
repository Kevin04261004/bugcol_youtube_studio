import {createFreeEditor} from './editor.js';
import {drawLayers,layerVideoTime} from './editor-engine.js';
import {getFrameRate} from './fps.js';
import {createGifWriter,decodeGif,gifFrameAt} from './gif.js';
import{createCloudEditor}from'./cloud.js';
import{zip,unzipSync,strToU8,strFromU8}from'./vendor/fflate.js';
import{Muxer,ArrayBufferTarget,FileSystemWritableFileStreamTarget}from'./vendor/mp4-muxer.js';
import{RATE,splitSentences,joinAudio,editAudio,trimAudio,wavBytes,pad,validScene,audioPackets,planAudioImports,COVER,sceneEntrance,needsScrim,clipRange,clipTimeAt,clipOutputSize,safeClipName,uniqueAssetKey,pickClipCodec,unusedAssetKeys,newVideoClip,newAudioClip,migrateProject,totalDuration,trackEnd,trackTail,clipEnd,clipsAt,videoClipAt,locateClip,moveClip,trimClip,trimRipple,mixNarration,MIN_CLIP}from'./core.js';
const size=n=>n<1048576?Math.max(1,Math.round(n/1024))+'KB':(n/1048576).toFixed(1)+'MB';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const emptyProject=()=>({version:2,name:'새로운 롱폼',captions:true,sentences:[],video:[],audio:[],assets:{}});
let project=emptyProject(),selected=0,clipIndex=0,tab='record',busy=false,recording=false,recorder=null,stream=null,ctx=null,analyser=null,recFrame=0,recordStart=0,saveTimer=null,saveChain=Promise.resolve(),toastTimer,undo=new Map(),previewToken=0,audioSource=null,renderCancelled=false;
const timelineSources=[];
const mediaCache=new Map();let cloud=null,freeEditor=null;
function toastHost(){return document.querySelector('dialog[open]')||document.body;}
function toast(msg){const t=$('toast'),host=toastHost();if(t.parentNode!==host)host.append(t);t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),5000);}
for(const d of document.querySelectorAll('dialog'))d.addEventListener('close',()=>{const t=$('toast');if(t.parentNode!==document.body)document.body.append(t);});
function time(t,decimal=false){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')+(decimal?'.'+Math.floor((t%1)*10):'');}
const current=()=>project.sentences[selected],duration=s=>s?.audio?.length?s.audio.length/RATE:0,total=()=>totalDuration(project.video,project.audio);
// 배경이 밝은지. 밝으면 글씨를 어둡게 써야 읽힌다.
function isLight(hex){const m=/^#?([0-9a-f]{6})$/i.exec(String(hex||''));if(!m)return false;
 const n=parseInt(m[1],16);return((n>>16&255)*299+(n>>8&255)*587+(n&255)*114)/1000>150;}
const captionsOn=()=>project.captions!==false;
const clip=()=>project.video[clipIndex],sentenceById=id=>project.sentences.find(s=>s.id===id);
const takeOf=c=>sentenceById(c?.sentenceId)?.audio||null;
// 녹음 조각이 실제로 쓸 수 있는 최대 길이. 녹음 뒤쪽을 넘겨 늘릴 수는 없다.
const takeRoom=c=>Math.max(MIN_CLIP,(takeOf(c)?.length||0)/RATE-(c?.offset||0));
const WHITE='#ffffff';
const defaultScene=()=>({title:'',subtitle:'',layout:'title',motion:'fade',background:WHITE,reviewed:false});
function newSentence(text,id){return{id,text,audio:null};}
function setBusy(value){busy=value;document.body.classList.toggle('busy',value);}
async function audioContext(){ctx??=new AudioContext({sampleRate:RATE});if(ctx.state!=='running')await ctx.resume();return ctx;}
const dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('burcol-studio-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
function changed(){if(clip())clip().scene.reviewed=false;scheduleSave();renderStats();}
function scheduleSave(localOnly=false){if(!localOnly)cloud?.edited();clearTimeout(saveTimer);$('saveState').textContent='저장 중…';saveTimer=setTimeout(()=>{const snapshot=structuredClone(project);saveChain=saveChain.catch(()=>{}).then(async()=>{const db=await dbPromise;await new Promise((resolve,reject)=>{const tx=db.transaction('projects','readwrite');tx.objectStore('projects').put(snapshot,'current');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});$('saveState').textContent='이 기기에 저장됨';}).catch(()=>{$('saveState').textContent='자동 저장 실패 · ZIP으로 백업';toast('기기 저장 공간을 확인하고 프로젝트 ZIP을 저장하세요.');});},450);}
async function loadSaved(){try{const db=await dbPromise;const saved=await new Promise((resolve,reject)=>{const r=db.transaction('projects').objectStore('projects').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const next=adoptProject(saved);if(next){project=next;$('projectName').value=project.name;}}catch{$('saveState').textContent='자동 저장 사용 불가';}render();}
// 예전 문장별 장면 프로젝트는 열 때 트랙으로 옮긴다. 형식이 아니면 건드리지 않는다.
function adoptProject(saved){if(!saved||!Array.isArray(saved.sentences))return null;
 const next=saved.version===1?migrateProject(saved):saved;
 if(next.version!==2)return null;
 next.video??=[];next.audio??=[];next.assets??={};
 if(typeof next.captions!=='boolean')next.captions=!next.video.length||next.video.some(c=>c.scene?.captions);
 for(const s of next.sentences)delete s.scene;
 return next;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
const fileName=()=>project.name.replace(/[\\/:*?"<>|]/g,'_')||'burcol';
function renderStats(){const list=project.sentences,clips=project.video,placed=project.audio;$('completedCount').textContent=String(list.filter(s=>s.audio?.length).length).padStart(2,'0');$('totalCount').textContent=String(list.length).padStart(2,'0');$('scriptCount').textContent=list.length;$('totalDuration').textContent='총 '+time(total());
 const done=list.filter(s=>s.audio?.length).length,review=clips.filter(c=>c.scene.reviewed).length,ready=total()>0;
 $('exportChecklist').innerHTML=`<div class="check-row"><span>문장별 녹음</span><b class="${done<list.length||!list.length?'warn':''}">${done} / ${list.length} 완료</b></div><div class="check-row"><span>영상 트랙</span><b class="${!clips.length?'warn':''}">${clips.length}조각 · ${time(trackEnd(clips))}</b></div><div class="check-row"><span>녹음 트랙</span><b class="${!placed.length?'warn':''}">${placed.length}조각 · ${time(trackEnd(placed))}</b></div><div class="check-row"><span>장면 검수</span><b class="${review<clips.length||!clips.length?'warn':''}">${review} / ${clips.length} 완료</b></div><div class="check-row"><span>영상 길이</span><b>${time(total())}</b></div><div class="check-row"><span>출력 형식</span><b>${outputNote()}</b></div>`;
 $('renderMp4').disabled=!ready;$('renderStatus').textContent=!ready?'타임라인에 영상 조각이나 녹음을 올리세요.':gapSeconds()>.05?`영상이 비는 ${gapSeconds().toFixed(1)}초는 배경색으로 출력됩니다.`:'영상 트랙이 빈 구간은 배경색으로 출력됩니다.';}
const outputNote=()=>({mp4:'MP4 / 호환 WebM · 16:9',webm:'WebM · 16:9',gif:`GIF · ${$('gifWidth')?.value||480}px · 소리 없음`}[$('exportFormat')?.value]||'MP4 / 호환 WebM · 16:9');
// 전체 길이 가운데 어떤 영상 조각도 덮지 않는 시간.
function gapSeconds(){const end=total();let covered=0,at=0;
 for(const c of [...project.video].sort((a,b)=>a.start-b.start)){const from=Math.max(at,c.start);if(clipEnd(c)>from){covered+=clipEnd(c)-from;at=clipEnd(c);}}
 return Math.max(0,end-covered);}
function renderList(){if(!project.sentences.length){$('sentenceList').innerHTML='<div class="empty-state"><span>▤</span>첫 번째 이야기를 가져오세요.<br>TXT 파일 하나면 시작할 수 있어요.</div>';return;}$('sentenceList').innerHTML=project.sentences.map((s,i)=>`<div class="sentence-row"><button class="sentence-item ${i===selected?'selected':''}" data-index="${i}"><span class="num">${pad(s.id)}</span><div><p>${esc(s.text||'새 문장')}</p><small>${s.audio?time(duration(s),true)+' · 녹음 완료':'녹음 대기'}</small></div><span class="done">${s.audio?'✓':''}</span></button><button class="sentence-del" data-del="${i}" aria-label="문장 ${pad(s.id)} 삭제" title="문장 삭제">✕</button></div>`).join('');$('sentenceList').querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>selectSentence(+el.dataset.index));$('sentenceList').querySelectorAll('[data-del]').forEach(el=>el.onclick=e=>{e.stopPropagation();deleteSentence(+el.dataset.del);});}
function pruneAssets(){for(const key of unusedAssetKeys(Object.keys(project.assets),project.video.flatMap(c=>[c.scene.asset,...(c.scene.layers||[]).map(l=>l.asset)]).concat(Object.keys(project.assets).filter(k=>k.startsWith('media/')))))delete project.assets[key];}
function deleteSentence(i){
 if(recording||busy)return toast('녹음이나 파일 처리가 끝난 뒤에 지울 수 있습니다.');
 const s=project.sentences[i];if(!s)return;
 if((s.audio||s.text.trim())&&!confirm(`문장 ${pad(s.id)}을 지울까요?`+(s.audio?' 이 문장의 녹음도 함께 사라집니다.':'')+' 되돌릴 수 없습니다.'))return;
 stopPlayback();
 project.sentences.splice(i,1);undo.delete(s.id);
 project.audio=project.audio.filter(c=>c.sentenceId!==s.id);
 if(i<selected||selected>=project.sentences.length)selected=Math.max(0,selected-1);
 pruneAssets();clearMedia();scheduleSave();render();
 toast(`문장 ${pad(s.id)}을 지웠습니다. 타임라인의 이 문장 녹음도 함께 내렸습니다.`);}
function renderSelected(){const s=current();$('sentenceText').value=s?.text||'';$('sentenceText').disabled=!s;$('currentNumber').textContent=s?pad(s.id):'01';$('sentencePosition').textContent=s?`${selected+1} / ${project.sentences.length} 문장`:'문장을 선택하세요';$('recordClock').textContent=time(duration(s),true);$('cutStart').value='0';$('cutEnd').value=duration(s).toFixed(3);$('audioDuration').textContent=s?.audio?duration(s).toFixed(2)+'초':'녹음 없음';$('recordBadge').textContent=s?.audio?'녹음 완료':'녹음 준비';$('recordHint').textContent=s?.audio?'선택 구간을 듣고, 필요한 부분만 남기세요.':'마이크를 켜고 이야기를 시작해 보세요.';$('recordBtn').disabled=!s;$('playAudio').disabled=!s?.audio;$('undoAudio').disabled=!undo.has(s?.id);$('prevSentence').disabled=selected<=0;$('nextSentence').disabled=selected>=project.sentences.length-1;drawWave();renderInspector();renderTimeline();if(freeEditor)freeEditor.refresh();else drawPreview();}
function render(){renderStats();renderList();renderSelected();}
function selectSentence(i){if(recording||busy)return;const next=Math.max(0,Math.min(project.sentences.length-1,i));stopPlayback();selected=next;renderList();renderSelected();}
function selectClip(i){if(recording||busy)return;clipIndex=Math.max(0,Math.min(project.video.length-1,i));const c=clip();if(c&&!c.scene.reviewed){c.scene.reviewed=true;scheduleSave();}renderStats();renderInspector();renderTimeline();if(freeEditor)freeEditor.refresh();else drawPreview();}
// 녹음을 타임라인에 올린다. 기본 자리는 녹음 트랙 맨 뒤라 예전처럼 순서대로 이어 붙지만, 올린 뒤에는 자유롭게 옮길 수 있다.
function placeTake(s,at=null){if(!s?.audio?.length)return null;const c=newAudioClip(s.id,at??trackTail(project.audio),duration(s),s.text);project.audio.push(c);return c;}
// 다시 녹음하면 타임라인에 올라간 조각도 새 녹음 전체를 쓰도록 되돌린다. 아직 안 올렸으면 맨 뒤에 올린다.
function syncTake(s){const placed=project.audio.filter(c=>c.sentenceId===s.id);if(!placed.length)return placeTake(s);
 for(const c of placed){c.text=s.text;c.offset=0;c.duration=duration(s);}
 return placed[0];}
function switchTab(next){if(recording||busy)return;stopPlayback();tab=next;document.querySelectorAll('[data-tab]').forEach(el=>el.classList.toggle('active',el.dataset.tab===next));for(const name of['record','scenes','export'])$(name+'View').hidden=name!==next;$('pageTitle').textContent={record:'좋은 이야기는, 한 문장부터.',scenes:'목소리에 장면을 입히세요.',export:'당신의 이야기를 세상으로.'}[next];$('pageSubtitle').textContent={record:'대본을 올리고, 한 문장씩 편안하게 녹음하세요.',scenes:'녹음 길이에 맞춰 장면을 연결하고, 흐름을 확인하세요.',export:'마지막 검수를 마치고, 한 편의 롱폼을 완성하세요.'}[next];renderStats();drawPreview();}
function replaceScript(text){const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!lines.length)throw Error('대본에 문장이 없습니다.');if(lines.length>2000)throw Error('한 프로젝트는 2,000문장까지 지원합니다.');if(project.sentences.length&&!confirm('현재 대본과 녹음이 교체됩니다. 프로젝트 ZIP으로 백업하셨나요?'))return;stopPlayback();clearMedia();project.sentences=lines.map((s,i)=>newSentence(s,i+1));project.video=[];project.audio=[];freeEditor?.clearHistory();project.assets={};selected=0;clipIndex=0;undo.clear();changed();render();toast(lines.length+'개의 문장으로 나누었습니다. 녹음하면 타임라인에 차례로 올라갑니다.');}
async function decodeAudio(blob){const context=await audioContext();const b=await context.decodeAudioData(await blob.arrayBuffer());if(b.duration>600)throw Error('한 문장 녹음은 10분 이내로 나누어 주세요.');const off=new OfflineAudioContext(1,Math.ceil(b.duration*RATE),RATE),src=off.createBufferSource();src.buffer=b;src.connect(off.destination);src.start();return(await off.startRendering()).getChannelData(0).slice();}
function updateAudio(data){const s=current();if(!s)return;if(s.audio)undo.set(s.id,s.audio);s.audio=data;syncTake(s);changed();render();}
async function startRecording(){if(recording){recorder.stop();return;}if(!current()||busy)return;stopPlayback();const s=current(),append=$('appendRecording').checked;if(s.audio&&!append&&!confirm('이 문장을 다시 녹음할까요? 기존 녹음은 실행 취소로 복원할 수 있습니다.'))return;setBusy(true);try{await audioContext();stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});const chunks=[];const input=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=2048;input.connect(analyser);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>{toast('녹음 중 오류가 발생했습니다. 마이크 연결을 확인하세요.');try{recorder.stop();}catch{cleanupRecord();}};recorder.onstop=async()=>{cleanupRecord();setBusy(true);try{const data=await decodeAudio(new Blob(chunks,{type:recorder.mimeType}));updateAudio(append&&s.audio?joinAudio(s.audio,data):data);toast('문장 '+pad(s.id)+' 녹음을 저장했습니다.');}catch(e){toast('녹음을 처리하지 못했습니다. '+e.message);}finally{setBusy(false);}};recording=true;recordStart=performance.now();recorder.start(1000);setBusy(false);$('recordBtn').innerHTML='<span class="rec-dot"></span> 녹음 완료';$('recordBtn').classList.add('recording');$('recordBadge').classList.add('live');$('recordBadge').textContent='녹음 중';$('sentenceText').disabled=true;tickRecord();}catch(e){cleanupRecord();setBusy(false);toast(e.name==='NotAllowedError'?'브라우저에서 마이크 사용을 허용해 주세요.':'마이크를 시작할 수 없습니다. '+e.message);}}
function cleanupRecord(){recording=false;cancelAnimationFrame(recFrame);stream?.getTracks().forEach(t=>t.stop());stream=null;$('recordBtn').innerHTML='<span class="rec-dot"></span> 녹음 시작';$('recordBtn').classList.remove('recording');$('recordBadge').classList.remove('live');$('sentenceText').disabled=!current();}
function tickRecord(){if(!recording)return;const elapsed=(performance.now()-recordStart)/1000;$('recordClock').textContent=time(elapsed,true);const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);drawWave(data);if(elapsed>=600){recorder.stop();toast('10분 녹음이 완료되었습니다.');return;}recFrame=requestAnimationFrame(tickRecord);}
function drawWave(live){const canvas=$('waveform'),g=canvas.getContext('2d'),w=canvas.width,h=canvas.height,data=live||current()?.audio;g.clearRect(0,0,w,h);g.fillStyle='#faf9fd';g.fillRect(0,0,w,h);const d=duration(current()),start=+$('cutStart').value,end=+$('cutEnd').value;if(!live&&d&&end>start){g.fillStyle='#eee6ff';g.fillRect(start/d*w,0,(end-start)/d*w,h);}const count=200;for(let i=0;i<count;i++){let peak=0;if(data?.length){const a=Math.floor(i/count*data.length),b=Math.max(a+1,Math.floor((i+1)/count*data.length)),stride=Math.max(1,Math.floor((b-a)/80));for(let j=a;j<b;j+=stride)peak=Math.max(peak,Math.abs(data[j]||0));}g.fillStyle=data?'#9570e8':'#d9d1e8';const bh=Math.max(4,peak*h*.9);g.fillRect(i*w/count+1,(h-bh)/2,3,bh);}if(!live&&d){g.fillStyle='#7852df';for(const t of[start,end])g.fillRect(t/d*w-1,0,2,h);}}
let dragStart=0;$('waveform').onpointerdown=e=>{if(!current()?.audio||recording||busy)return;dragStart=Math.max(0,Math.min(duration(current()),(e.clientX-e.currentTarget.getBoundingClientRect().left)/e.currentTarget.clientWidth*duration(current())));e.currentTarget.setPointerCapture(e.pointerId);};$('waveform').onpointermove=e=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;const t=Math.max(0,Math.min(duration(current()),(e.clientX-e.currentTarget.getBoundingClientRect().left)/e.currentTarget.clientWidth*duration(current())));$('cutStart').value=Math.min(t,dragStart).toFixed(3);$('cutEnd').value=Math.max(t,dragStart).toFixed(3);drawWave();};$('waveform').onpointerup=e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
function stopPlayback(){for(const source of timelineSources.splice(0)){try{source.stop();}catch{}source.disconnect();}freeEditor?.halt();if($('edFullPlay'))$('edFullPlay').textContent='처음부터 재생';previewToken++;previewing=false;if(audioSource){try{audioSource.stop();}catch{}audioSource=null;}for(const v of mediaCache.values())if(v.el instanceof HTMLVideoElement)v.el.pause();$('previewPlay').textContent='▶ 전체 미리보기';}
async function playSelected(){if(!current()?.audio||recording||busy)return;stopPlayback();const c=await audioContext(),s=current(),start=Math.max(0,+$('cutStart').value),end=Math.min(duration(s),+$('cutEnd').value);if(end<=start)return toast('재생할 구간을 선택하세요.');const b=c.createBuffer(1,s.audio.length,RATE);b.copyToChannel(s.audio,0);audioSource=c.createBufferSource();audioSource.buffer=b;audioSource.connect(c.destination);audioSource.start(0,start,end-start);}
function editSelected(keep){if(recording||busy||!current()?.audio)return;stopPlayback();try{updateAudio(editAudio(current().audio,+$('cutStart').value,+$('cutEnd').value,keep));toast(keep?'선택한 구간만 남겼습니다.':'선택한 구간을 삭제하고 앞뒤를 이어 붙였습니다.');}catch(e){toast(e.message);}}
function renderInspector(){const c=clip(),v=c?.scene||defaultScene();$('sceneNumber').textContent=c?pad(clipIndex+1):'—';for(const[k,id]of Object.entries({title:'sceneTitle',subtitle:'sceneSubtitle',layout:'sceneLayout',motion:'sceneMotion',background:'sceneColor'}))$(id).value=v[k]??'';$('sceneReviewed').checked=!!v.reviewed;document.querySelectorAll('.inspector input,.inspector select,.inspector textarea,.inspector button').forEach(el=>el.disabled=!c);
 $('clipPlace').textContent=c?`타임라인 ${time(c.start)} · 길이 ${c.duration.toFixed(2)}초`:'타임라인에 올린 영상 조각을 고르세요.';
 syncClip(!c);if($('cutDialog').open)renderClips();}
function clipNote(){const c=clip();if(!c)return;const el=$('clipVideo'),d=el.duration||0,{start,end,span}=clipRange(c.scene,d),need=c.duration;
 if(!d)return void($('clipNote').textContent='영상 정보를 읽는 중…');
 const short=need>span+.05,long=need>0&&span>need+.05;
 $('clipNote').classList.toggle('warn',short);
 $('clipNote').textContent=`쓰는 구간 ${start.toFixed(2)}초 ~ ${end.toFixed(2)}초 · 길이 ${span.toFixed(2)}초 · 이 조각이 타임라인에서 차지하는 시간 ${need.toFixed(2)}초`+(short?' · 구간이 짧아 남는 시간은 마지막 화면이 멈춥니다.':long?' · 조각보다 길어 뒷부분은 쓰이지 않습니다.':'');}
function syncClip(hide){const c=clip(),name=c?.scene.asset,isVideo=!hide&&!!name&&assetType(name)==='video';$('clipRow').hidden=!isVideo;
 if(!isVideo){if(clipUrl){URL.revokeObjectURL(clipUrl);clipUrl=null;}clipAsset=null;$('clipVideo').removeAttribute('src');return;}
 if(clipAsset!==name){if(clipUrl)URL.revokeObjectURL(clipUrl);clipAsset=name;clipUrl=URL.createObjectURL(project.assets[name]);$('clipVideo').src=clipUrl;}
 $('clipStart').value=(c.scene.clipStart||0).toFixed(2);$('clipEnd').value=(c.scene.clipEnd||0).toFixed(2);clipNote();}
function setClip(key,value){const c=clip();if(!c)return;const d=$('clipVideo').duration||0,x=Math.max(0,d?Math.min(d,value):value);
 if(key==='clipStart'){if(c.scene.clipEnd&&c.scene.clipEnd<=x)return toast('시작은 끝보다 앞이어야 합니다.');if(x>0)c.scene.clipStart=x;else delete c.scene.clipStart;}
 else{if(x<=(c.scene.clipStart||0))return toast('끝은 시작보다 뒤여야 합니다.');c.scene.clipEnd=x;}
 scheduleSave();syncClip();drawPreview();}
function renderTimeline(){$('timeline').innerHTML=project.video.map((c,i)=>`<button class="timeline-card ${i===clipIndex?'selected':''}" data-index="${i}"><div class="thumb" style="background:${esc(c.scene.background||WHITE)}">${esc(c.scene.title||c.scene.asset?.split('/').pop()||'빈 조각').slice(0,90)}</div><p>${pad(i+1)} <span>${c.scene.reviewed?'✓ 검수 완료':c.scene.asset||c.scene.layers?.length?'소재 연결됨':'기본 페이지'}</span><small>${time(c.start)} · ${c.duration.toFixed(2)}초</small></p></button>`).join('')||'<p class="timeline-empty">영상 조각을 타임라인에 올리면 여기에 나타납니다.</p>';$('timeline').querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>selectClip(+el.dataset.index));}
function clearMedia(){clipAsset=null;for(const v of mediaCache.values()){if(v.el instanceof HTMLVideoElement){v.el.pause();v.el.removeAttribute('src');v.el.load();}URL.revokeObjectURL(v.url);}mediaCache.clear();}
function assetType(name){return /\.(mp4|webm)$/i.test(name)?'video':/\.gif$/i.test(name)?'gif':/\.(png|jpe?g|webp)$/i.test(name)?'image':null;}
function blobType(name){return({mp4:'video/mp4',webm:'video/webm',gif:'image/gif',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'})[name.split('.').pop().toLowerCase()]||'application/octet-stream';}
const gifImages=new WeakMap();
function showGifFrame(el,t){const frame=gifFrameAt(el.gif,Math.max(0,t));if(el.shown===frame)return;el.shown=frame;
 let image=gifImages.get(frame);
 if(!image){image=new ImageData(frame.rgba,el.gif.width,el.gif.height);gifImages.set(frame,image);}
 el.getContext('2d').putImageData(image,0,0);}
async function loadGif(blob){const data=decodeGif(new Uint8Array(await blob.arrayBuffer()));
 const el=document.createElement('canvas');el.width=data.width;el.height=data.height;
 Object.assign(el,{naturalWidth:data.width,naturalHeight:data.height,duration:data.duration,gif:data});
 showGifFrame(el,0);return el;}
async function loadMedia(name,instance=''){if(!name)return null;const cacheKey=instance?name+'::'+instance:name;if(mediaCache.has(cacheKey))return mediaCache.get(cacheKey).promise;const blob=project.assets[name];if(!blob)throw Error('소재를 찾을 수 없습니다: '+name);const kind=assetType(name);
 if(kind==='gif'){const entry={url:'',el:null,promise:null};entry.promise=loadGif(blob).then(el=>{entry.el=el;return el;});mediaCache.set(cacheKey,entry);return entry.promise;}
 const url=URL.createObjectURL(blob),el=kind==='video'?document.createElement('video'):new Image();const entry={url,el,promise:null};entry.promise=new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('소재 로딩 시간 초과: '+name)),20000);const loaded=()=>{clearTimeout(timeout);resolve(el);};const failed=()=>{clearTimeout(timeout);reject(Error('지원하지 않거나 손상된 소재: '+name));};if(kind==='video'){el.muted=true;el.playsInline=true;el.preload='auto';el.onloadeddata=loaded;el.onerror=failed;}else{el.onload=loaded;el.onerror=failed;}el.src=url;});mediaCache.set(cacheKey,entry);return entry.promise;}
function linesFor(g,text,maxWidth){const lines=[];for(const paragraph of String(text).split('\n')){let line='';for(const ch of paragraph){if(g.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}return lines;}
function textBlock(g,text,x,y,width,size,maxLines,color='#fff',align='left'){g.font=`600 ${size}px "Noto Sans KR",sans-serif`;g.textAlign=align;g.fillStyle=color;let lines=linesFor(g,text,width);if(lines.length>maxLines){lines=lines.slice(0,maxLines);lines[maxLines-1]=lines[maxLines-1].slice(0,-1)+'…';}lines.forEach((l,i)=>g.fillText(l,x,y+i*size*1.5));return lines.length*size*1.5;}
function paintScene(g,shot){const v=shot.scene,t=shot.sceneTime,media=shot.media;g.fillStyle=v.background||WHITE;g.fillRect(0,0,1280,720);if(Array.isArray(v.layers)){drawLayers(g,v.layers,t,shot.layerMedia||new Map(),shot.editing);}else if(media){const mw=media.videoWidth||media.naturalWidth,mh=media.videoHeight||media.naturalHeight,x=v.layout==='split'?630:0,y=0,dw=v.layout==='split'?650:1280,dh=720,scale=Math.max(dw/mw,dh/mh)*(v.motion==='zoom'?1+.08*Math.min(1,t/shot.sceneSpan):1);g.save();g.beginPath();g.rect(x,y,dw,dh);g.clip();g.drawImage(media,x+(dw-mw*scale)/2,y+(dh-mh*scale)/2,mw*scale,mh*scale);if(needsScrim(v.layout,true)){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,y,dw,dh);}g.restore();}
if(!shot.bare&&!Array.isArray(v.layers)&&(v.layout!=='full'||!media)){const split=v.layout==='split',x=split?65:100,maxW=split?500:1080;const dark=!!media&&needsScrim(v.layout,true)||!isLight(v.background);
 const used=textBlock(g,v.title||shot.titleText,x,277,maxW,split?40:52,split?5:4,dark?'#fff':'#1b1b20');
 if(v.subtitle)textBlock(g,v.subtitle,x,Math.min(568,285+used),maxW,22,2,dark?'#c1bacd':'#5d5866');}
if(captionsOn()&&shot.captionText){g.font='500 24px "Noto Sans KR",sans-serif';const pages=linesFor(g,shot.captionText,1100),pairs=[];for(let i=0;i<pages.length;i+=2)pairs.push(pages.slice(i,i+2));const page=pairs[Math.min(pairs.length-1,Math.floor(Math.min(.999,shot.captionTime/shot.captionSpan)*pairs.length))]||[];const bh=page.length*36+24;g.fillStyle='#111015d9';g.fillRect(55,690-bh,1170,bh);g.textAlign='center';g.fillStyle='white';page.forEach((l,i)=>g.fillText(l,640,690-bh+35+i*36));}}
function drawScene(canvas,shot,prev=null){const g=canvas.getContext('2d'),k=canvas.width/1280;g.save();g.scale(k,k);if(!shot){g.fillStyle='#171925';g.fillRect(0,0,1280,720);textBlock(g,'다음 이야기는 어떤 장면일까요?',640,338,1000,36,2,'#c6bed8','center');textBlock(g,'대본을 준비하면 이곳에 장면이 나타납니다.',640,394,1000,20,2,'#777386','center');g.restore();return;}
const v=shot.scene,move=shot.still||shot.bare?{alpha:1,shiftX:0,covers:false}:sceneEntrance(v.motion,shot.sceneTime),under=move.covers&&prev?.scene;
if(under)paintScene(g,prev);else{g.fillStyle=v.background||WHITE;g.fillRect(0,0,1280,720);}
g.save();g.globalAlpha=move.alpha;g.translate(move.shiftX,0);paintScene(g,shot);g.restore();g.restore();}
// 타임라인 절대 시각 t 의 한 컷. 영상 트랙과 녹음 트랙을 따로 찾아 합치므로 둘의 경계가 일치할 필요가 없다.
const EMPTY_SCENE={background:WHITE,layout:'full'};
// 조각 c 의 local 초 지점을 그린 한 컷. at 은 그 순간의 타임라인 절대 시각으로, 자막은 여기에 맞춰 고른다.
// c 가 없으면 영상 트랙이 비는 구간이라 배경만 남긴다.
function shotOf(c,local,at,media=null){const scene=c?.scene||EMPTY_SCENE,take=clipsAt(project.audio,at).at(-1);
 return{scene,clip:c||null,titleText:scene.title||'',
  assetName:Array.isArray(scene.layers)?null:scene.asset,media,
  layerMedia:new Map((scene.layers||[]).map(l=>[l.id,mediaCache.get(l.asset+'::'+l.id)?.el])),
  sceneTime:Math.max(0,local),sceneSpan:Math.max(.1,c?.duration||.1),
  captionText:take?.text||'',captionTime:take?at-take.start:0,captionSpan:Math.max(.1,take?.duration||.1),
  // 영상 조각이 없는 구간은 배경만 남기고 등장 효과도, 타이틀도 건너뛴다.
  bare:!c};}
// 타임라인 절대 시각의 한 컷. 아직 아무것도 없는 프로젝트에서만 null 이다.
function shotAt(t,media=null){const at=Math.max(0,t),c=videoClipAt(project.video,at);
 if(!c&&!total())return null;
 return shotOf(c,c?at-c.start:0,at,media);}
async function prepareLayers(shot){if(!shot)return;shot.layerMedia=new Map();for(const l of shot.scene.layers||[])if(l.asset)shot.layerMedia.set(l.id,await loadMedia(l.asset,l.id));}
// 소재 시간 맞추기. 영상은 그 지점으로 감고, GIF 는 해당 프레임을 찍는다(끝나면 처음으로 돈다).
async function showMedia(el,scene,t){if(el instanceof HTMLVideoElement)return seekVideo(el,clipTimeAt(scene,t,el.duration));if(el?.gif)showGifFrame(el,t);}
async function seekLayers(shot){for(const l of shot.scene.layers||[]){const el=shot.layerMedia?.get(l.id);
 if(el instanceof HTMLVideoElement)await seekVideo(el,layerVideoTime(l,shot.sceneTime,el.duration));
 else if(el?.gif)showGifFrame(el,Math.max(0,shot.sceneTime-(l.start||0)));}}
let previewing=false;
let clipUrl=null,clipAsset=null,cutUrl=null,cutting=false,cutCancelled=false;
const clipStart=i=>project.video[i]?.start||0;
// 녹음 트랙 전체를 하나의 PCM 으로 섞는다. 조각끼리 겹치면 더해지고, 빈 구간은 무음이다.
const mixHere=(from,length)=>mixNarration(project.audio,takeOf,from,length);
function* narrationChunks(from,until,seconds=1){const total=samplesBetween(from,until),step=Math.max(1,Math.round(seconds*RATE));
 for(let at=0;at<total;at+=step)yield mixHere(from+at/RATE,Math.min(step,total-at));}
const samplesBetween=(from,until)=>Math.max(0,Math.round((until-from)*RATE));
// 미리보기용 한 덩어리. AudioBuffer 는 통짜로 받아야 해서 채널에 바로 이어 붙인다.
function narrationBuffer(from,end){const b=ctx.createBuffer(1,Math.max(1,samplesBetween(from,end)),RATE);
 let at=0;for(const chunk of narrationChunks(from,end)){if(!chunk.length)continue;b.copyToChannel(chunk,0,at);at+=chunk.length;}
 return b;}
async function drawAt(t,still=true){const shot=shotAt(t);if(!shot)return null;shot.still=still;
 await prepareLayers(shot);shot.media=await loadMedia(shot.assetName);await seekLayers(shot);
 await showMedia(shot.media,shot.scene,shot.sceneTime);
 return shot;}
let drawVersion=0;async function drawPreview(){if(freeEditor){freeEditor.paint();return;}const version=++drawVersion;
 const at=clipStart(clipIndex);
 if(!total()){drawScene($('preview'),null);$('previewTime').textContent='00:00 / '+time(total());return;}
 try{const shot=await drawAt(at);if(version!==drawVersion)return;
  drawScene($('preview'),shot);$('previewTime').textContent=time(at)+' / '+time(total());
 }catch(e){toast(e.message);drawScene($('preview'),shotAt(at));}}
async function previewAll(){if(busy||recording)return;if(previewing){stopPlayback();return;}const end=total();if(!end)return;stopPlayback();const token=previewToken;await audioContext();previewing=true;if($('edFullPlay'))$('edFullPlay').textContent='■ 전체 정지';
 try{const b=narrationBuffer(0,end);
  const src=ctx.createBufferSource();src.buffer=b;src.connect(ctx.destination);audioSource=src;const began=ctx.currentTime;src.start();
  await new Promise(resolve=>{const tick=async()=>{if(token!==previewToken)return resolve();const t=Math.min(ctx.currentTime-began,end);
   try{const shot=await drawAt(t,false);if(token!==previewToken)return resolve();
    drawScene($('preview'),shot);$('previewTime').textContent=time(t)+' / '+time(end);
    if(t>=end)resolve();else requestAnimationFrame(tick);}catch(e){toast(e.message);stopPlayback();resolve();}};tick();});
  if(token===previewToken)stopPlayback();}catch(e){stopPlayback();toast(e.message);}}
const ASTRA_GUIDE=`# 버콜 스튜디오 · Astra 장면 제작 요청\n\n이 ZIP의 manifest.json과 숫자 WAV를 읽고 각 문장에 어울리는 이미지·애니메이션 장면 패키지를 만들어 주세요. 녹음 순서는 id 순서이며 길이는 durationSeconds입니다. 대사는 그대로 유지하세요.\n\n## 반환 ZIP 규격 (version: 1)\nZIP 최상위에 scenes.json, 소재는 assets/에 넣으세요. 외부 URL과 실행 코드, HTML은 받지 않습니다. 이미지는 PNG/JPG/WebP, 영상은 MP4/WebM입니다. 폰트·텍스트·기본 애니메이션은 편집기의 동일한 캔버스 렌더러가 재현합니다. 복잡한 애니메이션은 16:9 영상으로 렌더해 소재로 넣으세요.\n\nscenes.json 예시:\n\n{\n  "version": 1,\n  "scenes": [\n    { "id": 1, "title": "첫 번째 이야기", "subtitle": "짧은 보조 문구", "asset": "assets/001.png", "layout": "split", "motion": "fade", "background": "#171925", "captions": true }\n  ]\n}\n\n- id: manifest.json의 문장 id(정수)와 정확히 일치. 중복 금지.\n- title, subtitle: 텍스트. title이 비면 대사를 사용. title은 한글 65자 이내 권장(긴 경우 화면에서 생략됨).\n- asset: ZIP 내부의 상대 경로. 생략하면 타이틀 페이지.\n- layout: title(텍스트 중심), split(좌 텍스트·우 소재), full(전체 소재).\n- motion: fade / zoom / slide / none. duration은 음성 길이로 자동 결정.\n- background: #RRGGBB. captions: true/false.\n- 1280×720 또는 1920×1080의 16:9. 안전 여백 5%.\n- 영상은 녹음 길이 이상 권장. 짧은 영상은 마지막 프레임을 유지. 영상 원음은 사용하지 않음. 자막 페이지는 녹음 길이에 비례해 전환하며 단어 단위 동기화가 아님.\n- HTML/CSS/JS 페이지는 직접 지원하지 않으므로 이미지나 영상으로 변환 후 넣기.\n- 파일 이름만 숫자인 이미지·영상(001.png, 002.mp4)도 직접 가져올 수 있음.\n\nAstra는 별도 대화에서 이 패키지를 제작합니다. 편집기는 AI 서비스에 자동으로 접속하지 않습니다.\n`;
function zipAsync(files){return new Promise((resolve,reject)=>zip(files,{level:0},(e,data)=>e?reject(e):resolve(data)));}
const trackManifest=()=>({version:2,name:project.name,captions:captionsOn(),sampleRate:RATE,channels:1,
 sentences:project.sentences.map(s=>({id:s.id,text:s.text,audio:s.audio?pad(s.id)+'.wav':null,durationSeconds:duration(s)})),
 video:project.video.map(c=>({id:c.id,start:c.start,duration:c.duration,scene:c.scene})),
 audio:project.audio.map(c=>({id:c.id,sentenceId:c.sentenceId,start:c.start,duration:c.duration,offset:c.offset||0,text:c.text}))});
async function exportPackage(full=false){if(busy||recording)return;if(!project.sentences.length&&!project.video.length)return toast('먼저 대본이나 영상 조각을 추가하세요.');if(!full&&!project.sentences.some(s=>s.audio))return toast('최소 한 문장을 녹음하세요.');setBusy(true);try{const files={},manifest=trackManifest();for(const s of project.sentences)if(s.audio)files[pad(s.id)+'.wav']=wavBytes(s.audio);files['manifest.json']=strToU8(JSON.stringify(manifest,null,2));files['script.txt']=strToU8(project.sentences.map(s=>pad(s.id)+'\t'+s.text).join('\n'));files['ASTRA_README.md']=strToU8(ASTRA_GUIDE);if(full){files['project.json']=strToU8(JSON.stringify(manifest,null,2));for(const[name,blob]of Object.entries(project.assets))files[name]=new Uint8Array(await blob.arrayBuffer());files['scenes.json']=strToU8(JSON.stringify({version:1,scenes:project.video.map((c,i)=>({id:i+1,...c.scene}))},null,2));}download(new Blob([await zipAsync(files)],{type:'application/zip'}),fileName()+(full?'_project.zip':'_audio.zip'));toast(full?'프로젝트 백업을 다운로드했습니다.':'숫자 WAV와 Astra 작업 안내를 다운로드했습니다.');}catch(e){toast('ZIP 저장 실패: '+e.message);}finally{setBusy(false);}}
function readZip(data){let size=0;const files=unzipSync(data,{filter:f=>{size+=f.originalSize;if(size>1024*1024*1024)throw Error('압축 해제 크기가 1GB를 넘습니다. 소재를 나누어 가져오세요.');return !f.name.endsWith('/')&&!f.name.startsWith('__MACOSX/')&&!/(^|\/)\./.test(f.name);}});return files;}
async function importSceneFiles(fileList,replace=false){if(replace&&!clip())return toast('바꿀 영상 조각을 먼저 고르세요.');if(busy||recording)return;setBusy(true);stopPlayback();try{const files={};for(const f of fileList){if(f.size>1024*1024*1024)throw Error('파일은 1GB 이하로 가져오세요.');if(/\.zip$/i.test(f.name))Object.assign(files,readZip(new Uint8Array(await f.arrayBuffer())));else files[f.name]=new Uint8Array(await f.arrayBuffer());}const assets={},updates=[],jsonKey=Object.keys(files).find(n=>n==='scenes.json'||n.endsWith('/scenes.json'));if(jsonKey){const spec=JSON.parse(strFromU8(files[jsonKey]));if(spec.version!==1||!Array.isArray(spec.scenes))throw Error('scenes.json의 version: 1과 scenes 배열을 확인하세요.');const prefix=jsonKey.slice(0,-'scenes.json'.length),ids=new Set();for(const raw of spec.scenes){const scene=validScene(raw);if(ids.has(scene.id))throw Error('중복 장면 번호: '+scene.id);ids.add(scene.id);if(scene.asset){const key=prefix+scene.asset;if(!files[key]||!assetType(key))throw Error('장면 소재 누락 또는 지원하지 않는 형식: '+scene.asset);const normalized='assets/'+scene.id+'_'+scene.asset.split('/').pop();assets[normalized]=new Blob([files[key]],{type:blobType(key)});scene.asset=normalized;}for(const l of scene.layers||[])if(l.asset){const key=prefix+l.asset;if(!files[key]||!assetType(key))throw Error('레이어 소재 누락: '+l.asset);const normalized='assets/'+scene.id+'_'+l.id+'_'+l.asset.split('/').pop();assets[normalized]=new Blob([files[key]],{type:blobType(key)});l.asset=normalized;}updates.push(scene);}}else{for(const[name,bytes]of Object.entries(files)){if(!assetType(name))continue;const n=name.split('/').pop().match(/^(\d+)\./),id=replace?1:n?Number(n[1]):null;if(!id)throw Error('소재 파일명은 순서 번호여야 합니다: 001.png, 002.mp4');const key='assets/'+id+'_'+name.split('/').pop();assets[key]=new Blob([bytes],{type:blobType(name)});if(updates.some(s=>s.id===id))throw Error('같은 순서 번호의 소재가 여러 개입니다.');updates.push({id,asset:key,layout:'full'});}}if(!updates.length)throw Error('가져올 장면이 없습니다.');clearMedia();Object.assign(project.assets,assets);
 // 가져온 장면은 그 문장 녹음이 놓인 자리에 맞춰 영상 트랙에 올린다. 녹음이 없으면 트랙 맨 뒤에 붙인다.
 if(replace&&clip()){const scene=updates[0];clip().scene={...clip().scene,...scene,reviewed:false};delete clip().scene.id;delete clip().scene.layers;}
 else for(const scene of updates.sort((a,b)=>a.id-b.id)){const id=scene.id,take=project.audio.find(c=>c.sentenceId===id),s=sentenceById(id);
  delete scene.id;
  const at=take?take.start:trackTail(project.video),span=take?take.duration:Math.max(MIN_CLIP,duration(s)||3);
  const existing=project.video.find(c=>Math.abs(c.start-at)<1e-6);
  if(existing)existing.scene={...defaultScene(),...scene,reviewed:false};
  else project.video.push(newVideoClip({...defaultScene(),...scene,reviewed:false},at,span));}
 project.video.sort((a,b)=>a.start-b.start);scheduleSave();render();toast(updates.length+'개 장면을 영상 트랙에 올렸습니다. 타임라인에서 자유롭게 옮기고 자를 수 있어요.');}catch(e){toast('장면 가져오기 실패: '+e.message);}finally{setBusy(false);}}
// 한 조각의 장면을 검사한다. validScene 은 문장 번호를 요구하므로 자리 번호를 빌려 주고 결과에서 뺀다.
function checkScene(raw,slot,files,assets){const scene=validScene({...raw,id:slot});delete scene.id;delete scene.continues;
 if(scene.asset){if(!files[scene.asset])delete scene.asset;else assets[scene.asset]=new Blob([files[scene.asset]],{type:blobType(scene.asset)});}
 for(const l of scene.layers||[])if(l.asset){if(!files[l.asset])throw Error('레이어 소재 누락: '+l.asset);assets[l.asset]=new Blob([files[l.asset]],{type:blobType(l.asset)});}
 return{...defaultScene(),...scene,reviewed:!!raw?.reviewed};}
async function restoreProject(file){if(busy||recording)return;if((project.sentences.length||project.video.length)&&!confirm('현재 작업을 이 ZIP의 프로젝트로 교체할까요?'))return;setBusy(true);try{const files=readZip(new Uint8Array(await file.arrayBuffer())),raw=files['project.json']||files['manifest.json'];if(!raw)throw Error('프로젝트 또는 녹음 ZIP을 선택하세요.');const m=JSON.parse(strFromU8(raw));if(![1,2].includes(m.version)||!Array.isArray(m.sentences)||m.sentences.length>2000)throw Error('지원하지 않는 프로젝트입니다.');
 const next={version:2,name:String(m.name||'가져온 프로젝트'),captions:m.captions!==false,sentences:[],video:[],audio:[],assets:{}},ids=new Set(),legacy=[];
 for(const item of m.sentences){if(typeof item.text!=='string')throw Error('문장 텍스트 오류');
  const id=Number(item.id);if(!Number.isInteger(id)||id<1)throw Error('문장 번호 오류');if(ids.has(id))throw Error('중복 문장 번호');ids.add(id);
  const s=newSentence(item.text,id);
  if(item.audio){if(!files[item.audio])throw Error('누락된 녹음: '+item.audio);s.audio=await decodeAudio(new Blob([files[item.audio]]));}
  next.sentences.push(s);
  // 이어가기는 더 이상 장면 속성이 아니지만, 옛 프로젝트를 옮길 때는 그대로 읽어야 조각이 예전처럼 묶인다.
  if(m.version===1)legacy.push({...s,scene:{...checkScene(item.scene,id,files,next.assets),...(item.scene?.continues?{continues:true}:{})}});}
 if(m.version===1){const moved=migrateProject({version:1,sentences:legacy});next.video=moved.video;next.audio=moved.audio;}
 else{
  if(!Array.isArray(m.video)||!Array.isArray(m.audio)||m.video.length>2000||m.audio.length>2000)throw Error('타임라인 트랙 형식이 올바르지 않습니다.');
  next.video=m.video.map((c,i)=>newVideoClip(checkScene(c.scene,i+1,files,next.assets),c.start,c.duration,typeof c.id==='string'?c.id:undefined));
  next.audio=m.audio.filter(c=>ids.has(Number(c.sentenceId))).map(c=>newAudioClip(Number(c.sentenceId),c.start,c.duration,String(c.text||''),typeof c.id==='string'?c.id:undefined,c.offset));}
 for(const[name,bytes]of Object.entries(files))if((name.startsWith('clips/')||name.startsWith('media/'))&&assetType(name)&&!next.assets[name])next.assets[name]=new Blob([bytes],{type:blobType(name)});
 stopPlayback();clearMedia();project=next;selected=0;clipIndex=0;undo.clear();freeEditor?.clearHistory();$('projectName').value=project.name;scheduleSave();render();toast('프로젝트를 복원했습니다.');}catch(e){toast('프로젝트 복원 실패: '+e.message);}finally{setBusy(false);}}
async function seekVideo(video,t){const target=Math.max(0,Math.min(t,Math.max(0,video.duration-.035)));if(Math.abs(video.currentTime-target)<.0005&&video.readyState>=2)return;await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{clean();reject(Error('영상 프레임을 읽을 수 없습니다. 소재를 MP4 H.264로 변환해 주세요.'));},10000);const clean=()=>{clearTimeout(timeout);video.removeEventListener('seeked',done);video.removeEventListener('error',fail);};const done=()=>{clean();resolve();},fail=()=>{clean();reject(Error('영상 소재 오류'));};video.addEventListener('seeked',done);video.addEventListener('error',fail);video.currentTime=target;});}
async function renderCompatibleVideo(want=''){
 const prefer=want==='webm'?['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm']:['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
 const mime=prefer.find(t=>globalThis.MediaRecorder?.isTypeSupported(t));
 if(!mime||!HTMLCanvasElement.prototype.captureStream)return toast(want==='webm'?'이 브라우저는 WebM 출력을 지원하지 않습니다. MP4로 내보내 보세요.':'이 브라우저에서는 영상 출력을 지원하지 않습니다. 프로젝트 ZIP을 PC Chrome·Edge로 옮겨 주세요.');
 const width=+$('resolution').value,canvas=document.createElement('canvas');canvas.width=width;canvas.height=width*9/16;
 let rec,stream,dest,source,wake;renderCancelled=false;stopPlayback();setBusy(true);$('renderProgress').hidden=false;$('cancelRender').hidden=false;
 try{await audioContext();await document.fonts.ready;try{wake=await navigator.wakeLock?.request('screen');}catch{}dest=ctx.createMediaStreamDestination();stream=canvas.captureStream(getFrameRate());for(const track of dest.stream.getAudioTracks())stream.addTrack(track);
 const chunks=[];let recordingError=null;rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:width===1920?6500000:3500000,audioBitsPerSecond:128000});rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};rec.onerror=e=>{recordingError=e.error||Error('영상 인코딩 실패');};const done=new Promise(resolve=>rec.onstop=resolve);
 const end=total(),first=await drawAt(0,false);drawScene(canvas,first);rec.start(1000);
 const b=narrationBuffer(0,end);source=ctx.createBufferSource();source.buffer=b;source.connect(dest);const began=ctx.currentTime;source.start();
 let lastClip=first?.clip||null,lastShot=first,prev=null;
 while(ctx.currentTime-began<end){if(renderCancelled)throw Error('렌더링을 취소했습니다.');if(recordingError)throw recordingError;
  const t=ctx.currentTime-began,shot=shotAt(t);
  if(shot?.clip!==lastClip){lastClip=shot?.clip||null;prev=lastShot;if(shot)await prepareLayers(shot);}
  if(shot){shot.media=await loadMedia(shot.assetName);await seekLayers(shot);await showMedia(shot.media,shot.scene,shot.sceneTime);}
  drawScene(canvas,shot,prev);lastShot=shot;
  $('renderProgress').value=t/end;$('renderStatus').textContent=`호환 모드 · ${Math.round(t/end*100)}% · 영상 길이만큼 시간이 걸려요. 이 탭을 열어 두세요.`;await new Promise(requestAnimationFrame);}
 source.stop();source.disconnect();source=null;
 rec.stop();await done;if(recordingError)throw recordingError;const ext=mime.startsWith('video/mp4')?'mp4':'webm',blob=new Blob(chunks,{type:mime});if(!blob.size)throw Error('영상 파일이 비어 있습니다.');download(blob,fileName()+'.'+ext);$('renderProgress').value=1;$('renderStatus').textContent=ext.toUpperCase()+' 저장 완료 · 호환 모드';toast(ext.toUpperCase()+' 영상을 저장했습니다.');
 }catch(e){if(rec?.state==='recording')rec.stop();$('renderStatus').textContent=e.message;toast(e.message);}finally{try{source?.stop();}catch{}source?.disconnect();stream?.getTracks().forEach(t=>t.stop());dest?.disconnect();await wake?.release().catch(()=>{});$('cancelRender').hidden=true;setBusy(false);}
}

// GIF 는 소리를 담지 못하고 256색이라, 화면만 작게 줄여 프레임마다 눌러 담는다.
async function renderGif(){
 if(busy||recording)return;const end=total();if(!end)return toast('타임라인에 영상 조각이나 녹음을 올리세요.');
 const fps=Math.max(1,+$('gifFps').value||10),width=Math.max(2,Math.round((+$('gifWidth').value||480)/2)*2),height=Math.round(width*9/16/2)*2;
 const count=Math.max(1,Math.ceil(end*fps));
 if(count>1800)throw Error(`GIF 는 프레임이 ${count}장이라 너무 깁니다. 타임라인을 줄이거나 FPS를 낮춰 주세요.`);
 renderCancelled=false;stopPlayback();setBusy(true);$('renderProgress').hidden=false;$('cancelRender').hidden=false;$('renderProgress').value=0;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const g=canvas.getContext('2d',{willReadFrequently:true});
 try{
  await document.fonts.ready;
  const writer=createGifWriter({width,height}),started=performance.now();
  let lastClip=null,lastShot=null,prev=null;
  for(let frame=0;frame<count;frame++){
   if(renderCancelled)throw Error('GIF 만들기를 취소했습니다.');
   const t=frame/fps,shot=shotAt(t);
   if(shot?.clip!==lastClip){lastClip=shot?.clip||null;prev=lastShot;if(shot)await prepareLayers(shot);}
   if(shot){shot.media=await loadMedia(shot.assetName);await seekLayers(shot);if(shot.media instanceof HTMLVideoElement)shot.media.pause();await showMedia(shot.media,shot.scene,shot.sceneTime);}
   drawScene(canvas,shot,prev);lastShot=shot;
   writer.addFrame(g.getImageData(0,0,width,height).data,1/fps);
   const fraction=(frame+1)/count;$('renderProgress').value=fraction;
   $('renderStatus').textContent=`GIF ${Math.round(fraction*100)}% · ${frame+1} / ${count}장 · ${size(writer.bytes)} · 경과 ${time((performance.now()-started)/1000)}`;
   await new Promise(r=>setTimeout(r,0));
  }
  const bytes=writer.finish();
  download(new Blob([bytes],{type:'image/gif'}),fileName()+'.gif');
  $('renderProgress').value=1;
  $('renderStatus').textContent=`GIF 저장 완료 · ${width} × ${height} · ${count}장 · ${size(bytes.length)} · 소리는 담기지 않습니다`;
  toast('GIF를 저장했습니다. 소리는 담기지 않아요.');
 }catch(e){$('renderStatus').textContent=e.message;toast(e.message);}
 finally{$('cancelRender').hidden=true;setBusy(false);}
}
async function renderMp4(){if(busy||recording)return;if(!total())return toast('타임라인에 영상 조각이나 녹음을 올리세요.');
 const format=$('exportFormat').value;
 if(format==='gif')return renderGif();
 if(format==='webm')return renderCompatibleVideo('webm');
 if(!globalThis.VideoEncoder||!globalThis.AudioEncoder)return renderCompatibleVideo();let fileHandle=null,writer=null,ve=null,ae=null,wakeLock=null;renderCancelled=false;stopPlayback();const width=+$('resolution').value,height=width*9/16;try{setBusy(true);const videoConfig={codec:'avc1.420028',width,height,bitrate:width===1920?6500000:3500000,framerate:getFrameRate(),latencyMode:'realtime',avc:{format:'avc'}},audioConfig={codec:'mp4a.40.2',sampleRate:RATE,numberOfChannels:1,bitrate:128000};const [vs,as]=await Promise.all([VideoEncoder.isConfigSupported(videoConfig),AudioEncoder.isConfigSupported(audioConfig)]);if(!vs.supported||!as.supported)return await renderCompatibleVideo();if(globalThis.showSaveFilePicker){try{fileHandle=await showSaveFilePicker({suggestedName:fileName()+'.mp4',types:[{description:'MP4 영상',accept:{'video/mp4':['.mp4']}}]});}catch(e){if(e.name==='AbortError')return;fileHandle=null;}}if(!fileHandle&&total()*(videoConfig.bitrate+128000)/8>700*1024*1024)throw Error('긴 영상은 직접 파일 저장이 가능한 PC Chrome·Edge에서 렌더링하세요.');if(fileHandle)writer=await fileHandle.createWritable();try{wakeLock=await navigator.wakeLock?.request('screen');}catch{}const target=writer?new FileSystemWritableFileStreamTarget(writer):new ArrayBufferTarget(),muxer=new Muxer({target,video:{codec:'avc',width,height,frameRate:getFrameRate()},audio:{codec:'aac',numberOfChannels:1,sampleRate:RATE},fastStart:false,firstTimestampBehavior:'offset'});let encoderError=null;ve=new VideoEncoder({output:(chunk,meta)=>{try{muxer.addVideoChunk(chunk,meta);}catch(e){encoderError=e;}},error:e=>encoderError=e});ae=new AudioEncoder({output:(chunk,meta)=>{try{muxer.addAudioChunk(chunk,meta);}catch(e){encoderError=e;}},error:e=>encoderError=e});ve.configure(videoConfig);ae.configure(audioConfig);const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;await document.fonts.ready;$('renderProgress').hidden=false;$('cancelRender').hidden=false;$('renderProgress').value=0;let sampleOffset=0,frame=0;
const packets=audioPackets(narrationChunks(0,total()));let packet=packets.next();
const drain=async(encoder,limit)=>{while(encoder.encodeQueueSize>limit){if(renderCancelled)throw Error('렌더링을 취소했습니다.');if(encoderError)throw encoderError;await new Promise(resolve=>setTimeout(resolve,1));}};
const encodeAudioUntil=async(timeUs)=>{while(!packet.done&&packet.value.timestamp<timeUs){if(encoderError)throw encoderError;const {data,timestamp}=packet.value;const ad=new AudioData({format:'f32',sampleRate:RATE,numberOfFrames:data.length,numberOfChannels:1,timestamp,data});try{ae.encode(ad);}finally{ad.close();}packet=packets.next();await drain(ae,32);}};
const end=total(),frameTotal=Math.ceil(end*getFrameRate()),started=performance.now();let prev=null,lastClip=null,lastShot=null;
for(;frame<frameTotal;frame++){if(renderCancelled)throw Error('렌더링을 취소했습니다.');if(encoderError)throw encoderError;
 const t=frame/getFrameRate(),shot=shotAt(t);
 // 조각이 바뀌는 순간의 직전 화면을 붙잡아 둔다. 덮으며 등장하는 효과가 그 위에 얹힌다.
 if(shot?.clip!==lastClip){lastClip=shot?.clip||null;prev=lastShot;if(shot)await prepareLayers(shot);}
 if(shot){shot.media=await loadMedia(shot.assetName);await seekLayers(shot);if(shot.media instanceof HTMLVideoElement)shot.media.pause();await showMedia(shot.media,shot.scene,shot.sceneTime);}
 drawScene(canvas,shot,prev);lastShot=shot;
 const vf=new VideoFrame(canvas,{timestamp:Math.round(frame*1e6/getFrameRate()),duration:Math.round((frame+1)*1e6/getFrameRate())-Math.round(frame*1e6/getFrameRate())});ve.encode(vf,{keyFrame:frame%(getFrameRate()*2)===0});vf.close();
 await encodeAudioUntil(Math.round((frame+1)*1e6/getFrameRate()));await drain(ve,8);
 if(frame%(getFrameRate()/2)===0){const fraction=(frame+1)/frameTotal;$('renderProgress').value=fraction;const elapsed=(performance.now()-started)/1000;$('renderStatus').textContent=`${Math.round(fraction*100)}% · ${time(t)} / ${time(end)} · 경과 ${time(elapsed)} · 이 탭을 열어 두세요`;await new Promise(r=>setTimeout(r,0));}}
await encodeAudioUntil(Infinity);await Promise.all([ve.flush(),ae.flush()]);if(encoderError)throw encoderError;if(renderCancelled)throw Error('렌더링을 취소했습니다.');muxer.finalize();if(writer){await writer.close();writer=null;}else download(new Blob([target.buffer],{type:'video/mp4'}),fileName()+'.mp4');$('renderProgress').value=1;$('renderStatus').textContent='MP4 저장 완료 · '+width+' × '+height+' · '+time(total());toast('롱폼 MP4를 저장했습니다.');}catch(e){if(writer)try{await writer.abort();}catch{}$('renderStatus').textContent=e.message;toast(e.message);}finally{if(ve?.state!=='closed')try{ve?.close();}catch{}if(ae?.state!=='closed')try{ae?.close();}catch{}await wakeLock?.release().catch(()=>{});$('cancelRender').hidden=true;setBusy(false);}}
const on=(id,fn)=>$(id).addEventListener('click',async()=>{if((busy||recording)&&!['recordBtn','cancelRender','previewStop'].includes(id))return;try{await fn();}catch(e){toast(e.message||'작업을 완료하지 못했습니다.');}});
document.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>switchTab(el.dataset.tab));on('goExport',()=>switchTab('export'));on('uploadTxt',()=>$('txtInput').click());on('pasteBtn',()=>$('textDialog').showModal());on('applyText',()=>{replaceScript($('pasteText').value);$('textDialog').close();});on('sampleBtn',()=>{replaceScript('좋은 이야기는 한 문장에서 시작됩니다.\n잠깐 말을 멈춰도 괜찮아요.\n다시 말하고, 필요한 부분만 남기면 됩니다.\n이제 목소리에 장면을 더해 하나의 영상으로 완성해 볼까요?');project.name='나의 첫 번째 롱폼';$('projectName').value=project.name;scheduleSave();});on('addSentence',()=>{project.sentences.push(newSentence('',Math.max(0,...project.sentences.map(s=>s.id))+1));selected=project.sentences.length-1;changed();render();$('sentenceText').focus();});on('recordBtn',startRecording);on('playAudio',playSelected);on('prevSentence',()=>selectSentence(selected-1));on('nextSentence',()=>selectSentence(selected+1));on('keepRange',()=>editSelected(true));on('deleteRange',()=>editSelected(false));on('trimSilence',()=>{if(current()?.audio){stopPlayback();updateAudio(trimAudio(current().audio));toast('앞뒤의 작은 무음을 정리했습니다.');}});on('undoAudio',()=>{const s=current(),old=undo.get(s?.id);if(old){stopPlayback();s.audio=old;undo.delete(s.id);changed();render();toast('직전 오디오 편집을 복원했습니다.');}});on('importAudio',()=>{if(!current())return toast('문장을 먼저 선택하세요.');$('audioInput').click();});on('exportAudio',()=>exportPackage());on('exportAudio2',()=>exportPackage());on('saveProject',()=>exportPackage(true));on('backupBtn',()=>exportPackage(true));on('openProject',()=>$('projectInput').click());let replaceMode=false;on('importScenes',()=>{replaceMode=false;$('sceneInput').multiple=true;$('sceneInput').click();});on('replaceAsset',()=>{replaceMode=true;$('sceneInput').multiple=false;$('sceneInput').click();});on('sceneTemplate',async()=>{const scenes={version:1,scenes:(project.sentences.length?project.sentences:[newSentence('첫 번째 이야기',1)]).map(s=>({id:s.id,title:s.text,subtitle:'',layout:'title',motion:'fade',background:WHITE,captions:true,continues:false,clipStart:0,clipEnd:0}))};download(new Blob([await zipAsync({'scenes.json':strToU8(JSON.stringify(scenes,null,2)),'ASTRA_README.md':strToU8(ASTRA_GUIDE)})],{type:'application/zip'}),'astra_scene_template.zip');});on('previewPlay',previewAll);on('previewStop',()=>{stopPlayback();drawPreview();});on('renderMp4',renderMp4);
$('exportFormat').onchange=()=>{const f=$('exportFormat').value;
 $('gifOptions').hidden=f!=='gif';for(const id of ['resolution','frameRate'])$(id)?.closest('label')?.toggleAttribute('hidden',f==='gif');
 $('formatNote').textContent={
  mp4:'MP4를 우선 사용하며, 기기에서 지원하지 않으면 호환 모드로 MP4 또는 WebM을 저장합니다. 긴 영상은 PC에서 출력하는 것이 편해요.',
  webm:'WebM은 파일이 작고 웹에 올리기 좋습니다. 녹음도 함께 담기며, 영상 길이만큼 시간이 걸립니다.',
  gif:'GIF는 소리가 담기지 않고 색이 256개로 줄어듭니다. 짧은 구간을 반복 재생할 때 알맞아요.',
 }[f];
 $('renderMp4').textContent=f==='gif'?'GIF 내보내기 ↗':'영상 내보내기 ↗';renderStats();};
$('gifWidth').onchange=renderStats;on('cancelRender',()=>{renderCancelled=true;$('renderStatus').textContent='렌더링을 중단하는 중…';});on('guideBtn',()=>$('guideDialog').showModal());on('closeGuide',()=>$('guideDialog').close());
$('txtInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||busy||recording)return;try{if(file.size>2*1024*1024)throw Error('대본 TXT는 2MB 이하로 가져오세요.');const bytes=await file.arrayBuffer();let text=new TextDecoder('utf-8',{fatal:true});try{text=text.decode(bytes);}catch{text=new TextDecoder('euc-kr').decode(bytes);}replaceScript(text);}catch(e){toast(e.message);}};
$('audioInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file||busy||recording)return;if(current()?.audio&&!$('appendRecording').checked&&!confirm('현재 문장 녹음을 이 파일로 교체할까요?'))return;setBusy(true);try{const audio=await decodeAudio(file);updateAudio($('appendRecording').checked&&current().audio?joinAudio(current().audio,audio):audio);}catch(e){toast(e.message);}finally{setBusy(false);}};
$('sceneInput').onchange=async e=>{const files=[...e.target.files];e.target.value='';if(files.length)await importSceneFiles(files,replaceMode);};$('projectInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(file)await restoreProject(file);};
$('sentenceText').oninput=()=>{if(current()&&!busy&&!recording){current().text=$('sentenceText').value;changed();renderList();}};$('projectName').oninput=()=>{project.name=$('projectName').value;scheduleSave();};for(const id of['cutStart','cutEnd'])$(id).oninput=()=>drawWave();
for(const[k,id]of Object.entries({title:'sceneTitle',subtitle:'sceneSubtitle',layout:'sceneLayout',motion:'sceneMotion',background:'sceneColor'}))$(id).oninput=()=>{if(!clip()||busy)return;stopPlayback();clip().scene[k]=$(id).value;changed();$('sceneReviewed').checked=false;drawPreview();renderTimeline();};// ── 영상 자르기 도구 ────────────────────────────────────────────────
const clipKeys=()=>Object.keys(project.assets).filter(k=>k.startsWith('clips/')).sort();
const clipLabel=key=>key.slice('clips/'.length);
const srcSpan=()=>clipRange({clipStart:+$('srcStart').value||0,clipEnd:+$('srcEnd').value||0},$('srcVideo').duration||0);
function srcNote(extra){
 const el=$('srcVideo');
 if(extra!==undefined)return void($('srcStatus').textContent=extra);
 if(!el.duration)return void($('srcStatus').textContent='원본 영상을 열면 구간을 정할 수 있습니다.');
 const {start,end,span}=srcSpan();
 $('srcStatus').textContent=`자를 구간 ${start.toFixed(2)}초 ~ ${end.toFixed(2)}초 · 길이 ${span.toFixed(2)}초 · 타임라인 ${time(trackTail(project.video))} 자리에 이어 붙습니다`;
}
function renderClips(){
 const keys=clipKeys(),list=$('clipList');
 $('clipCount').textContent=keys.length;list.replaceChildren();
 if(!keys.length)return void(list.textContent='아직 잘라 둔 영상이 없습니다. 원본을 열고 구간을 잘라 보세요.');
 for(const key of keys){
  const row=document.createElement('div');row.className='clip-item'+(clip()?.scene.asset===key?' current':'');
  const info=document.createElement('div');info.className='clip-info';
  const name=document.createElement('strong'),meta=document.createElement('small');
  name.textContent='✂ '+clipLabel(key);
  const used=project.video.filter(c=>c.scene.asset===key||c.scene.layers?.some(l=>l.asset===key)).map(c=>time(c.start));
  meta.textContent=(project.assets[key].size/1048576).toFixed(1)+'MB'+(used.length?' · 타임라인 '+used.join(', ')+'에 올림':' · 아직 올리지 않음');
  info.append(name,meta);
  const acts=document.createElement('div');acts.className='clip-item-actions';
  const use=document.createElement('button');use.className='primary';
  use.textContent='타임라인 끝에 올리기';use.onclick=()=>useClip(key).catch(e=>toast(e.message));
  const dl=document.createElement('button');dl.className='text-btn';dl.textContent='내려받기';
  dl.onclick=()=>download(project.assets[key],clipLabel(key));
  const del=document.createElement('button');del.className='text-btn danger';del.textContent='삭제';
  del.onclick=()=>removeClip(key);
  acts.append(use,dl,del);row.append(info,acts);list.append(row);
 }
}
// 잘라 둔 조각을 영상 트랙 맨 뒤에 올린다. 길이는 잘라 낸 구간 그대로이고 녹음과는 아무 관계가 없다.
async function useClip(key,at=null){
 if(!project.assets[key])return toast('조각을 찾을 수 없습니다.');
 let span=clipSpans.get(key)||0;
 if(!span){try{span=await mediaSeconds(key);clipSpans.set(key,span);}catch{span=3;}}
 const start=at??trackTail(project.video);
 const added=newVideoClip({...defaultScene(),asset:key,layout:'full',reviewed:false},start,Math.max(MIN_CLIP,span));
 project.video.push(added);project.video.sort((a,b)=>a.start-b.start);
 clipIndex=project.video.indexOf(added);
 clearMedia();scheduleSave();render();renderClips();
 toast(`${clipLabel(key)} 조각을 ${time(start)} 자리에 올렸습니다.`);
}
const clipSpans=new Map();
async function mediaSeconds(key){const el=await loadMedia(key);return el instanceof HTMLVideoElement?el.duration||0:3;}
function removeClip(key){
 const used=project.video.filter(c=>c.scene.asset===key||c.scene.layers?.some(l=>l.asset===key));
 if(!confirm(`‘${clipLabel(key)}’ 조각을 지울까요?`+(used.length?` 타임라인 ${used.map(c=>time(c.start)).join(', ')}에서 쓰고 있어 그 자리의 영상도 사라집니다.`:'')))return;
 for(const c of used){if(c.scene.asset===key){delete c.scene.asset;delete c.scene.clipStart;delete c.scene.clipEnd;}if(c.scene.layers)c.scene.layers=c.scene.layers.filter(l=>l.asset!==key);c.scene.reviewed=false;}
 delete project.assets[key];clipSpans.delete(key);clearMedia();scheduleSave();render();renderClips();
 toast('조각을 지웠습니다.');
}
async function cutClip(){
 if(cutting)return;
 const video=$('srcVideo');
 if(!video.duration)throw Error('원본 영상을 먼저 열어 주세요.');
 if(!globalThis.VideoEncoder)throw Error('이 브라우저는 영상 자르기를 지원하지 않습니다. PC Chrome 또는 Edge를 사용하세요.');
 const {start,end,span}=srcSpan();
 if(span<.1)throw Error('구간이 너무 짧습니다. 시작과 끝을 다시 정하세요.');
 if(span>300)throw Error('한 번에 5분 이하로 잘라 주세요.');
 const {width,height}=clipOutputSize(video.videoWidth,video.videoHeight,+$('resolution').value||1280);
 const base={width,height,bitrate:width>=1920?6500000:3500000,framerate:getFrameRate(),latencyMode:'realtime'};
 const pick=await pickClipCodec(base,c=>VideoEncoder.isConfigSupported(c));
 if(!pick)throw Error('이 기기에서 영상 인코딩을 사용할 수 없습니다. PC Chrome·Edge를 사용하세요.');
 const config={...base,...pick.extra,codec:pick.codec};
 const key=uniqueAssetKey(Object.keys(project.assets),safeClipName($('srcName').value,'조각'));
 cutting=true;cutCancelled=false;setBusy(true);
 $('srcProgress').hidden=false;$('srcProgress').value=0;$('srcCancel').hidden=false;
 let enc=null;
 try{
  video.pause();
  const target=new ArrayBufferTarget(),muxer=new Muxer({target,video:{codec:pick.muxer,width,height,frameRate:getFrameRate()},fastStart:'in-memory'});
  let encErr=null;
  enc=new VideoEncoder({output:(chunk,meta)=>{try{muxer.addVideoChunk(chunk,meta);}catch(e){encErr=e;}},error:e=>encErr=e});
  enc.configure(config);
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const g=canvas.getContext('2d'),frames=Math.max(1,Math.round(span*getFrameRate())),began=performance.now();
  for(let i=0;i<frames;i++){
   if(cutCancelled)throw Error('자르기를 취소했습니다.');
   if(encErr)throw encErr;
   await seekVideo(video,Math.min(start+i/getFrameRate(),Math.max(start,end-1/60)));
   g.drawImage(video,0,0,width,height);
   const frame=new VideoFrame(canvas,{timestamp:Math.round(i*1e6/getFrameRate()),duration:Math.round(1e6/getFrameRate())});
   enc.encode(frame,{keyFrame:i%60===0});frame.close();
   while(enc.encodeQueueSize>8){if(encErr)throw encErr;await new Promise(r=>setTimeout(r,1));}
   if(i%10===0||i===frames-1){$('srcProgress').value=(i+1)/frames;
    srcNote(`자르는 중 ${Math.round((i+1)/frames*100)}% · ${width}×${height} ${pick.label} · 경과 ${time((performance.now()-began)/1000)}`);
    await new Promise(r=>setTimeout(r,0));}
  }
  await enc.flush();
  if(encErr)throw encErr;
  muxer.finalize();
  project.assets[key]=new Blob([target.buffer],{type:'video/mp4'});
  clipSpans.set(key,span);
  const at=trackTail(project.video);
  project.video.push(newVideoClip({...defaultScene(),asset:key,layout:'full',reviewed:false},at,span));
  clipIndex=project.video.length-1;
  scheduleSave();render();renderClips();
  srcNote(`잘라 저장했습니다 · ${clipLabel(key)} · ${span.toFixed(2)}초 · ${(project.assets[key].size/1048576).toFixed(1)}MB`);
  toast(`영상 조각을 타임라인 ${time(at)} 자리에 올렸습니다. 원하는 곳으로 끌어 옮기세요.`);
 }finally{
  if(enc&&enc.state!=='closed')try{enc.close();}catch{}
  cutting=false;setBusy(false);$('srcCancel').hidden=true;$('srcProgress').hidden=true;
 }
}
on('cutVideoBtn',()=>{renderClips();srcNote();if(!$('cutDialog').open)$('cutDialog').showModal();});
$('closeCut').onclick=()=>{if(cutting)return toast('자르기가 끝난 뒤에 닫아 주세요.');$('cutDialog').close();};
on('openSource',()=>$('sourceInput').click());
$('sourceInput').onchange=e=>{const file=e.target.files[0];e.target.value='';if(!file)return;
 if(cutUrl)URL.revokeObjectURL(cutUrl);
 cutUrl=URL.createObjectURL(file);$('srcVideo').src=cutUrl;
 $('sourceName').textContent=file.name+' · '+(file.size/1048576).toFixed(0)+'MB';
 $('cutBody').hidden=false;$('srcStart').value='0.00';$('srcEnd').value='0.00';
 $('srcName').value=safeClipName(file.name.replace(/\.[^.]+$/,''),'조각');srcNote();};
$('srcVideo').onloadedmetadata=()=>{$('srcTotal').textContent='/ '+time($('srcVideo').duration);srcNote();};
$('srcVideo').ontimeupdate=()=>{const el=$('srcVideo');$('srcNow').textContent=time(el.currentTime,true);if(el.duration)$('srcScrub').value=el.currentTime/el.duration;};
$('srcScrub').oninput=()=>{const el=$('srcVideo');if(el.duration)el.currentTime=(+$('srcScrub').value)*el.duration;};
$('srcStart').onchange=()=>srcNote();$('srcEnd').onchange=()=>srcNote();
on('srcSetStart',()=>{$('srcStart').value=$('srcVideo').currentTime.toFixed(2);srcNote();});
on('srcSetEnd',()=>{$('srcEnd').value=$('srcVideo').currentTime.toFixed(2);srcNote();});
on('srcFit',()=>{const gap=total()-trackTail(project.video);if(gap<=.05)return toast('영상 트랙이 녹음만큼 이미 채워져 있습니다.');
 $('srcEnd').value=((+$('srcStart').value||0)+gap).toFixed(2);srcNote();
 toast(`남은 녹음 ${gap.toFixed(2)}초에 맞췄습니다.`);});
on('srcPlay',async()=>{const el=$('srcVideo'),{start,end}=srcSpan();el.currentTime=start;
 const stop=()=>{if(el.currentTime>=end){el.pause();el.removeEventListener('timeupdate',stop);}};
 el.addEventListener('timeupdate',stop);try{await el.play();}catch{}});
on('srcSave',()=>cutClip().catch(e=>{srcNote(e.message);toast(e.message);}));
$('srcCancel').onclick=()=>{cutCancelled=true;srcNote('자르기를 멈추는 중…');};
$('clipScrub').oninput=()=>{const el=$('clipVideo');if(el.duration)el.currentTime=(+$('clipScrub').value)*el.duration;};
$('clipVideo').ontimeupdate=()=>{const el=$('clipVideo');if(el.duration)$('clipScrub').value=el.currentTime/el.duration;};
$('clipVideo').onloadedmetadata=()=>clipNote();
$('clipStart').onchange=()=>setClip('clipStart',+$('clipStart').value);
$('clipEnd').onchange=()=>setClip('clipEnd',+$('clipEnd').value);
on('clipSetStart',()=>setClip('clipStart',$('clipVideo').currentTime));
on('clipSetEnd',()=>setClip('clipEnd',$('clipVideo').currentTime));
on('clipReset',()=>{const c=clip();if(!c)return;delete c.scene.clipStart;delete c.scene.clipEnd;scheduleSave();syncClip();drawPreview();toast('영상 전체를 사용합니다.');});
on('clipPlay',async()=>{const c=clip();if(!c)return;const el=$('clipVideo'),{start,end}=clipRange(c.scene,el.duration||0);
 el.currentTime=start;const stop=()=>{if(el.currentTime>=end){el.pause();el.removeEventListener('timeupdate',stop);}};
 el.addEventListener('timeupdate',stop);try{await el.play();}catch{}});
$('sceneReviewed').onchange=()=>{if(clip()){clip().scene.reviewed=$('sceneReviewed').checked;scheduleSave();renderStats();renderTimeline();}};
window.addEventListener('beforeunload',e=>{if(recording||busy||saveTimer&&$('saveState').textContent==='저장 중…'){e.preventDefault();e.returnValue='';}});
async function registerTools(){const mc=document.modelContext;if(!mc?.registerTool)return;try{await mc.registerTool({name:'get_longform_project',description:'Read the script, recordings and the video/narration timeline tracks of the current longform editing project.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>({name:project.name,captions:captionsOn(),totalSeconds:total(),sentences:project.sentences.map(s=>({id:s.id,text:s.text,durationSeconds:duration(s)})),video:project.video.map((c,i)=>({slot:i+1,start:c.start,duration:c.duration,scene:c.scene})),audio:project.audio.map(c=>({sentenceId:c.sentenceId,start:c.start,duration:c.duration,offset:c.offset||0}))})});await mc.registerTool({name:'update_longform_scenes',description:'Apply validated page descriptions to video track clips by their 1-based timeline slot. Resets review status. Does not record audio, generate assets, move clips or export a video.',inputSchema:{type:'object',properties:{scenes:{type:'array',items:{type:'object',properties:{id:{type:'integer'},title:{type:'string'},subtitle:{type:'string'},layout:{type:'string',enum:['title','split','full']},motion:{type:'string',enum:['fade','zoom','slide','none']},background:{type:'string'},captions:{type:'boolean'}},required:['id'],additionalProperties:false}}},required:['scenes'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{if(busy||recording)throw Error('Editor is busy');if(!Array.isArray(input?.scenes))throw Error('scenes array required');const checked=input.scenes.map(validScene),seen=new Set();for(const v of checked){if(seen.has(v.id)||!project.video[v.id-1])throw Error('Unknown or duplicate clip slot');seen.add(v.id);if(v.asset&&!project.assets[v.asset])throw Error('Asset not loaded');}stopPlayback();for(const v of checked){const c=project.video[v.id-1],{id,...rest}=v;c.scene={...c.scene,...rest,reviewed:false};}scheduleSave();render();return{updated:checked.map(s=>s.id)};}});}catch(e){console.info('Optional agent tools unavailable',e);}}
async function importAudioFiles(files){
 if(busy||recording||!files.length)return;setBusy(true);stopPlayback();
 try{let entries=[],script=[];
 for(const file of files){if(/\.zip$/i.test(file.name)){const contents=readZip(new Uint8Array(await file.arrayBuffer()));const manifest=contents['manifest.json']||contents['project.json'];if(manifest){const m=JSON.parse(strFromU8(manifest));if(Array.isArray(m.sentences))script=m.sentences;}for(const[name,data]of Object.entries(contents))if(/\.(wav|mp3|m4a|aac|ogg|webm|flac|mp4)$/i.test(name))entries.push(new File([data],name));}else if(file.type.startsWith('audio/')||/\.(wav|mp3|m4a|aac|ogg|webm|flac|mp4)$/i.test(file.name))entries.push(file);else throw Error('지원하지 않는 음성 파일: '+file.name);}
 if(!entries.length)throw Error('가져올 음성 파일이 없습니다.');
 const plan=planAudioImports(entries,project.sentences,current()?.id,script);
 if(plan.some(p=>project.sentences.find(s=>s.id===p.id)?.audio)&&!confirm('같은 번호의 기존 녹음을 가져온 파일로 교체할까요?'))return;
 const decoded=[];for(let i=0;i<plan.length;i++){toast(`음성 가져오는 중 ${i+1} / ${plan.length}`);decoded.push({...plan[i],audio:await decodeAudio(plan[i].file)});}
 if(!project.sentences.length){project.sentences=decoded.map(p=>newSentence(p.text,p.id)).sort((a,b)=>a.id-b.id);selected=0;}
 for(const p of decoded){const s=project.sentences.find(s=>s.id===p.id);if(s.audio)undo.set(s.id,s.audio);s.audio=p.audio;syncTake(s);}
 changed();render();toast(decoded.length+'개 음성을 녹음 트랙에 올렸습니다.');
 }catch(e){toast('음성 가져오기 실패: '+e.message);}finally{setBusy(false);}
}
on('importAudioBatch',()=>$('batchAudioInput').click());
$('batchAudioInput').onchange=async e=>{const files=[...e.target.files];e.target.value='';await importAudioFiles(files);};
cloud=createCloudEditor({getProject:()=>project,isBusy:()=>busy||recording,setBusy,toast,
 persistLocal:()=>scheduleSave(true),updateName:name=>{$('projectName').value=name;},
 flushLocal:async()=>{scheduleSave(true);await new Promise(r=>setTimeout(r,500));await saveChain;},
 setProject:next=>{stopPlayback();clearMedia();project=adoptProject(next)||next;selected=0;clipIndex=0;undo.clear();freeEditor?.clearHistory();$('projectName').value=project.name;render();},
 newProject:()=>{stopPlayback();clearMedia();freeEditor?.clearHistory();project=emptyProject();selected=0;clipIndex=0;undo.clear();$('projectName').value=project.name;render();scheduleSave(true);}
});
const freeScene=()=>({...defaultScene(),layers:[],layout:'full',motion:'none'});
// 빈 영상 조각을 트랙 맨 뒤에 붙인다.
function addFreeScene(){if(busy||recording)return;project.video.push(newVideoClip(freeScene(),trackTail(project.video),3));clipIndex=project.video.length-1;changed();render();}
function deleteClip(i){if(busy||recording)return;const c=project.video[i];if(!c)return;
 project.video.splice(i,1);clipIndex=Math.max(0,Math.min(project.video.length-1,i));
 pruneAssets();clearMedia();changed();render();toast('영상 조각을 타임라인에서 내렸습니다.');}
let editorDrawVersion=0;
freeEditor=createFreeEditor({assets:()=>project.assets,video:()=>project.video,audio:()=>project.audio,sentences:()=>project.sentences,
 current:clip,selected:()=>clipIndex,takeOf,takeRoom,total,
 snapshot:()=>({video:project.video.map(c=>({...c,scene:structuredClone(c.scene)})),audio:project.audio.map(c=>({...c})),assets:{...project.assets},selected:clipIndex}),
 restore:v=>{stopPlayback();clearMedia();project.video=v.video;project.audio=v.audio;project.assets=v.assets;clipIndex=v.selected;changed();render();},
 isBusy:()=>busy||recording,stop:stopPlayback,changed,toast,load:loadMedia,setBusy,
 focus:index=>{clipIndex=index;renderList();renderInspector();renderTimeline();},
 importAudio:()=>$('batchAudioInput').click(),
 move:(track,id,start)=>{const c=(track==='audio'?project.audio:project.video).find(x=>x.id===id);if(c)moveClip(c,start);},
 // 소재가 조각 밖으로 나가면 조각을 늘려 품게 한다. 늘어난 만큼 뒤 조각은 밀린다.
 growClip:(index,need)=>{const c=project.video[index];if(!c||!(need>c.duration))return;
  // 조각이 늘어날 때 '끝까지' 쓰던 다른 소재가 같이 늘어나면 안 되니, 지금 보이는 끝에 붙들어 둔다.
  for(const l of c.scene.layers||[])if(!l.end)l.end=c.duration;
  trimRipple(project.video,c,'end',c.start+Math.min(600,need));},
 trim:(track,id,edge,at)=>{const list=track==='audio'?project.audio:project.video,c=list.find(x=>x.id===id);if(c)trimRipple(list,c,edge,at,track==='audio'?takeRoom(c):Infinity);},
 dropTake:(sentenceId,start)=>{const s=sentenceById(sentenceId);if(!s?.audio?.length)return toast('먼저 이 문장을 녹음하세요.');placeTake(s,start);changed();render();},
 removeTake:id=>{project.audio=project.audio.filter(c=>c.id!==id);changed();render();},
 async startTimelineAudio(from){await audioContext();const b=narrationBuffer(from,total());
  const source=ctx.createBufferSource();source.buffer=b;source.connect(ctx.destination);timelineSources.push(source);const begins=ctx.currentTime+.04;source.start(begins);
  return()=>Math.max(from,from+ctx.currentTime-begins);},
 async draw(at,editing){const version=++editorDrawVersion,c=clip(),inside=c&&at>=c.start&&at<clipEnd(c);
  const shot=inside?shotOf(c,at-c.start,at):shotAt(at);if(!shot)return drawScene($('preview'),null);shot.still=editing;shot.editing=editing;await prepareLayers(shot);shot.media=await loadMedia(shot.assetName);await seekLayers(shot);await showMedia(shot.media,shot.scene,shot.sceneTime);if(version===editorDrawVersion)drawScene($('preview'),shot);},
 empty:()=>drawScene($('preview'),null),addScene:addFreeScene,deleteScene:()=>deleteClip(clipIndex),
 select:selectClip,
 captions:captionsOn,setCaptions:v=>{project.captions=!!v;changed();render();},
 recordTab:()=>switchTab('record'),script:()=>$('pasteBtn').click(),legacyImport:()=>$('importScenes').click(),cutVideo:()=>$('cutVideoBtn').click(),fullPlay:previewAll,
 prepare:async()=>{await audioContext();const shot=shotAt(clipStart(clipIndex));if(shot)await prepareLayers(shot);},visible:()=>tab==='scenes'
});
await loadSaved();switchTab('scenes');registerTools();cloud.init();
