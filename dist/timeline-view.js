import {materialTracks} from './editor-engine.js';
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
 // 마우스 끌어놓기와 손가락 길게 끌기가 같은 자리로 들어온다. el 은 이벤트가 난 막대(없으면 좌표로 찾는다).
 function under(x,y,el){const hit=el||(document.elementFromPoint?document.elementFromPoint(x,y):null);
  return{bar:hit?.closest?.('[data-clip]')||null,lane:hit?.closest?.('[data-lane]')||null};}
 function hover(x,y){root.querySelectorAll('.drop-hot').forEach(n=>n.classList.remove('drop-hot'));if(x==null)return;under(x,y).bar?.classList.add('drop-hot');}
 function dropAsset(key,x,y,el){hover(null);if(!layout||h.busy())return true;
  const{bar,lane}=under(x,y,el);if(!bar&&!lane)return false;
  h.stop();
  // 녹음 소재는 조각과 상관없이 놓은 시각 그대로 녹음 줄에 올라간다.
  if(h.isAudio(key)){h.dropAudio(key,Math.max(0,timeAt({clientX:x})));return true;}
  const empty=c=>c&&!c.layer.asset&&c.layer.kind!=='text';
  // 빈 칸에 놓으면 그 칸을 채우고, 이미 찬 칸이면 바꾸지 않고 소재 줄을 하나 더 만든다.
  if(bar){const c=layout.layers[+bar.dataset.clip];if(empty(c)){h.fillLayer(c.clipIndex,c.layer.id,key);return true;}}
  // 조각 끝을 지나 놓아도 그냥 흘려보내지 않고 마지막 조각 끝에 붙인다.
  const at=timeAt({clientX:x}),last=layout.clips.at(-1);
  const hit=locateTime(layout,at)||(last?{index:layout.clips.length-1,local:Math.max(0,last.seconds-1e-6),time:last.end-1e-6}:null);
  if(!hit)return false;
  if(lane){const slot=layout.layers.find(c=>c.lane===+lane.dataset.lane&&c.clipIndex===hit.index&&empty(c));
   if(slot){h.fillLayer(slot.clipIndex,slot.layer.id,key);return true;}}
  h.seek(hit.time);h.addAsset(key,hit.local,bar?null:lane?+lane.dataset.lane:null);return true;}
 function render(nextZoom=zoom){if(dragging)return;zoom=nextZoom;layout=timelineLayout(h.video(),h.audio());root.style.width=Math.max(scroll.clientWidth||500,RAIL+20+layout.total*zoom)+'px';
  const step=Math.max(zoom<40?5:zoom<80?2:1,Math.ceil(layout.total/1000));let ticks='';for(let t=0;t<=layout.total;t+=step)ticks+=`<span style="left:${x(t)}px">${clock(t)}</span>`;
  let html=`<div class="track-ruler" aria-label="전체 영상 시간 눈금"><b class="timeline-rail">전체 영상</b>${ticks}</div><div id="edPlayhead" style="left:${x(h.time())}px"></div>`;
  html+='<div class="track-row narration-track" data-drop="audio"><span class="timeline-rail">♫ 녹음</span>'+layout.takes.map(t=>{const take=h.takeOf(t.clip);
   return `<div class="take-bar ${take?'has-audio':'silent'}" role="button" tabindex="0" data-take="${esc(t.clip.id)}" title="${esc(t.clip.text||'녹음')} · ${clock(t.start)}–${clock(t.end)}" style="left:${x(t.start)}px;width:${Math.max(4,t.seconds*zoom)}px"><i data-edge="start" aria-hidden="true"></i><span>${esc(t.clip.text||'녹음')}</span>${wave(take)}<i data-edge="end" aria-hidden="true"></i></div>`;}).join('')
   +(layout.takes.length?'':'<p class="track-empty">녹음한 문장을 여기로 끌어다 놓으세요.</p>')+'</div>';
  // 맨 위 칸이 가장 나중에 그려져 화면 앞에 선다. 레이어 배열의 끝이 곧 맨 위 칸이다.
 const tracks=materialTracks(h.video()[h.selected()]?.scene||{});
 for(let lane=layout.lanes-1;lane>=0;lane--){
  const rail=`<button class="rail-grip" data-track-drag="${lane}" title="끌어서 소재 순서 변경" aria-label="소재 ${lane+1} 순서 변경: 위아래로 끌거나 방향키 사용"><span aria-hidden="true">☰</span></button><input class="rail-name" data-track-name="${lane}" value="${esc(tracks[lane]?.name||'소재 '+(lane+1))}" maxlength="120" aria-label="소재 이름"><button class="rail-remove" data-track-remove="${lane}" title="소재 라인 삭제" aria-label="소재 ${lane+1} 삭제">×</button>`;
  const blocks=layout.layers.map((c,i)=>{if(c.lane!==lane)return '';const l=c.layer;if(!l.asset&&l.kind!=='text')return '';
   return `<div class="layer-bar ${l.hidden?'is-hidden':''} ${l.locked?'is-locked':''}" role="button" tabindex="0" aria-label="${esc(l.name||l.asset)} · 조각 ${c.clipIndex+1}" data-clip="${i}" style="left:${x(c.start)}px;width:${(c.end-c.start)*zoom}px"><i data-edge="start" aria-hidden="true"></i><span>${l.locked?'🔒 ':l.kind==='text'?'T ':l.kind==='video'?'▷ ':''}${esc(l.name||l.asset)}</span><em class="bar-actions"><button data-bar-act="dup" data-bar-clip="${i}" title="복제" aria-label="복제">⧉</button><button data-bar-act="fit" data-bar-clip="${i}" title="전체 맞춤" aria-label="전체 맞춤">⇔</button><button data-bar-act="del" data-bar-clip="${i}" title="삭제" aria-label="삭제">×</button></em><i data-edge="end" aria-hidden="true"></i></div>`;}).join('');
  html+=`<div class="track-row material-track" data-lane="${lane}"><span class="timeline-rail">${rail}</span>${blocks||'<p class="track-empty">소재나 블록을 여기로 끌어다 놓으세요.</p>'}</div>`;}
  html+='<div class="track-row add-track-row"><button class="timeline-rail rail-add" data-add-track title="소재 라인을 하나 더 만듭니다">＋ 라인 생성</button></div>';
  if(!layout.layers.length&&!layout.takes.length&&!tracks.length)html+='<p class="timeline-empty">＋ 라인 생성으로 소재 라인을 만들고, 소재를 끌어다 놓으세요.</p>';
  root.innerHTML=html;
  // 시간 눈금을 좌우로 끌면 배율이 바뀐다. 손가락·커서 아래의 시각은 제자리에 붙들어 둔다. 끌지 않고 누르기만 하면 재생 머리가 움직인다.
  root.querySelector('.track-ruler').onpointerdown=e=>{if(h.busy())return;
   const startX=e.clientX,startZoom=zoom,inRail=e.clientX-root.getBoundingClientRect().left<RAIL;
   const view=()=>scroll.getBoundingClientRect().left;
   const anchor=Math.max(0,(startX-view()+scroll.scrollLeft-RAIL)/startZoom);
   let moved=false;e.preventDefault();
   const move=ev=>{const dx=ev.clientX-startX;
    if(!moved&&Math.abs(dx)<5)return;
    moved=true;h.setZoom(clamp(startZoom*Math.pow(1.012,dx),2,160));
    scroll.scrollLeft=Math.max(0,RAIL+anchor*zoom-(startX-view()));};
   const done=ev=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',done);document.removeEventListener('pointercancel',done);
    if(!moved&&!inRail&&ev.type==='pointerup'){h.stop();h.seek(timeAt(ev));render();}};
   document.addEventListener('pointermove',move);document.addEventListener('pointerup',done);document.addEventListener('pointercancel',done);};
  root.querySelector('[data-add-track]').onclick=()=>{if(!h.busy())h.addTrack();};
  // 블록 위의 작은 버튼들은 막대를 끌지 않도록 눌림을 가로챈다.
  root.querySelectorAll('[data-bar-act]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();
   el.onclick=e=>{e.stopPropagation();const c=layout.layers[+el.dataset.barClip];h.stop();h.blockAction(c.clipIndex,c.layer.id,el.dataset.barAct);};});
  root.querySelectorAll('[data-take]').forEach(el=>{const entry=layout.takes.find(t=>t.clip.id===el.dataset.take);dragTake(el,entry);
   el.ondblclick=()=>{if(!h.busy()){h.stop();h.seek(entry.start);}};
   el.onkeydown=e=>{if(e.key==='Delete'){e.preventDefault();h.removeTake(entry.clip.id);}};});
  root.querySelectorAll('[data-track-name]').forEach(el=>{el.onpointerdown=e=>{e.stopPropagation();h.selectLane(+el.dataset.trackName);};el.onchange=()=>h.renameTrack(+el.dataset.trackName,el.value);});
  root.querySelectorAll('[data-track-remove]').forEach(el=>{el.onpointerdown=e=>e.stopPropagation();el.onclick=e=>{e.stopPropagation();h.removeTrack(+el.dataset.trackRemove);};});
  root.querySelectorAll('[data-track-drag]').forEach(el=>{
   const lane=+el.dataset.trackDrag;
   el.onkeydown=e=>{if(!['ArrowUp','ArrowDown'].includes(e.key)||h.busy())return;e.preventDefault();e.stopPropagation();
    const to=lane+(e.key==='ArrowUp'?1:-1);h.reorderTrack(lane,to);root.querySelector(`[data-track-drag="${to}"]`)?.focus();};
   el.onpointerdown=e=>{e.stopPropagation();if(h.busy()||(e.button!=null&&e.button!==0))return;e.preventDefault();
    dragging=true;h.stop();let target=lane;const row=el.closest('[data-lane]');row.classList.add('row-dragging');
    el.setAttribute('aria-pressed','true');try{el.setPointerCapture?.(e.pointerId);}catch{}
    const move=ev=>{const rect=scroll.getBoundingClientRect();if(ev.clientY<rect.top+35)scroll.scrollTop-=14;else if(ev.clientY>rect.bottom-25)scroll.scrollTop+=14;
     const rows=[...root.querySelectorAll('[data-lane]')];rows.forEach(r=>r.classList.remove('row-drop-target'));
     const hit=rows.find(r=>{const box=r.getBoundingClientRect();return ev.clientY>=box.top&&ev.clientY<box.bottom;});
     if(hit){target=+hit.dataset.lane;if(target!==lane)hit.classList.add('row-drop-target');}};
    const done=ev=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);el.removeEventListener('lostpointercapture',done);
     dragging=false;if(ev.type==='pointerup')h.reorderTrack(lane,target);render();root.querySelector(`[data-track-drag="${ev.type==='pointerup'?target:lane}"]`)?.focus();};
    el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);el.addEventListener('lostpointercapture',done);
   };
  });
  root.querySelectorAll('[data-lane]').forEach(el=>{el.onpointerdown=e=>{if(e.target.closest('[data-clip],input,button'))return;h.selectLane(+el.dataset.lane);};});
  // 빈 소재 칸 위에 떨어뜨리면 그 칸이 채워진다.
  root.querySelectorAll('[data-clip]').forEach(el=>{
   el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-hot');});
   el.addEventListener('dragleave',()=>el.classList.remove('drop-hot'));
   el.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();el.classList.remove('drop-hot');
    const key=e.dataTransfer.getData('text/asset');if(key)dropAsset(key,e.clientX,e.clientY,el);});
   el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!h.busy()){const c=layout.layers[+el.dataset.clip];h.stop();h.selectLayer(c.clipIndex,c.layer.id,c.start);}}};
   el.onpointerdown=e=>{if(h.busy())return;const c=layout.layers[+el.dataset.clip];let l=c.layer;dragging=true;h.stop();h.selectLayer(c.clipIndex,l.id,c.start);selected();
    if(l.locked){dragging=false;return;}
    // 갓 넣은 영상은 아직 레이어가 아니라 끌 수 없다. 처음 끌 때 레이어로 바꿔 주고 그대로 이어서 끈다.
    if(l.legacy){const live=h.convertLayer(c.clipIndex);if(!live){dragging=false;return;}l=live;h.selectLayer(c.clipIndex,l.id,c.start);}
    e.preventDefault();h.stamp();try{el.setPointerCapture?.(e.pointerId);}catch{}let targetLane=c.lane;const originTop=el.parentElement.getBoundingClientRect().top;const origin=e.clientX,edge=e.target.dataset.edge,a=c.start,b=c.end;
    const move=ev=>{const delta=(ev.clientX-origin)/zoom,frame=1/h.fps(),snap=t=>Math.round(t/frame)*frame;
     let start=a,end=b;
     if(edge==='start')start=clamp(a+snap(delta),0,b-frame);
     else if(edge==='end')end=Math.max(a+frame,b+snap(delta));
     else{start=Math.max(0,a+snap(delta));end=start+(b-a);}
     h.setLayerSpan(c.clipIndex,l.id,start,end);
     if(!edge){const row=[...root.querySelectorAll('[data-lane]')].find(row=>{const r=row.getBoundingClientRect();return ev.clientY>=r.top&&ev.clientY<r.bottom;});
      if(row){targetLane=+row.dataset.lane;el.style.transform='translateY('+(row.getBoundingClientRect().top-originTop)+'px)';el.style.zIndex='5';}}
     el.style.left=x(start)+'px';el.style.width=(end-start)*zoom+'px';
    };
    const done=()=>{if(!edge)h.moveLayerToLane(c.clipIndex,l.id,targetLane);dragging=false;el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',done);el.removeEventListener('pointercancel',done);h.commit();};el.addEventListener('pointermove',move);el.addEventListener('pointerup',done);el.addEventListener('pointercancel',done);
   };
  });
  for(const el of root.querySelectorAll('[data-lane],[data-drop]')){el.addEventListener('dragover',e=>e.preventDefault());
   el.addEventListener('drop',e=>{e.preventDefault();if(h.busy())return;const at=timeAt(e);
    const take=e.dataTransfer.getData('text/take');
    if(el.dataset.drop==='audio'){if(take){h.stop();h.dropTake(Number(take),at);}return;}
    const key=e.dataTransfer.getData('text/asset');
    if(key)dropAsset(key,e.clientX,e.clientY,el);});}
  playhead(h.time());
 }
 return{render,playhead,hover,dropAsset,fit(){const d=timelineLayout(h.video(),h.audio()).total;return Math.max(2,Math.min(160,((scroll.clientWidth||700)-150)/Math.max(1,d)));}};
}
