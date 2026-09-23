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

// 소재함은 유니티 프로젝트 창처럼 폴더 나무다 — 폴더를 만들고, 그 안으로 소재를 옮긴다
{
 const rows=()=>[...$('edAssets').querySelectorAll('.tree-row')].map(r=>r.dataset.folder||r.dataset.asset);
 assert.deepEqual(rows(),['media','media/Record','media/loop.gif'],'뿌리 아래에 녹음 폴더와 소재가 달린다');
 assert.ok(read().folders.includes('media/Record'),'녹음을 담을 Record 폴더가 처음부터 있다');
 assert.match($('edAssets').querySelector('[data-folder="media"] .row-label').textContent,/Assets/,'뿌리는 Assets 로 보인다');

 $('edNewFolder').click();
 assert.deepEqual([...read().folders],['media/Record','media/새 폴더'],'폴더가 프로젝트에 남는다');
 assert.deepEqual(rows(),['media','media/Record','media/새 폴더','media/loop.gif'],'만든 폴더가 나무에 보인다');

 // 폴더 이름 바꾸기 — 두 번 눌러 고친다
 const folderRow=$('edAssets').querySelector('[data-folder="media/새 폴더"]');
 folderRow.ondblclick();
 const input=$('edAssets').querySelector('.row-rename');
 assert.ok(input,'이름 칸이 열린다');
 input.value='녹음';input.onblur();
 assert.deepEqual([...read().folders],['media/Record','media/녹음'],'폴더 이름이 바뀐다');

 // 이 소재를 쓰는 블록을 하나 만들어 둔다 — 폴더를 옮겨도 블록이 따라와야 한다
 {const row=$('edTracks').querySelector('[data-lane="0"]'),d=new window.Event('drop',{bubbles:true});
  Object.assign(d,{clientX:400,clientY:100,dataTransfer:{getData:t=>t==='text/asset'?'media/loop.gif':''}});
  row.dispatchEvent(d);await new Promise(r=>setTimeout(r,300));
  assert.ok(read().video.some(c=>(c.scene.layers||[]).some(l=>l.asset==='media/loop.gif')),'블록이 그 소재를 쓴다');}

 // 소재를 폴더 위로 끌어다 놓으면 그 폴더로 옮겨진다
 const target=$('edAssets').querySelector('[data-folder="media/녹음"]');
 const move=new window.Event('drop',{bubbles:true});
 move.dataTransfer={getData:t=>t==='text/asset'?'media/loop.gif':''};
 target.dispatchEvent(move);
 assert.ok(read().assets.includes('media/녹음/loop.gif'),'소재 경로가 폴더 안으로 바뀐다');
 assert.ok(read().video.some(c=>(c.scene.layers||[]).some(l=>l.asset==='media/녹음/loop.gif')),'그 소재를 쓰던 블록도 따라간다');

 // 폴더를 접으면 안의 소재가 사라지고, 비어 있지 않으면 지울 수 없다
 $('edAssets').querySelector('[data-toggle="media/녹음"]').click(new window.Event('click'));
 assert.deepEqual(rows(),['media','media/Record','media/녹음'],'접힌 폴더는 속을 감춘다');
 $('edAssets').querySelector('[data-folder-remove="media/녹음"]').click(new window.Event('click'));
 assert.deepEqual([...read().folders],['media/Record','media/녹음'],'소재가 든 폴더는 지워지지 않는다');
}

