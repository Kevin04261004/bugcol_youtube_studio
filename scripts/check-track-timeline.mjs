import assert from 'node:assert/strict';
import {newVideoClip,newAudioClip,trackEnd,totalDuration,clipsAt,videoClipAt,migrateProject,RATE} from '../dist/core.js';

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

// 시간 t 에 걸치는 조각 찾기 (겹치는 구간, 빈 트랙 사이 gap 포함)
assert.deepEqual(clipsAt(video,1).map(c=>c.id),['v1']);
assert.deepEqual(clipsAt(video,4).map(c=>c.id),[],'조각 사이 빈 구간(gap)에는 아무것도 없다');
assert.deepEqual(clipsAt(video,5).map(c=>c.id),['v2']);
assert.deepEqual(clipsAt(video,3).map(c=>c.id),[],'끝 시각은 포함하지 않는다(다음 조각과 안 겹친다)');
const overlap=[newVideoClip({},0,5,'x'),newVideoClip({},2,5,'y')];
assert.deepEqual(clipsAt(overlap,3).map(c=>c.id),['x','y'],'겹치면 둘 다 찾는다');
assert.equal(videoClipAt(overlap,3).id,'y','겹치면 더 나중에 시작한 조각을 화면 앞으로 본다');
assert.equal(videoClipAt(video,4),null,'빈 구간은 null');
assert.equal(videoClipAt([],0),null);

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
// 문장 1: 2초 녹음 → 영상/오디오 조각이 0초에서 시작
assert.equal(migrated.audio[0].start,0);assert.equal(migrated.audio[0].duration,2);assert.equal(migrated.audio[0].sentenceId,1);
assert.equal(migrated.video[0].start,0);assert.equal(migrated.video[0].duration,2);assert.equal(migrated.video[0].scene.title,'하나');
// 문장 2: 녹음 없이 scene.duration=3초 → 2초 뒤에 이어진다
assert.equal(migrated.audio[1].start,2);assert.equal(migrated.audio[1].duration,3);
assert.equal(migrated.video[1].start,2);
// 문장 3: continues=true → 새 영상 조각을 만들지 않고 문장 2의 영상 조각 길이만 늘어난다(예전과 같은 이어가기 동작)
assert.equal(migrated.video.length,2,'이어가는 문장은 영상 조각을 새로 만들지 않는다');
assert.equal(migrated.video[1].duration,4,'이어간 만큼 앞 영상 조각이 늘어난다');
// 오디오는 항상 문장마다 독립 조각 — 이어가기와 무관하게 narration 은 그대로 이어 붙는다
assert.equal(migrated.audio.length,3);
assert.equal(migrated.audio[2].start,5);assert.equal(migrated.audio[2].duration,1);assert.equal(migrated.audio[2].sentenceId,3);
assert.equal(totalDuration(migrated.video,migrated.audio),6,'전체 길이는 예전 순차 재생 길이와 같다');

// version 이 1이 아니면 손대지 않는다(이미 v2, 혹은 형식이 다른 값)
const already={version:2,video:[],audio:[]};
assert.equal(migrateProject(already),already);
assert.equal(migrateProject(null),null);
assert.equal(migrateProject({version:1,sentences:null}).sentences,null);

console.log('PASS independent video/audio track clips, gap/overlap lookup, longer-track total duration, and version:1 scene-per-sentence to version:2 track migration preserving old sequential timing');
