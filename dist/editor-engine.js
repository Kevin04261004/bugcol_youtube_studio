// Shared deterministic geometry for editing, preview and export (1280 × 720).
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number(v)||0));
export const EASINGS={linear:t=>t,out:t=>1-(1-t)**3,inout:t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2};
export const uid=()=>globalThis.crypto?.randomUUID?.()||'layer-'+Date.now()+'-'+Math.random().toString(36).slice(2);
export function newLayer(asset='',name='소재',kind='image',ratio=1){const w=kind==='text'?600:480;return{id:uid(),asset,name,kind,x:640,y:360,w,h:kind==='text'?100:w/ratio,rotation:0,opacity:1,start:0,end:0,clipStart:0,motion:'none',enter:.35,hidden:false,locked:false,text:kind==='text'?'텍스트':'',color:'#ffffff',fontSize:52,keyframes:[]};}
export function validateLayers(input){if(!Array.isArray(input)||input.length>100)throw Error('장면당 레이어는 100개 이하입니다.');const ids=new Set();return input.map(raw=>{if(!raw||typeof raw!=='object')throw Error('레이어 형식 오류');const l=newLayer();l.id=typeof raw.id==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(raw.id)?raw.id:uid();if(ids.has(l.id))throw Error('레이어 ID 중복');ids.add(l.id);if(Number.isInteger(raw.lane)&&raw.lane>=0&&raw.lane<100)l.lane=raw.lane;l.kind=['image','video','text'].includes(raw.kind)?raw.kind:'image';for(const k of ['asset','name','text'])l[k]=String(raw[k]||'').slice(0,10000);if(l.asset&&(/(^|\/)\.\.?(\/|$)|^\/|:|\\/.test(l.asset)))throw Error('레이어 소재 경로 오류');for(const k of ['x','y'])l[k]=raw[k]==null?(k==='x'?640:360):clamp(raw[k],-2560,3840);for(const k of ['w','h'])l[k]=raw[k]==null?480:clamp(raw[k],8,6000);l.rotation=clamp(raw.rotation,-360,360);l.opacity=raw.opacity==null?1:clamp(raw.opacity,0,1);for(const k of ['start','end','clipStart'])l[k]=clamp(raw[k],0,86400);if(l.end&&l.end<=l.start)throw Error('레이어 끝은 시작보다 뒤여야 합니다.');l.motion=['none','drop','left','right','pop','fade'].includes(raw.motion)?raw.motion:'none';l.enter=clamp(raw.enter??.35,.05,5);l.color=/^#[a-f0-9]{6}$/i.test(raw.color)?raw.color:'#ffffff';l.fontSize=clamp(raw.fontSize||52,12,240);l.hidden=!!raw.hidden;l.locked=!!raw.locked;l.keyframes=(Array.isArray(raw.keyframes)?raw.keyframes:[]).slice(0,300).map(k=>({t:clamp(k.t,0,86400),x:clamp(k.x,-2560,3840),y:clamp(k.y,-2560,3840),w:clamp(k.w,8,6000),h:clamp(k.h,8,6000),rotation:clamp(k.rotation,-360,360),opacity:clamp(k.opacity,0,1),ease:['linear','out','inout'].includes(k.ease)?k.ease:'out'})).sort((a,b)=>a.t-b.t);return l;});}
export function poseAt(l,time,edit=false){let p={x:l.x,y:l.y,w:l.w,h:l.h,rotation:l.rotation||0,opacity:l.opacity??1};const t=time-(l.start||0);if(l.hidden||(!edit&&(t<0||(l.end>0&&time>=l.end))))return null;const keys=l.keyframes||[];if(keys.length){let a=keys[0],b=keys.at(-1);if(t<=a.t)b=a;else if(t>=b.t)a=b;else for(let i=1;i<keys.length;i++)if(t<=keys[i].t){a=keys[i-1];b=keys[i];break;}const f=a===b?0:(EASINGS[b.ease]||EASINGS.out)(clamp((t-a.t)/(b.t-a.t),0,1));for(const k of Object.keys(p))p[k]=a[k]+(b[k]-a[k])*f;}
 if(!edit&&t<(l.enter||.35)){const u=clamp(t/(l.enter||.35),0,1),q=EASINGS.out(u);if(l.motion==='drop')p.y-=((p.y+p.h/2)+20)*(1-q);if(l.motion==='left')p.x-=(p.x+p.w/2+20)*(1-q);if(l.motion==='right')p.x+=(1280-p.x+p.w/2+20)*(1-q);if(l.motion==='fade')p.opacity*=q;if(l.motion==='pop'){const s=u<.75?.05+1.03*EASINGS.out(u/.75):1.08-.08*(u-.75)/.25;p.w*=s;p.h*=s;}}
 return p;}
export function hitLayer(l,p,x,y){if(!p||l.hidden)return false;const r=-(p.rotation||0)*Math.PI/180,dx=x-p.x,dy=y-p.y,xx=dx*Math.cos(r)-dy*Math.sin(r),yy=dx*Math.sin(r)+dy*Math.cos(r);return Math.abs(xx)<=p.w/2&&Math.abs(yy)<=p.h/2;}
export function drawLayers(g,layers,t,media,edit=false){for(const l of layers||[]){const p=poseAt(l,t,edit);if(!p)continue;g.save();g.globalAlpha=p.opacity;g.translate(p.x,p.y);g.rotate(p.rotation*Math.PI/180);if(l.kind==='text'){g.scale(p.w/l.w,p.h/l.h);g.fillStyle=l.color;g.textAlign='center';g.textBaseline='middle';g.font=`700 ${l.fontSize||52}px sans-serif`;const lines=(l.text||'').split('\n');lines.forEach((line,i)=>g.fillText(line,0,(i-(lines.length-1)/2)*(l.fontSize||52)*1.3,l.w));}else{const el=media?.get(l.id);if(el&&(el.naturalWidth||el.videoWidth))g.drawImage(el,-p.w/2,-p.h/2,p.w,p.h);}g.restore();}}
export function layerVideoTime(l,t,duration){return clamp((l.clipStart||0)+Math.max(0,t-(l.start||0)),0,Math.max(0,duration-1/30));}

// Rows persist independently of their blocks, including after deleting the last block.
export function materialTracks(scene){
 const tracks=scene.materialTracks||[];
 const count=Math.max(tracks.length,...(scene.layers||[]).map((l,i)=>(l.lane??i)+1),scene.asset&&!Array.isArray(scene.layers)?1:0);
 return Array.from({length:count},(_,i)=>tracks[i]||{name:(scene.layers||[]).find((l,j)=>(l.lane??j)===i)?.name||'소재 '+(i+1)});
}
export function ensureMaterialTracks(scene){
 scene.materialTracks=materialTracks(scene);
 (scene.layers||[]).forEach((l,i)=>{l.lane??=i;});
 return scene.materialTracks;
}
export function sortMaterialLayers(scene){scene.layers.sort((a,b)=>(a.lane??0)-(b.lane??0));}

// Set one block's absolute span. Containers may grow, but no neighbouring block moves or resizes.
export function setLayerSpan(clip,id,start,end){
 const layer=clip?.scene?.layers?.find(l=>l.id===id);
 if(!layer||layer.locked||!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start)return;
 const oldStart=clip.start,oldDuration=clip.duration,origin=Math.min(oldStart,start),shift=oldStart-origin;
 const duration=Math.max(oldStart+oldDuration,end)-origin;
 if(shift||duration!==oldDuration){
  for(const l of clip.scene.layers){const stop=l.end||oldDuration;l.start=(l.start||0)+shift;l.end=stop+shift;}
  clip.start=origin;clip.duration=duration;
 }
 layer.start=start-clip.start;layer.end=end-clip.start;
}
