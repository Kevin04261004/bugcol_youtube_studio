// 애니메이션 GIF 인코더. GIF 는 프레임마다 256색 팔레트만 쓸 수 있어서
// 색을 먼저 고르고(median cut) 그 색으로 픽셀을 바꾼 뒤 LZW 로 묶는다. 소리는 담지 못한다.
export const MAX_COLORS=256;
// 풀어 둔 GIF 프레임에 쓸 수 있는 최대 메모리.
export const MAX_DECODED=300*1024*1024;
// 화면에서 고르게 뽑은 표본. 픽셀을 전부 보면 느려서 8천 개쯤만 본다(그 이상 봐도 색이 나아지지 않는다).
function sample(rgba,limit=8000){const count=rgba.length/4,step=Math.max(1,Math.floor(count/limit)),out=[];
 for(let i=0;i<count;i+=step)out.push([rgba[i*4],rgba[i*4+1],rgba[i*4+2]]);
 return out;}
// 한 칸이 어느 축으로 얼마나 퍼져 있는지. 쪼갤 때마다 다시 세지 않도록 칸과 함께 들고 다닌다.
function boxOf(pixels){let size=0,channel=0;
 for(let c=0;c<3;c++){let lo=255,hi=0;for(const p of pixels){const v=p[c];if(v<lo)lo=v;if(v>hi)hi=v;}
  if(hi-lo>size){size=hi-lo;channel=c;}}
 return{pixels,channel,size};}
// 색 공간을 가장 넓게 퍼진 축에서 반으로 계속 쪼개고, 각 칸의 평균색을 팔레트로 삼는다.
export function quantizePalette(rgba,maxColors=MAX_COLORS){
 const limit=Math.max(2,Math.min(MAX_COLORS,maxColors)),first=sample(rgba);
 if(!first.length)return[[0,0,0]];
 const boxes=[boxOf(first)];
 while(boxes.length<limit){
  let pick=-1,best=0;
  for(let i=0;i<boxes.length;i++){const b=boxes[i];if(b.pixels.length>1&&b.size>best){best=b.size;pick=i;}}
  if(pick<0)break;
  const {pixels,channel}=boxes[pick];
  pixels.sort((a,b)=>a[channel]-b[channel]);
  const half=pixels.length>>1;
  boxes.splice(pick,1,boxOf(pixels.slice(0,half)),boxOf(pixels.slice(half)));
 }
 return boxes.map(({pixels})=>{const sum=[0,0,0];for(const p of pixels)for(let c=0;c<3;c++)sum[c]+=p[c];
  return sum.map(v=>Math.round(v/pixels.length));});}
// 팔레트에서 가장 가까운 색 찾기. 5비트로 뭉뚱그려 캐시해 두면 프레임마다 다시 계산하지 않아도 된다.
export function paletteMapper(palette){const cache=new Int16Array(32768).fill(-1);
 return(r,g,b)=>{const key=(r>>3)<<10|(g>>3)<<5|(b>>3);const hit=cache[key];if(hit>=0)return hit;
  let best=0,bestDistance=Infinity;
  for(let i=0;i<palette.length;i++){const p=palette[i],dr=r-p[0],dg=g-p[1],db=b-p[2],d=dr*dr+dg*dg+db*db;
   if(d<bestDistance){bestDistance=d;best=i;if(!d)break;}}
  cache[key]=best;return best;};}
export function indexPixels(rgba,palette){const map=paletteMapper(palette),out=new Uint8Array(rgba.length/4);
 for(let i=0;i<out.length;i++)out[i]=map(rgba[i*4],rgba[i*4+1],rgba[i*4+2]);
 return out;}
// GIF 가 쓰는 LZW. 사전이 가득 차면 초기화 부호를 넣고 처음부터 다시 쌓는다.
export function lzwEncode(indices,minCodeSize){
 const clear=1<<minCodeSize,end=clear+1,mask=clear-1;
 let size=minCodeSize+1,next=end+1,table=new Map(),cur=0,bits=0;
 const bytes=[],push=code=>{cur|=code<<bits;bits+=size;while(bits>=8){bytes.push(cur&255);cur>>=8;bits-=8;}};
 push(clear);
 if(indices.length){
  let prefix=indices[0]&mask;
  for(let i=1;i<indices.length;i++){
   const k=indices[i]&mask,key=prefix<<8|k,known=table.get(key);
   if(known!==undefined){prefix=known;continue;}
   push(prefix);
   if(next===4096){push(clear);table=new Map();next=end+1;size=minCodeSize+1;}
   else{if(next>=1<<size)size++;table.set(key,next++);}
   prefix=k;
  }
  push(prefix);
 }
 push(end);
 if(bits>0)bytes.push(cur&255);
 // GIF 는 이미지 데이터를 255바이트 이하 덩어리로 나누고 0으로 끝낸다.
 const out=[];
 for(let i=0;i<bytes.length;i+=255){const part=bytes.slice(i,i+255);out.push(part.length,...part);}
 out.push(0);
 return Uint8Array.from(out);}
