import {timelineLayout,locateTime} from './project-timeline.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
export function createProjectTimeline(root,h){
 let zoom=64,layout,dragging=false;const peaks=new WeakMap();
 const scroll=root.parentElement;
 function wave(audio){if(!audio?.length)return '';if(peaks.has(audio))return peaks.get(audio);
  let path='';for(let i=0;i<96;i++){const a=Math.floor(i*audio.length/96),b=Math.floor((i+1)*audio.length/96);let peak=0;for(let j=a;j<b;j+=Math.max(1,Math.floor((b-a)/32)))peak=Math.max(peak,Math.abs(audio[j]));const size=Math.max(.4,Math.min(10,peak*10));path+=`M${i+0.5} ${12-size}V${12+size}`;}
  const svg=`<svg class="timeline-wave" viewBox="0 0 96 24" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"/></svg>`;peaks.set(audio,svg);return svg;
 }
 function x(t){return 130+t*zoom;}
 function timeAt(e){return clamp((e.clientX-root.getBoundingClientRect().left-130)/zoom,0,layout.total);}
 function selected(){root.querySelectorAll('[data-narration],[data-shot]').forEach(el=>el.classList.toggle('selected',Number(el.dataset.narration??el.dataset.shot)===h.selected()));root.querySelectorAll('[data-clip]').forEach(el=>{const clip=layout.clips[+el.dataset.clip];el.classList.toggle('selected',clip.sceneIndex===h.selected()&&clip.layer.id===h.active());});}
 function playhead(time,follow=false){const el=root.querySelector('#edPlayhead');if(el)el.style.left=x(time)+'px';selected();if(follow){const at=x(time),left=scroll.scrollLeft;if(at>left+scroll.clientWidth-50)scroll.scrollLeft=Math.max(0,at-scroll.clientWidth*.5);else if(at<left+130)scroll.scrollLeft=Math.max(0,at-150);}}
 function render(nextZoom=zoom){if(dragging)return;zoom=nextZoom;layout=timelineLayout(h.sentences(),h.duration);root.style.width=Math.max(scroll.clientWidth||500,150+layout.total*zoom)+'px';
  const step=Math.max(zoom<40?5:zoom<80?2:1,Math.ceil(layout.total/1000));let ticks='';for(let t=0;t<=layout.total;t+=step)ticks+=`<span style="left:${x(t)}px">${clock(t)}</span>`;
  let html=`<div class="track-ruler" aria-label="전체 영상 시간 눈금"><b class="timeline-rail">전체 영상</b>${ticks}</div><div id="edPlayhead" style="left:${x(h.time())}px"></div>`;
  html+='<div class="track-row scene-track"><span class="timeline-rail">▧ 장면</span>'+layout.scenes.map(s=>`<button data-shot="${s.index}" class="global-scene" title="${esc(s.sentence.text||'빈 장면')}" style="left:${x(s.start)}px;width:${s.seconds*zoom}px"><b>${s.index+1}</b><span>${esc(s.sentence.text||'빈 장면')}</span><small>${s.seconds.toFixed(2)}초</small></button>`).join('')+'</div>';
  html+='<div class="track-row audio-track"><span class="timeline-rail">♫ 대사 / 녹음</span>'+layout.scenes.map(s=>`<button class="audio-bar ${s.sentence.audio?'has-audio':'silent'}" data-narration="${s.index}" title="${esc(s.sentence.text||'빈 장면')} · ${clock(s.start)}–${clock(s.end)}" style="left:${x(s.start)}px;width:${s.seconds*zoom}px"><span>${esc(s.sentence.text||'빈 장면')}</span>${wave(s.sentence.audio)}</button>`).join('')+'</div>';
  for(let lane=0;lane<layout.lanes;lane++)html+=`<div class="track-row material-track" data-lane="${lane}"><span class="timeline-rail">▧ 소재 ${lane+1}</span>`+layout.clips.map((clip,i)=>{if(clip.lane!==lane)return '';const l=clip.layer;return `<div class="layer-bar ${l.hidden?'is-hidden':''} ${l.locked?'is-locked':''}" role="button" tabindex="0" aria-label="${esc(l.name||l.asset)} · 장면 ${clip.sceneIndex+1}" data-clip="${i}" style="left:${x(clip.start)}px;width:${(clip.end-clip.start)*zoom}px"><i data-edge="start" aria-hidden="true"></i><span>${l.locked?'🔒 ':l.kind==='text'?'T ':l.kind==='video'?'▷ ':''}${esc(l.name||l.asset)}</span><i data-edge="end" aria-hidden="true"></i></div>`;}).join('')+'</div>';
  if(!layout.scenes.length)html+='<p class="timeline-empty">대사나 녹음을 가져오면 모든 장면이 여기에 차례로 놓입니다.</p>';
  root.innerHTML=html;
  root.querySelector('.track-ruler').onpointerdown=e=>{if(h.busy()||e.clientX-root.getBoundingClientRect().left<130)return;h.stop();const ruler=e.currentTarget;ruler.setPointerCapture?.(e.pointerId);dragging=true;h.seek(timeAt(e));const move=ev=>h.seek(timeAt(ev));const done=()=>{dragging=false;ruler.removeEventListener('pointermove',move);ruler.removeEventListener('pointerup',done);ruler.removeEventListener('pointercancel',done);render();};ruler.addEventListener('pointermove',move);ruler.addEventListener('pointerup',done);ruler.addEventListener('pointercancel',done);};
  root.querySelectorAll('[data-shot]').forEach(el=>{el.onclick=()=>{if(!h.busy()){h.stop();h.seek(layout.scenes[+el.dataset.shot].start);}};});
  root.querySelectorAll('[data-narration]').forEach(el=>{el.onclick=e=>{if(!h.busy()){h.stop();h.seek(timeAt(e));}};el.ondblclick=()=>{if(!h.busy()){h.stop();h.seek(layout.scenes[+el.dataset.narration].start);h.record();}};});
  root.querySelectorAll('[data-clip]').forEach(el=>{
   el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!h.busy()){const c=layout.clips[+el.dataset.clip];h.stop();h.selectLayer(c.sceneIndex,c.layer.id,c.start);}}};
   el.onpointerdown=e=>{if(h.busy())return;const clip=layout.clips[+el.dataset.clip],l=clip.layer;h.stop();dragging=true;h.selectLayer(clip.sceneIndex,l.id,clip.start);selected();if(l.locked||l.legacy){dragging=false;return;}e.preventDefault();h.stamp();el.setPointerCapture?.(e.pointerId);const origin=e.clientX,edge=e.target.dataset.edge,a=clip.start-clip.groupStart,b=clip.end-clip.groupStart,d=clip.groupEnd-clip.groupStart;
    const move=ev=>{const delta=(ev.clientX-origin)/zoom,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
     if(edge==='start')l.start=clamp(snap(a+delta),0,b-frame);
     else if(edge==='end')l.end=clamp(snap(b+delta),a+frame,d);
     else{const length=b-a;l.start=clamp(snap(a+delta),0,Math.max(0,d-length));l.end=l.start+length;}
     el.style.left=x(clip.groupStart+l.start)+'px';el.style.width=((l.end||d)-l.start)*zoom+'px';
    };
    const done=()=>{dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);
   };
  });
  root.querySelectorAll('[data-lane]').forEach(el=>{el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();if(h.busy())return;const key=e.dataTransfer.getData('text/asset'),at=locateTime(layout,timeAt(e));if(key&&at){h.stop();h.seek(at.time);h.addAsset(key,at.local);}};});playhead(h.time());
 }
 return{render,playhead,fit(){const d=timelineLayout(h.sentences(),h.duration).total;return Math.max(2,Math.min(160,((scroll.clientWidth||700)-150)/Math.max(1,d)));}};
}
