import {timelineLayout,locateTime} from './project-timeline.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const RAIL=168;
export function createProjectTimeline(root,h){
 let zoom=64,layout,dragging=false;const peaks=new WeakMap();
 const scroll=root.parentElement;
 function wave(audio){if(!audio?.length)return '';if(peaks.has(audio))return peaks.get(audio);
  let path='';for(let i=0;i<96;i++){const a=Math.floor(i*audio.length/96),b=Math.floor((i+1)*audio.length/96);let peak=0;for(let j=a;j<b;j+=Math.max(1,Math.floor((b-a)/32)))peak=Math.max(peak,Math.abs(audio[j]));const size=Math.max(.4,Math.min(10,peak*10));path+=`M${i+0.5} ${12-size}V${12+size}`;}
  const svg=`<svg class="timeline-wave" viewBox="0 0 96 24" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"/></svg>`;peaks.set(audio,svg);return svg;
 }
 function x(t){return RAIL+t*zoom;}
 function timeAt(e){return clamp((e.clientX-root.getBoundingClientRect().left-RAIL)/zoom,0,Math.max(layout.total,0)+600);}
 function selected(){root.querySelectorAll('[data-clip]').forEach(el=>{const c=layout.layers[+el.dataset.clip];el.classList.toggle('selected',c.clipIndex===h.selected()&&c.layer.id===h.active());});}
 function playhead(time,follow=false){const el=root.querySelector('#edPlayhead');if(el)el.style.left=x(time)+'px';selected();if(follow){const at=x(time),left=scroll.scrollLeft;if(at>left+scroll.clientWidth-50)scroll.scrollLeft=Math.max(0,at-scroll.clientWidth*.5);else if(at<left+RAIL)scroll.scrollLeft=Math.max(0,at-150);}}
 // 녹음 막대를 끌어 옮기거나 가장자리로 길이를 바꾼다. 서로 붙을 필요가 없어 빈 구간과 겹침을 모두 허용한다.
 function dragTake(el,entry){
  el.onpointerdown=e=>{if(h.busy())return;const edge=e.target.dataset.edge;
   // 고르는 순간 트랙을 다시 그리면 끌고 있던 막대가 사라지므로, 먼저 끌기 상태로 잠근다.
   dragging=true;h.stop();
   e.preventDefault();h.stamp();try{el.setPointerCapture?.(e.pointerId);}catch{}
   const origin=e.clientX,start=entry.clip.start,span=entry.clip.duration,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
   const move=ev=>{const delta=(ev.clientX-origin)/zoom;
    if(edge)h.trim('audio',entry.clip.id,edge,snap(edge==='start'?start+delta:start+span+delta));
    else h.move('audio',entry.clip.id,Math.max(0,snap(start+delta)));
    el.style.left=x(entry.clip.start)+'px';el.style.width=Math.max(4,entry.clip.duration*zoom)+'px';};
   const done=()=>{dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};
   el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);};
 }
 function render(nextZoom=zoom){if(dragging)return;zoom=nextZoom;layout=timelineLayout(h.video(),h.audio());root.style.width=Math.max(scroll.clientWidth||500,RAIL+20+layout.total*zoom)+'px';
  const step=Math.max(zoom<40?5:zoom<80?2:1,Math.ceil(layout.total/1000));let ticks='';for(let t=0;t<=layout.total;t+=step)ticks+=`<span style="left:${x(t)}px">${clock(t)}</span>`;
  let html=`<div class="track-ruler" aria-label="전체 영상 시간 눈금"><b class="timeline-rail">전체 영상</b>${ticks}</div><div id="edPlayhead" style="left:${x(h.time())}px"></div>`;
  html+='<div class="track-row narration-track" data-drop="audio"><span class="timeline-rail">♫ 녹음</span>'+layout.takes.map(t=>{const take=h.takeOf(t.clip);
   return `<div class="take-bar ${take?'has-audio':'silent'}" role="button" tabindex="0" data-take="${esc(t.clip.id)}" title="${esc(t.clip.text||'녹음')} · ${clock(t.start)}–${clock(t.end)}" style="left:${x(t.start)}px;width:${Math.max(4,t.seconds*zoom)}px"><i data-edge="start" aria-hidden="true"></i><span>${esc(t.clip.text||'녹음')}</span>${wave(take)}<i data-edge="end" aria-hidden="true"></i></div>`;}).join('')
   +(layout.takes.length?'':'<p class="track-empty">녹음한 문장을 여기로 끌어다 놓으세요.</p>')+'</div>';
  // 맨 위 칸이 가장 나중에 그려져 화면 앞에 선다. 레이어 배열의 끝이 곧 맨 위 칸이다.
 for(let lane=layout.lanes-1;lane>=0;lane--){const own=layout.layers.find(c=>c.lane===lane&&c.clipIndex===h.selected());
  const rail=own?`<input class="rail-name" data-rename="${esc(own.layer.id)}" data-rclip="${own.clipIndex}" value="${esc(own.layer.name||'소재')}" maxlength="120" aria-label="소재 이름"><button class="rail-move" data-move="up" data-rclip="${own.clipIndex}" data-mid="${esc(own.layer.id)}" title="앞으로 (위 칸)" aria-label="앞으로">↑</button><button class="rail-move" data-move="down" data-rclip="${own.clipIndex}" data-mid="${esc(own.layer.id)}" title="뒤로 (아래 칸)" aria-label="뒤로">↓</button>`:`▧ 소재 ${lane+1}`;
  html+=`<div class="track-row material-track" data-lane="${lane}"><span class="timeline-rail">${rail}</span>`+layout.layers.map((c,i)=>{if(c.lane!==lane)return '';const l=c.layer,empty=!l.asset&&l.kind!=='text';
   return `<div class="layer-bar ${empty?'is-empty':''} ${l.hidden?'is-hidden':''} ${l.locked?'is-locked':''}" role="button" tabindex="0" aria-label="${esc(l.name||l.asset||'빈 소재 칸')} · 조각 ${c.clipIndex+1}" data-clip="${i}" style="left:${x(c.start)}px;width:${(c.end-c.start)*zoom}px"><i data-edge="start" aria-hidden="true"></i><span>${l.locked?'🔒 ':l.kind==='text'?'T ':l.kind==='video'?'▷ ':empty?'⤓ ':''}${esc(empty?'이미지를 여기로 끌어다 놓기':l.name||l.asset)}</span><i data-edge="end" aria-hidden="true"></i></div>`;}).join('')+'</div>';}
  if(!layout.layers.length&&!layout.takes.length)html+='<p class="timeline-empty">소재를 가져와 누르면 여기에 놓이고, 대사를 녹음하면 녹음 트랙이 생깁니다.</p>';
  root.innerHTML=html;
  root.querySelector('.track-ruler').onpointerdown=e=>{if(h.busy()||e.clientX-root.getBoundingClientRect().left<RAIL)return;h.stop();const ruler=e.currentTarget;ruler.setPointerCapture?.(e.pointerId);dragging=true;h.seek(timeAt(e));const move=ev=>h.seek(timeAt(ev));const done=()=>{dragging=false;ruler.removeEventListener('pointermove',move);ruler.removeEventListener('pointerup',done);ruler.removeEventListener('pointercancel',done);render();};ruler.addEventListener('pointermove',move);ruler.addEventListener('pointerup',done);ruler.addEventListener('pointercancel',done);};
  root.querySelectorAll('[data-take]').forEach(el=>{const entry=layout.takes.find(t=>t.clip.id===el.dataset.take);dragTake(el,entry);
   el.ondblclick=()=>{if(!h.busy()){h.stop();h.seek(entry.start);}};
   el.onkeydown=e=>{if(e.key==='Delete'){e.preventDefault();h.removeTake(entry.clip.id);}};});
  root.querySelectorAll('[data-rename]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();
   el.onchange=()=>h.renameLayer(+el.dataset.rclip,el.dataset.rename,el.value);});
  root.querySelectorAll('[data-move]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();
   el.onclick=()=>h.reorderLayer(+el.dataset.rclip,el.dataset.mid,el.dataset.move);});
  // 소재 칸 위에 그대로 떨어뜨리면 그 칸이 채워진다. 칸을 새로 만들지 않는다.
  root.querySelectorAll('[data-clip]').forEach(el=>{
   el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-hot');});
   el.addEventListener('dragleave',()=>el.classList.remove('drop-hot'));
   el.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();el.classList.remove('drop-hot');if(h.busy())return;
    const key=e.dataTransfer.getData('text/asset');if(!key)return;const c=layout.layers[+el.dataset.clip];h.stop();h.fillLayer(c.clipIndex,c.layer.id,key);});
   el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!h.busy()){const c=layout.layers[+el.dataset.clip];h.stop();h.selectLayer(c.clipIndex,c.layer.id,c.start);}}};
   el.onpointerdown=e=>{if(h.busy())return;const c=layout.layers[+el.dataset.clip];let l=c.layer;h.stop();dragging=true;h.selectLayer(c.clipIndex,l.id,c.start);selected();
    if(l.locked){dragging=false;return;}
    // 갓 넣은 영상은 아직 레이어가 아니라 끌 수 없다. 처음 끌 때 레이어로 바꿔 주고 그대로 이어서 끈다.
    if(l.legacy){const live=h.convertLayer(c.clipIndex);if(!live){dragging=false;return;}l=live;h.selectLayer(c.clipIndex,l.id,c.start);}
    e.preventDefault();h.stamp();try{el.setPointerCapture?.(e.pointerId);}catch{}const origin=e.clientX,edge=e.target.dataset.edge,a=c.start-c.clipStart,b=c.end-c.clipStart,d=c.clipEnd-c.clipStart;
    const move=ev=>{const delta=(ev.clientX-origin)/zoom,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
     if(edge==='start')l.start=clamp(snap(a+delta),0,b-frame);
     // 소재를 조각 밖으로 끌어도 멈추지 않는다. 대신 조각이 늘어나 소재를 계속 품는다.
     else if(edge==='end')l.end=Math.max(a+frame,snap(b+delta));
     else{const length=b-a;l.start=Math.max(0,snap(a+delta));l.end=l.start+length;}
     h.growClip(c.clipIndex,l.end);
     el.style.left=x(c.clipStart+l.start)+'px';el.style.width=((l.end||d)-l.start)*zoom+'px';
    };
    const done=()=>{dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);
   };
  });
  for(const el of root.querySelectorAll('[data-lane],[data-drop]')){el.addEventListener('dragover',e=>e.preventDefault());
   el.addEventListener('drop',e=>{e.preventDefault();if(h.busy())return;const at=timeAt(e);
    const take=e.dataTransfer.getData('text/take');
    if(el.dataset.drop==='audio'){if(take){h.stop();h.dropTake(Number(take),at);}return;}
    const key=e.dataTransfer.getData('text/asset'),hit=locateTime(layout,at);
    if(!key||!hit)return;
    const lane=+el.dataset.lane,slot=layout.layers.find(c=>c.lane===lane&&c.clipIndex===hit.index&&!c.layer.asset&&c.layer.kind!=='text');
    h.stop();
    if(slot)h.fillLayer(slot.clipIndex,slot.layer.id,key);
    else{h.seek(hit.time);h.addAsset(key,hit.local);}});}
  playhead(h.time());
 }
 return{render,playhead,fit(){const d=timelineLayout(h.video(),h.audio()).total;return Math.max(2,Math.min(160,((scroll.clientWidth||700)-150)/Math.max(1,d)));}};
}
