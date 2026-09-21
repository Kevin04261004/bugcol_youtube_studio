import assert from 'node:assert/strict';
import {timelineLayout,locateTime,takesAt,clipLayers} from '../dist/project-timeline.js';
import {newVideoClip,newAudioClip} from '../dist/core.js';
const rounded=value=>JSON.parse(JSON.stringify(value,(_,v)=>typeof v==='number'?Math.round(v*1e9)/1e9:v));

const video=[
 newVideoClip({layers:[{id:'a',start:.2,end:1.2}]},0,2.52,'v1'),
 newVideoClip({layers:[{id:'b',start:.5,end:0},{id:'c',start:1,end:2}]},2.52,4.94,'v2'),
 newVideoClip({layers:[]},7.46,3,'v3'),
];
const audio=[newAudioClip(1,0,2.52,'첫 번째','a1'),newAudioClip(2,3,4,'두 번째','a2')];
const layout=timelineLayout(video,audio);

// 전체 길이는 두 트랙 중 더 긴 쪽
assert.equal(layout.total,10.46);
assert.deepEqual(rounded(layout.clips.map(c=>c.start)),[0,2.52,7.46]);
assert.deepEqual(rounded(layout.takes.map(t=>[t.start,t.end])),[[0,2.52],[3,7]]);

// 레이어는 자기 조각 안에서의 상대 시간 → 타임라인 절대 구간으로 펴진다. end:0 은 조각 끝까지.
assert.deepEqual(rounded(layout.layers.map(c=>[c.lane,c.start,c.end])),[[0,.2,1.2],[0,3.02,7.46],[1,3.52,4.52]]);
assert.equal(layout.lanes,2);

// 조각은 이제 문장이 아니라 절대 위치를 가진다 — 옮기면 레이어도 통째로 따라간다
video[1].start=6;
const moved=timelineLayout(video,audio);
assert.deepEqual(rounded(moved.layers.filter(c=>c.clipIndex===1).map(c=>[c.start,c.end])),[[6.5,10.94],[7,8]]);
assert.equal(rounded(moved.total),10.94,'조각을 뒤로 밀면 전체 길이도 늘어난다');
video[1].start=2.52;

// 절대 시각 → 편집할 조각과 조각 안에서의 시간
assert.equal(locateTime(layout,2.52).index,1);
assert.equal(rounded(locateTime(layout,3.02).local),.5);
assert.equal(locateTime(layout,100).index,2,'끝을 넘어서면 마지막 조각에서 멈춘다');
assert.equal(locateTime(layout,-5).local,0);

// 조각 사이가 비어 있으면 화면에 아무것도 없다(예전에는 문장이 늘 이어져 빈 구간이 없었다)
const gapped=timelineLayout([newVideoClip({},0,2,'g1'),newVideoClip({},5,2,'g2')],[]);
assert.equal(locateTime(gapped,3),null,'빈 구간에는 편집할 조각이 없다');
assert.equal(locateTime(gapped,5).index,1);

// 녹음은 영상과 따로 논다 — 영상 조각 경계와 무관하게 겹치는 녹음을 찾는다
assert.deepEqual(takesAt(layout,3.5).map(c=>c.id),['a2']);
assert.deepEqual(takesAt(layout,2.8).map(c=>c.id),[],'녹음 사이 빈 구간은 무음');
assert.deepEqual(takesAt(layout,1).map(c=>c.id),['a1']);

// 기존 단일 asset 장면은 조각 전체를 덮는 레이어 하나로 읽는다
const legacy=clipLayers(timelineLayout([newVideoClip({asset:'clips/example.mp4'},0,3)],[]).clips[0]);
assert.equal(legacy[0].layer.legacy,true);
assert.deepEqual(rounded(legacy.map(c=>[c.start,c.end])),[[0,3]]);

assert.equal(timelineLayout([],[]).total,0);
assert.equal(locateTime(timelineLayout([],[]),0),null);
console.log('PASS absolute video/narration track layout, clip-relative layer spans, gaps between clips, independent narration lookup and legacy single-asset scenes');