// 녹음 파일도 소재함으로 가져와 이미지처럼 끌어다 쓴다 — 단 언제나 녹음 줄로 간다
{
 // happy-dom 에는 오디오 장치가 없어, 길이만 아는 최소한의 해독기를 끼워 둔다.
 const RATE=48000,seconds=2;
 window.AudioContext=class{constructor(){this.state='running';this.currentTime=0;}resume(){}
  async decodeAudioData(){return{duration:seconds,length:RATE*seconds,sampleRate:RATE};}
  createMediaStreamSource(){return{connect(){}};}
  createAnalyser(){return{fftSize:2048,getFloatTimeDomainData(){}};}
  createBuffer(){return{copyToChannel(){}};}
  createBufferSource(){return{buffer:null,connect(){},start(){},stop(){},disconnect(){}};}
  get destination(){return{};}};
 window.OfflineAudioContext=class{constructor(ch,length){this.length=length;}
  createBufferSource(){return{buffer:null,connect(){},start(){}};}get destination(){return{};}
  async startRendering(){const data=new Float32Array(this.length).fill(.25);return{getChannelData:()=>data};}};

 const wav=new Uint8Array(64);
 $('edFiles').files={length:1,0:new window.File([wav],'voice.mp3',{type:'audio/mpeg'}),[Symbol.iterator]:function*(){yield this[0];}};
 $('edFiles').dispatchEvent(new window.Event('change',{bubbles:true}));
 await new Promise(r=>setTimeout(r,300));
 assert.ok(read().assets.includes('media/voice.mp3'),'녹음 파일도 소재함에 들어온다');
 const row=$('edAssets').querySelector('[data-asset="media/voice.mp3"]');
 assert.ok(row,'나무에 줄이 생긴다');
 assert.equal(row.querySelector('img'),null,'그림이 아니라 아이콘으로 보인다');
 assert.equal(row.querySelector('.row-icon').textContent,'♫');

 // 소재 줄 위에 놓아도 화면 레이어가 되지 않고 녹음 줄에 올라간다
 const takesBefore=read().audio.length,layersBefore=read().video.flatMap(c=>c.scene.layers||[]).length;
 const lane=$('edTracks').querySelector('[data-lane="0"]'),drop=new window.Event('drop',{bubbles:true});
 Object.assign(drop,{clientX:420,clientY:100,dataTransfer:{getData:t=>t==='text/asset'?'media/voice.mp3':''}});
 lane.dispatchEvent(drop);
 await new Promise(r=>setTimeout(r,400));
 assert.equal(read().video.flatMap(c=>c.scene.layers||[]).length,layersBefore,'녹음은 화면 블록이 되지 않는다');
 assert.equal(read().audio.length,takesBefore+1,'녹음 줄에 한 조각이 올라간다');
 const take=read().audio.at(-1);
 assert.ok(Math.abs(take.duration-seconds)<.01,'녹음 길이만큼 자리를 차지한다');
 assert.ok(take.start>0,'놓은 자리에서 시작한다');
 assert.match(read().sentences.at(-1).text,/voice/,'파일 이름이 대사가 된다');
}

// 녹음하면 내 소재의 Record 폴더에 파일로도 남는다
{
 window.MediaRecorder=class{static isTypeSupported(){return true;}
  constructor(){this.mimeType='audio/webm';}
  start(){this.ondataavailable?.({data:new window.Blob([new Uint8Array(16)])});}
  stop(){this.onstop?.();}};
 window.navigator.mediaDevices={getUserMedia:async()=>({getTracks:()=>[]})};

 assert.ok(read().sentences.length,'녹음할 문장이 있다');
 const before=read().assets.filter(k=>k.startsWith('media/Record/')).length;
 $('recordBtn').click();
 await new Promise(r=>setTimeout(r,200));
 $('recordBtn').click();
 await new Promise(r=>setTimeout(r,400));
 const kept=read().assets.filter(k=>k.startsWith('media/Record/'));
 assert.equal(kept.length,before+1,'녹음 한 번에 파일 하나가 Record 폴더에 남는다');
 assert.match(kept.at(-1),/^media\/Record\/녹음 \d+\.wav$/,'번호를 붙인 WAV 로 담긴다');
 assert.ok($('edAssets').querySelector(`[data-asset="${kept.at(-1)}"]`),'소재함 나무에도 보인다');

 // 다시 녹음하면 덮어쓰지 않고 다음 번호로 쌓인다
 $('recordBtn').click();await new Promise(r=>setTimeout(r,200));
 $('recordBtn').click();await new Promise(r=>setTimeout(r,400));
 assert.equal(read().assets.filter(k=>k.startsWith('media/Record/')).length,before+2,'녹음마다 새 파일이 쌓인다');
}

