// Project seconds are absolute; layer/keyframe times remain relative to their scene.
export function timelineLayout(sentences,duration){
 let total=0,owner=0;
 const scenes=sentences.map((sentence,index)=>{const seconds=Math.max(.1,Number(duration(sentence))||3),start=total;total+=seconds;if(!sentence.scene.continues||index===0)owner=index;return{sentence,index,start,end:total,seconds,owner};});
 const groups=[];for(const s of scenes){if(s.owner===s.index)groups.push({...s});else groups.at(-1).end=s.end;}
 const clips=[];let lanes=2;
 for(const group of groups){const scene=group.sentence.scene,span=group.end-group.start;
  const layers=Array.isArray(scene.layers)?scene.layers:(scene.asset?[{id:'legacy',asset:scene.asset,name:scene.asset.split('/').pop(),start:0,end:0,legacy:true}]:[]);
  lanes=Math.max(lanes,layers.length);
  layers.forEach((layer,lane)=>{const start=group.start+Math.min(span,Math.max(0,layer.start||0)),end=group.start+Math.min(span,layer.end||span);if(end>start)clips.push({layer,lane,sceneIndex:group.index,start,end,groupStart:group.start,groupEnd:group.end});});
 }
 return{scenes,groups,clips,lanes,total};
}
export function locateTime(layout,seconds){
 const time=Math.min(layout.total,Math.max(0,Number(seconds)||0));
 const scene=layout.scenes.find(s=>time<s.end)||layout.scenes.at(-1);
 return scene?{index:scene.index,local:time-scene.start,time}:null;
}
