import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const window=new Window({url:'https://editor.test',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
window.document.write('<div id="host"></div>');
const result=await build({stdin:{contents:"import {createSubtitleStudio} from './dist/subtitle-view.js';window.make=createSubtitleStudio;",resolveDir:process.cwd()},bundle:true,write:false,format:'iife'});
window.eval(result.outputFiles[0].text);
const host=window.document.getElementById('host');
const toasts=[];
const studio=window.make(host,{toast:m=>toasts.push(m)});
const $=id=>host.querySelector('#'+id);
const rows=()=>[...host.querySelectorAll('.cue-row')];

// 영상 없이도 대본만으로 자막 줄이 선다 — 길이를 모르면 한 줄 3초
assert.ok($('subVideo'),'영상 화면이 있다');
assert.equal(rows().length,0);
$('subScriptText').value='첫 줄\n\n둘째 줄\n셋째 줄';
$('subScriptApply').click();
assert.equal(rows().length,3,'빈 줄은 빼고 세 줄이 선다');
assert.deepEqual([...studio.cues().map(c=>[c.start,c.end])],[[0,3],[3,6],[6,9]]);
assert.equal($('subCount').textContent,'3줄');

// 줄마다 시간과 글을 바로 고친다
const second=rows()[1];
second.querySelector('[data-edge="start"]').value='2';
second.querySelector('[data-edge="start"]').dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(studio.cues()[1].start,2,'시작 시간을 고칠 수 있다');
assert.equal(studio.cues()[0].end,2,'앞 자막을 침범하면 앞 자막이 거기서 끊긴다');
const text=rows()[2].querySelector('.cue-text');
text.value='고친 글';text.dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(studio.cues()[2].text,'고친 글');

// 지금 위치에 자막 추가 — 재생 머리 자리에 선다
$('subVideo').currentTime=1;
$('subAdd').click();
assert.ok(studio.cues().some(c=>c.start===1),'재생 위치에 새 자막이 생긴다');
const before=rows().length;
rows()[0].querySelector('[data-drop]').click();
assert.equal(rows().length,before-1,'× 로 한 줄만 지운다');

// 화면 자막은 지금 시각의 줄을 보여 준다
studio.setCues([{start:0,end:1,text:'처음'},{start:1,end:2,text:'다음'}]);
$('subVideo').currentTime=1.5;
$('subVideo').dispatchEvent(new window.Event('timeupdate'));
assert.equal($('subOverlay').textContent,'다음','재생 위치에 맞는 자막이 화면에 뜬다');
$('subVideo').currentTime=5;
$('subVideo').dispatchEvent(new window.Event('timeupdate'));
assert.equal($('subOverlay').hidden,true,'자막이 없는 구간에서는 아무것도 안 보인다');

// 타이밍 찍기 — 누를 때마다 그 시각이 이번 줄의 끝이자 다음 줄의 시작
studio.setCues([{start:0,end:1,text:'가'},{start:1,end:2,text:'나'},{start:2,end:3,text:'다'}]);
$('subVideo').currentTime=0;
$('subStamp').click();
assert.match($('subStamp').textContent,/다음 줄 \(1 \/ 3\)/);
$('subVideo').currentTime=2.5;$('subStamp').click();
$('subVideo').currentTime=4;$('subStamp').click();
assert.deepEqual([...studio.cues().map(c=>[c.start,c.end])].slice(0,2),[[0,2.5],[2.5,4]],'찍은 시각이 그대로 들어간다');
assert.match($('subStamp').textContent,/다음 줄 \(3 \/ 3\)/);
$('subVideo').currentTime=6;$('subStamp').click();
assert.equal($('subStamp').textContent,'타이밍 찍기 시작','마지막 줄까지 찍으면 멈춘다');
assert.equal(studio.cues().at(-1).end,6);

// SRT 는 내려받기 전에 그대로 읽어 볼 수 있다
assert.match(studio.srt(),/^1\n00:00:00,000 --> 00:00:02,500\n가\n/);
assert.match(studio.vtt(),/^WEBVTT/);

// 작업 폴더에 녹음해 둔 대사를 그대로 가져온다
const folder={name:'무한한 도전 1화',lines:['첫 문장','둘째 문장','셋째 문장'],timed:[]};
const host2=window.document.body.appendChild(window.document.createElement('div'));
const studio2=window.make(host2,{toast:m=>toasts.push(m),projectScript:()=>folder});
const at=id=>host2.querySelector('#'+id);

// 대사가 없는 작업 폴더면 알려만 준다
folder.lines=[];folder.timed=[];
at('subFromProject').click();
assert.match(toasts.at(-1),/대사가 없습니다/);
assert.equal(studio2.cues().length,0);

// 대사만 있으면 줄 그대로 가져와 고르게 깐다
folder.lines=['첫 문장','둘째 문장','셋째 문장'];
at('subFromProject').click();
assert.equal(at('subScriptText').value,'첫 문장\n둘째 문장\n셋째 문장','작업 폴더의 대사가 그대로 들어온다');
assert.equal(at('subTakesRow').hidden,true,'녹음 타이밍이 없으면 그 선택지는 숨는다');
at('subScriptApply').click();
assert.deepEqual([...studio2.cues().map(c=>c.text)],['첫 문장','둘째 문장','셋째 문장']);
assert.deepEqual([...studio2.cues().map(c=>[c.start,c.end])],[[0,3],[3,6],[6,9]]);

// 녹음 타이밍이 있으면 그 시각을 그대로 입는다
folder.timed=[{start:0,end:2.5,text:'첫 문장'},{start:4,end:7.25,text:'둘째 문장'},{start:9,end:12,text:'셋째 문장'}];
at('subFromProject').click();
assert.equal(at('subTakesRow').hidden,false,'녹음이 있으면 타이밍 쓰기를 고를 수 있다');
assert.equal(at('subUseTakes').checked,true,'기본은 녹음 타이밍 그대로');
at('subScriptApply').click();
assert.deepEqual([...studio2.cues().map(c=>[c.start,c.end])],[[0,2.5],[4,7.25],[9,12]],'녹음한 시각 그대로 들어온다');

// 줄을 고쳐도 순서만 맞으면 그 자리에 들어가고, 더 적은 줄은 녹음 뒤로 이어 붙는다
at('subFromProject').click();
at('subScriptText').value='고친 첫 줄\n둘째 문장\n셋째 문장\n덧붙인 줄';
at('subScriptApply').click();
assert.equal(studio2.cues()[0].text,'고친 첫 줄');
assert.deepEqual([...studio2.cues()[0]&&studio2.cues().map(c=>[c.start,c.end])],[[0,2.5],[4,7.25],[9,12],[12,15]],'모자란 줄은 녹음이 끝난 뒤로 붙는다');

// 타이밍 쓰기를 끄면 영상 길이에 맞춰 다시 고르게 깐다
at('subFromProject').click();
at('subUseTakes').checked=false;
at('subScriptApply').click();
assert.deepEqual([...studio2.cues().map(c=>[c.start,c.end])],[[0,3],[3,6],[6,9]],'끄면 고르게 나눈다');

// 영상이 아닌 파일은 받지 않는다
studio.loadVideo(new window.File([new Uint8Array(4)],'글.txt',{type:'text/plain'}));
assert.match(toasts.at(-1),/영상을 올려 주세요/);

console.log('PASS subtitle studio: script to cues, inline time and text editing, add and delete, live overlay, tap-along timing, SRT output, and pulling the script of the open work folder with its recorded timings');
await window.happyDOM.abort();
