import assert from 'node:assert/strict';
import {COVER,easeOut,sceneEntrance,needsScrim,offsetAt,clipRange,clipTimeAt,validScene,clipOutputSize,safeClipName,uniqueAssetKey,CLIP_CODECS,pickClipCodec} from '../dist/core.js';

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

// 영상 소재에서 쓸 구간
assert.deepEqual(clipRange({},10),{start:0,end:10,span:10},'구간을 안 정하면 영상 전체를 쓴다');
assert.deepEqual(clipRange({clipStart:3},10),{start:3,end:10,span:7},'시작만 정하면 끝까지 쓴다');
assert.deepEqual(clipRange({clipStart:3,clipEnd:8},10),{start:3,end:8,span:5});
assert.deepEqual(clipRange({clipStart:3,clipEnd:20},10),{start:3,end:10,span:7},'영상 길이를 넘는 끝은 잘린다');
assert.deepEqual(clipRange({clipStart:3,clipEnd:8},0),{start:3,end:8,span:5},'길이를 아직 모르면 정한 끝을 믿는다');
assert.deepEqual(clipRange({clipStart:-5},10),{start:0,end:10,span:10},'음수 시작은 0 으로 본다');

assert.equal(clipTimeAt({},0,10),0);
assert.equal(clipTimeAt({clipStart:3,clipEnd:8},0,10),3,'장면이 시작하면 구간 시작을 읽는다');
assert.equal(clipTimeAt({clipStart:3,clipEnd:8},2,10),5);
assert.ok(Math.abs(clipTimeAt({clipStart:3,clipEnd:8},99,10)-(8-1/60))<1e-9,'구간보다 길면 마지막 화면에서 멈춘다');
assert.ok(clipTimeAt({clipStart:3,clipEnd:8},99,10)<8,'구간 끝을 넘어가지 않는다');
assert.equal(clipTimeAt({clipStart:3,clipEnd:8},-1,10),3);

// 프로젝트 ZIP 과 scenes.json 으로 구간이 오간다
assert.equal(validScene({id:1,clipStart:2.5,clipEnd:7}).clipStart,2.5);
assert.equal(validScene({id:1,clipStart:2.5,clipEnd:7}).clipEnd,7);
assert.equal(validScene({id:1,clipStart:0,clipEnd:0}).clipStart,undefined,'0 은 전체 사용이라 저장하지 않는다');
assert.throws(()=>validScene({id:1,clipStart:5,clipEnd:5}),/clipStart 보다 뒤/);
assert.throws(()=>validScene({id:1,clipStart:5,clipEnd:2}),/clipStart 보다 뒤/);
assert.throws(()=>validScene({id:1,clipStart:-1}),/0 이상/);
assert.throws(()=>validScene({id:1,clipEnd:'abc'}),/0 이상/);
assert.throws(()=>validScene({id:1,clipStart:90000}),/86400/);

// 잘라 낸 조각을 인코딩할 크기 (H.264 는 짝수만 받는다)
assert.deepEqual(clipOutputSize(1920,1080,1280),{width:1280,height:720});
assert.deepEqual(clipOutputSize(3840,2160,1920),{width:1920,height:1080});
assert.deepEqual(clipOutputSize(640,360,1280),{width:640,height:360},'원본이 작으면 키우지 않는다');
assert.deepEqual(clipOutputSize(1080,1920,1280),{width:1080,height:1920},'세로 영상도 그대로 담는다');
for(const [w,h] of [[1001,563],[999,777],[1,1],[1279,721]]){
 const out=clipOutputSize(w,h,1280);
 assert.equal(out.width%2,0,w+'x'+h+' 가로가 짝수여야 한다');
 assert.equal(out.height%2,0,w+'x'+h+' 세로가 짝수여야 한다');
 assert.ok(out.width>=2&&out.height>=2);
}
assert.deepEqual(clipOutputSize(0,0,1280),{width:2,height:2},'크기를 모르면 최소값으로 떨어진다');

// 조각 이름은 장면 소재 경로로 쓰이므로 경로 문자가 남으면 안 된다
assert.equal(safeClipName('도입부 항공샷'),'도입부 항공샷');
assert.equal(safeClipName('도입부/항공샷'),'도입부 항공샷');
assert.equal(safeClipName('a:b\\c../d'),'a b c d');
assert.equal(safeClipName('   '),'조각','빈 이름은 기본값을 쓴다');
assert.equal(safeClipName(null),'조각');
assert.equal(safeClipName('가'.repeat(200)).length,60,'이름 길이를 제한한다');
for(const bad of ['../../etc','a/b','c:d','e\\f']){
 assert.ok(!/[/\\:]|\.\./.test(safeClipName(bad)),bad+' 에서 경로 문자가 남았다');
 assert.doesNotThrow(()=>validScene({id:1,asset:'clips/'+safeClipName(bad)+'.mp4'}));
}

// 같은 이름으로 여러 번 잘라도 서로 덮어쓰지 않는다
assert.equal(uniqueAssetKey([],'도입부'),'clips/도입부.mp4');
assert.equal(uniqueAssetKey(['clips/도입부.mp4'],'도입부'),'clips/도입부-2.mp4');
assert.equal(uniqueAssetKey(['clips/도입부.mp4','clips/도입부-2.mp4'],'도입부'),'clips/도입부-3.mp4');
assert.equal(uniqueAssetKey(['assets/1_a.png'],'도입부'),'clips/도입부.mp4','다른 소재와는 겹치지 않는다');

// 되는 코덱을 찾아 자른다. 조각은 최종 렌더링에서 다시 인코딩되므로 H.264 가 아니어도 된다.
assert.equal(CLIP_CODECS[0].muxer,'avc','H.264 를 가장 먼저 시도한다');
const asked=[];
const only=set=>async c=>{asked.push(c.codec);return{supported:set.includes(c.codec)};};
asked.length=0;
assert.equal((await pickClipCodec({width:640},only(['avc1.420028','vp09.00.10.08']))).muxer,'avc');
assert.deepEqual(asked,['avc1.420028'],'첫 코덱이 되면 더 묻지 않는다');
asked.length=0;
assert.equal((await pickClipCodec({width:640},only(['vp09.00.10.08']))).muxer,'vp9','H.264 가 없으면 VP9 로 넘어간다');
assert.equal(asked.length,2);
assert.equal((await pickClipCodec({width:640},only(['av01.0.04M.08']))).muxer,'av1');
assert.equal(await pickClipCodec({width:640},only([])),null,'아무것도 없으면 null 로 알린다');
assert.equal(await pickClipCodec({width:640},async()=>{throw Error('지원 확인 실패');}),null,'확인 자체가 터져도 null 을 준다');
assert.equal((await pickClipCodec({width:640},async c=>{if(c.codec==='avc1.420028')throw Error('nope');return{supported:true};})).muxer,'vp9','터진 코덱은 건너뛴다');
for(const option of CLIP_CODECS)assert.ok(['avc','hevc','vp9','av1'].includes(option.muxer),option.muxer+' 는 muxer 가 받는 이름이어야 한다');

console.log('PASS scene scrim only under overlaid text, slide from screen edge with fast start and slow close, previous scene held underneath while covering, timeline position offsets, video clip range, cut clip sizing, naming and codec fallback');