const pow2=n=>{let size=2;while(size<n)size<<=1;return Math.min(256,size);};
// 프레임을 하나씩 받아 바로 눌러 담는다. 긴 영상은 원본 화면을 다 들고 있을 수 없어서
// 받는 즉시 인코딩하고 압축된 바이트만 남긴다.
export function createGifWriter({width,height,loop=0,maxColors=MAX_COLORS}={}){
 const chunks=[];let parts=[],frames=0,bytes=0;
 const put=(...v)=>parts.push(...v),put16=v=>put(v&255,v>>8&255),text=s=>put(...[...s].map(c=>c.charCodeAt(0)));
 const flush=()=>{if(!parts.length)return;const block=Uint8Array.from(parts);bytes+=block.length;chunks.push(block);parts=[];};
 // 이미지 데이터는 수십만 바이트까지 커진다. 펼쳐서 push 하면 인자가 너무 많아 터지므로 통째로 붙인다.
 const putBytes=block=>{flush();bytes+=block.length;chunks.push(block);};
 text('GIF89a');put16(width);put16(height);put(0x70,0,0);
 text('\x21\xFF\x0B');text('NETSCAPE2.0');put(3,1);put16(loop);put(0);
 flush();
 return{
  get frames(){return frames;},get bytes(){return bytes;},
  // rgba 는 그 프레임의 화면, delay 는 머무는 시간(초).
  addFrame(rgba,delay=.1){
   const palette=quantizePalette(rgba,maxColors),indices=indexPixels(rgba,palette);
   const slots=pow2(palette.length),depth=Math.max(1,Math.log2(slots)),minCodeSize=Math.max(2,depth);
   const hundredths=Math.max(1,Math.round(delay*100));
   put(0x21,0xF9,4,1<<2,hundredths&255,hundredths>>8&255,0,0);
   put(0x2C);put16(0);put16(0);put16(width);put16(height);put(0x80|depth-1);
   for(let i=0;i<slots;i++){const c=palette[i]||[0,0,0];put(c[0],c[1],c[2]);}
   put(minCodeSize);putBytes(lzwEncode(indices,minCodeSize));
   frames++;flush();return bytes;},
  finish(){if(!frames)throw Error('GIF 로 만들 화면이 없습니다.');put(0x3B);flush();
   const out=new Uint8Array(bytes);let at=0;for(const c of chunks){out.set(c,at);at+=c.length;}return out;},
 };}
// ── 읽기 ────────────────────────────────────────────────────────────
// 브라우저에 <img> 로 맡기면 애니메이션이 제멋대로 돌아 타임라인과 어긋나므로 직접 푼다.
function lzwDecode(bytes,minCodeSize,expected){
 const clear=1<<minCodeSize,end=clear+1,out=new Uint8Array(expected);
 let size=minCodeSize+1,dict=[],n=0,cur=0,bits=0,prev=null;
 const reset=()=>{dict=new Array(clear+2);for(let i=0;i<clear;i++)dict[i]=[i];size=minCodeSize+1;prev=null;};
 reset();
 for(let i=0;i<bytes.length;i++){
  cur|=bytes[i]<<bits;bits+=8;
  while(bits>=size){
   const code=cur&(1<<size)-1;cur>>>=size;bits-=size;
   if(code===clear){reset();continue;}
   if(code===end)return out;
   let entry=dict[code];
   if(!entry){if(!prev)throw Error('GIF 압축 데이터가 깨졌습니다.');entry=[...prev,prev[0]];}
   for(const v of entry)if(n<out.length)out[n++]=v;
   if(prev){dict.push([...prev,entry[0]]);if(dict.length===1<<size&&size<12)size++;}
   prev=entry;
  }
 }
 return out;}
// 한 줄씩 순서대로가 아니라 네 번에 나눠 담는 방식(interlace)의 줄 순서.
function interlaced(height){const rows=[];
 for(const [start,step] of [[0,8],[4,8],[2,4],[1,2]])for(let y=start;y<height;y+=step)rows.push(y);
 return rows;}
