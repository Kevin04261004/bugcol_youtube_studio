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

// 영상이 아닌 파일은 받지 않는다
studio.loadVideo(new window.File([new Uint8Array(4)],'글.txt',{type:'text/plain'}));
assert.match(toasts.at(-1),/영상을 올려 주세요/);

console.log('PASS subtitle studio: script to cues, inline time and text editing, add and delete, live overlay, tap-along timing and SRT output');
await window.happyDOM.abort();
