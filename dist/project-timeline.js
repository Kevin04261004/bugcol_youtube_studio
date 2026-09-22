import {materialTracks} from './editor-engine.js';
// 트랙 위치는 모두 타임라인 절대 초. 레이어/키프레임 시간만 그 조각 기준 상대 시간이다.
import {clipEnd,totalDuration,videoClipAt,clipsAt} from './core.js';
const bar=(clip,index)=>({clip,index,start:clip.start,end:clipEnd(clip),seconds:Math.max(0,Number(clip.duration)||0)});
// 조각 하나가 품은 소재 레이어를 타임라인 절대 구간으로 편다. 기존 단일 asset 장면은 조각 전체를 덮는 레이어 하나로 본다.
export function clipLayers(entry){const scene=entry.clip.scene||{},span=entry.seconds;
 const layers=Array.isArray(scene.layers)?scene.layers:(scene.asset?[{id:'legacy',asset:scene.asset,name:scene.asset.split('/').pop(),start:0,end:0,legacy:true}]:[]);
 return layers.map((layer,lane)=>{const start=entry.start+Math.min(span,Math.max(0,layer.start||0)),end=entry.start+Math.min(span,layer.end||span);
  return{layer,lane:layer.lane??lane,clipIndex:entry.index,start,end,clipStart:entry.start,clipEnd:entry.end};}).filter(c=>c.end>c.start);}
export function timelineLayout(video,audio){
 const clips=(video||[]).map(bar),takes=(audio||[]).map(bar);
 const layers=clips.flatMap(clipLayers);
 return{clips,takes,layers,lanes:Math.max(1,...clips.map(c=>materialTracks(c.clip.scene||{}).length),...layers.map(l=>l.lane+1)),total:totalDuration(video,audio)};
}
// 절대 시각 → 그 시점에 편집할 영상 조각과 조각 안에서의 시간. 빈 구간이면 null.
export function locateTime(layout,seconds){const time=Math.min(layout.total,Math.max(0,Number(seconds)||0));
 // 끝 시각은 어느 조각에도 안 걸리므로(끝은 열린 구간) 마지막 프레임을 보여 준다.
 const hit=videoClipAt(layout.clips.map(c=>c.clip),time<layout.total?time:Math.max(0,time-1e-6));if(!hit)return null;
 const index=layout.clips.findIndex(c=>c.clip===hit);
 return{index,local:time-hit.start,time};}
// 그 시점에 들려야 할 녹음 조각들.
export const takesAt=(layout,seconds)=>clipsAt(layout.takes.map(t=>t.clip),seconds);