// 상자 끝끼리 0.05초 안으로 가까워지면 딱 붙는다
{
 const {timelineLayout}=await import('../dist/project-timeline.js');
 const spans=()=>timelineLayout(read().video,read().audio).layers;
 const barFor=id=>{const map=timelineLayout(read().video,read().audio);
  return $('edTracks').querySelector(`[data-clip="${map.layers.findIndex(c=>c.layer.id===id)}"]`);};
 const gesture=(target,deltas)=>{const down=new window.Event('pointerdown',{bubbles:true});Object.assign(down,{clientX:400,pointerId:9});target.dispatchEvent(down);
  const bar=target.closest('.layer-bar');
  for(const d of deltas){const move=new window.Event('pointermove',{bubbles:true});Object.assign(move,{clientX:400+d,pointerId:9});bar.dispatchEvent(move);}
  const up=new window.Event('pointerup',{bubbles:true});Object.assign(up,{pointerId:9});bar.dispatchEvent(up);};

 $('edNewScene').click();$('edAddText').click();$('edAddText').click();
 const clip=read().video.at(-1),[first,second]=clip.scene.layers;
 const fixed=()=>spans().find(c=>c.layer.id===first.id),moving=()=>spans().find(c=>c.layer.id===second.id);
 const wall=fixed().end;
 // 3초 + 0.03초 만큼 오른쪽으로 민다. 프레임 격자로는 딱 떨어지지 않는 자리다.
 gesture(barFor(second.id),[Math.round((wall+.03-moving().start)*64)]);
 assert.equal(moving().start,wall,'앞 상자의 끝에 딱 붙는다');
 assert.ok(Math.abs(moving().end-moving().start-(fixed().end-fixed().start))<1e-9,'붙어도 길이는 그대로다');

 // 0.05초보다 멀면 붙지 않고 그 자리에 선다
 const away=moving().start;
 gesture(barFor(second.id),[Math.round(.4*64)]);
 assert.ok(moving().start>away+.3,'멀리 끌면 끌린 자리에 그대로 남는다');
 assert.notEqual(moving().start,wall);

 // 가장자리를 끌 때도 붙는다 — 시작 가장자리를 앞 상자 끝 가까이로
 gesture(barFor(second.id).querySelector('[data-edge="start"]'),[Math.round((wall+.02-moving().start)*64)]);
 assert.equal(moving().start,wall,'가장자리도 0.05초 안이면 딱 붙는다');
}

// 자막은 늘 켜져 있다 — 끄는 스위치가 없다
{
 assert.equal(window.document.getElementById('edCaptionsAll'),null,'자막 스위치는 없앴다');
 assert.equal(window.document.getElementById('edCaptions'),null,'조각별 자막 체크도 없다');
 assert.equal(window.document.getElementById('sceneCaptions'),null,'옛 인스펙터의 자막 체크도 없다');
 assert.equal(read().captions,true,'자막은 기본으로 켜져 있다');

 // 자막을 꺼 둔 옛 프로젝트를 열어도 켜진 채로 돌아온다
 const saved=read();
 const zip=zipSync({'project.json':strToU8(JSON.stringify({version:2,name:'자막 테스트',captions:false,
  sentences:saved.sentences.map(x=>({id:x.id,text:x.text,audio:null})),
  video:saved.video.map(c=>({id:'v'+c.slot,start:c.start,duration:c.duration,scene:c.scene})),audio:[]}))});
 await $('projectInput').onchange({target:{files:[{arrayBuffer:async()=>zip.buffer}],value:''}});
 assert.equal(read().captions,true,'꺼 둔 옛 설정이 와도 자막은 켜진다');
}

console.log('PASS preview gaps, GIF import, persistent empty material rows, row rename/removal, cross-row block drag, undo/redo, deletion and reload, clip growth, always-on captions, the Unity-style asset folder tree audio materials that always land on the narration track, recordings kept as WAVs in the Record folder, and 0.05s edge magnets between boxes');

await window.happyDOM.abort();
