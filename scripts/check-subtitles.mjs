import assert from 'node:assert/strict';
import {splitScript,layoutCues,normalizeCues,cueAt,srtTime,toSrt,toVtt,parseSrt} from '../dist/subtitles.js';

// 대본 나누기 — 빈 줄과 앞뒤 공백은 버린다
assert.deepEqual(splitScript(' 첫 줄 \n\n둘째 줄\r\n  \n셋째'),['첫 줄','둘째 줄','셋째']);
assert.deepEqual(splitScript(''),[]);

// 영상 길이를 알면 고르게 나눠 놓는다
const three=layoutCues(['하나','둘','셋'],30);
assert.deepEqual([...three.map(c=>[c.start,c.end])],[[0,10],[10,20],[20,30]]);
assert.equal(three[2].text,'셋');
// 길이를 모르면 한 줄 3초로 이어 붙인다
assert.deepEqual([...layoutCues(['하나','둘']).map(c=>[c.start,c.end])],[[0,3],[3,6]]);

// 겹치면 뒤 자막이 시작하는 자리에서 앞 자막을 끊는다
const overlap=normalizeCues([{start:5,end:12,text:'늦게 끝남'},{start:0,end:6,text:'먼저'},{start:10,end:11,text:'끝'}]);
assert.deepEqual([...overlap.map(c=>[c.start,c.end,c.text])],[[0,5,'먼저'],[5,10,'늦게 끝남'],[10,11,'끝']]);
// 빈 글자와 길이가 없는 줄은 버린다
assert.deepEqual(normalizeCues([{start:1,end:1,text:''},{start:2,end:2,text:'  '}]),[]);
// 영상 길이를 넘는 시간은 끝으로 붙든다
assert.deepEqual([...normalizeCues([{start:9,end:99,text:'넘침'}],10).map(c=>[c.start,c.end])],[[9,10]]);
// 끝이 시작보다 앞이면 최소 길이를 준다
assert.ok(normalizeCues([{start:4,end:2,text:'거꾸로'}])[0].end>4);

// 지금 이 순간에 보일 자막 — 끝 시각은 다음 자막의 것이다
const cues=normalizeCues([{start:0,end:2,text:'가'},{start:2,end:4,text:'나'}]);
assert.equal(cueAt(cues,0).text,'가');
assert.equal(cueAt(cues,1.99).text,'가');
assert.equal(cueAt(cues,2).text,'나');
assert.equal(cueAt(cues,4),null);
assert.equal(cueAt([],1),null);

// 시간 표기 — SRT 는 쉼표, VTT 는 점
assert.equal(srtTime(0),'00:00:00,000');
assert.equal(srtTime(3661.5),'01:01:01,500');
assert.equal(srtTime(3661.5,false),'01:01:01.500');
assert.equal(srtTime(-5),'00:00:00,000');
assert.equal(srtTime(1.9999),'00:00:02,000','반올림이 1000ms 로 넘어가도 표기가 깨지지 않는다');

// SRT 만들기
const srt=toSrt([{start:0,end:1.25,text:'첫 줄'},{start:1.25,end:3,text:'둘째\n줄'}]);
assert.equal(srt,'1\n00:00:00,000 --> 00:00:01,250\n첫 줄\n\n2\n00:00:01,250 --> 00:00:03,000\n둘째\n줄\n');
assert.match(toVtt([{start:0,end:1,text:'가'}]),/^WEBVTT\n\n00:00:00\.000 --> 00:00:01\.000\n가\n$/);

// 다시 읽으면 같은 자막이 나온다 — 다른 도구를 거쳐 돌아와도 살아남아야 한다
const back=parseSrt(srt);
assert.deepEqual([...back.map(c=>[c.start,c.end,c.text])],[[0,1.25,'첫 줄'],[1.25,3,'둘째\n줄']]);
// VTT 도 같은 자리에서 읽는다
assert.deepEqual([...parseSrt(toVtt([{start:2,end:4,text:'가나'}])).map(c=>[c.start,c.end,c.text])],[[2,4,'가나']]);
// 분:초 만 있는 표기와 BOM, 번호 없는 파일도 읽는다
assert.deepEqual([...parseSrt('﻿00:01.000 --> 00:02.500\n짧은 표기').map(c=>[c.start,c.end,c.text])],[[1,2.5,'짧은 표기']]);
assert.deepEqual(parseSrt('그냥 글자만 있는 파일'),[]);
assert.deepEqual(parseSrt(''),[]);

console.log('PASS subtitle cues: script splitting, even layout, overlap trimming, current-cue lookup, SRT/VTT writing and reading back');
