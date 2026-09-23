import {newLayer,poseAt,hitLayer,clamp,uid,materialTracks,ensureMaterialTracks,sortMaterialLayers} from './editor-engine.js';
import {timelineLayout,locateTime} from './project-timeline.js';
import {createProjectTimeline} from './timeline-view.js';
import {getFrameRate} from './fps.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createFreeEditor(h){
 const $=id=>document.getElementById(id);let selectedLane=null,active=null,cursor=0,gapAt=null,playing=false,raf=0,lastScene=null,undo=[],redo=[],drag=null,token=0,urls=new Map(),zoom=64,fitMode=true,playbackEpoch=0;
 const stage=$('preview'),host=document.createElement('div');host.id='freeEditor';
 host.innerHTML=`<div class="editor-tabs" role="tablist"><button data-pane="media" class="active">소재함</button><button data-pane="layers">레이어</button><button data-pane="properties">속성</button></div>
 <div class="editor-grid"><aside class="media-pane editor-pane" data-panel="media"><div class="ed-heading"><h2>내 소재</h2><span id="mediaCount">0</span></div><button id="edImport" class="ed-primary">＋ 이미지 · 영상 · 녹음 가져오기</button><input id="edFiles" type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,audio/*" multiple hidden><div class="media-actions"><button id="edNewFolder">▣ 폴더 만들기</button><button id="edAddText">T 텍스트</button><button id="edScript">대사 가져오기</button></div><div id="edAssets" class="asset-tree"></div><p class="ed-note">소재를 타임라인으로 끌어다 놓으세요. 녹음 파일은 녹음 줄로 갑니다. 휴대폰에서는 길게 누른 뒤 끌면 됩니다. 폴더를 고르고 가져오면 그 폴더에 담기고, 소재를 폴더 위로 끌면 옮겨집니다.</p><details class="legacy-options"><summary>고급 · 옛 조각 다루기</summary><button id="edNewScene">＋ 빈 조각</button><button id="edDeleteScene">조각 내리기</button><button id="edLegacyImport">장면 ZIP · JSON</button><button id="edCutVideo">긴 영상 구간 자르기</button></details></aside>
 <section class="canvas-pane"><div class="canvas-toolbar"><span id="edSceneName">장면 편집</span><div><button id="edUndo" title="실행 취소" aria-label="실행 취소">↶</button><button id="edRedo" title="다시 실행" aria-label="다시 실행">↷</button><button id="edFit" title="편집 / 재생 위치 보기">배치 보기</button><span>16:9</span></div></div><div id="edStageWrap"><div id="edStage"><canvas id="edSelection" width="1280" height="720" aria-label="소재를 드래그해서 배치하고 모서리로 크기를 조절하세요"></canvas><div id="edEmpty"><strong>네 이야기를 직접 편집해 봐</strong><p>소재 칸을 만들고 이미지를 끌어다 넣으세요.</p><button id="edStart" class="ed-primary">＋ 소재 추가</button><button id="edStartScript">대사 붙여넣기</button></div></div></div><div class="ed-transport"><button id="edBeginning" aria-label="처음으로">|◀</button><button id="edPlay" class="ed-play" aria-label="전체 영상 재생">▶</button><span id="edClock">00:00.00 / 00:03.00</span><input id="edScrub" type="range" min="0" max="3" step="0.01" value="0" aria-label="전체 영상 재생 위치"><button id="edFullPlay">처음부터 재생</button></div><p class="canvas-hint">끌어서 이동 · 모서리로 크기 조절 · 배치 보기에서는 등장 전 소재도 보여요</p></section>
 <aside class="properties-pane editor-pane" data-panel="properties"><div class="ed-heading"><h2>속성</h2><span id="edType">조각</span></div><div id="edSceneProps"><label>배경색 <input type="color" id="edBackground" value="#ffffff"></label><label>조각 길이 (초)<input type="number" min="0.1" max="600" step=".1" id="edDuration" value="3"></label><p id="edDurationNote" class="ed-note"></p></div><div id="edLayerProps" hidden><input id="edName" aria-label="레이어 이름"><button id="edFill" class="ed-fill" title="이 소재를 조각 전체 화면·전체 길이로 채웁니다">⛶ 화면 전체 채우기</button><div class="prop-grid">${[['x','X 위치'],['y','Y 위치'],['w','너비'],['h','높이'],['rotation','회전 °'],['opacity','불투명도 %'],['start','등장 (초)'],['end','끝 (0=조각 끝)']].map(([k,label])=>`<label>${label}<input type="number" id="prop_${k}" data-prop="${k}" step="${['start','end'].includes(k)?'.05':'1'}"></label>`).join('')}</div><label id="edClipField">영상 시작 (초)<input id="prop_clipStart" type="number" min="0" step=".05" data-prop="clipStart"></label><div id="edTextFields"><label>내용<textarea id="edText" rows="3"></textarea></label><div class="prop-grid"><label>글자 크기<input id="edFontSize" type="number" min="12" max="240"></label><label>글자색<input id="edTextColor" type="color"></label></div></div><div class="ed-heading"><h3>등장 애니메이션</h3></div><select id="edMotion"><option value="none">없음</option><option value="drop">위에서 내려오기</option><option value="left">왼쪽에서 들어오기</option><option value="right">오른쪽에서 들어오기</option><option value="pop">뿅! 등장</option><option value="fade">서서히 나타나기</option></select><label>동작 길이 (초)<input id="edEnter" type="number" min=".05" max="5" step=".05"></label><div class="ed-heading"><h3>키프레임</h3><button id="edAddKey" title="현재 위치·크기를 키프레임으로 저장">◇ 추가</button></div><p class="ed-note">재생 위치를 옮기고 소재를 배치한 뒤 ◇ 추가를 누르세요.</p><div id="edKeys"></div><div class="media-actions"><button id="edDuplicate">복제</button><button id="edDelete" class="ed-danger">삭제</button></div></div><div id="edLayerList"><div class="ed-heading"><h3>레이어</h3><small>위쪽이 화면 앞</small></div><div id="edLayers"></div></div><div id="edLegacy"></div></aside></div>
 <section class="ed-timeline"><div class="track-scroll"><div id="edTracks"></div></div></section>`;
 host.querySelector('[data-pane="media"]').textContent='소재함';$('scenesView').prepend(host);$('edStage').prepend(stage);$('edSelection').style.touchAction='none';
 const layer=()=>h.current()?.scene.layers?.find(l=>l.id===active),scene=()=>h.current()?.scene,span=()=>Math.max(.1,h.current()?.duration||.1),layers=()=>scene()?.layers||[];
 const layout=()=>timelineLayout(h.video(),h.audio()),offset=()=>h.current()?.start||0;
 const projectTime=()=>gapAt??offset()+cursor;
 let timeline;
 function seekProject(seconds){if(h.isBusy())return;const map=layout(),time=Math.min(map.total,Math.max(0,Number(seconds)||0)),at=locateTime(map,time);
  fitMode=false;
  if(!at){gapAt=time;updateClock();paint();return;}
  gapAt=null;const switched=at.index!==h.selected();
  if(switched){h.focus(at.index);lastScene=h.current()?.id;active=null;selectedLane=null;}
  cursor=at.local;if(switched)refresh();else{updateClock();paint();}}
 timeline=createProjectTimeline($('edTracks'),{video:h.video,audio:h.audio,takeOf:h.takeOf,selected:h.selected,active:()=>active,time:projectTime,busy:h.isBusy,fps:getFrameRate,stop,seek:seekProject,stamp:()=>stamp(),commit:()=>commit(),addAsset:(key,start,lane)=>addAsset(key,start,lane),addTrack:()=>addMaterial(),isAudio:key=>isAudio(key),dropAudio:(key,at)=>dropAudio(key,at),blockAction:(index,id,act)=>blockAction(index,id,act),setZoom:z=>{zoom=clamp(z,2,160);renderTracks();},selectLane,renameTrack,reorderTrack,removeTrack:removeMaterial,moveLayerToLane,fillLayer:(i,id,key)=>fillLayer(i,id,key),renameLayer:(i,id,name)=>renameLayer(i,id,name),reorderLayer:(i,id,dir)=>reorderLayer(i,id,dir),select:index=>{h.focus(index);lastScene=h.current()?.id;active=null;selectedLane=null;refresh();},move:h.move,trim:h.trim,setLayerSpan:h.setLayerSpan,convertLayer:index=>{if(index!==h.selected())h.focus(index);if(!ensure())return null;const ls=layers();return ls.length?ls[ls.length-1]:null;},dropTake:h.dropTake,removeTake:h.removeTake,selectLayer:(index,id,time)=>{h.focus(index);lastScene=h.current()?.id;cursor=Math.max(0,time-offset());active=id;selectedLane=layer()?.lane??null;fitMode=true;refresh();}});
 const stamp=()=>{undo.push(h.snapshot());if(undo.length>25)undo.shift();redo=[];};
 const commit=()=>{h.changed();refresh();};
 function halt(){playbackEpoch++;playing=false;cancelAnimationFrame(raf);$('edPlay').textContent='▶';$('edPlay').setAttribute('aria-label','전체 영상 재생');}function stop(){halt();h.stop();}
 function ensure(){const s=scene();if(!s)return false;if(!Array.isArray(s.layers)){s.layers=[];if(s.asset){const l=newLayer(s.asset,s.asset.split('/').pop(),/\.(mp4|webm)$/i.test(s.asset)?'video':'image',1280/720);Object.assign(l,{w:1280,h:720,clipStart:s.clipStart||0});s.layers.push(l);}s.layout='full';s.motion='none';}ensureMaterialTracks(s);return true;}
 function checkpoint(){if(h.isBusy())return false;stop();stamp();return ensure();}
 async function paint(){const mine=++token;if(!h.current()){h.empty();outline();return;}try{await h.draw(projectTime(),fitMode&&!playing);if(mine===token)outline();}catch(e){h.toast(e.message);}}
 function outline(){const c=$('edSelection'),g=c.getContext('2d');g.clearRect(0,0,1280,720);const l=layer(),p=l&&poseAt(l,cursor,fitMode&&!playing);if(!p||playing)return;g.save();g.translate(p.x,p.y);g.rotate(p.rotation*Math.PI/180);g.strokeStyle=l.locked?'#999':'#ad94ff';g.lineWidth=3;g.strokeRect(-p.w/2,-p.h/2,p.w,p.h);if(!l.locked)for(const x of[-p.w/2,p.w/2])for(const y of[-p.h/2,p.h/2]){g.fillStyle='#fff';g.fillRect(x-7,y-7,14,14);g.strokeRect(x-7,y-7,14,14);}g.restore();}
 function refresh(){const s=h.current();gapAt=null;cursor=Math.min(cursor,span());if(s?.id!==lastScene){lastScene=s?.id;cursor=0;active=null;selectedLane=null;stop();}if(active&&!layer())active=null;if(selectedLane!=null&&selectedLane>=materialTracks(scene()||{}).length)selectedLane=null;$('edEmpty').hidden=!!s;$('edSceneName').textContent=s?`조각 ${h.selected()+1} · ${s.scene.title||s.scene.asset?.split('/').pop()||'빈 조각'}`:'조각 편집';$('edBackground').value=s?.scene.background||'#ffffff';$('edDuration').value=s?span().toFixed(2):3;$('edDuration').disabled=!s;$('edDurationNote').textContent=s?'타임라인에서 조각 가장자리를 끌어도 길이가 바뀝니다.':'영상 조각을 골라 길이를 정하세요.';$('edUndo').disabled=!undo.length;$('edRedo').disabled=!redo.length;renderAssets();renderProps();renderTracks();updateClock();paint();}
 function updateClock(){const f=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(2).padStart(5,'0')}`,total=layout().total;$('edClock').textContent=`${f(projectTime())} / ${f(total)}`;$('edScrub').max=total;$('edScrub').step=1/getFrameRate();$('edScrub').value=projectTime();$('edFit').classList.toggle('selected',fitMode);timeline?.playhead(projectTime(),playing);}
 function assetUrl(key){const blob=h.assets()[key],old=urls.get(key);if(old?.blob===blob)return old.url;if(old)URL.revokeObjectURL(old.url);const url=URL.createObjectURL(blob);urls.set(key,{blob,url});return url;}
 let touchDropAt=0;
 const isAudio=key=>key.startsWith('take:')||h.isAudioAsset(key);
 // 손가락이 화면 가장자리에 닿아 있는 동안 화면을 대신 밀어 준다. 소재함과 타임라인이 한 화면에 안 들어와도 끌어다 놓을 수 있다.
 const EDGE=96,MAX_SCROLL=22;
 const scrollableY=node=>{for(let el=node;el&&el!==document.body;el=el.parentElement){const o=getComputedStyle(el).overflowY;
   if((o==='auto'||o==='scroll')&&el.scrollHeight>el.clientHeight+2)return el;}
  return document.scrollingElement||document.documentElement;};
 const edgePush=(near,far,size)=>{const inTop=near<EDGE,inBottom=far<EDGE;
  if(!inTop&&!inBottom||size<=0)return 0;
  const depth=Math.min(1,(EDGE-(inTop?near:far))/EDGE);return Math.ceil(MAX_SCROLL*depth)*(inTop?-1:1);};
 function autoScroll(x,y){const under=document.elementFromPoint?.(x,y);
  const box=under?.closest?.('.track-scroll');
  if(box){const r=box.getBoundingClientRect(),dx=edgePush(x-r.left,r.right-x,box.scrollWidth-box.clientWidth);
   if(dx)box.scrollLeft+=dx;}
  const pane=scrollableY(under||document.body),r=pane===document.scrollingElement||pane===document.documentElement
   ?{top:0,bottom:innerHeight}:pane.getBoundingClientRect();
  const dy=edgePush(y-r.top,r.bottom-y,pane.scrollHeight-pane.clientHeight);
  if(dy)pane.scrollTop+=dy;
  return!!dy;}
 // 모바일 브라우저는 dragstart 를 내지 않는다. 길게 눌러 끄는 길을 따로 낸다.
 function touchDrag(el,key){let state=null;
  const block=e=>{if(state?.armed&&e.cancelable)e.preventDefault();};
  const clean=()=>{if(!state)return;clearTimeout(state.timer);cancelAnimationFrame(state.roll);state.ghost?.remove();state=null;
   timeline.hover(null);document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);
   document.removeEventListener('pointercancel',clean);document.removeEventListener('touchmove',block);};
  const onMove=e=>{if(!state)return;
   // 손가락이 먼저 움직이면 목록을 넘기려는 것이니 끌기를 접는다.
   if(!state.armed){if(Math.hypot(e.clientX-state.x,e.clientY-state.y)>10)clean();return;}
   state.x=e.clientX;state.y=e.clientY;
   state.ghost.style.left=state.x+'px';state.ghost.style.top=state.y+'px';timeline.hover(state.x,state.y);};
  // 손가락이 멈춰 있어도 가장자리에 있으면 계속 밀어야 하므로 프레임마다 확인한다.
  const roll=()=>{if(!state?.armed)return;
   if(autoScroll(state.x,state.y))timeline.hover(state.x,state.y);
   state.roll=requestAnimationFrame(roll);};
  const onUp=e=>{const armed=state?.armed,x=e.clientX,y=e.clientY;clean();if(!armed)return;
   touchDropAt=Date.now();
   if(!timeline.dropAsset(key,x,y))h.toast('타임라인의 소재 칸 위에 놓아 주세요.');};
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||h.isBusy())return;clean();
   state={x:e.clientX,y:e.clientY,armed:false,ghost:null,timer:0,roll:0};
   state.timer=setTimeout(()=>{if(!state)return;state.armed=true;navigator.vibrate?.(12);
    const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.textContent=key.split('/').pop();
    ghost.style.left=state.x+'px';ghost.style.top=state.y+'px';document.body.append(ghost);state.ghost=ghost;
    timeline.hover(state.x,state.y);roll();},260);
   document.addEventListener('pointermove',onMove);document.addEventListener('pointerup',onUp);
   document.addEventListener('pointercancel',clean);document.addEventListener('touchmove',block,{passive:false});});
 }
 // 소재함은 유니티 프로젝트 창처럼 폴더 나무로 보여 준다. 접힌 폴더는 이 화면에서만 기억한다.
 const ROOT='media',RECORD=ROOT+'/Record',TAKE='take:',LIB='lib',closed=new Set();let pickedFolder=ROOT;
 const takeRows=()=>h.sentences().filter(s=>s.audio?.length);
 // 녹음은 작업 폴더 이름과 같은 칸에 모아 둔다. 공용 소재함과 섞이지 않게.
 const safeName=n=>String(n||'작업').replace(/[\/\\]/g,' ').trim().slice(0,60)||'작업';
 const recordDir=()=>RECORD+'/'+safeName(h.projectName());
 const folderName=p=>p===ROOT?'Assets':p.split('/').pop();
 const parentOf=p=>p.split('/').slice(0,-1).join('/');
 function allFolders(){const set=new Set([ROOT]);
  set.add(RECORD);if(takeRows().length)for(const part of recordDir().split('/').map((_,i,a)=>a.slice(0,i+1).join('/')))if(part.startsWith(ROOT))set.add(part);
  for(const f of h.folders())if(f&&f.startsWith(ROOT+'/'))for(const part of f.split('/').map((_,i,a)=>a.slice(0,i+1).join('/')))if(part.startsWith(ROOT))set.add(part);
  for(const key of Object.keys(h.assets())){const parts=key.split('/');parts.pop();
   for(let i=1;i<=parts.length;i++){const p=parts.slice(0,i).join('/');if(p.startsWith(ROOT))set.add(p);}}
  return set;}
 const iconOf=key=>/\.(mp4|webm)$/i.test(key)?'▷':/\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(key)?'♫':/\.gif$/i.test(key)?'◨':'▧';
 function treeRows(folder,depth,folders,out){
  const open=!closed.has(folder);
  out.push(`<div class="tree-row tree-folder${open?' open':''}${pickedFolder===folder?' picked':''}" data-folder="${esc(folder)}" draggable="${folder!==ROOT}" style="--d:${depth}">`
   +`<button class="twisty" data-toggle="${esc(folder)}" aria-label="${open?'접기':'펼치기'}">${open?'▼':'▶'}</button>`
   +`<span class="row-label">▣ ${esc(folderName(folder))}</span>`
   +(folder===ROOT?'':`<button class="row-x" data-folder-remove="${esc(folder)}" title="빈 폴더 삭제" aria-label="폴더 삭제">×</button>`)+'</div>');
  if(!open)return;
  for(const child of [...folders].filter(f=>parentOf(f)===folder).sort())treeRows(child,depth+1,folders,out);
  // Record 안의 줄은 문장 녹음을 그대로 비춘다. 사본 파일을 만들지 않으니 저장 용량도, 기기 사이 차이도 생기지 않는다.
  if(folder===recordDir())for(const s of takeRows())
   out.push(`<button class="tree-row asset-card" data-asset="${TAKE}${s.id}" title="${esc(s.text||'녹음')}" style="--d:${depth+1}">`
    +'<i class="row-icon">♫</i>'
    +`<span class="row-label">녹음 ${String(s.id).padStart(3,'0')} · ${esc(s.text||'')}</span></button>`);
  for(const key of Object.keys(h.assets()).filter(k=>parentOf(k)===folder).sort())
   out.push(`<button class="tree-row asset-card" data-asset="${esc(key)}" title="${esc(key)}" style="--d:${depth+1}">`
    +(/\.(png|jpe?g|webp|gif)$/i.test(key)?`<img src="${assetUrl(key)}" alt="" loading="lazy">`:`<i class="row-icon">${iconOf(key)}</i>`)
    +`<span class="row-label">${esc(key.split('/').pop())}</span>`+(/\.gif$/i.test(key)?'<em class="gif-tag">GIF</em>':'')
    +rowButton('rename',key,'✎','이름 바꾸기')
    +`<em class="row-share" data-share="${esc(key)}" title="계정 공용 소재함에 올리기" role="button">↑</em>`
    +rowButton('delete',key,'×','소재 지우기')+'</button>');
 }
 // 줄 위에서 바로 이름을 고친다. 소재 줄은 누르면 타임라인에 들어가니 ✎ 로만 연다.
 function startRename(row,current,commit){const label=row.querySelector('.row-label');if(!label)return;
  const input=document.createElement('input');input.className='row-rename';input.value=current;
  label.replaceWith(input);input.focus();input.select();
  let done=false;
  const finish=save=>{if(done)return;done=true;input.onblur=null;
   const value=input.value.trim();
   if(save&&value&&value!==current)commit(value);else{renderAssets();filterAssets();}};
  input.onpointerdown=e=>e.stopPropagation();input.onclick=e=>e.stopPropagation();
  input.onblur=()=>finish(true);
  input.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')finish(true);if(e.key==='Escape')finish(false);};}
 const rowButton=(kind,key,mark,title)=>`<em class="row-act" data-${kind}="${esc(key)}" title="${title}" role="button">${mark}</em>`;
 function libFolders(){const set=new Set([ROOT]);
  for(const f of h.libraryFolders())if(f?.startsWith(ROOT))for(const p of f.split('/').map((_,i,a)=>a.slice(0,i+1).join('/')))if(p.startsWith(ROOT))set.add(p);
  for(const key of Object.keys(h.library())){const parts=key.split('/');parts.pop();
   for(let i=1;i<=parts.length;i++)set.add(parts.slice(0,i).join('/'));}
  return set;}
 function libTree(folder,depth,folders,out){const open=!closed.has(LIB+folder);
  out.push(`<div class="tree-row tree-folder lib-row${open?' open':''}" data-libfolder="${esc(folder)}" draggable="${folder!==ROOT}" style="--d:${depth}">`
   +`<button class="twisty" data-toggle="${esc(LIB+folder)}" aria-label="${open?'접기':'펼치기'}">${open?'▼':'▶'}</button>`
   +`<span class="row-label">${folder===ROOT?'☁ 계정 소재함':'▣ '+esc(folderName(folder))}</span>`
   +rowButton('libnew',folder,'＋','이 안에 폴더 만들기')+'</div>');
  if(!open)return;
  for(const child of [...folders].filter(f=>parentOf(f)===folder).sort())libTree(child,depth+1,folders,out);
  for(const key of Object.keys(h.library()).filter(k=>parentOf(k)===folder).sort()){const mine=!!h.assets()[key];
   out.push(`<button class="tree-row lib-item${mine?' mine':''}" data-lib="${esc(key)}" title="${esc(key)}${mine?' · 이미 이 작업에 있음':' · 눌러서 이 작업에 넣기'}" style="--d:${depth+1}">`
    +`<i class="row-icon">${iconOf(key)}</i><span class="row-label">${esc(key.split('/').pop())}</span>`
    +rowButton('librename',key,'✎','이름 바꾸기')+rowButton('libremove',key,'×','계정 소재함에서 내리기')
    +`<b>${mine?'✓':'＋'}</b></button>`);}}
 function renderAssets(){const keys=Object.keys(h.assets());
  for(const[key,v]of urls)if(!h.assets()[key]){URL.revokeObjectURL(v.url);urls.delete(key);}
  $('mediaCount').textContent=keys.length;
  const folders=allFolders();
  if(!folders.has(pickedFolder))pickedFolder=ROOT;
  const rows=[];treeRows(ROOT,0,folders,rows);
  const shared=Object.keys(h.library()).length||h.libraryFolders().length;
  if(shared)libTree(ROOT,0,libFolders(),rows);
  $('edAssets').innerHTML=rows.join('');
  const stop=e=>e.stopPropagation();
  $('edAssets').querySelectorAll('[data-lib]').forEach(el=>{const key=el.dataset.lib;
   el.onclick=()=>h.useLibrary(key);
   el.draggable=true;el.ondragstart=e=>{e.dataTransfer.setData('text/libasset',key);e.stopPropagation();};});
  $('edAssets').querySelectorAll('[data-rename]').forEach(el=>{el.onpointerdown=stop;
   el.onclick=e=>{stop(e);const key=el.dataset.rename;startRename(el.closest('.tree-row'),key.split('/').pop(),v=>h.renameAsset(key,v));};});
  $('edAssets').querySelectorAll('[data-librename]').forEach(el=>{el.onpointerdown=stop;
   el.onclick=e=>{stop(e);const key=el.dataset.librename;startRename(el.closest('.tree-row'),key.split('/').pop(),v=>h.libraryRename(key,v));};});
  $('edAssets').querySelectorAll('[data-delete]').forEach(el=>{el.onpointerdown=stop;
   el.onclick=e=>{stop(e);h.deleteAsset(el.dataset.delete);};});
  $('edAssets').querySelectorAll('[data-libremove]').forEach(el=>{el.onpointerdown=stop;
   el.onclick=e=>{stop(e);h.libraryRemove(el.dataset.libremove);};});
  $('edAssets').querySelectorAll('[data-libnew]').forEach(el=>{el.onpointerdown=stop;
   el.onclick=e=>{stop(e);const base=el.dataset.libnew+'/새 폴더';const taken=libFolders();
    let path=base,n=2;while(taken.has(path))path=base+' '+n++;h.libraryNewFolder(path);};});
  // 공용 소재함 폴더 — 이름 바꾸기, 소재·폴더 받아 옮기기
  $('edAssets').querySelectorAll('[data-libfolder]').forEach(el=>{const path=el.dataset.libfolder;
   el.ondragstart=e=>{if(path!==ROOT)e.dataTransfer.setData('text/libfolder',path);e.stopPropagation();};
   el.ondblclick=()=>{if(path!==ROOT)startRename(el,folderName(path),v=>h.libraryFolderRename(path,v));};
   el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-hot');});
   el.addEventListener('dragleave',()=>el.classList.remove('drop-hot'));
   el.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();el.classList.remove('drop-hot');
    const lib=e.dataTransfer.getData('text/libasset'),dir=e.dataTransfer.getData('text/libfolder'),mine=e.dataTransfer.getData('text/asset');
    if(lib)h.libraryMove(lib,path);
    else if(dir&&dir!==path)h.libraryFolderMove(dir,path);
    else if(mine&&!mine.startsWith(TAKE))h.shareToLibrary([mine],path);});});
  $('edAssets').querySelectorAll('[data-toggle]').forEach(el=>el.onclick=e=>{e.stopPropagation();
   const p=el.dataset.toggle;closed.has(p)?closed.delete(p):closed.add(p);renderAssets();filterAssets();});
  $('edAssets').querySelectorAll('[data-folder-remove]').forEach(el=>el.onclick=e=>{e.stopPropagation();h.removeFolder(el.dataset.folderRemove);});
  $('edAssets').querySelectorAll('[data-folder]').forEach(el=>{const path=el.dataset.folder;
   el.onclick=()=>{pickedFolder=path;renderAssets();filterAssets();};
   // 폴더 위에 소재를 떨어뜨리면 그 폴더로 옮긴다.
   el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-hot');});
   el.addEventListener('dragleave',()=>el.classList.remove('drop-hot'));
   el.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();el.classList.remove('drop-hot');
    const key=e.dataTransfer.getData('text/asset'),dir=e.dataTransfer.getData('text/folder');
    if(key&&!key.startsWith(TAKE))h.moveAsset(key,path);
    else if(dir&&dir!==path)h.moveFolder(dir,path);});
   el.ondragstart=e=>{if(path!==ROOT)e.dataTransfer.setData('text/folder',path);e.stopPropagation();};
   el.ondblclick=()=>{if(path===ROOT)return;const label=el.querySelector('.row-label');
    const input=document.createElement('input');input.className='row-rename';input.value=folderName(path);
    label.replaceWith(input);input.focus();input.select();
    const finish=save=>{input.onblur=null;if(save&&input.value.trim())h.renameFolder(path,parentOf(path)+'/'+input.value.trim());else renderAssets();};
    input.onblur=()=>finish(true);
    input.onkeydown=e=>{if(e.key==='Enter')finish(true);if(e.key==='Escape')finish(false);};};});
  $('edAssets').querySelectorAll('[data-share]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();
   el.onclick=e=>{e.stopPropagation();h.shareToLibrary([el.dataset.share]);};});
  $('edAssets').querySelectorAll('[data-asset]').forEach(el=>{const key=el.dataset.asset;
  // 끌어다 놓고 손을 뗀 직후의 click 은 같은 소재를 한 번 더 넣게 되니 흘려보낸다.
  el.onclick=()=>{if(Date.now()-touchDropAt<400)return;useAsset(key);};
  el.draggable=true;el.ondragstart=e=>e.dataTransfer.setData('text/asset',key);touchDrag(el,key);});}
 // 복제·전체 맞춤·삭제는 도구 줄이 아니라 조각(블록)에 붙어 있다.
 function blockAction(index,id,act){if(h.isBusy())return;
  if(index!==h.selected()){h.focus(index);lastScene=h.current()?.id;}
  active=id;
  if(act==='dup')return $('edDuplicate').click();
  if(act==='del')return $('edDelete').click();
  const l=layer();if(!l||l.locked||!checkpoint())return;
  // 전체 맞춤: 이 블록을 조각 처음부터 끝까지 늘린다.
  l.start=0;l.end=0;commit();}
 // A material row is empty until a block is placed on it.
 function addMaterial(){if(h.isBusy())return;if(!h.current())h.addScene();if(!checkpoint())return;
  const tracks=ensureMaterialTracks(scene());if(tracks.length>=100)return h.toast('소재 라인은 100개까지 만들 수 있어요.');
  selectedLane=tracks.length;tracks.push({name:'소재 '+(tracks.length+1)});active=null;commit();}
 function removeMaterial(lane){if(h.isBusy()||!scene()||!Number.isInteger(lane)||lane<0||lane>=materialTracks(scene()).length)return;
  if(layers().some((l,i)=>(l.lane??i)===lane&&l.locked))return h.toast('잠긴 블록의 잠금을 먼저 풀어 주세요.');
  if(!checkpoint())return;scene().materialTracks.splice(lane,1);scene().layers=layers().filter(l=>l.lane!==lane);
  layers().forEach(l=>{if(l.lane>lane)l.lane--;});active=null;selectedLane=null;commit();}
 function selectLane(lane){if(h.isBusy())return;stop();selectedLane=lane;active=null;renderProps();paint();}
 function renameTrack(lane,name){if(h.isBusy()||!scene()||!String(name).trim()||!checkpoint())return;
  const tracks=ensureMaterialTracks(scene());while(tracks.length<=lane)tracks.push({name:'소재 '+(tracks.length+1)});
  tracks[lane].name=String(name).slice(0,120);commit();}
 function reorderTrack(lane,to){if(h.isBusy()||!scene())return;const tracks=materialTracks(scene());
  if(!Number.isInteger(lane)||!Number.isInteger(to)||lane<0||lane>=tracks.length||to<0||to>=tracks.length||lane===to||!checkpoint())return;
  const order=tracks.map((_,i)=>i);order.splice(to,0,order.splice(lane,1)[0]);
  scene().materialTracks=order.map(i=>scene().materialTracks[i]);
  layers().forEach(l=>{l.lane=order.indexOf(l.lane);});sortMaterialLayers(scene());selectedLane=to;commit();}
 function moveLayerToLane(index,id,lane){const c=h.video()[index],l=c?.scene.layers?.find(l=>l.id===id);
  if(!l||l.locked||h.isBusy()||lane<0||lane>=100)return;
  const tracks=ensureMaterialTracks(c.scene);while(tracks.length<=lane)tracks.push({name:'소재 '+(tracks.length+1)});
  l.lane=lane;sortMaterialLayers(c.scene);selectedLane=lane;}
 function placeLayer(l,lane=null){const tracks=ensureMaterialTracks(scene());
  if(lane==null){lane=tracks.length;if(lane>=100)return false;}
  while(tracks.length<=lane)tracks.push({name:'소재 '+(tracks.length+1)});
  l.lane=lane;scene().layers.push(l);sortMaterialLayers(scene());selectedLane=lane;return true;}
 const layerIn=(index,id)=>h.video()[index]?.scene?.layers?.find(x=>x.id===id)||null;
 async function fillLayer(index,id,key){if(h.isBusy()||!h.assets()[key])return;
  if(isAudio(key))return dropAudio(key,offset());
  const target=layerIn(index,id);if(!target)return;
  if(target.locked)return h.toast('잠긴 소재입니다. 잠금을 풀고 넣어 주세요.');
  if(target.kind==='text')return h.toast('텍스트 칸에는 이미지를 넣을 수 없어요.');
  // 이미 소재가 든 칸은 갈아 끼우지 않는다. 소재 줄을 하나 더 만들어 따로 관리하게 둔다.
  if(target.asset){if(index!==h.selected()){h.focus(index);lastScene=h.current()?.id;}return addAsset(key,target.start||0);}
  if(index!==h.selected()){h.focus(index);lastScene=h.current()?.id;}
  active=id;fitMode=true;
  if(!checkpoint())return;
  const l=layerIn(index,id);if(!l)return;
  try{const el=await h.load(key),ratio=(el.videoWidth||el.naturalWidth)/(el.videoHeight||el.naturalHeight)||1;
   if(/^소재 \d+$/.test(l.name||''))l.name=key.split('/').pop();
   l.asset=key;l.kind=el.videoWidth?'video':'image';l.clipStart=0;
   l.w=480;l.h=480/ratio;if(l.h>600){l.w*=600/l.h;l.h=600;}
   commit();}catch(e){h.toast(e.message);}}
 function renameLayer(index,id,name){const l=layerIn(index,id);if(!l||l.locked||!String(name).trim())return;
  if(l.name===String(name).slice(0,120))return;
  if(h.isBusy())return;stamp();l.name=String(name).slice(0,120);commit();}
 // 위로 올릴수록 나중에 그려져 화면 앞에 선다.
 function reorderLayer(index,id,dir){const c=h.video()[index];if(!c||h.isBusy())return;
  const ls=c.scene?.layers;if(!Array.isArray(ls))return;
  const i=ls.findIndex(x=>x.id===id),j=dir==='up'?i+1:i-1;if(i<0||j<0||j>=ls.length)return;
  stop();stamp();[ls[i],ls[j]]=[ls[j],ls[i]];active=id;commit();}
 // 소재함에서 누르면 골라 둔 빈 칸을 먼저 채운다.

 // 녹음 소재는 어디에 놓아도 녹음 줄로 간다. 화면 레이어가 될 수 없다.
 const dropAudio=(key,at)=>{h.stop();if(key.startsWith(TAKE))h.dropTake(Number(key.slice(TAKE.length)),Math.max(0,at));else h.addAudioAsset(key,at);};
 function useAsset(key){if(isAudio(key))return dropAudio(key,projectTime());const l=layer();if(l&&!l.asset&&l.kind!=='text')return fillLayer(h.selected(),l.id,key);return addAsset(key,cursor,selectedLane);}
 async function addAsset(key,start=0,lane=null){if(isAudio(key))return dropAudio(key,offset()+Math.max(0,start));if(!h.current())h.addScene();if(layers().length>=100)return h.toast('조각당 소재는 100개까지 넣을 수 있어요.');if(!checkpoint())return;try{const el=await h.load(key),l=newLayer(key,key.split('/').pop(),el.videoWidth?'video':'image',(el.videoWidth||el.naturalWidth)/(el.videoHeight||el.naturalHeight));if(l.h>600){l.w*=600/l.h;l.h=600;}l.start=clamp(start,0,Math.max(0,span()-.05));if(!placeLayer(l,lane))return h.toast('소재 라인은 100개까지 만들 수 있어요.');active=l.id;fitMode=true;commit();}catch(e){h.toast(e.message);}}
 async function importFiles(files){if(h.isBusy())return;const good=[...files];if(!good.length)return;stop();h.setBusy(true);try{for(const f of good){if(!/\.(png|jpe?g|webp|gif|mp4|webm|mp3|wav|m4a|ogg|aac|flac)$/i.test(f.name))throw Error('PNG/JPG/WebP/GIF/MP4/WebM 또는 MP3/WAV/M4A/OGG 파일을 선택하세요.');if(f.size>1024**3)throw Error('한 파일은 1GB 이하로 가져오세요.');}stamp();const first=[];for(const f of good){const name=f.name.replace(/[^\p{L}\p{N}._ -]/gu,'_').slice(-120);const dir=pickedFolder||'media';let key=dir+'/'+name,n=2;while(h.assets()[key])key=dir+'/'+n+++'_'+name;h.assets()[key]=f;first.push(key);}h.changed();renderAssets();h.toast(`${good.length}개 소재를 가져왔어요. 빈 소재 칸으로 끌거나 눌러서 넣으세요.`);h.shareToLibrary(first);}catch(e){h.toast(e.message);}finally{h.setBusy(false);refresh();}}
 function renderProps(){const l=layer();$('edLayerProps').hidden=!l;$('edSceneProps').hidden=!!l;$('edType').textContent=l?(l.asset||l.kind==='text'?{image:'이미지',video:'영상',text:'텍스트'}[l.kind]:'빈 소재 칸'):'조각';if(l){$('edName').value=l.name;for(const el of host.querySelectorAll('[data-prop]'))el.value=Math.round((el.dataset.prop==='opacity'?l.opacity*100:l[el.dataset.prop]||0)*100)/100;$('edClipField').hidden=l.kind!=='video';$('edTextFields').hidden=l.kind!=='text';$('edText').value=l.text||'';$('edFontSize').value=l.fontSize||52;$('edTextColor').value=l.color||'#ffffff';$('edMotion').value=l.motion||'none';$('edEnter').value=l.enter||.35;$('edKeys').innerHTML=(l.keyframes||[]).map((k,i)=>`<div class="key-row"><button data-key="${i}">◇ ${(k.t+(l.start||0)).toFixed(2)}초</button><select data-ease="${i}" aria-label="키프레임 속도"><option value="out" ${k.ease==='out'?'selected':''}>부드럽게 정지</option><option value="linear" ${k.ease==='linear'?'selected':''}>일정한 속도</option><option value="inout" ${k.ease==='inout'?'selected':''}>부드럽게 이동</option></select><button data-delkey="${i}" aria-label="키프레임 삭제">×</button></div>`).join('');$('edKeys').querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>{stop();cursor=l.keyframes[+b.dataset.key].t+(l.start||0);fitMode=false;updateClock();paint();});$('edKeys').querySelectorAll('[data-delkey]').forEach(b=>b.onclick=()=>{stamp();l.keyframes.splice(+b.dataset.delkey,1);commit();});$('edKeys').querySelectorAll('[data-ease]').forEach(b=>b.onchange=()=>{stamp();l.keyframes[+b.dataset.ease].ease=b.value;commit();});}
 $('edLayers').innerHTML=layers().length?[...layers()].reverse().map(l=>`<div class="layer-item ${active===l.id?'selected':''}"><button data-select="${esc(l.id)}">${l.kind==='text'?'T':l.kind==='video'?'▷':'▧'} ${esc(l.name)}</button><button data-action="hidden" data-id="${esc(l.id)}" aria-label="표시 전환">${l.hidden?'○':'●'}</button><button data-action="locked" data-id="${esc(l.id)}" aria-label="잠금 전환">${l.locked?'🔒':'◇'}</button><button data-action="up" data-id="${esc(l.id)}" aria-label="앞으로">↑</button><button data-action="down" data-id="${esc(l.id)}" aria-label="뒤로">↓</button></div>`).join(''):'<p class="ed-note">소재를 추가하면 각각 이동하고 겹칠 수 있어요.</p>';$('edLayers').querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{active=b.dataset.select;if(host.dataset.pane==='layers'){host.dataset.pane='properties';host.querySelectorAll('[data-pane]').forEach(b=>b.classList.toggle('active',b.dataset.pane==='properties'));}renderProps();paint();});$('edLayers').querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{if(!checkpoint())return;const ls=layers(),i=ls.findIndex(x=>x.id===b.dataset.id),l=ls[i],a=b.dataset.action;if(a==='up'||a==='down'){const lane=l.lane+(a==='up'?1:-1);if(lane>=0&&lane<scene().materialTracks.length)moveLayerToLane(h.selected(),l.id,lane);}else if(['hidden','locked'].includes(a))l[a]=!l[a];commit();});$('edLegacy').innerHTML=scene()&&!Array.isArray(scene().layers)?'<p class="ed-note">기존 방식의 조각입니다. 직접 편집으로 바꾸면 소재를 자유롭게 배치할 수 있어요.</p><button id="edConvert">직접 편집으로 전환</button>':'';if($('edConvert'))$('edConvert').onclick=()=>{if(checkpoint())commit();};}
 // 아직 트랙에 올리지 않은 녹음만 칩으로 보여 준다.
 function renderTracks(){timeline.render(zoom);}
 function point(e){const r=$('edSelection').getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*1280,y:(e.clientY-r.top)/r.height*720};}
 $('edSelection').onpointerdown=e=>{if(h.isBusy())return;stop();const q=point(e),l=layer(),p=l&&poseAt(l,cursor,fitMode);let resize=false;if(p&&!l.locked){const angle=p.rotation*Math.PI/180;for(const dx of[-p.w/2,p.w/2])for(const dy of[-p.h/2,p.h/2]){const x=p.x+dx*Math.cos(angle)-dy*Math.sin(angle),y=p.y+dx*Math.sin(angle)+dy*Math.cos(angle);if(Math.hypot(q.x-x,q.y-y)<30)resize=true;}}const hit=resize?l:[...layers()].reverse().find(l=>hitLayer(l,poseAt(l,cursor,fitMode),q.x,q.y));active=hit?.id||null;renderProps();outline();if(!hit||hit.locked)return;stamp();const pose=poseAt(hit,cursor,fitMode);drag={id:hit.id,q,pose,resize,initial:structuredClone(hit)};$('edSelection').setPointerCapture(e.pointerId);};
 $('edSelection').onpointermove=e=>{if(!drag)return;const l=layer(),q=point(e);if(!l)return;const p={...drag.pose};if(drag.resize){const old=Math.hypot(drag.q.x-p.x,drag.q.y-p.y)||1,scale=clamp(Math.hypot(q.x-p.x,q.y-p.y)/old,.03,20);p.w=Math.max(8,drag.pose.w*scale);p.h=Math.max(8,drag.pose.h*scale);}else{p.x=clamp(p.x+q.x-drag.q.x,-1280,2560);p.y=clamp(p.y+q.y-drag.q.y,-720,1440);}Object.assign(l,p);if(l.keyframes?.length){const t=Math.max(0,cursor-(l.start||0)),key=l.keyframes.find(k=>Math.abs(k.t-t)<.03);if(key)Object.assign(key,p);else l.keyframes.push({t,...p,ease:'out'});l.keyframes.sort((a,b)=>a.t-b.t);}paint();};
 const endDrag=()=>{if(!drag)return;drag=null;commit();};$('edSelection').onpointerup=endDrag;$('edSelection').onpointercancel=endDrag;
 $('edStage').ondragover=e=>e.preventDefault();$('edStage').ondrop=e=>{e.preventDefault();const key=e.dataTransfer.getData('text/asset');if(key)addAsset(key);else if(e.dataTransfer.files.length)importFiles(e.dataTransfer.files);};
 function bind(id,fn){$(id).onclick=fn;}
 bind('edImport',()=>$('edFiles').click());
 bind('edNewFolder',()=>{if(h.isBusy())return;const base=(pickedFolder||'media')+'/새 폴더';
  let path=base,n=2;const taken=()=>allFolders().has(path);while(taken())path=base+' '+n++;
  const made=h.addFolder(path);if(made){closed.delete(pickedFolder);pickedFolder=made;renderAssets();filterAssets();}});$('edFiles').onchange=e=>{importFiles(e.target.files);e.target.value='';};bind('edScript',()=>h.script());bind('edStartScript',()=>h.script());bind('edStart',()=>addMaterial());bind('edLegacyImport',()=>h.legacyImport());bind('edCutVideo',()=>h.cutVideo());bind('edAddText',()=>{if(!h.current())h.addScene();if(!checkpoint())return;if(layers().length>=100)return h.toast('조각당 소재는 100개까지 넣을 수 있어요.');const l=newLayer('','텍스트','text');l.color='#20252b';if(!placeLayer(l,selectedLane))return;active=l.id;commit();});bind('edNewScene',()=>{stop();stamp();h.addScene();});bind('edDeleteScene',()=>{stop();stamp();h.deleteScene();});
 bind('edUndo',()=>{if(!undo.length||h.isBusy())return;stop();redo.push(h.snapshot());h.restore(undo.pop());active=null;refresh();});bind('edRedo',()=>{if(!redo.length||h.isBusy())return;stop();undo.push(h.snapshot());h.restore(redo.pop());active=null;refresh();});
 bind('edFill',()=>{const l=layer();if(!l||l.locked||!checkpoint())return;Object.assign(l,{x:640,y:360,w:1280,h:720,rotation:0,start:0,end:0});l.keyframes=[];commit();});
 bind('edDuplicate',()=>{const l=layer();if(!l||!checkpoint())return;const copy=structuredClone(l);copy.id=uid();copy.name+=' 복사';copy.x+=25;copy.y+=25;for(const k of copy.keyframes||[]){k.x+=25;k.y+=25;}if(!placeLayer(copy))return;active=copy.id;commit();});bind('edDelete',()=>{if(!layer()||layer().locked||!checkpoint())return;selectedLane=layer().lane;scene().layers=layers().filter(x=>x.id!==active);active=null;commit();});
 for(const el of host.querySelectorAll('[data-prop]'))el.onchange=()=>{const l=layer();if(!l||l.locked||!checkpoint())return;const k=el.dataset.prop,v=Number(el.value);if(!Number.isFinite(v))return;const limits={x:[-2560,3840],y:[-1440,2160],w:[8,6000],h:[8,6000],rotation:[-360,360],opacity:[0,100],start:[0,span()-.05],end:[0,span()],clipStart:[0,86400]};l[k]=clamp(v,...limits[k]);if(k==='opacity')l.opacity/=100;if(l.keyframes?.length&&['x','y','w','h','rotation','opacity'].includes(k)){const t=Math.max(0,cursor-(l.start||0)),p=poseAt(l,cursor,true),key=l.keyframes.find(x=>Math.abs(x.t-t)<.03);p[k]=l[k];if(key)Object.assign(key,p);else l.keyframes.push({t,...p,ease:'out'});l.keyframes.sort((a,b)=>a.t-b.t);}if(l.end&&l.end<=l.start)l.end=Math.min(span(),l.start+.1);commit();};
 for(const[id,k]of[['edName','name'],['edText','text'],['edTextColor','color'],['edFontSize','fontSize'],['edMotion','motion'],['edEnter','enter']])$(id).onchange=()=>{const l=layer();if(!l||l.locked||!checkpoint())return;l[k]=['fontSize','enter'].includes(k)?clamp($(id).value,k==='enter'?.05:12,k==='enter'?5:240):$(id).value;commit();};
 $('edBackground').onchange=()=>{if(!h.current())return;stamp();scene().background=$('edBackground').value;commit();};$('edDuration').onchange=()=>{if(!h.current())return;stamp();h.current().duration=clamp($('edDuration').value,.05,600);cursor=Math.min(cursor,span());commit();};
 bind('edAddKey',()=>{const l=layer();if(!l||l.locked)return;stamp();const t=Math.max(0,cursor-(l.start||0)),p={x:l.x,y:l.y,w:l.w,h:l.h,rotation:l.rotation||0,opacity:l.opacity??1};l.keyframes??=[];const prev=l.keyframes.find(k=>Math.abs(k.t-t)<.03);if(prev)Object.assign(prev,p);else l.keyframes.push({t,...p,ease:'out'});l.keyframes.sort((a,b)=>a.t-b.t);l.motion='none';commit();});
 bind('edBeginning',()=>{stop();seekProject(0);});bind('edFit',()=>{stop();fitMode=!fitMode;updateClock();paint();});$('edScrub').oninput=()=>{const t=+$('edScrub').value;stop();seekProject(t);};

 async function playProject(fromBeginning=false){
  if(playing&&!fromBeginning){stop();return;}if(!h.current()||h.isBusy())return;
  stop();if(fromBeginning||projectTime()>=layout().total-.01)seekProject(0);
  const epoch=playbackEpoch;$('edPlay').textContent='…';
  try{await h.prepare();if(epoch!==playbackEpoch)return;const from=projectTime();const clock=await h.startTimelineAudio(from);if(epoch!==playbackEpoch)return;
   fitMode=false;playing=true;$('edPlay').textContent='Ⅱ';$('edPlay').setAttribute('aria-label','전체 영상 일시정지');
   const tick=async()=>{if(epoch!==playbackEpoch||!playing)return;try{const map=layout(),time=Math.min(map.total,clock()),at=locateTime(map,time);
    if(!at)gapAt=time;
    else{gapAt=null;if(at.index!==h.selected()){h.focus(at.index);lastScene=h.current()?.id;active=null;selectedLane=null;cursor=at.local;refresh();}else cursor=at.local;}
    updateClock();await paint();if(epoch!==playbackEpoch)return;if(time>=map.total){stop();return;}raf=requestAnimationFrame(tick);
   }catch(e){stop();h.toast(e.message);}};tick();
  }catch(e){stop();h.toast(e.message);}
 }
 bind('edPlay',()=>playProject());bind('edFullPlay',()=>playProject(true));

 host.querySelectorAll('[data-pane]').forEach(b=>b.onclick=()=>{host.dataset.pane=b.dataset.pane;host.querySelectorAll('[data-pane]').forEach(x=>x.classList.toggle('active',x===b));});host.dataset.pane='media';const legacy=document.createElement('details');legacy.id='legacySettings';legacy.innerHTML='<summary>조각 화면 설정</summary>';legacy.append(document.querySelector('.inspector'));host.append(legacy);
 host.querySelector('.properties-pane').append(legacy);
 // Keep common commands beside the timeline; every button uses the existing edit history.
 $('edAssets').insertAdjacentHTML('beforebegin','<input id="edMediaSearch" type="search" placeholder="소재 이름 검색" aria-label="소재 이름 검색"><p id="edSearchEmpty" class="ed-note" hidden>검색 결과가 없습니다.</p>');
 function filterAssets(){const q=$('edMediaSearch').value.trim().toLocaleLowerCase();let count=0;host.querySelectorAll('[data-asset]').forEach(el=>{el.hidden=!el.dataset.asset.toLocaleLowerCase().includes(q);if(!el.hidden)count++;});$('edSearchEmpty').hidden=!q||count>0;}
 $('edMediaSearch').oninput=filterAssets;
 new MutationObserver(filterAssets).observe($('edAssets'),{childList:true});
 $('edPlay').insertAdjacentHTML('beforebegin','<button id="edPrevFrame" title="이전 프레임 (←)" aria-label="이전 프레임">‹</button>');
 $('edPlay').insertAdjacentHTML('afterend','<button id="edNextFrame" title="다음 프레임 (→)" aria-label="다음 프레임">›</button>');
 const stepFrame=amount=>{stop();seekProject(projectTime()+amount/getFrameRate());};
 $('edPrevFrame').onclick=()=>stepFrame(-1);$('edNextFrame').onclick=()=>stepFrame(1);
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.isComposing||h.isBusy()||!h.visible()||document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  const mod=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
  if(mod&&key==='z'){e.preventDefault();$(e.shiftKey?'edRedo':'edUndo').click();return;}
  if(mod&&key==='y'){e.preventDefault();$('edRedo').click();return;}
  if(mod&&key==='d'){e.preventDefault();$('edDuplicate').click();return;}
  if(mod||e.altKey)return;
  if(e.code==='Space'){if(e.target.closest('button'))return;e.preventDefault();$('edPlay').click();}
  else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stepFrame((e.key==='ArrowLeft'?-1:1)*(e.shiftKey?10:1));}
  else if(e.key==='Home'){e.preventDefault();stop();seekProject(0);}
  else if(e.key==='End'){e.preventDefault();stop();seekProject(layout().total);}
  else if(e.key==='Delete'){e.preventDefault();$('edDelete').click();}
 });
 return{refresh,stop,halt,paint,clearHistory(){undo=[];redo=[];active=null;lastScene=null;},isPlaying:()=>playing};
}
