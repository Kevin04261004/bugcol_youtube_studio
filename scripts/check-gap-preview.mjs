import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gifBytes,decodeGif} from '../dist/gif.js';
import {zipSync,strToU8} from 'fflate';
const window=new Window({url:'https://example.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
window.document.write(fs.readFileSync('dist/index.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
// 캔버스에 실제로 칠해진 배경색을 받아 적는다. 어느 조각이 그려졌는지는 이걸로만 알 수 있다.
const painted=[];
window.HTMLCanvasElement.prototype.getContext=function(){const self=this;
 return new Proxy({measureText:t=>({width:t.length*12}),fillRect(x,y,w,h){if(w>=1280&&h>=720)painted.push({canvas:self.id,fill:this.fillStyle});
   if(w===1170)painted.push({canvas:self.id,caption:true});}},
  {get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});};
window.confirm=()=>true;
window.structuredClone=structuredClone;
// happy-dom 의 ImageData 는 픽셀 배열을 받지 못해, GIF 프레임을 올릴 최소한의 그릇만 둔다.
window.ImageData=class{constructor(data,width,height){this.data=data;this.width=width;this.height=height;}};
const registered=new Map();window.document.modelContext={registerTool:async t=>registered.set(t.name,t)};
const errors=[];window.addEventListener('error',e=>errors.push(e.message));
window.fetch=async()=>new window.Response(JSON.stringify({user:null}),{status:200,headers:{'Content-Type':'application/json'}});
const result=await build({entryPoints:['dist/app.js'],bundle:true,write:false,format:'esm'});
window.eval('(async()=>{'+result.outputFiles[0].text+'})()');
await new Promise(r=>setTimeout(r,120));
const $=id=>window.document.getElementById(id),read=()=>registered.get('get_longform_project').execute();
const settle=()=>new Promise(r=>setTimeout(r,40));
const addTrack=()=>$('edTracks').querySelector('[data-add-track]').click();
const lastPreviewFill=()=>[...painted].reverse().find(p=>p.canvas==='preview')?.fill;

// 조각 둘을 올리고 배경색을 다르게 해 어느 쪽이 그려지는지 구분할 수 있게 한다
$('edNewScene').click();$('edNewScene').click();
await settle();
const paint=(i,bg)=>{window.document.querySelectorAll('#timeline .timeline-card')[i].click();
 const el=$('sceneColor');el.value=bg;el.dispatchEvent(new window.Event('input',{bubbles:true}));};
paint(0,'#aa0000');paint(1,'#0000bb');
await settle();
assert.deepEqual([...read().video.map(c=>c.start)],[0,3]);
assert.equal(read().video[0].scene.background,'#aa0000');
assert.equal(read().video[1].scene.background,'#0000bb');

// 두 번째 조각을 골랐으면 두 번째 조각이 그려져야 한다.
// (예전에는 조각 안에서의 시간을 타임라인 절대 시각으로 착각해 늘 첫 조각이 나왔다)
window.document.querySelectorAll('#timeline .timeline-card')[1].click();
await settle();
assert.match($('edSceneName').textContent,/조각 2/);
assert.equal(lastPreviewFill(),'#0000bb','고른 조각의 배경이 그려진다');
window.document.querySelectorAll('#timeline .timeline-card')[0].click();
await settle();
assert.equal(lastPreviewFill(),'#aa0000','첫 조각을 고르면 첫 조각이 그려진다');

// 첫 조각을 1초로 줄여 1~3초를 비운다. 두 번째 조각은 3초 자리에 그대로 남는다.
const shrink=(i,seconds)=>{window.document.querySelectorAll('#timeline .timeline-card')[i].click();
 $('edDuration').value=String(seconds);$('edDuration').dispatchEvent(new window.Event('change',{bubbles:true}));};
shrink(0,1);await settle();
shrink(1,1);await settle();
assert.deepEqual([...read().video.map(c=>[c.start,c.duration])],[[0,1],[3,1]],'조각 둘이 0~1초, 3~4초를 쓰고 1~3초가 빈다');
assert.equal(read().totalSeconds,4);
painted.length=0;
$('edScrub').value='2';$('edScrub').dispatchEvent(new window.Event('input',{bubbles:true}));
await settle();
assert.match($('edClock').textContent,/^00:02\.00/,'빈 구간으로도 재생 머리가 움직인다');
assert.notEqual(lastPreviewFill(),'#aa0000','빈 구간에서 앞 조각이 계속 보이면 안 된다');
assert.notEqual(lastPreviewFill(),'#0000bb','빈 구간에서 뒤 조각이 미리 보여도 안 된다');
assert.equal(lastPreviewFill(),'#ffffff','빈 구간은 흰 배경으로 그린다');

// 빈 구간을 지나 다음 조각에 닿으면 다시 그 조각이 나온다
$('edScrub').value='3.5';$('edScrub').dispatchEvent(new window.Event('input',{bubbles:true}));
await settle();
assert.equal(lastPreviewFill(),'#0000bb','빈 구간을 지나면 다음 조각이 나온다');
assert.match($('edSceneName').textContent,/조각 2/,'그 조각이 선택된다');

// 움직이는 GIF 를 소재로 가져오면 타임라인 위치에 맞는 프레임이 나온다
const solid=c=>{const a=new Uint8ClampedArray(8*8*4);
 for(let i=0;i<8*8;i++){a[i*4]=c[0];a[i*4+1]=c[1];a[i*4+2]=c[2];a[i*4+3]=255;}return a;};
const clip3=gifBytes([{rgba:solid([220,20,20]),delay:1},{rgba:solid([20,200,20]),delay:1}],{width:8,height:8});
$('edFiles').files={length:1,0:new window.File([clip3],'loop.gif',{type:'image/gif'}),[Symbol.iterator]:function*(){yield this[0];}};
$('edFiles').dispatchEvent(new window.Event('change',{bubbles:true}));
await new Promise(r=>setTimeout(r,300));
assert.equal(window.document.querySelectorAll('#edAssets .asset-card').length,1,'GIF 도 소재로 받아들인다');
assert.match(window.document.querySelector('#edAssets .asset-card span').textContent,/loop\.gif/);
assert.ok(window.document.querySelector('#edAssets .gif-tag'),'움직이는 그림임을 표시한다');
// 파일 형식 검사가 GIF 를 막지 않는지 (막혔다면 소재가 0개였을 것)
const decoded=decodeGif(clip3);
assert.equal(decoded.frames.length,2);
assert.equal(decoded.duration,2);


// Empty rows have no placeholder blocks, persist after deletion, and accept block transfers.
{
 const before=read().video[1].scene.layers?.length||0;
 addTrack();
 assert.equal(read().video[1].scene.layers.length,before);
 assert.equal(read().video[1].scene.materialTracks.length,1);
 assert.equal($('edTracks').querySelectorAll('.layer-bar').length,0);
 const row=$('edTracks').querySelector('[data-lane="0"]');
 const drop=new window.Event('drop',{bubbles:true});
 Object.assign(drop,{clientX:400,clientY:100,dataTransfer:{getData:t=>t==='text/asset'?'media/loop.gif':''}});
 row.dispatchEvent(drop);await new Promise(r=>setTimeout(r,300));
 assert.equal(read().video[1].scene.layers[0].asset,'media/loop.gif');
 assert.equal(read().video[1].scene.layers[0].lane,0);
 addTrack();
 assert.equal(read().video[1].scene.materialTracks.length,2);
 assert.equal(read().video[1].scene.layers.length,1);
 let rail=$('edTracks').querySelector('[data-track-name="1"]');
 rail.value='배경 그림';rail.dispatchEvent(new window.Event('change'));
 assert.equal(read().video[1].scene.materialTracks[1].name,'배경 그림');
 const dragTo=(bar,lane)=>{
  $('edTracks').querySelectorAll('[data-lane]').forEach(row=>{const n=+row.dataset.lane;row.getBoundingClientRect=()=>({top:n*60,bottom:n*60+60});});
  for(const [type,y]of [['pointerdown',10],['pointermove',lane*60+10],['pointerup',lane*60+10]]){
   const e=new window.Event(type,{bubbles:true});Object.assign(e,{clientX:400,clientY:y,pointerId:1});bar.dispatchEvent(e);
  }
 };
 const original=structuredClone(read().video[1].scene.layers[0]);
 dragTo($('edTracks').querySelector('.layer-bar'),1);
 let scene=read().video[1].scene;
 assert.equal(scene.layers[0].lane,1);
 assert.equal(scene.layers[0].id,original.id);
 assert.equal(scene.layers[0].asset,original.asset);
 assert.ok(Math.abs(scene.layers[0].start-original.start)<1/30);
 assert.equal(scene.materialTracks.length,2,'source row survives transfer');
 $('edUndo').click();assert.equal(read().video[1].scene.layers[0].lane,0);
 $('edRedo').click();assert.equal(read().video[1].scene.layers[0].lane,1);
 // Select after undo/redo and delete only the block.
 let bar=$('edTracks').querySelector('.layer-bar');
 const select=new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true});bar.dispatchEvent(select);
 $('edDelete').click();
 assert.equal(read().video[1].scene.layers.length,0);
 assert.equal(read().video[1].scene.materialTracks.length,2);
 assert.equal($('edTracks').querySelectorAll('[data-lane]').length,2);
 // Project validation (used by ZIP reload) preserves empty rows and names.
 const {validScene}=await import('../dist/core.js');
 const restored=validScene({id:1,...JSON.parse(JSON.stringify(read().video[1].scene))});
 assert.equal(restored.materialTracks[1].name,'배경 그림');
 assert.equal(restored.layers.length,0);
 $('edTracks').querySelectorAll('[data-lane]').forEach(row=>{const n=+row.dataset.lane;row.getBoundingClientRect=()=>({top:n*60,bottom:n*60+60});});
 const grip=$('edTracks').querySelector('[data-track-drag="1"]');
 for(const [type,y]of [['pointerdown',70],['pointermove',10],['pointerup',10]]){const e=new window.Event(type,{bubbles:true});Object.assign(e,{clientX:12,clientY:y,pointerId:2});grip.dispatchEvent(e);}
 assert.equal(read().video[1].scene.materialTracks[0].name,'배경 그림');
 $('edTracks').querySelector('[data-track-remove="0"]').click();
 assert.equal(read().video[1].scene.materialTracks.length,1,'explicit row removal still works');
}

assert.deepEqual(errors,[]);

// 소재 막대를 끌어 자유롭게 옮길 수 있어야 한다.
// 조각을 꽉 채운 소재는 조각 안에 여유가 0이라 예전에는 1px도 움직이지 않았다.
{
 const drag=(el,from,to)=>{
  const down=new window.Event('pointerdown',{bubbles:true});
  Object.assign(down,{clientX:from,pointerId:1});
  el.dispatchEvent(down);
  const move=new window.Event('pointermove',{bubbles:true});
  Object.assign(move,{clientX:to,pointerId:1});
  el.dispatchEvent(move);
  const up=new window.Event('pointerup',{bubbles:true});
  Object.assign(up,{clientX:to,pointerId:1});
  el.dispatchEvent(up);
 };
 $('edNewScene').click();
 const slot=read().video.length-1;
 {const at=read().video[slot].start;$('edScrub').value=String(at);$('edScrub').dispatchEvent(new window.Event('input',{bubbles:true}));}
 $('edAddText').click();
 $('edFill').click();
 const filled=read().video[slot];
 assert.equal(filled.scene.layers[0].start,0);
 assert.equal(filled.scene.layers[0].end,0,'조각 전체를 채운 상태 — 안에 여유가 없다');
 const bar=[...$('edTracks').querySelectorAll('.layer-bar')].at(-1);
 assert.ok(bar,'소재 막대가 그려진다');
 drag(bar,0,128); // 2초(zoom 64) 오른쪽으로
 const moved=read().video[slot];
 assert.equal(moved.scene.layers[0].start,2,'소재가 실제로 옮겨진다');
 assert.equal(moved.scene.layers[0].end,5,'길이는 그대로 유지된다');
 assert.equal(moved.duration,5,'조각이 늘어나 옮긴 소재를 계속 품는다');
}


// Regression: growing then shrinking A must never alter B; B can move before its old container start.
{
 const {timelineLayout}=await import('../dist/project-timeline.js');
 const barFor=id=>{const state=read(),map=timelineLayout(state.video,state.audio);return $('edTracks').querySelector(`[data-clip="${map.layers.findIndex(c=>c.layer.id===id)}"]`);};
 const gesture=(target,deltas)=>{const down=new window.Event('pointerdown',{bubbles:true});Object.assign(down,{clientX:400,pointerId:3});target.dispatchEvent(down);
  const bar=target.closest('.layer-bar');for(const delta of deltas){const move=new window.Event('pointermove',{bubbles:true});Object.assign(move,{clientX:400+delta,pointerId:3});bar.dispatchEvent(move);}
  const up=new window.Event('pointerup',{bubbles:true});Object.assign(up,{pointerId:3});bar.dispatchEvent(up);};
 $('edNewScene').click();$('edAddText').click();const ai=read().video.length-1,aid=read().video[ai].scene.layers[0].id;
 $('edNewScene').click();$('edAddText').click();$('edAddText').click();
 const bi=read().video.length-1,before=structuredClone(read().video[bi]),bid=before.scene.layers[0].id,sibling=before.scene.layers[1].id;
 gesture(barFor(aid).querySelector('[data-edge="end"]'),[320,64]);
 assert.deepEqual(structuredClone(read().video[bi]),before,'A resize gesture must not shift or shorten B');
 gesture(barFor(aid).querySelector('[data-edge="end"]'),[-64]);
 assert.deepEqual(structuredClone(read().video[bi]),before,'shrinking A later must also leave B intact');
 const spans=()=>timelineLayout(read().video,read().audio).layers;
 const siblingBefore=spans().find(c=>c.layer.id===sibling);
 gesture(barFor(bid),[-128]);
 let moved=spans().find(c=>c.layer.id===bid),untouched=spans().find(c=>c.layer.id===sibling);
 assert.equal(moved.start,before.start-2,'B can move left across its former container boundary');
 assert.equal(moved.end-moved.start,3,'moving preserves B duration');
 assert.equal(untouched.start,siblingBefore.start);assert.equal(untouched.end,siblingBefore.end,'implicit full-span sibling must not grow');
 $('edUndo').click();assert.equal(spans().find(c=>c.layer.id===bid).start,before.start);
 $('edRedo').click();assert.equal(spans().find(c=>c.layer.id===bid).start,before.start-2);
}

// 자막은 조각마다가 아니라 프로젝트 전체 스위치 하나로 켜고 끈다
{
 const capBtn=$('edCaptionsAll');
 assert.ok(capBtn,'타임라인 도구에 전체 자막 스위치가 있다');
 assert.equal(window.document.getElementById('edCaptions'),null,'조각별 자막 체크는 없어졌다');
 assert.equal(window.document.getElementById('sceneCaptions'),null,'옛 인스펙터의 자막 체크도 없어졌다');
 assert.equal(read().captions,true,'처음에는 켜져 있다');
 assert.match(capBtn.textContent,/켜짐/);
 assert.equal(capBtn.getAttribute('aria-pressed'),'true');

 capBtn.click();
 assert.equal(read().captions,false,'한 번 누르면 영상 전체에서 꺼진다');
 assert.match($('edCaptionsAll').textContent,/꺼짐/);
 assert.equal($('edCaptionsAll').getAttribute('aria-pressed'),'false');

 // 조각을 새로 만들어도 그 조각만 따로 켜지거나 꺼지지 않는다
 $('edNewScene').click();
 assert.equal(read().captions,false,'새 조각을 만들어도 전체 설정 그대로다');
 assert.ok(read().video.every(c=>c.scene.captions===undefined),'조각에는 자막 설정이 남지 않는다');

 // 껐다 켠 상태가 프로젝트 ZIP 으로 오갈 때 그대로 남는다
 const saved=read();
 const zip=zipSync({'project.json':strToU8(JSON.stringify({version:2,name:'자막 테스트',captions:false,
  sentences:saved.sentences.map(x=>({id:x.id,text:x.text,audio:null})),
  video:saved.video.map(c=>({id:'v'+c.slot,start:c.start,duration:c.duration,scene:c.scene})),audio:[]}))});
 await $('projectInput').onchange({target:{files:[{arrayBuffer:async()=>zip.buffer}],value:''}});
 assert.equal(read().captions,false,'꺼 둔 설정이 ZIP 에서 돌아와도 유지된다');
 assert.match($('edCaptionsAll').textContent,/꺼짐/);

 $('edCaptionsAll').click();
 assert.equal(read().captions,true,'다시 누르면 켜진다');
}

console.log('PASS preview gaps, GIF import, persistent empty material rows, row rename/removal, cross-row block drag, undo/redo, deletion and reload, clip growth and captions');

await window.happyDOM.abort();
