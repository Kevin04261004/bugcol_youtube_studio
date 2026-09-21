import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {zipSync,strToU8} from 'fflate';
const window=new Window({url:'https://example.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
window.document.write(fs.readFileSync('dist/index.html','utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
window.HTMLCanvasElement.prototype.getContext=()=>new Proxy({measureText:t=>({width:t.length*12})},{get:(o,k)=>o[k]||(()=>{})});
window.confirm=()=>true;
window.structuredClone=structuredClone;
const registered=new Map();window.document.modelContext={registerTool:async tool=>registered.set(tool.name,tool)};
const errors=[];window.addEventListener('error',e=>errors.push(e.message));
window.fetch=async()=>new window.Response(JSON.stringify({user:null}),{status:200,headers:{'Content-Type':'application/json'}});
const result=await build({entryPoints:['dist/app.js'],bundle:true,write:false,format:'esm'});
window.eval('(async()=>{'+result.outputFiles[0].text+'})()');
await new Promise(r=>setTimeout(r,100));

const $=id=>window.document.getElementById(id),read=()=>registered.get('get_longform_project').execute();
assert.ok($('frameRate'),'프레임레이트 선택이 내보내기 화면에 있다');
assert.equal($('frameRate').value,'30');$('frameRate').value='60';assert.equal($('frameRate').value,'60');
$('pasteText').value='첫 장면입니다. 문장부호는 유지합니다.\n두 번째 장면';$('applyText').click();
assert.equal(read().sentences.length,2,'대본은 문장만 만든다');
assert.equal(read().video.length,0,'대본은 영상 트랙을 건드리지 않는다');

// 영상 조각을 두 개 올리고 각각 따로 편집한다
$('edNewScene').click();$('edNewScene').click();
assert.equal(read().video.length,2);
assert.equal(read().video[0].scene.captions,false,'빈 조각은 자막을 끄고 시작한다');
$('edTracks').querySelector('[data-shot="0"]').click();
$('edAddText').click();assert.equal(read().video[0].scene.layers.length,1);
$('edText').value='편집 테스트';$('edText').dispatchEvent(new window.Event('change'));
$('prop_x').value='300';$('prop_x').dispatchEvent(new window.Event('change'));
assert.equal(read().video[0].scene.layers[0].x,300);
$('edAddKey').click();$('edScrub').value='1';$('edScrub').dispatchEvent(new window.Event('input'));
$('prop_x').value='700';$('prop_x').dispatchEvent(new window.Event('change'));
assert.equal(read().video[0].scene.layers[0].keyframes.length,2);
assert.equal(read().video[0].scene.layers[0].keyframes[1].x,700);
$('edDuplicate').click();assert.equal(read().video[0].scene.layers.length,2);
$('edUndo').click();assert.equal(read().video[0].scene.layers.length,1);
$('edRedo').click();assert.equal(read().video[0].scene.layers.length,2);

// 트랙은 절대 시각으로 놓인다 — 두 번째 조각은 첫 조각 3초 뒤
assert.equal($('edTracks').querySelectorAll('[data-shot]').length,2,'영상 조각이 각각 트랙에 보인다');
assert.equal($('edTracks').querySelectorAll('[data-clip]').length,2,'조각 안 소재도 트랙에 펼쳐진다');
assert.equal($('edTracks').querySelector('[data-shot="1"]').style.left,'322px','두 번째 조각은 3초 자리(130+3×64)에서 시작한다');
assert.equal($('edTracks').querySelectorAll('[data-take]').length,0,'녹음이 없으면 녹음 트랙은 비어 있다');

// 프로젝트 ZIP 왕복 — 트랙이 그대로 살아 돌아온다
const before=read(),manifest={version:2,name:'복원 테스트',sentences:before.sentences.map(s=>({id:s.id,text:s.text,audio:null})),
 video:before.video.map(c=>({id:'v'+c.slot,start:c.start,duration:c.duration,scene:c.scene})),audio:[]};
const bytes=zipSync({'project.json':strToU8(JSON.stringify(manifest))});
await $('projectInput').onchange({target:{files:[{arrayBuffer:async()=>bytes.buffer}],value:''}});
assert.equal(JSON.stringify(read().video.map(c=>c.scene.layers)),JSON.stringify(before.video.map(c=>c.scene.layers)),'레이어가 그대로 복원된다');
assert.deepEqual([...read().video.map(c=>c.start)],[0,3],'조각 위치도 그대로다');
assert.equal($('renderMp4').disabled,false,'녹음 없이 출력할 수 있다');

// 전체 재생 위치를 옮기면 그 시각을 덮는 조각이 선택된다
$('edScrub').value='4';$('edScrub').dispatchEvent(new window.Event('input'));
assert.match($('edSceneName').textContent,/조각 2/,'전체 재생 위치로 다음 조각을 고른다');
assert.match($('edClock').textContent,/00:04.00 \/ 00:06.00/);
$('edAddText').click();
assert.equal($('edTracks').querySelectorAll('[data-clip]').length,3,'다른 조각을 골라도 앞 조각의 소재는 남아 보인다');
$('edBeginning').click();assert.match($('edSceneName').textContent,/조각 1/);

// 조각 길이는 조각마다 따로 — 녹음이 없어도 공유 시계를 따라 경계를 넘는다
window.AudioContext=class {constructor(){this.state='running';this.started=Date.now();}get currentTime(){return(Date.now()-this.started)/1000;}createBuffer(){return{copyToChannel(){}};}createBufferSource(){return{buffer:null,connect(){},start(){},stop(){},disconnect(){}};}get destination(){return{};}};
$('edDuration').value='.1';$('edDuration').dispatchEvent(new window.Event('change'));
assert.equal(read().video[0].duration,.1);
assert.equal(read().video[1].start,3,'앞 조각을 줄여도 뒤 조각은 제자리에 남는다');
$('edTracks').querySelector('[data-shot="1"]').click();
$('edDuration').value='.1';$('edDuration').dispatchEvent(new window.Event('change'));
$('edEarlier').click();
assert.deepEqual([...read().video.map(c=>c.start)],[0,3],'순서 바꾸기는 두 조각의 자리를 맞바꾼다');

// 예전 문장별 장면 프로젝트(version 1)를 열면 트랙으로 옮겨진다
const legacy={version:1,name:'예전 작업',sentences:[
 {id:1,text:'첫 문장',audio:null,scene:{title:'하나',background:'#112233',duration:2}},
 {id:2,text:'둘째 문장',audio:null,scene:{title:'둘',duration:3}},
 {id:3,text:'이어가는 문장',audio:null,scene:{continues:true,title:'둘',duration:1}},
]};
await $('projectInput').onchange({target:{files:[{arrayBuffer:async()=>zipSync({'project.json':strToU8(JSON.stringify(legacy))}).buffer}],value:''}});
assert.equal(read().sentences.length,3,'대사는 그대로 살아 있다');
assert.equal(read().video.length,2,'이어가던 문장은 앞 조각에 흡수된다');
assert.deepEqual([...read().video.map(c=>c.start)],[0,2],'예전 순서대로 이어 붙는다');
assert.deepEqual([...read().video.map(c=>c.duration)],[2,4],'이어간 만큼 앞 조각이 길어진다');
assert.equal(read().video[0].scene.title,'하나');
assert.equal(read().video[0].scene.background,'#112233','장면 설정이 보존된다');
assert.equal(read().video[1].scene.continues,undefined,'옮긴 뒤에는 이어가기 표시가 남지 않는다');
assert.equal(read().audio.length,0,'녹음이 없던 문장은 녹음 트랙을 차지하지 않는다');
assert.equal(read().totalSeconds,6,'전체 길이는 예전 순차 재생 길이와 같다');

assert.deepEqual(errors,[]);
console.log('PASS clip-scoped layer edits, two keyframes, duplicate, undo/redo, absolute track placement, v2 project ZIP round trip, per-clip duration and version:1 project migration on open');
await window.happyDOM.abort();
