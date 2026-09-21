import assert from 'node:assert/strict';
import {quantizePalette,paletteMapper,indexPixels,lzwEncode,gifBytes,createGifWriter,MAX_COLORS} from '../dist/gif.js';

// 명세대로 따로 쓴 해독기. 인코더와 짝을 맞춰 보며 진짜 GIF 바이트인지 확인한다.
function lzwDecode(bytes,minCodeSize){
 const clear=1<<minCodeSize,end=clear+1;
 let size=minCodeSize+1,dict=[],out=[],cur=0,bits=0,prev=null;
 const reset=()=>{dict=[];for(let i=0;i<clear;i++)dict.push([i]);dict.push(null,null);size=minCodeSize+1;prev=null;};
 reset();
 for(const byte of bytes){
  cur|=byte<<bits;bits+=8;
  while(bits>=size){
   const code=cur&(1<<size)-1;cur>>=size;bits-=size;
   if(code===clear){reset();continue;}
   if(code===end)return out;
   let entry;
   if(code<dict.length&&dict[code])entry=dict[code];
   else if(prev)entry=[...prev,prev[0]];
   else throw Error('알 수 없는 부호: '+code);
   out.push(...entry);
   if(prev){dict.push([...prev,entry[0]]);if(dict.length===1<<size&&size<12)size++;}
   prev=entry;
  }
 }
 return out;}
const unblock=bytes=>{const out=[];let i=0;while(i<bytes.length){const n=bytes[i++];if(!n)break;out.push(...bytes.slice(i,i+n));i+=n;}return out;};

// LZW 왕복 — 반복이 많은 줄, 전부 같은 색, 한 픽셀, 색이 다 다른 줄
for(const [name,indices,min] of [
 ['반복되는 줄',[1,1,1,2,2,3,1,1,1,2,2,3,1,1,1,2,2,3],2],
 ['한 가지 색',new Array(600).fill(5),3],
 ['픽셀 하나',[7],3],
 ['톱니 무늬',Array.from({length:1000},(_,i)=>i%16),4],
 ['빈 값',[],2],
]){
 const packed=lzwEncode(Uint8Array.from(indices),min);
 assert.equal(packed.at(-1),0,name+': 이미지 데이터는 0으로 끝난다');
 assert.deepEqual(lzwDecode(unblock(packed),min),indices,name+': 풀면 원래 색 번호가 그대로 나온다');
}
// 사전이 가득 차 초기화가 일어나도 내용은 그대로다
const long=Array.from({length:70000},(_,i)=>(i*7+((i/97)|0))%256);
assert.deepEqual(lzwDecode(unblock(lzwEncode(Uint8Array.from(long),8)),8),long,'사전이 넘쳐 초기화돼도 내용은 같다');
// 255바이트 덩어리로 잘려 나간다
const blocks=lzwEncode(Uint8Array.from(long),8);
let at=0,seen=0;while(at<blocks.length){const n=blocks[at];if(!n)break;assert.ok(n<=255);seen++;at+=n+1;}
assert.ok(seen>1,'긴 데이터는 여러 덩어리로 나뉜다');

// 팔레트 — 뚜렷한 네 가지 색은 그대로 살아남는다
const four=new Uint8ClampedArray(4*4*4);
for(const [i,c] of [[0,[255,0,0]],[1,[0,255,0]],[2,[0,0,255]],[3,[255,255,255]]])
 for(let n=0;n<4;n++){const at=(i*4+n)*4;four[at]=c[0];four[at+1]=c[1];four[at+2]=c[2];four[at+3]=255;}
const palette=quantizePalette(four,4);
assert.equal(palette.length,4);
for(const want of [[255,0,0],[0,255,0],[0,0,255],[255,255,255]])
 assert.ok(palette.some(p=>p.every((v,i)=>Math.abs(v-want[i])<12)),want+' 는 팔레트에 남는다');
assert.ok(quantizePalette(four,MAX_COLORS).length<=4,'색이 4개뿐이면 팔레트도 4개를 넘지 않는다');
assert.equal(quantizePalette(new Uint8ClampedArray(0)).length,1,'빈 화면도 팔레트 하나는 준다');

// 가장 가까운 색 찾기와 캐시
const map=paletteMapper([[0,0,0],[255,255,255]]);
assert.equal(map(10,10,10),0);assert.equal(map(250,250,250),1);
assert.equal(map(10,10,10),0,'캐시를 타도 답은 같다');
assert.deepEqual([...indexPixels(four,palette)].length,16);

// GIF 조립 — 머리글, 반복 설정, 프레임 수, 끝 표시
const frame=n=>({rgba:new Uint8ClampedArray(Array.from({length:4*4*4},(_,i)=>i%4===3?255:n*60%256)),delay:.1});
const gif=gifBytes([frame(1),frame(2),frame(3)],{width:4,height:4});
assert.equal(String.fromCharCode(...gif.slice(0,6)),'GIF89a');
assert.equal(gif[6]|gif[7]<<8,4,'가로');assert.equal(gif[8]|gif[9]<<8,4,'세로');
assert.equal(gif.at(-1),0x3B,'GIF 는 0x3B 로 끝난다');
assert.equal(String.fromCharCode(...gif.slice(16,27)),'NETSCAPE2.0','무한 반복 확장이 들어간다');
let frames=0;for(let i=0;i<gif.length-1;i++)if(gif[i]===0x21&&gif[i+1]===0xF9)frames++;
assert.equal(frames,3,'프레임마다 제어 블록이 하나씩');
assert.throws(()=>gifBytes([],{width:4,height:4}),/화면이 없습니다/);
assert.throws(()=>createGifWriter({width:4,height:4}).finish(),/화면이 없습니다/,'한 장도 안 넣고 끝낼 수는 없다');

// 한 장씩 흘려 넣어도 결과는 한꺼번에 만든 것과 같다 — 긴 영상은 이 방식으로 뽑는다
const stream=createGifWriter({width:4,height:4});
for(const n of [1,2,3])stream.addFrame(frame(n).rgba,.1);
assert.equal(stream.frames,3);
assert.deepEqual([...stream.finish()],[...gif],'흘려 넣어도 같은 바이트가 나온다');
assert.ok(stream.bytes>0);

// 1/100초 단위 — 30FPS(0.0333초)는 3, 아주 짧아도 최소 1
const fast=gifBytes([{rgba:frame(1).rgba,delay:1/30}],{width:4,height:4});
const gce=[...fast].findIndex((v,i)=>v===0x21&&fast[i+1]===0xF9);
assert.equal(fast[gce+4]|fast[gce+5]<<8,3,'30FPS 한 프레임은 3/100초');
const tiny=gifBytes([{rgba:frame(1).rgba,delay:.001}],{width:4,height:4});
const tinyGce=[...tiny].findIndex((v,i)=>v===0x21&&tiny[i+1]===0xF9);
assert.equal(tiny[tinyGce+4]|tiny[tinyGce+5]<<8,1,'더 잘게는 못 쪼개고 1/100초로 붙든다');

console.log('PASS GIF LZW round trip with dictionary reset and sub-block splitting, median-cut palette, nearest-colour cache, and GIF89a assembly with looping and hundredth-second delays');
