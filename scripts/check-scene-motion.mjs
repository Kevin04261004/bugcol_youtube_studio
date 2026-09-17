import assert from 'node:assert/strict';
import {COVER,easeOut,sceneEntrance,needsScrim,offsetAt} from '../dist/core.js';

// 이미지 위에 제목을 얹는 배치에서만 어둡게 덮는다. 전체 이미지는 원본 밝기 그대로 나간다.
assert.equal(needsScrim('full',true),false,'전체 이미지 배치는 어둡게 덮지 않는다');
assert.equal(needsScrim('title',true),true,'제목이 이미지 위에 얹히면 글자를 위해 덮는다');
assert.equal(needsScrim('split',true),false);
assert.equal(needsScrim('full',false),false);
assert.equal(needsScrim('title',false),false,'이미지가 없으면 덮을 것도 없다');

// 슬라이드는 화면 맨 끝에서 출발해 제자리에서 멈춘다
assert.equal(sceneEntrance('slide',0).shiftX,1280);
assert.equal(sceneEntrance('slide',COVER).shiftX,0);
assert.equal(sceneEntrance('slide',COVER*10).shiftX,0);
assert.equal(sceneEntrance('slide',-5).shiftX,1280,'음수 시간도 시작으로 고정된다');

// 빠르게 출발해 마지막은 천천히 닫힌다
const at=f=>1280-sceneEntrance('slide',COVER*f).shiftX;
assert.ok(at(.25)>1280*.6,'첫 1/4 에 절반 넘게 이동해야 한다');
assert.ok(at(1)-at(.75)<at(.25)-at(0),'마지막 1/4 이동량이 첫 1/4 보다 작아야 한다');
let last=1281;
for(let f=0;f<=1;f+=.05){const x=sceneEntrance('slide',COVER*f).shiftX;assert.ok(x<=last,'되돌아가지 않고 한 방향으로 닫힌다');last=x;}

// 덮는 동안에는 앞 장면을 아래에 깔아 둔다
for(const motion of ['fade','slide','zoom']){
 assert.equal(sceneEntrance(motion,0).covers,true,motion+' 는 시작할 때 앞 장면을 덮는다');
 assert.equal(sceneEntrance(motion,COVER).covers,false,motion+' 는 다 덮은 뒤 앞 장면을 놓는다');
}
assert.equal(sceneEntrance('none',0).covers,false,'움직임 없음은 바로 잘라 붙인다');
assert.deepEqual(sceneEntrance('none',0),{alpha:1,shiftX:0,covers:false});

// 페이드와 줌은 서서히 드러난다
assert.equal(sceneEntrance('fade',0).alpha,0);
assert.equal(sceneEntrance('fade',COVER).alpha,1);
assert.equal(sceneEntrance('zoom',COVER).alpha,1);
let prev=-1;
for(let f=0;f<=1;f+=.05){const a=sceneEntrance('fade',COVER*f).alpha;assert.ok(a>=prev);prev=a;}
assert.equal(sceneEntrance('slide',0).alpha,1,'슬라이드는 투명해지지 않고 밀고 들어온다');

// easeOut 은 0..1 을 벗어나지 않는다
assert.equal(easeOut(0),0);assert.equal(easeOut(1),1);
assert.equal(easeOut(-3),0);assert.equal(easeOut(9),1);
// 타임라인에서 고른 장면이 영상 어디쯤인지
const lens=[2,3.5,1.25,4];
assert.equal(offsetAt(lens,0),0,'첫 장면은 영상 시작점이다');
assert.equal(offsetAt(lens,1),2);
assert.equal(offsetAt(lens,3),6.75);
assert.equal(offsetAt(lens,4),10.75,'마지막 다음은 전체 길이다');
assert.equal(offsetAt(lens,99),10.75,'범위를 넘어도 전체 길이를 넘지 않는다');
assert.equal(offsetAt(lens,-2),0,'음수는 시작점으로 본다');
assert.equal(offsetAt([],0),0);
assert.equal(offsetAt([undefined,2],2),2,'녹음이 없는 문장은 0초로 센다');

console.log('PASS scene scrim only under overlaid text, slide from screen edge with fast start and slow close, previous scene held underneath while covering, timeline position offsets');
