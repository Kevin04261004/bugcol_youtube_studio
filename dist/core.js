import {validateLayers} from './editor-engine.js';
export const RATE=48000;
export function splitSentences(text){return text.replace(/^\uFEFF/,'').split(/\n+/).flatMap(line=>{line=line.trim();if(!line)return[];if(globalThis.Intl?.Segmenter)return [...new Intl.Segmenter('ko',{granularity:'sentence'}).segment(line)].map(s=>s.segment.trim()).filter(Boolean);return line.match(/[^.!?]+[.!?]+[”’"']*|[^.!?]+$/g)?.map(s=>s.trim()).filter(Boolean)||[];});}
export function joinAudio(a,b){const c=new Float32Array(a.length+b.length);c.set(a);c.set(b,a.length);return c;}
export function editAudio(data,start,end,keep=false){const a=Math.max(0,Math.min(data.length,Math.round(start*RATE))),b=Math.max(a,Math.min(data.length,Math.round(end*RATE)));if(b<=a)throw Error('수정할 구간을 먼저 선택하세요.');const out=keep?data.slice(a,b):joinAudio(data.slice(0,a),data.slice(b));if(!out.length)throw Error('전체 녹음을 삭제할 수 없습니다. 다시 녹음을 사용하세요.');if(!keep){const edge=Math.min(240,a,out.length-a);for(let i=0;i<edge;i++){out[a-edge+i]*=1-i/edge;out[a+i]*=i/edge;}}return out;}
export function trimAudio(data){const block=480,threshold=.008;let a=0,b=data.length;const rms=(s,e)=>{let sum=0;for(let i=s;i<e;i++)sum+=data[i]*data[i];return Math.sqrt(sum/(e-s));};while(a+block<b&&rms(a,a+block)<threshold)a+=block;while(b-block>a&&rms(b-block,b)<threshold)b-=block;if(b-a<=block)throw Error('음성이 감지되지 않아 원본을 유지했습니다.');return data.slice(Math.max(0,a-4800),Math.min(data.length,b+4800));}
export function wavBytes(data){const bytes=new Uint8Array(44+data.length*2),v=new DataView(bytes.buffer);const str=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};str(0,'RIFF');v.setUint32(4,36+data.length*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,RATE,true);v.setUint32(28,RATE*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,data.length*2,true);for(let i=0;i<data.length;i++){const s=Math.max(-1,Math.min(1,data[i]));v.setInt16(44+i*2,s<0?s*32768:s*32767,true);}return bytes;}
export const pad=n=>String(n).padStart(3,'0');
export function validScene(s){if(!s||!Number.isInteger(Number(s.id))||Number(s.id)<1)throw Error('장면 id는 1 이상의 문장 번호여야 합니다.');const out={id:Number(s.id)};for(const key of ['title','subtitle','asset']){if(s[key]!=null){if(typeof s[key]!=='string'||s[key].length>10000)throw Error('장면 텍스트 형식이 올바르지 않습니다.');out[key]=s[key];}}if(s.asset&&(/(^|\/)\.\.?(\/|$)|^\/|:|\\/.test(s.asset)))throw Error('장면 소재는 ZIP 내부의 상대 경로여야 합니다.');if(s.background!=null){if(!/^#[0-9a-f]{6}$/i.test(s.background))throw Error('배경색은 #171925 형식이어야 합니다.');out.background=s.background;}for(const [k,vals]of Object.entries({layout:['title','split','full'],motion:['none','fade','zoom','slide']})){if(s[k]!=null){if(!vals.includes(s[k]))throw Error('지원하지 않는 장면 '+k);out[k]=s[k];}}for(const k of ['clipStart','clipEnd']){if(s[k]!=null){const n=Number(s[k]);if(!Number.isFinite(n)||n<0||n>86400)throw Error('장면 '+k+' 는 0 이상 86400 이하의 초여야 합니다.');if(n>0)out[k]=n;}}if(out.clipEnd!=null&&out.clipEnd<=(out.clipStart||0))throw Error('장면 clipEnd 는 clipStart 보다 뒤여야 합니다.');if(s.captions!=null)out.captions=!!s.captions;if(s.layers!=null)out.layers=validateLayers(s.layers);if(s.duration!=null)out.duration=Math.max(.1,Math.min(600,Number(s.duration)||3));return out;}

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
// 어느 장면도 쓰지 않는 소재. 잘라 둔 조각(clips/)은 보관함이라 남긴다.
export function unusedAssetKeys(keys,used,keep='clips/'){const live=new Set((used||[]).filter(Boolean));
 return (keys||[]).filter(k=>!String(k).startsWith(keep)&&!live.has(k));}

// ── 독립 트랙(영상/오디오) 타임라인 ──────────────────────────────────
export const uid=()=>globalThis.crypto?.randomUUID?.()||'clip-'+Date.now()+'-'+Math.random().toString(36).slice(2);
export const MIN_CLIP=.05;
// 영상 트랙 조각. 문장이 아니라 타임라인 위 절대 시각에 놓인다.
// scene 은 기존 화면 구성(layers/asset/layout/motion…)을 그대로 담고, 레이어 시간은 이 조각 안에서의 상대 시간이다.
export function newVideoClip(scene,start=0,duration=3,id){return{id:id||uid(),start:Math.max(0,Number(start)||0),duration:Math.max(MIN_CLIP,Number(duration)||3),scene};}
// 내레이션 조각. 녹음 자체는 sentences[].audio 에 남고, 여기서는 어느 문장의 녹음을 어디에 얼마나 얹을지만 정한다.
// offset 은 그 녹음의 어느 지점부터 쓰는지(앞을 잘라내도 원본 PCM 은 그대로 둔다).
export function newAudioClip(sentenceId,start=0,duration=0,text='',id,offset=0){return{id:id||uid(),sentenceId,start:Math.max(0,Number(start)||0),duration:Math.max(0,Number(duration)||0),offset:Math.max(0,Number(offset)||0),text:String(text||'')};}
export const clipEnd=c=>(Number(c?.start)||0)+(Number(c?.duration)||0);
// 트랙 전체 길이. 빈 트랙은 0.
export function trackEnd(clips){return (clips||[]).reduce((max,c)=>Math.max(max,clipEnd(c)),0);}
// 영상+오디오 트랙을 합친 전체 영상 길이. 영상이 내레이션보다 짧아도 소리는 끝까지 들려야 하므로 둘 중 긴 쪽을 쓴다.
export function totalDuration(video,audio){return Math.max(trackEnd(video),trackEnd(audio));}
// 시각 t 를 덮는 조각들. 겹치면 배열 순서대로.
export function clipsAt(clips,t){const time=Math.max(0,Number(t)||0);return (clips||[]).filter(c=>time>=c.start&&time<clipEnd(c));}
// 영상 트랙에서 t 시점에 보여줄 조각 하나(겹치면 가장 나중에 시작한 것이 화면 앞).
export function videoClipAt(clips,t){const hits=clipsAt(clips,t);return hits.length?hits.reduce((a,b)=>b.start>=a.start?b:a):null;}
// 절대 시각 → 조각 번호와 그 조각 안에서의 시간. 빈 구간이면 null.
export function locateClip(clips,t){const clip=videoClipAt(clips,t);if(!clip)return null;const index=(clips||[]).indexOf(clip);return{clip,index,local:Math.max(0,(Number(t)||0)-clip.start)};}
// 트랙 맨 뒤(새 조각을 이어 붙일 자리).
export const trackTail=clips=>trackEnd(clips);
// 조각을 통째로 옮긴다. 타임라인 앞(0초)보다 앞으로는 못 간다.
export function moveClip(clip,start){clip.start=Math.max(0,Number(start)||0);return clip;}
// 조각 가장자리를 끌어 길이를 바꾼다. 시작 쪽을 당기면 쓰는 구간도 같이 밀려 내용이 제자리에 남는다.
// limit 은 더 늘릴 수 없는 최대 길이(녹음 길이 등). 없으면 제한 없음.
export function trimClip(clip,edge,time,limit=Infinity){
 const t=Math.max(0,Number(time)||0),end=clipEnd(clip),max=Math.max(MIN_CLIP,Number(limit)||Infinity);
 if(edge==='start'){
  const start=Math.min(Math.max(0,t),end-MIN_CLIP),shift=start-clip.start;
  if(clip.offset!=null&&clip.offset+shift<0)return clip;
  clip.start=start;clip.duration=end-start;
  if(clip.offset!=null)clip.offset=Math.max(0,clip.offset+shift);
 }else clip.duration=Math.min(max,Math.max(MIN_CLIP,t-clip.start));
 return clip;
}
// 옛 문장별 장면(version:1)을 독립 영상/오디오 트랙(version:2)으로 옮긴다.
// 순서대로 이어 붙여 예전과 똑같이 재생되는 자리에 두고, 그 뒤로는 자유롭게 옮기고 자를 수 있다.
export function migrateProject(project){
 if(!project||project.version!==1||!Array.isArray(project.sentences))return project;
 const video=[],audio=[];let offset=0;
 for(const s of project.sentences){
  const scene=s?.scene||{},seconds=s?.audio?.length?s.audio.length/RATE:Math.max(.1,Number(scene.duration)||3);
  if(!scene.continues||!video.length)video.push(newVideoClip(scene,offset,seconds,'v'+s.id));
  else video.at(-1).duration+=seconds;
  if(s?.audio?.length)audio.push(newAudioClip(s.id,offset,seconds,s.text,'a'+s.id));
  offset+=seconds;
 }
 for(const clip of video)delete clip.scene.continues;
 return{...project,version:2,video,audio};
}

