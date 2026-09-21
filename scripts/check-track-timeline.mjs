import assert from 'node:assert/strict';
import {newVideoClip,newAudioClip,trackEnd,totalDuration,clipsAt,videoClipAt,locateClip,moveClip,trimClip,migrateProject,MIN_CLIP,RATE} from '../dist/core.js';

// 빈 트랙은 길이 0
assert.equal(trackEnd([]),0);
assert.equal(trackEnd(),0);
const video=[newVideoClip({title:'A'},0,3,'v1'),newVideoClip({title:'B'},5,2,'v2')];
assert.equal(trackEnd(video),7,'마지막 조각의 끝이 트랙 길이다');
const audio=[newAudioClip(1,0,4,'첫 문장','a1'),newAudioClip(2,4,4,'둘째 문장','a2')];
assert.equal(trackEnd(audio),8);

// 전체 영상 길이는 영상/오디오 중 더 긴 쪽 — 소리가 영상보다 길면 끝까지 들려야 한다
assert.equal(totalDuration(video,audio),8,'오디오가 더 길면 오디오 길이를 쓴다');
assert.equal(totalDuration(audio,video),8);
assert.equal(totalDuration([],[]),0);

// 시간 t 에 걸치는 조각 찾기 (겹치는 구간, 조각 사이 빈 구간 포함)
assert.deepEqual(clipsAt(video,1).map(c=>c.id),['v1']);
assert.deepEqual(clipsAt(video,4).map(c=>c.id),[],'조각 사이 빈 구간에는 아무것도 없다');
assert.deepEqual(clipsAt(video,5).map(c=>c.id),['v2']);
assert.deepEqual(clipsAt(video,3).map(c=>c.id),[],'끝 시각은 포함하지 않는다(다음 조각과 안 겹친다)');
const overlap=[newVideoClip({},0,5,'x'),newVideoClip({},2,5,'y')];
assert.deepEqual(clipsAt(overlap,3).map(c=>c.id),['x','y'],'겹치면 둘 다 찾는다');
assert.equal(videoClipAt(overlap,3).id,'y','겹치면 더 나중에 시작한 조각을 화면 앞으로 본다');
assert.equal(videoClipAt(video,4),null,'빈 구간은 null');
assert.equal(videoClipAt([],0),null);

// 절대 시각 → 조각 안에서의 시간(레이어 시간은 조각 기준 상대 시간이다)
assert.deepEqual(locateClip(video,6),{clip:video[1],index:1,local:1});
assert.equal(locateClip(video,4),null,'빈 구간에서는 편집할 조각이 없다');

// 조각 옮기기 — 타임라인 앞으로는 못 넘어간다
assert.equal(moveClip(newVideoClip({},5,2),9).start,9);
assert.equal(moveClip(newVideoClip({},5,2),-3).start,0,'0초보다 앞으로는 못 간다');

// 끝 가장자리 트림: 길이만 바뀐다
const endTrim=trimClip(newVideoClip({},2,4,'t'),'end',4.5);
assert.equal(endTrim.start,2);assert.equal(endTrim.duration,2.5);
assert.equal(trimClip(newVideoClip({},2,4),'end',2).duration,MIN_CLIP,'끝은 시작을 넘어설 수 없다');
assert.equal(trimClip(newVideoClip({},0,4),'end',99,6).duration,6,'limit 보다 길게는 못 늘린다');

// 시작 가장자리 트림: 시작과 길이가 함께 바뀌어 끝은 제자리
const startTrim=trimClip(newVideoClip({},2,4,'t'),'start',3);
assert.equal(startTrim.start,3);assert.equal(startTrim.duration,3,'끝(6초)은 그대로');
assert.ok(Math.abs(trimClip(newVideoClip({},2,4),'start',99).duration-MIN_CLIP)<1e-9,'시작은 끝을 넘어설 수 없다');

// 녹음 조각의 시작을 당기면 쓰는 구간(offset)도 같이 밀려 소리가 제자리에 남는다
const take=newAudioClip(1,2,4,'문장','a',1);
trimClip(take,'start',3);
assert.equal(take.offset,2,'앞을 1초 잘라내면 녹음도 1초 뒤부터 쓴다');
assert.equal(take.start,3);assert.equal(take.duration,3);
const atHead=newAudioClip(1,2,4,'문장','a',0);
trimClip(atHead,'start',1);
assert.deepEqual([atHead.start,atHead.duration,atHead.offset],[2,4,0],'녹음 앞머리보다 더 앞으로는 늘릴 수 없다');

// 옛 문장별 장면(version 1) → 독립 트랙(version 2) 마이그레이션
const old={version:1,name:'옛 작업',assets:{'assets/1_a.png':'blob'},sentences:[
 {id:1,text:'첫 문장',audio:new Float32Array(RATE*2),scene:{title:'하나',asset:'assets/1_a.png',layout:'full'}},
 {id:2,text:'둘째 문장',audio:null,scene:{title:'둘',duration:3}},
 {id:3,text:'셋째 문장 이어감',audio:new Float32Array(RATE*1),scene:{continues:true,title:'둘'}},
]};
const migrated=migrateProject(old);
assert.equal(migrated.version,2);
assert.equal(migrated.name,'옛 작업');
assert.equal(migrated.assets,old.assets,'소재 맵은 그대로 유지된다');
assert.equal(migrated.sentences,old.sentences,'대본과 녹음은 그대로 둔다');
// 문장 1: 2초 녹음 → 영상/녹음 조각이 0초에서 시작
assert.equal(migrated.audio[0].start,0);assert.equal(migrated.audio[0].duration,2);assert.equal(migrated.audio[0].sentenceId,1);
assert.equal(migrated.video[0].start,0);assert.equal(migrated.video[0].duration,2);assert.equal(migrated.video[0].scene.title,'하나');
// 문장 2: 녹음 없이 scene.duration=3초 → 영상은 2초 뒤에 이어지고, 녹음 조각은 생기지 않는다
assert.equal(migrated.video[1].start,2);
assert.equal(migrated.audio.length,2,'녹음이 없는 문장은 오디오 트랙을 차지하지 않는다');
// 문장 3: continues=true → 새 영상 조각 대신 앞 조각이 늘어난다(예전 이어가기와 같은 화면)
assert.equal(migrated.video.length,2,'이어가는 문장은 영상 조각을 새로 만들지 않는다');
assert.equal(migrated.video[1].duration,4,'이어간 만큼 앞 영상 조각이 늘어난다');
assert.equal(migrated.video[1].scene.continues,undefined,'옮긴 뒤에는 이어가기 표시가 필요 없다');
assert.equal(migrated.audio[1].start,5);assert.equal(migrated.audio[1].duration,1);assert.equal(migrated.audio[1].sentenceId,3);
assert.equal(totalDuration(migrated.video,migrated.audio),6,'전체 길이는 예전 순차 재생 길이와 같다');

// version 이 1이 아니면 손대지 않는다(이미 v2, 혹은 형식이 다른 값)
const already={version:2,video:[],audio:[]};
assert.equal(migrateProject(already),already);
assert.equal(migrateProject(null),null);
assert.equal(migrateProject({version:1,sentences:null}).sentences,null);
assert.doesNotThrow(()=>migrateProject({version:1,sentences:[{id:1,text:'장면 없음'}]}),'scene 이 없는 문장도 옮길 수 있다');

console.log('PASS independent video/audio track clips, gap/overlap lookup, clip move and edge trim with narration offset, longer-track total duration, and version:1 scene-per-sentence to version:2 track migration');
