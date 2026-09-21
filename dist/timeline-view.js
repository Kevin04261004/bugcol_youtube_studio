import {timelineLayout,locateTime} from './project-timeline.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const RAIL=130;
export function createProjectTimeline(root,h){
 let zoom=64,layout,dragging=false;const peaks=new WeakMap();
 const scroll=root.parentElement;
 function wave(audio){if(!audio?.length)return '';if(peaks.has(audio))return peaks.get(audio);
  let path='';for(let i=0;i<96;i++){const a=Math.floor(i*audio.length/96),b=Math.floor((i+1)*audio.length/96);let peak=0;for(let j=a;j<b;j+=Math.max(1,Math.floor((b-a)/32)))peak=Math.max(peak,Math.abs(audio[j]));const size=Math.max(.4,Math.min(10,peak*10));path+=`M${i+0.5} ${12-size}V${12+size}`;}
  const svg=`<svg class="timeline-wave" viewBox="0 0 96 24" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"/></svg>`;peaks.set(audio,svg);return svg;
 }
 function x(t){return RAIL+t*zoom;}
 function timeAt(e){return clamp((e.clientX-root.getBoundingClientRect().left-RAIL)/zoom,0,Math.max(layout.total,0)+600);}
 function selected(){root.querySelectorAll('[data-shot]').forEach(el=>el.classList.toggle('selected',Number(el.dataset.shot)===h.selected()));
  root.querySelectorAll('[data-clip]').forEach(el=>{const c=layout.layers[+el.dataset.clip];el.classList.toggle('selected',c.clipIndex===h.selected()&&c.layer.id===h.active());});}
 function playhead(time,follow=false){const el=root.querySelector('#edPlayhead');if(el)el.style.left=x(time)+'px';selected();if(follow){const at=x(time),left=scroll.scrollLeft;if(at>left+scroll.clientWidth-50)scroll.scrollLeft=Math.max(0,at-scroll.clientWidth*.5);else if(at<left+RAIL)scroll.scrollLeft=Math.max(0,at-150);}}
 // 트랙 조각을 끌어 옮기거나 가장자리로 길이를 바꾼다. 조각끼리 붙을 필요가 없어 빈 구간과 겹침을 모두 허용한다.
 function dragBar(el,track,entry){
  el.onpointerdown=e=>{if(h.busy())return;const edge=e.target.dataset.edge;
   // 고르는 순간 트랙을 다시 그리면 끌고 있던 막대가 사라지므로, 먼저 끌기 상태로 잠근다.
   dragging=true;h.stop();
   if(track==='video')h.select(entry.index);
   e.preventDefault();h.stamp();try{el.setPointerCapture?.(e.pointerId);}catch{}
   const origin=e.clientX,start=entry.clip.start,span=entry.clip.duration,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
   const move=ev=>{const delta=(ev.clientX-origin)/zoom;
    if(edge)h.trim(track,entry.clip.id,edge,snap(edge==='start'?start+delta:start+span+delta));
    else h.move(track,entry.clip.id,Math.max(0,snap(start+delta)));
    el.style.left=x(entry.clip.start)+'px';el.style.width=Math.max(4,entry.clip.duration*zoom)+'px';};
   const done=()=>{dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};
   el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);};
 }
 function render(nextZoom=zoom){if(dragging)return;zoom=nextZoom;layout=timelineLayout(h.video(),h.audio());root.style.width=Math.max(scroll.clientWidth||500,RAIL+20+layout.total*zoom)+'px';
  const step=Math.max(zoom<40?5:zoom<80?2:1,Math.ceil(layout.total/1000));let ticks='';for(let t=0;t<=layout.total;t+=step)ticks+=`<span style="left:${x(t)}px">${clock(t)}</span>`;
  let html=`<div class="track-ruler" aria-label="전체 영상 시간 눈금"><b class="timeline-rail">전체 영상</b>${ticks}</div><div id="edPlayhead" style="left:${x(h.time())}px"></div>`;
  html+='<div class="track-row video-track"><span class="timeline-rail">▧ 영상</span>'+layout.clips.map(c=>{const scene=c.clip.scene||{},label=scene.title||scene.asset?.split('/').pop()||'빈 조각';
   return `<div class="clip-bar" role="button" tabindex="0" data-shot="${c.index}" title="${esc(label)} · ${clock(c.start)}–${clock(c.end)}" style="left:${x(c.start)}px;width:${Math.max(4,c.seconds*zoom)}px"><i data-edge="start" aria-hidden="true"></i><b class="clip-swatch" style="background:${esc(scene.background||'#2a2440')}"></b><span>${esc(label)}</span><small>${c.seconds.toFixed(2)}초</small><i data-edge="end" aria-hidden="true"></i></div>`;}).join('')
   +(layout.clips.length?'':'<p class="track-empty">영상 조각을 올리면 여기에서 끌어 옮기고 자를 수 있어요.</p>')+'</div>';
  html+='<div class="track-row narration-track" data-drop="audio"><span class="timeline-rail">♫ 녹음</span>'+layout.takes.map(t=>{const take=h.takeOf(t.clip);
   return `<div class="take-bar ${take?'has-audio':'silent'}" role="button" tabindex="0" data-take="${esc(t.clip.id)}" title="${esc(t.clip.text||'녹음')} · ${clock(t.start)}–${clock(t.end)}" style="left:${x(t.start)}px;width:${Math.max(4,t.seconds*zoom)}px"><i data-edge="start" aria-hidden="true"></i><span>${esc(t.clip.text||'녹음')}</span>${wave(take)}<i data-edge="end" aria-hidden="true"></i></div>`;}).join('')
   +(layout.takes.length?'':'<p class="track-empty">녹음한 문장을 여기로 끌어다 놓으세요.</p>')+'</div>';
  for(let lane=0;lane<layout.lanes;lane++)html+=`<div class="track-row material-track" data-lane="${lane}"><span class="timeline-rail">▧ 소재 ${lane+1}</span>`+layout.layers.map((c,i)=>{if(c.lane!==lane)return '';const l=c.layer;return `<div class="layer-bar ${l.hidden?'is-hidden':''} ${l.locked?'is-locked':''}" role="button" tabindex="0" aria-label="${esc(l.name||l.asset)} · 조각 ${c.clipIndex+1}" data-clip="${i}" style="left:${x(c.start)}px;width:${(c.end-c.start)*zoom}px"><i data-edge="start" aria-hidden="true"></i><span>${l.locked?'🔒 ':l.kind==='text'?'T ':l.kind==='video'?'▷ ':''}${esc(l.name||l.asset)}</span><i data-edge="end" aria-hidden="true"></i></div>`;}).join('')+'</div>';
  if(!layout.clips.length&&!layout.takes.length)html+='<p class="timeline-empty">영상을 잘라 올리거나 대사를 녹음하면 여기에 트랙이 생깁니다.</p>';
  root.innerHTML=html;
  root.querySelector('.track-ruler').onpointerdown=e=>{if(h.busy()||e.clientX-root.getBoundingClientRect().left<RAIL)return;h.stop();const ruler=e.currentTarget;ruler.setPointerCapture?.(e.pointerId);dragging=true;h.seek(timeAt(e));const move=ev=>h.seek(timeAt(ev));const done=()=>{dragging=false;ruler.removeEventListener('pointermove',move);ruler.removeEventListener('pointerup',done);ruler.removeEventListener('pointercancel',done);render();};ruler.addEventListener('pointermove',move);ruler.addEventListener('pointerup',done);ruler.addEventListener('pointercancel',done);};
  root.querySelectorAll('[data-shot]').forEach(el=>{const entry=layout.clips[+el.dataset.shot];dragBar(el,'video',entry);
   el.onclick=()=>{if(!h.busy())h.select(entry.index);};
   el.ondblclick=()=>{if(!h.busy()){h.stop();h.seek(entry.start);}};
   el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!h.busy()){h.stop();h.select(entry.index);h.seek(entry.start);}}};});
  root.querySelectorAll('[data-take]').forEach(el=>{const entry=layout.takes.find(t=>t.clip.id===el.dataset.take);dragBar(el,'audio',entry);
   el.ondblclick=()=>{if(!h.busy()){h.stop();h.seek(entry.start);}};
   el.onkeydown=e=>{if(e.key==='Delete'){e.preventDefault();h.removeTake(entry.clip.id);}};});
  root.querySelectorAll('[data-clip]').forEach(el=>{
   el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!h.busy()){const c=layout.layers[+el.dataset.clip];h.stop();h.selectLayer(c.clipIndex,c.layer.id,c.start);}}};
   el.onpointerdown=e=>{if(h.busy())return;const c=layout.layers[+el.dataset.clip],l=c.layer;h.stop();dragging=true;h.selectLayer(c.clipIndex,l.id,c.start);selected();if(l.locked||l.legacy){dragging=false;return;}e.preventDefault();h.stamp();el.setPointerCapture?.(e.pointerId);const origin=e.clientX,edge=e.target.dataset.edge,a=c.start-c.clipStart,b=c.end-c.clipStart,d=c.clipEnd-c.clipStart;
    const move=ev=>{const delta=(ev.clientX-origin)/zoom,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
     if(edge==='start')l.start=clamp(snap(a+delta),0,b-frame);
     else if(edge==='end')l.end=clamp(snap(b+delta),a+frame,d);
     else{const length=b-a;l.start=clamp(snap(a+delta),0,Math.max(0,d-length));l.end=l.start+length;}
     el.style.left=x(c.clipStart+l.start)+'px';el.style.width=((l.end||d)-l.start)*zoom+'px';
    };
    const done=()=>{dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);
   };
  });
  for(const el of root.querySelectorAll('[data-lane],[data-drop]')){el.ondragover=e=>e.preventDefault();
   el.ondrop=e=>{e.preventDefault();if(h.busy())return;const at=timeAt(e);
    const take=e.dataTransfer.getData('text/take');
    if(el.dataset.drop==='audio'){if(take){h.stop();h.dropTake(Number(take),at);}return;}
    const key=e.dataTransfer.getData('text/asset'),hit=locateTime(layout,at);
    if(key&&hit){h.stop();h.seek(hit.time);h.addAsset(key,hit.local);}};}
  playhead(h.time());
 }
 return{render,playhead,fit(){const d=timelineLayout(h.video(),h.audio()).total;return Math.max(2,Math.min(160,((scroll.clientWidth||700)-150)/Math.max(1,d)));}};
}