// GIF 바이트를 프레임 목록으로. 각 프레임은 이미 겹쳐 그려 둔 전체 화면이다.
export function decodeGif(bytes){
 const b=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
 if(String.fromCharCode(...b.slice(0,3))!=='GIF')throw Error('GIF 파일이 아닙니다.');
 let p=6;
 const u8=()=>b[p++],u16=()=>{const v=b[p]|b[p+1]<<8;p+=2;return v;};
 const width=u16(),height=u16(),packed=u8();p+=2;
 const table=n=>{const out=new Array(n);for(let i=0;i<n;i++)out[i]=[b[p++],b[p++],b[p++]];return out;};
 const global=packed&0x80?table(2<<(packed&7)):null;
 const blocks=()=>{const parts=[];for(;;){const n=b[p++];if(!n)break;parts.push(b.subarray(p,p+n));p+=n;}
  const size=parts.reduce((s,x)=>s+x.length,0),out=new Uint8Array(size);let at=0;
  for(const part of parts){out.set(part,at);at+=part.length;}return out;};
 const skip=()=>{for(;;){const n=b[p++];if(!n)break;p+=n;}};
 const canvas=new Uint8ClampedArray(width*height*4),frames=[];
 let delay=.1,transparent=-1,disposal=0,duration=0;
 while(p<b.length){
  const marker=u8();
  if(marker===0x3B)break;
  if(marker===0x21){const label=u8();
   if(label===0xF9){p++;const flags=u8(),raw=u16();transparent=flags&1?u8():(p++,-1);p++;
    disposal=flags>>2&7;
    // 0 이나 1/100초는 '최대한 빠르게'라는 뜻이고, 브라우저는 관행적으로 0.1초로 늦춘다.
    delay=raw<=1?.1:raw/100;}
   else skip();
   continue;}
  if(marker!==0x2C)continue;
  const left=u16(),top=u16(),w=u16(),h=u16(),flags=u8();
  const local=flags&0x80?table(2<<(flags&7)):null,palette=local||global;
  if(!palette)throw Error('GIF 색 정보가 없습니다.');
  const minCodeSize=u8(),indices=lzwDecode(blocks(),minCodeSize,w*h);
  const before=disposal===3?canvas.slice():null;
  const rows=flags&0x40?interlaced(h):null;
  for(let y=0;y<h;y++){const dy=(rows?rows[y]:y)+top;if(dy<0||dy>=height)continue;
   for(let x=0;x<w;x++){const dx=left+x;if(dx<0||dx>=width)continue;
    const index=indices[y*w+x];if(index===transparent)continue;
    const c=palette[index]||[0,0,0],at=(dy*width+dx)*4;
    canvas[at]=c[0];canvas[at+1]=c[1];canvas[at+2]=c[2];canvas[at+3]=255;}}
  // 프레임은 모두 펼친 화면으로 들고 있어서, 크고 긴 GIF 는 메모리를 통째로 삼킬 수 있다.
  if((frames.length+1)*width*height*4>MAX_DECODED)throw Error('GIF 가 너무 크거나 깁니다. 더 작은 파일로 줄여 주세요.');
  frames.push({rgba:canvas.slice(),delay});duration+=delay;
  // 다음 장을 위한 뒤처리. 2는 이 자리를 비우고, 3은 그리기 전으로 되돌린다.
  if(disposal===2){for(let y=top;y<Math.min(height,top+h);y++)for(let x=left;x<Math.min(width,left+w);x++)
   canvas.fill(0,(y*width+x)*4,(y*width+x)*4+4);}
  else if(disposal===3&&before)canvas.set(before);
 }
 if(!frames.length)throw Error('GIF 에서 읽을 화면이 없습니다.');
 return{width,height,duration,frames};}
// 움직이는 GIF 에서 t 초에 보여 줄 프레임. 끝나면 처음으로 돌아간다.
export function gifFrameAt(gif,t){const {frames,duration}=gif;
 if(frames.length<2||!(duration>0))return frames[0];
 let at=(Number(t)||0)%duration;if(at<0)at+=duration;
 for(const frame of frames){if(at<frame.delay)return frame;at-=frame.delay;}
 return frames.at(-1);}
// frames: [{rgba, delay}] · delay 는 초. 1/100초 단위로 저장되므로 0.01초보다 잘게는 못 쪼갠다.
export function gifBytes(frames,options={}){
 if(!frames?.length)throw Error('GIF 로 만들 화면이 없습니다.');
 const writer=createGifWriter(options);
 for(const frame of frames)writer.addFrame(frame.rgba,frame.delay||.1);
 return writer.finish();}
