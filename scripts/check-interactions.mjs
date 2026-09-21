import {Window} from 'happy-dom';
import {build} from 'esbuild';
import fs from 'node:fs';
import assert from 'node:assert/strict';
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
const $$=id=>window.document.getElementById(id);
const read=()=>registered.get('get_longform_project').execute();
const cards=()=>[...window.document.querySelectorAll('#timeline .timeline-card')];

// 대본은 문장만 만든다 — 영상 트랙은 대본과 따로 논다
$$('sampleBtn').click();
await new Promise(r=>setTimeout(r,50));
assert.ok(window.document.querySelectorAll('.sentence-item').length>=3,'샘플이 문장을 만든다');
assert.equal(read().video.length,0,'대본만으로는 영상 조각이 생기지 않는다');
assert.equal(read().audio.length,0,'녹음하기 전에는 녹음 트랙도 비어 있다');
assert.match($$('timeline').textContent,/영상 조각을 타임라인에 올리면/,'빈 영상 트랙은 무엇을 해야 할지 알려준다');

window.document.querySelector('[data-tab="scenes"]').click();
assert.equal($$('scenesView').hidden,false);

// 빈 조각을 올리면 트랙 맨 뒤에 차례로 붙는다
$$('edNewScene').click();$$('edNewScene').click();$$('edNewScene').click();
assert.equal(read().video.length,3);
assert.deepEqual([...read().video.map(c=>c.start)],[0,3,6],'새 조각은 트랙 맨 뒤에 이어 붙는다');
assert.deepEqual([...read().video.map(c=>c.duration)],[3,3,3]);
assert.equal(read().totalSeconds,9,'전체 길이는 트랙 끝까지다');
assert.equal(cards().length,3,'조각마다 카드가 그려진다');

// 조각을 고르면 검수가 끝나고, 속성은 그 조각에 붙는다
assert.ok(!read().video[2].scene.reviewed,'처음에는 검수 전이다');
cards()[2].click();
assert.equal(read().video[2].scene.reviewed,true,'타임라인 클릭만으로 검수가 끝난다');
assert.ok(cards()[2].className.includes('selected'),'고른 조각으로 이동한다');
assert.match(cards()[2].textContent,/검수 완료/);
assert.equal($$('sceneReviewed').checked,true,'검수 체크도 함께 켜진다');
assert.match($$('clipPlace').textContent,/00:06/,'고른 조각이 타임라인 어디에 있는지 보여 준다');
cards()[0].click();
assert.equal(read().video[2].scene.reviewed,true,'다른 조각을 눌러도 앞서 끝낸 검수는 남는다');
assert.equal(read().video[0].scene.reviewed,true);
assert.match($$('previewTime').textContent,/^\d\d:\d\d \/ \d\d:\d\d$/,'미리보기 시간이 고른 자리를 가리킨다');
assert.match($$('exportChecklist').textContent,/영상 트랙3조각/);
assert.match($$('exportChecklist').textContent,/장면 검수2 \/ 3 완료/,'고른 두 조각이 검수된다');

// 속성 편집은 고른 조각에만 적용되고, 고친 조각은 다시 검수 대상이 된다
$$('sceneTitle').value='첫 조각';$$('sceneTitle').dispatchEvent(new window.Event('input',{bubbles:true}));
assert.equal(read().video[0].scene.title,'첫 조각');
assert.equal(read().video[1].scene.title,'','옆 조각은 그대로다');
assert.equal(read().video[0].scene.reviewed,false,'고치면 검수가 풀린다');
assert.equal($$('sceneTitle').disabled,false,'이어가기가 사라져 늘 편집할 수 있다');
assert.equal(window.document.getElementById('sceneContinue'),null,'앞 장면 이어가기 개념은 없어졌다');
assert.match($$('exportChecklist').textContent,/장면 검수1 \/ 3 완료/);

// 조각 길이는 녹음이 아니라 조각마다 따로 정한다
$$('edDuration').value='1.5';$$('edDuration').dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(read().video[0].duration,1.5,'조각 길이를 직접 줄일 수 있다');
assert.equal(read().video[1].start,3,'앞 조각을 줄여도 뒤 조각은 제자리 — 빈 구간이 생긴다');

// 에이전트 도구는 문장 번호가 아니라 트랙 위 조각 순서를 가리킨다
const edit=registered.get('update_longform_scenes');assert.ok(edit);
edit.execute({scenes:[{id:2,title:'검사 조각'}]});
assert.equal(read().video[1].scene.title,'검사 조각');
assert.throws(()=>edit.execute({scenes:[{id:999,title:'실패'}]}),/clip slot/);

// 문장을 지워도 영상 트랙은 그대로 — 둘은 묶여 있지 않다
const dels=()=>[...window.document.querySelectorAll('#sentenceList .sentence-del')];
const before=[...read().sentences.map(s=>s.id)];
assert.ok(before.length>=4);
dels()[1].click();
assert.deepEqual([...read().sentences.map(s=>s.id)],[...before].filter((_,i)=>i!==1),'고른 문장만 사라진다');
assert.equal(read().video.length,3,'문장을 지워도 영상 조각은 남는다');

// 조각 내리기는 영상 트랙에서만 일어난다
const sentencesLeft=read().sentences.length;
$$('edDeleteScene').click();
assert.equal(read().video.length,2,'조각을 트랙에서 내린다');
assert.equal(read().sentences.length,sentencesLeft,'문장과 녹음은 그대로다');

while(dels().length)dels()[0].click();
assert.equal(read().sentences.length,0,'문장이 모두 사라진다');
assert.equal(read().video.length,2,'그래도 영상 트랙은 살아 있다');
assert.match($$('sentenceList').textContent,/첫 번째 이야기를 가져오세요/);

$$('goExport').click();
assert.equal($$('exportView').hidden,false);
assert.equal($$('renderMp4').disabled,false,'영상 조각만 있어도 내보낼 수 있다');

assert.deepEqual(errors,[]);
console.log('PASS sample script leaves tracks empty, clips append to the video track, clip selection reviews and binds the inspector, per-clip duration, slot-addressed agent tools, and sentence deletes that leave the video track alone');
await window.happyDOM.abort();
