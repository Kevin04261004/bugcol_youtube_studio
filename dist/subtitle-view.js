import {splitScript,layoutCues,normalizeCues,cueAt,toSrt,toVtt,parseSrt,MAX_CUES} from './subtitles.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(2).padStart(5,'0')}`;
const VIDEO=/\.(mp4|webm|mov|m4v)$/i;

// 편집은 다른 도구에서 하고 여기서는 자막만 얹는다. 영상은 이 기기에만 있고 서버로 올라가지 않는다.
export function createSubtitleStudio(host,hooks={}){
 const $=id=>host.querySelector('#'+id);
 let cues=[],active=null,url='',name='',stamping=false,script=[];
 host.innerHTML=`<div class="subs-grid">
  <section class="subs-stage">
   <div class="subs-pick"><button id="subOpen" class="ed-primary">＋ 영상 가져오기</button>
    <input id="subFile" type="file" accept="video/mp4,video/webm,video/quicktime,.mov,.m4v" hidden>
    <span id="subName">편집을 마친 영상을 올리면 자막만 얹어 드려요.</span></div>
   <div id="subScreen"><video id="subVideo" playsinline preload="auto"></video><p id="subOverlay"></p>
    <div id="subEmpty">영상을 올리면 여기에서 자막을 맞춥니다.</div></div>
   <div class="subs-transport">
    <button id="subBack" title="5초 뒤로">◀◀</button>
    <button id="subPlay" class="ed-play">▶</button>
    <button id="subFwd" title="5초 앞으로">▶▶</button>
    <span id="subClock">00:00.00 / 00:00.00</span>
    <input id="subScrub" type="range" min="0" max="0" step="0.01" value="0" aria-label="재생 위치">
   </div>
   <div class="subs-stamp"><button id="subStamp" class="ed-primary">타이밍 찍기 시작</button>
    <small id="subHint">재생하면서 줄이 바뀌는 순간마다 누르면 시간이 찍힙니다.</small></div>
  </section>
  <aside class="subs-side">
   <div class="ed-heading"><h2>자막</h2><span id="subCount">0줄</span></div>
   <div class="subs-actions">
    <button id="subScript">직접 입력</button>
    <button id="subFromProject">작업 폴더 대사</button>
    <button id="subImport">SRT 불러오기</button>
    <input id="subSrtFile" type="file" accept=".srt,.vtt,text/plain" hidden>
    <button id="subAdd">＋ 지금 위치에 추가</button>
   </div>
   <div id="subList" class="subs-list"></div>
   <div class="subs-out">
    <button id="subSrt">↓ SRT 내려받기</button>
    <button id="subVtt">↓ VTT</button>
    <button id="subBurn" class="ed-primary">자막 입힌 영상 만들기</button>
    <p id="subState" class="ed-note">SRT 는 클립챔프·프리미어·유튜브에 그대로 올릴 수 있어요. 영상으로 구우면 어디서나 그대로 보입니다.</p>
   </div>
  </aside>
 </div>
 <dialog id="subScriptBox"><form method="dialog"><h3 id="subScriptTitle">직접 입력</h3>
  <p class="ed-note">한 줄이 자막 한 개가 됩니다. 시간은 영상 길이에 맞춰 고르게 나눈 뒤 다듬으세요.</p>
  <textarea id="subScriptText" rows="10" placeholder="첫 번째 자막\n두 번째 자막"></textarea>
  <label id="subTakesRow" hidden><input type="checkbox" id="subUseTakes"> 녹음해 둔 타이밍 그대로 쓰기</label>
  <menu><button value="cancel">취소</button><button id="subScriptApply" value="apply" class="ed-primary">자막으로 만들기</button></menu>
 </form></dialog>`;
 const video=$('subVideo');
 const duration=()=>Number.isFinite(video.duration)?video.duration:0;
 const toast=m=>hooks.toast?.(m);
 const state=m=>{$('subState').textContent=m;};

 function renderList(){
  $('subCount').textContent=cues.length+'줄';
  $('subList').innerHTML=cues.length?cues.map((c,i)=>`<div class="cue-row${active===c.id?' picked':''}" data-cue="${esc(c.id)}">
   <b>${i+1}</b>
   <input class="cue-time" data-edge="start" type="number" min="0" step=".05" value="${c.start.toFixed(2)}" aria-label="시작 초">
   <input class="cue-time" data-edge="end" type="number" min="0" step=".05" value="${c.end.toFixed(2)}" aria-label="끝 초">
   <input class="cue-text" value="${esc(c.text)}" aria-label="자막 글">
   <button data-jump title="이 자막으로 이동">▶</button>
   <button data-now title="지금 위치를 시작으로">지금</button>
   <button data-drop title="지우기">×</button>
  </div>`).join(''):'<p class="ed-note">아직 자막이 없습니다. 대본을 붙여넣거나 SRT 를 불러오세요.</p>';
  for(const row of $('subList').querySelectorAll('[data-cue]')){
   const id=row.dataset.cue,cue=()=>cues.find(c=>c.id===id);
   row.querySelectorAll('.cue-time').forEach(el=>el.onchange=()=>{const c=cue();if(!c)return;
    c[el.dataset.edge]=Math.max(0,Number(el.value)||0);commit();});
   row.querySelector('.cue-text').oninput=el=>{const c=cue();if(c)c.text=row.querySelector('.cue-text').value;paint();};
   row.querySelector('.cue-text').onchange=()=>{const c=cue();if(c)c.text=row.querySelector('.cue-text').value;commit();};
   row.querySelector('[data-jump]').onclick=()=>{const c=cue();if(c)seek(c.start);};
   row.querySelector('[data-now]').onclick=()=>{const c=cue();if(!c)return;c.start=video.currentTime;if(c.end<=c.start)c.end=c.start+1.5;commit();};
   row.querySelector('[data-drop]').onclick=()=>{cues=cues.filter(c=>c.id!==id);commit();};
   row.onpointerdown=()=>{active=id;renderList();};
  }
 }
 function commit(){cues=normalizeCues(cues,duration());renderList();paint();hooks.changed?.(cues);}
 function paint(){
  const now=cueAt(cues,video.currentTime),line=now?.text||'';
  $('subOverlay').textContent=line;$('subOverlay').hidden=!line;
  $('subClock').textContent=`${clock(video.currentTime||0)} / ${clock(duration())}`;
  $('subScrub').value=video.currentTime||0;
  const row=now&&$('subList').querySelector(`[data-cue="${now.id}"]`);
  $('subList').querySelectorAll('.cue-row').forEach(el=>el.classList.toggle('playing',el===row));
 }
 function seek(t){if(!url)return;video.currentTime=Math.max(0,Math.min(duration(),t));paint();}
 function load(file){
  if(!file)return;
  if(!VIDEO.test(file.name)&&!String(file.type).startsWith('video/'))return toast('MP4·WebM·MOV 영상을 올려 주세요.');
  if(url)URL.revokeObjectURL(url);
  url=URL.createObjectURL(file);name=file.name;
  video.src=url;$('subName').textContent=file.name;$('subEmpty').hidden=true;
  video.onloadedmetadata=()=>{$('subScrub').max=duration();
   // 대본만 먼저 붙여넣었다면 이제 영상 길이에 맞춰 고르게 펴 준다.
   if(cues.length&&cues.at(-1).end>duration())cues=layoutCues(cues.map(c=>c.text),duration());
   commit();state(`${file.name} · ${clock(duration())}`);};
 }
 function saveBlob(blob,filename){
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=filename;
  link.style.display='none';document.body.append(link);link.click();
  setTimeout(()=>{link.remove();URL.revokeObjectURL(link.href);},60000);
  return filename;
 }
 function download(text,ext){
  if(!cues.length)return toast('자막이 없습니다.');
  const base=(name||'자막').replace(/\.[^.]+$/,'');
  const blob=new Blob(['﻿'+text],{type:'text/plain;charset=utf-8'});
  saveBlob(blob,base+'.'+ext);
 }
 // 타이밍 찍기 — 재생하면서 줄이 바뀌는 순간마다 누른다. 누른 시각이 다음 줄의 시작이자 이번 줄의 끝이다.
 let stampIndex=0;
 function startStamp(){
  if(!cues.length)return toast('먼저 대본을 붙여넣으세요.');
  stamping=true;stampIndex=0;cues[0].start=video.currentTime;
  $('subStamp').textContent='다음 줄 (1 / '+cues.length+')';
  $('subHint').textContent='줄이 바뀌는 순간마다 누르세요. Esc 로 멈춥니다.';
  video.play().catch(()=>{});
 }
 function stamp(){
  if(!stamping)return startStamp();
  const now=video.currentTime,cue=cues[stampIndex];
  cue.end=Math.max(cue.start+.2,now);
  stampIndex++;
  if(stampIndex>=cues.length)return stopStamp();
  cues[stampIndex].start=cue.end;
  $('subStamp').textContent=`다음 줄 (${stampIndex+1} / ${cues.length})`;
  renderList();paint();
 }
 function stopStamp(){stamping=false;$('subStamp').textContent='타이밍 찍기 시작';
  $('subHint').textContent='재생하면서 줄이 바뀌는 순간마다 누르면 시간이 찍힙니다.';commit();}

 // 자막을 화면에 구워 넣는다. 실시간으로 한 번 재생하며 캔버스에 옮겨 담는 방식이라 소리도 같이 들어간다.
 let mixer=null;
 async function burn(){
  if(!url)return toast('영상을 먼저 올려 주세요.');
  if(!cues.length)return toast('자막을 먼저 만들어 주세요.');
  if(!globalThis.MediaRecorder||!video.captureStream&&!video.mozCaptureStream)return toast('이 브라우저에서는 영상 굽기를 지원하지 않습니다. SRT 를 받아 편집기에서 얹어 주세요.');
  const mime=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm']
   .find(t=>MediaRecorder.isTypeSupported(t));
  if(!mime)return toast('이 브라우저에서는 영상 굽기를 지원하지 않습니다.');
  const canvas=document.createElement('canvas');
  canvas.width=Math.min(1920,video.videoWidth||1280);
  canvas.height=Math.round(canvas.width*(video.videoHeight||720)/(video.videoWidth||1280));
  const g=canvas.getContext('2d');
  const stream=canvas.captureStream(30);
  try{
   mixer??=(()=>{const ctx=new AudioContext(),src=ctx.createMediaElementSource(video),dest=ctx.createMediaStreamDestination();
    src.connect(dest);src.connect(ctx.destination);return{ctx,dest};})();
   await mixer.ctx.resume();
   for(const track of mixer.dest.stream.getAudioTracks())stream.addTrack(track);
  }catch(e){console.info('소리를 함께 담지 못했습니다',e);}
  const chunks=[],recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:8000000});
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  const done=new Promise(r=>recorder.onstop=r);
  hooks.setBusy?.(true);$('subBurn').disabled=true;
  video.pause();video.currentTime=0;
  await new Promise(r=>{const ok=()=>{video.removeEventListener('seeked',ok);r();};video.addEventListener('seeked',ok);});
  recorder.start(1000);
  await video.play();
  let stop=false;
  const frame=()=>{
   if(stop)return;
   g.drawImage(video,0,0,canvas.width,canvas.height);
   drawCaption(g,canvas,cueAt(cues,video.currentTime)?.text||'');
   state(`굽는 중 ${clock(video.currentTime)} / ${clock(duration())}`);
   if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(frame);else requestAnimationFrame(frame);
  };
  frame();
  await new Promise(r=>{const end=()=>{video.removeEventListener('ended',end);r();};video.addEventListener('ended',end);});
  stop=true;recorder.stop();await done;
  hooks.setBusy?.(false);$('subBurn').disabled=false;
  const type=recorder.mimeType||mime;
  const file=saveBlob(new Blob(chunks,{type}),(name||'영상').replace(/\.[^.]+$/,'')+'-자막'+(type.includes('mp4')?'.mp4':'.webm'));
  state('다 됐습니다 · '+file);
 }
 function drawCaption(g,canvas,text){
  if(!text)return;
  const size=Math.round(canvas.height*.055),pad=Math.round(size*.9);
  g.font=`700 ${size}px "Noto Sans KR",sans-serif`;g.textAlign='center';g.textBaseline='middle';
  const max=canvas.width*.86,lines=[];
  for(const paragraph of text.split('\n')){let line='';
   for(const ch of paragraph){if(g.measureText(line+ch).width>max&&line){lines.push(line);line=ch;}else line+=ch;}
   lines.push(line);}
  const height=lines.length*size*1.35+pad,top=canvas.height-height-Math.round(canvas.height*.06);
  g.fillStyle='rgba(0,0,0,.72)';g.fillRect(canvas.width*.05,top,canvas.width*.9,height);
  g.fillStyle='#fff';
  lines.forEach((line,i)=>g.fillText(line,canvas.width/2,top+pad/2+size*.7+i*size*1.35,max));
 }

 $('subOpen').onclick=()=>$('subFile').click();
 $('subFile').onchange=e=>{load(e.target.files[0]);e.target.value='';};
 $('subScreen').ondragover=e=>e.preventDefault();
 $('subScreen').ondrop=e=>{e.preventDefault();load(e.dataTransfer.files[0]);};
 $('subPlay').onclick=()=>{if(!url)return;video.paused?video.play():video.pause();};
 $('subBack').onclick=()=>seek(video.currentTime-5);
 $('subFwd').onclick=()=>seek(video.currentTime+5);
 $('subScrub').oninput=()=>seek(+$('subScrub').value);
 $('subAdd').onclick=()=>{if(cues.length>=MAX_CUES)return toast('자막은 '+MAX_CUES+'개까지 넣을 수 있어요.');
  const start=video.currentTime||0;
  cues.push({id:'c'+Date.now().toString(36),start,end:start+1.5,text:'새 자막'});commit();};
 // 대사는 손으로 쓰거나, 지금 열려 있는 작업 폴더에서 그대로 가져온다.
 function openScript(title,text,takes){
  $('subScriptTitle').textContent=title;$('subScriptText').value=text;
  $('subTakesRow').hidden=!takes.length;$('subUseTakes').checked=!!takes.length;
  script=takes;$('subScriptBox').showModal();
 }
 $('subScript').onclick=()=>openScript('직접 입력',cues.map(c=>c.text).join('\n'),[]);
 $('subFromProject').onclick=()=>{
  const found=hooks.projectScript?.()||{lines:[],timed:[]};
  if(!found.lines.length&&!found.timed.length)return toast('지금 열려 있는 작업 폴더에 대사가 없습니다. 대본 & 녹음에서 먼저 작업을 열어 주세요.');
  const lines=found.timed.length?found.timed.map(c=>c.text):found.lines;
  openScript('작업 폴더 대사'+(found.name?' · '+found.name:''),lines.join('\n'),found.timed);
 };
 $('subScriptApply').onclick=()=>{const lines=splitScript($('subScriptText').value);
  if(!lines.length)return;
  // 녹음 타이밍을 쓰면 줄 순서대로 그 시각을 그대로 입는다. 줄을 고쳤어도 순서만 맞으면 된다.
  if($('subUseTakes').checked&&script.length){
   const tail=script.at(-1)?.end||0;
   // 줄을 더 적었다면 녹음이 끝난 뒤로 3초씩 이어 붙인다.
   cues=normalizeCues(lines.map((text,i)=>{const take=script[i],extra=i-script.length;
    return take?{id:'c'+(i+1),start:take.start,end:take.end,text}
     :{id:'c'+(i+1),start:tail+extra*3,end:tail+(extra+1)*3,text};}),duration());
  }else cues=layoutCues(lines,duration());
  commit();
  toast(lines.length+'줄을 만들었어요.'+($('subUseTakes').checked&&script.length?' 녹음 타이밍을 그대로 입혔습니다 — 영상을 자르셨다면 타이밍 찍기로 다시 맞추세요.':' 타이밍 찍기로 맞춰 보세요.'));};
 $('subImport').onclick=()=>$('subSrtFile').click();
 $('subSrtFile').onchange=async e=>{const file=e.target.files[0];e.target.value='';
  if(!file)return;
  try{const found=parseSrt(await file.text());
   if(!found.length)throw Error('자막을 찾지 못했습니다.');
   cues=found;commit();toast(found.length+'줄을 불러왔어요.');}
  catch(err){toast('자막 파일을 읽지 못했습니다: '+err.message);}};
 $('subSrt').onclick=()=>download(toSrt(cues),'srt');
 $('subVtt').onclick=()=>download(toVtt(cues),'vtt');
 $('subBurn').onclick=()=>burn().catch(e=>{hooks.setBusy?.(false);$('subBurn').disabled=false;toast('영상을 굽지 못했습니다: '+e.message);});
 $('subStamp').onclick=stamp;
 video.ontimeupdate=paint;
 video.onplay=()=>{$('subPlay').textContent='Ⅱ';};
 video.onpause=()=>{$('subPlay').textContent='▶';if(stamping)stopStamp();};
 video.onended=()=>{$('subPlay').textContent='▶';if(stamping)stopStamp();};
 host.addEventListener('keydown',e=>{if(e.key==='Escape'&&stamping){e.preventDefault();stopStamp();}});
 renderList();paint();
 return{cues:()=>cues,setCues:next=>{cues=normalizeCues(next,duration());renderList();paint();},
  srt:()=>toSrt(cues),vtt:()=>toVtt(cues),loadVideo:load,stamp,visible:()=>!host.hidden};
}
