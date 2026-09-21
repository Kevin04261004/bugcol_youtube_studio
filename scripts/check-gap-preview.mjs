import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {gifBytes,decodeGif} from '../dist/gif.js';
const window=new Window({url:'https://example.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
window.document.write(fs.readFileSync('dist/index.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
// 캔버스에 실제로 칠해진 배경색을 받아 적는다. 어느 조각이 그려졌는지는 이걸로만 알 수 있다.
const painted=[];
window.HTMLCanvasElement.prototype.getContext=function(){const self=this;
 return new Proxy({measureText:t=>({width:t.length*12}),fillRect(x,y,w,h){if(w>=1280&&h>=720)painted.push({canvas:self.id,fill:this.fillStyle});}},
  {get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>{o[k]=v;return true;}});};
window.confirm=()=>true;
window.structuredClone=structuredClone;
const registered=new Map();window.document.modelContext={registerTool:async t=>registered.set(t.name,t)};
const errors=[];window.addEventListener('error',e=>errors.push(e.message));
window.fetch=async()=>new window.Response(JSON.stringify({user:null}),{status:200,headers:{'Content-Type':'application/json'}});
const result=await build({entryPoints:['dist/app.js'],bundle:true,write:false,format:'esm'});
window.eval('(async()=>{'+result.outputFiles[0].text+'})()');
await new Promise(r=>setTimeout(r,120));
const $=id=>window.document.getElementById(id),read=()=>registered.get('get_longform_project').execute();
const settle=()=>new Promise(r=>setTimeout(r,40));
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
assert.equal(lastPreviewFill(),'#171925','빈 구간은 빈 배경으로 그린다');

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

assert.deepEqual(errors,[]);
console.log('PASS preview paints the selected clip at its own timeline position, and gaps between clips render empty instead of holding the previous clip, and animated GIFs import as material');
await window.happyDOM.abort();
