import {validateLayers} from './editor-engine.js';
export const RATE=48000;
export function splitSentences(text){return text.replace(/^\uFEFF/,'').split(/\n+/).flatMap(line=>{line=line.trim();if(!line)return[];if(globalThis.Intl?.Segmenter)return [...new Intl.Segmenter('ko',{granularity:'sentence'}).segment(line)].map(s=>s.segment.trim()).filter(Boolean);return line.match(/[^.!?]+[.!?]+[”’"']*|[^.!?]+$/g)?.map(s=>s.trim()).filter(Boolean)||[];});}
export function joinAudio(a,b){const c=new Float32Array(a.length+b.length);c.set(a);c.set(b,a.length);return c;}
export function editAudio(data,start,end,keep=false){const a=Math.max(0,Math.min(data.length,Math.round(start*RATE))),b=Math.max(a,Math.min(data.length,Math.round(end*RATE)));if(b<=a)throw Error('수정할 구간을 먼저 선택하세요.');const out=keep?data.slice(a,b):joinAudio(data.slice(0,a),data.slice(b));if(!out.length)throw Error('전체 녹음을 삭제할 수 없습니다. 다시 녹음을 사용하세요.');if(!keep){const edge=Math.min(240,a,out.length-a);for(let i=0;i<edge;i++){out[a-edge+i]*=1-i/edge;out[a+i]*=i/edge;}}return out;}
export function trimAudio(data){const block=480,threshold=.008;let a=0,b=data.length;const rms=(s,e)=>{let sum=0;for(let i=s;i<e;i++)sum+=data[i]*data[i];return Math.sqrt(sum/(e-s));};while(a+block<b&&rms(a,a+block)<threshold)a+=block;while(b-block>a&&rms(b-block,b)<threshold)b-=block;if(b-a<=block)throw Error('음성이 감지되지 않아 원본을 유지했습니다.');return data.slice(Math.max(0,a-4800),Math.min(data.length,b+4800));}
export function wavBytes(data){const bytes=new Uint8Array(44+data.length*2),v=new DataView(bytes.buffer);const str=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};str(0,'RIFF');v.setUint32(4,36+data.length*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,RATE,true);v.setUint32(28,RATE*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,data.length*2,true);for(let i=0;i<data.length;i++){const s=Math.max(-1,Math.min(1,data[i]));v.setInt16(44+i*2,s<0?s*32768:s*32767,true);}return bytes;}
export const pad=n=>String(n).padStart(3,'0');
export function validScene(s){if(!s||!Number.isInteger(Number(s.id))||Number(s.id)<1)throw Error('장면 id는 1 이상의 문장 번호여야 합니다.');const out={id:Number(s.id)};for(const key of ['title','subtitle','asset']){if(s[key]!=null){if(typeof s[key]!=='string'||s[key].length>10000)throw Error('장면 텍스트 형식이 올바르지 않습니다.');out[key]=s[key];}}if(s.asset&&(/(^|\/)\.\.?(\/|$)|^\/|:|\\/.test(s.asset)))throw Error('장면 소재는 ZIP 내부의 상대 경로여야 합니다.');if(s.background!=null){if(!/^#[0-9a-f]{6}$/i.test(s.background))throw Error('배경색은 #171925 형식이어야 합니다.');out.background=s.background;}for(const [k,vals]of Object.entries({layout:['title','split','full'],motion:['none','fade','zoom','slide']})){if(s[k]!=null){if(!vals.includes(s[k]))throw Error('지원하지 않는 장면 '+k);out[k]=s[k];}}for(const k of ['clipStart','clipEnd']){if(s[k]!=null){const n=Number(s[k]);if(!Number.isFinite(n)||n<0||n>86400)throw Error('장면 '+k+' 는 0 이상 86400 이하의 초여야 합니다.');if(n>0)out[k]=n;}}if(out.clipEnd!=null&&out.clipEnd<=(out.clipStart||0))throw Error('장면 clipEnd 는 clipStart 보다 뒤여야 합니다.');if(s.captions!=null)out.captions=!!s.captions;if(s.continues)out.continues=true;if(s.layers!=null)out.layers=validateLayers(s.layers);if(s.duration!=null)out.duration=Math.max(.1,Math.min(600,Number(s.duration)||3));return out;}

// Keep one PCM clock and one packet sequence across every sentence boundary.
export function* audioPackets(clips, packetSize=1024){
  let data=new Float32Array(packetSize),used=0,offset=0;
  for(const clip of clips){
    let pos=0;
    while(pos<clip.length){
      const n=Math.min(packetSize-used,clip.length-pos);
      data.set(clip.subarray(pos,pos+n),used);used+=n;pos+=n;
      if(used===packetSize){
        yield {data,timestamp:Math.round(offset*1e6/RATE)};
        offset+=used;used=0;data=new Float32Array(packetSize);
      }
    }
  }
  if(used)yield {data:data.slice(0,used),timestamp:Math.round(offset*1e6/RATE)};
}
export function planAudioImports(files,sentences=[],selectedId=null,script=[]){
 const known=new Set(sentences.map(s=>s.id)),used=new Set();
 return files.map((file,index)=>{const base=file.name.split('/').pop(),match=base.match(/^(\d+)(?:[_. -]|$)/);let id=match?Number(match[1]):sentences.length?(files.length===1?selectedId:null):index+1;
 if(!id||!Number.isInteger(id)||id<1)throw Error('여러 음성 파일은 001.wav, 002.mp3처럼 문장 번호로 이름을 지정하세요.');
 if(used.has(id))throw Error('같은 문장 번호의 음성 파일이 여러 개입니다: '+id);used.add(id);
 if(sentences.length&&!known.has(id))throw Error('대본에 없는 문장 번호입니다: '+id);
 const text=script.find(s=>s.id===id)?.text||base.replace(/\.[^.]+$/,'');return {file,id,text};
 });
}
export const COVER=.65;
export const easeOut=(p,power=3)=>1-Math.pow(1-Math.min(1,Math.max(0,p)),power);
export function sceneEntrance(motion,t,cover=COVER){const p=Math.min(1,Math.max(0,t)/cover);
 if(motion==='none')return{alpha:1,shiftX:0,covers:false};
 if(motion==='slide')return{alpha:1,shiftX:(1-easeOut(p,4))*1280,covers:p<1};
 return{alpha:easeOut(p),shiftX:0,covers:p<1};}
export const needsScrim=(layout,hasMedia)=>!!hasMedia&&layout==='title';
export const offsetAt=(durations,index)=>durations.slice(0,Math.max(0,index)).reduce((a,n)=>a+(n||0),0);
// 장면이 영상 소재의 어느 구간을 쓰는지. clipEnd 가 없으면 소재 끝까지 쓴다.
export function clipRange(scene,mediaDuration=0){const start=Math.max(0,Number(scene?.clipStart)||0);const raw=Number(scene?.clipEnd)||0,tail=Math.max(start,Number(mediaDuration)||0);const end=raw>start?(tail>start?Math.min(raw,tail):raw):tail;return{start,end,span:Math.max(0,end-start)};}
// 장면 시간 t 일 때 영상 소재에서 읽을 위치. 구간이 짧으면 마지막 화면에서 멈춘다.
export function clipTimeAt(scene,t,mediaDuration=0){const {start,span}=clipRange(scene,mediaDuration);return start+Math.min(Math.max(0,Number(t)||0),Math.max(0,span-1/60));}
// 잘라 낸 조각을 어떤 크기로 인코딩할지. H.264 는 짝수 크기를 요구한다.
export function clipOutputSize(width,height,maxWidth=1280){const sw=Math.max(2,Math.round(Number(width)||0)),sh=Math.max(2,Math.round(Number(height)||0));
 const cap=Math.max(2,Math.round(Number(maxWidth)||1280)),scale=Math.min(1,cap/sw),even=n=>Math.max(2,Math.round(n/2)*2);
 return{width:even(sw*scale),height:even(sh*scale)};}
export function safeClipName(name,fallback='조각'){const clean=String(name??'').replace(/[^\p{L}\p{N} _-]/gu,' ').replace(/\s+/g,' ').trim().slice(0,60);return clean||fallback;}
export function uniqueAssetKey(existingKeys,name,prefix='clips/',ext='.mp4'){const taken=new Set(existingKeys||[]),base=prefix+name;
 let key=base+ext;for(let n=2;taken.has(key);n++)key=base+'-'+n+ext;return key;}
// 조각을 인코딩할 코덱 후보. 조각은 최종 렌더링에서 다시 인코딩되므로 H.264 가 아니어도 된다.
export const CLIP_CODECS=[{codec:'avc1.420028',muxer:'avc',extra:{avc:{format:'avc'}},label:'H.264'},{codec:'vp09.00.10.08',muxer:'vp9',extra:{},label:'VP9'},{codec:'av01.0.04M.08',muxer:'av1',extra:{},label:'AV1'}];
export async function pickClipCodec(base,isSupported){for(const option of CLIP_CODECS){
 try{const result=await isSupported({...base,...option.extra,codec:option.codec});if(result?.supported)return option;}catch{}
}return null;}
// 이어가기로 묶인 장면 계산. 각 문장이 어느 장면을 쓰고, 그 장면이 시작한 지 얼마나 됐는지.
export function sceneGroups(items){const list=(items||[]).map(it=>({continues:!!it?.continues,seconds:Math.max(0,Number(it?.seconds)||0)}));
 const out=list.map(()=>({baseIndex:0,offset:0,span:0}));let base=0,offset=0;
 list.forEach((it,i)=>{if(i===0||!it.continues){base=i;offset=0;}out[i].baseIndex=base;out[i].offset=offset;offset+=it.seconds;});
 const spans=new Map();list.forEach((it,i)=>spans.set(out[i].baseIndex,(spans.get(out[i].baseIndex)||0)+it.seconds));
 out.forEach(o=>{o.span=spans.get(o.baseIndex)||0;});return out;}
// 어느 장면도 쓰지 않는 소재. 잘라 둔 조각(clips/)은 보관함이라 남긴다.
export function unusedAssetKeys(keys,used,keep='clips/'){const live=new Set((used||[]).filter(Boolean));
 return (keys||[]).filter(k=>!String(k).startsWith(keep)&&!live.has(k));}

// ── 독립 트랙(영상/오디오) 타임라인 ──────────────────────────────────
// 문장에 묶이지 않는 영상 트랙 조각. scene 은 기존 title/layout/motion/layers 등 화면 구성을 그대로 담는다.
export function newVideoClip(scene,start=0,duration=3,id){return{id:id||uid(),start:Math.max(0,Number(start)||0),duration:Math.max(.05,Number(duration)||3),scene};}
// 문장 녹음이 얹히는 오디오 트랙 조각. sentenceId 로 대본/자막과 연결된다.
export function newAudioClip(sentenceId,start=0,duration=0,text='',id){return{id:id||uid(),sentenceId,start:Math.max(0,Number(start)||0),duration:Math.max(0,Number(duration)||0),text:String(text||'')};}
export const uid=()=>globalThis.crypto?.randomUUID?.()||'clip-'+Date.now()+'-'+Math.random().toString(36).slice(2);
// 트랙 전체 길이. 빈 트랙은 0.
export function trackEnd(clips){return (clips||[]).reduce((max,c)=>Math.max(max,(Number(c.start)||0)+(Number(c.duration)||0)),0);}
// 영상+오디오 트랙을 합친 전체 영상 길이. 영상이 내레이션보다 짧아도 소리는 끝까지 들려야 하므로 둘 중 긴 쪽을 쓴다.
export function totalDuration(video,audio){return Math.max(trackEnd(video),trackEnd(audio));}
// 시각 t 를 덮는 조각들(시작 순). 겹치면 나중 것이 위, 즉 배열의 뒤가 화면 앞이라고 본다.
export function clipsAt(clips,t){const time=Math.max(0,Number(t)||0);return (clips||[]).filter(c=>time>=c.start&&time<c.start+c.duration);}
// 영상 트랙에서 t 시점에 보여줄 조각 하나(겹치면 가장 나중에 시작한 것).
export function videoClipAt(clips,t){const hits=clipsAt(clips,t);return hits.length?hits.reduce((a,b)=>b.start>=a.start?b:a):null;}
// 옛 문장별 장면(version:1)을 독립 영상/오디오 트랙(version:2)으로 옮긴다.
// 순서대로 이어 붙여 예전과 똑같이 재생되는 위치에 두고, 그 뒤로는 자유롭게 옮기고 자를 수 있다.
export function migrateProject(project){
 if(!project||project.version!==1||!Array.isArray(project.sentences))return project;
 const video=[],audio=[];let offset=0;
 for(const s of project.sentences){
  const seconds=s?.audio?.length?s.audio.length/RATE:Math.max(.1,Number(s?.scene?.duration)||3);
  if(!s.scene.continues||!video.length)video.push(newVideoClip(s.scene,offset,seconds,'v'+s.id));
  else video.at(-1).duration+=seconds;
  audio.push(newAudioClip(s.id,offset,seconds,s.text,'a'+s.id));
  offset+=seconds;
 }
 return{...project,version:2,video,audio};
}

