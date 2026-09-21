import assert from 'node:assert/strict';
import {quantizePalette,paletteMapper,indexPixels,lzwEncode,gifBytes,createGifWriter,decodeGif,gifFrameAt,MAX_COLORS} from '../dist/gif.js';

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

// 큰 화면은 이미지 데이터가 수십만 바이트라, 펼쳐서 넘기면 인자 수 한계에 걸려 터진다
const noisy=(w,h)=>{const a=new Uint8ClampedArray(w*h*4);
 for(let i=0;i<w*h;i++){a[i*4]=(i*97)%256;a[i*4+1]=(i*53)%256;a[i*4+2]=(i*181)%256;a[i*4+3]=255;}return a;};
const big=createGifWriter({width:640,height:360});
assert.doesNotThrow(()=>big.addFrame(noisy(640,360),.1),'큰 프레임도 터지지 않는다');
const bigGif=big.finish();
assert.equal(String.fromCharCode(...bigGif.slice(0,6)),'GIF89a');
assert.equal(bigGif.at(-1),0x3B);
assert.equal(bigGif[6]|bigGif[7]<<8,640);assert.equal(bigGif[8]|bigGif[9]<<8,360);
assert.ok(bigGif.length>30000,'압축이 잘 안 되는 화면은 실제로 큰 데이터를 만든다');


// ── 읽기 ────────────────────────────────────────────────────────────
// 내보낸 GIF 를 다시 읽으면 같은 화면이 나와야 한다
const solid=(w,h,c)=>{const a=new Uint8ClampedArray(w*h*4);
 for(let i=0;i<w*h;i++){a[i*4]=c[0];a[i*4+1]=c[1];a[i*4+2]=c[2];a[i*4+3]=255;}return a;};
const three=gifBytes([{rgba:solid(8,6,[200,20,30]),delay:.1},{rgba:solid(8,6,[20,200,30]),delay:.2},{rgba:solid(8,6,[20,30,200]),delay:.3}],{width:8,height:6});
const back=decodeGif(three);
assert.equal(back.width,8);assert.equal(back.height,6);
assert.equal(back.frames.length,3,'세 장을 그대로 읽는다');
assert.deepEqual([...back.frames.map(f=>f.delay)],[.1,.2,.3],'머무는 시간도 살아남는다');
assert.ok(Math.abs(back.duration-.6)<1e-9);
for(const [i,want] of [[0,[200,20,30]],[1,[20,200,30]],[2,[20,30,200]]])
 assert.deepEqual([...back.frames[i].rgba.slice(0,4)],[...want,255],`${i}번째 장의 색이 같다`);

// 시간에 따라 프레임 고르기 — 끝나면 처음으로 돌아간다
const pick=t=>back.frames.indexOf(gifFrameAt(back,t));
assert.equal(pick(0),0);assert.equal(pick(.05),0);
assert.equal(pick(.1),1,'0.1초가 지나면 둘째 장');
assert.equal(pick(.29),1);assert.equal(pick(.31),2);
assert.equal(pick(back.duration),0,'한 바퀴 돌면 처음으로');
assert.equal(pick(back.duration+.05),0);assert.equal(pick(back.duration+.15),1,'두 바퀴째도 같은 순서');
assert.equal(pick(-.05),2,'뒤로 가도 마지막 장을 준다');
assert.equal(gifFrameAt({frames:[{rgba:new Uint8ClampedArray(4),delay:.1}],duration:.1},99).delay,.1,'한 장짜리는 늘 그 장');

// 진짜 GIF 파일 구조 — 손으로 짠 두 장짜리(투명·지우기 포함)
const bytes=a=>Uint8Array.from(a);
const lzwOf=(indices,min)=>[...lzwEncode(Uint8Array.from(indices),min)];
const hand=bytes([
 0x47,0x49,0x46,0x38,0x39,0x61, 2,0, 2,0, 0xF1,0,0,           // 2x2, 전역 팔레트 4색
 255,0,0, 0,255,0, 0,0,255, 255,255,255,
 0x21,0xF9,4, 1<<2|1, 10,0, 3, 0,                              // 지연 0.1초, 3번 색은 투명
 0x2C, 0,0, 0,0, 2,0, 2,0, 0,                                  // 전체 화면 이미지
 2,...lzwOf([0,1,2,3],2),
 0x21,0xF9,4, 2<<2, 25,0, 0, 0,                                // 0.25초, 끝나면 그 자리 지우기
 0x2C, 0,0, 0,0, 1,0, 1,0, 0,                                  // 왼쪽 위 한 칸만
 2,...lzwOf([1],2),
 0x3B]);
const two=decodeGif(hand);
assert.equal(two.frames.length,2);
assert.deepEqual([...two.frames.map(f=>f.delay)],[.1,.25]);
assert.deepEqual([...two.frames[0].rgba.slice(0,4)],[255,0,0,255],'첫 칸은 빨강');
assert.deepEqual([...two.frames[0].rgba.slice(12,16)],[0,0,0,0],'투명으로 지정된 칸은 비어 있다');
assert.deepEqual([...two.frames[1].rgba.slice(0,4)],[0,255,0,255],'둘째 장은 첫 칸만 초록으로 덮는다');
assert.deepEqual([...two.frames[1].rgba.slice(4,8)],[0,255,0,255],'덮지 않은 칸은 앞 장이 남는다');

// 1/100초 단위가 0이면 브라우저 관행대로 0.1초로 본다
const zero=bytes([...hand.slice(0,13+12),0x21,0xF9,4,0,0,0,0,0,0x2C,0,0,0,0,2,0,2,0,0,2,...lzwOf([0,0,0,0],2),0x3B]);
assert.equal(decodeGif(zero).frames[0].delay,.1,'0은 최대한 빠르게라는 뜻이라 0.1초로 늦춘다');

assert.throws(()=>decodeGif(bytes([1,2,3,4,5,6,7,8])),/GIF 파일이 아닙니다/);
assert.throws(()=>decodeGif(bytes([0x47,0x49,0x46,0x38,0x39,0x61,1,0,1,0,0,0,0,0x3B])),/읽을 화면이 없습니다/);


// 너무 크거나 긴 GIF 는 메모리를 삼키기 전에 막는다
const huge=(()=>{const w=2000,h=2000,head=[0x47,0x49,0x46,0x38,0x39,0x61,w&255,w>>8,h&255,h>>8,0xF0,0,0, 0,0,0, 255,255,255];
 const body=[];for(let i=0;i<30;i++)body.push(0x2C,0,0,0,0,w&255,w>>8,h&255,h>>8,0,2,...lzwOf(new Array(w*h).fill(i%2),2));
 return Uint8Array.from([...head,...body,0x3B]);})();
assert.throws(()=>decodeGif(huge),/너무 크거나 깁니다/,'메모리를 다 쓰기 전에 멈춘다');

console.log('PASS GIF LZW round trip with dictionary reset and sub-block splitting, median-cut palette, nearest-colour cache, and GIF89a assembly with looping and hundredth-second delays, including frames too large to pass by spread, plus decoding back to frames with transparency, disposal, interlace row order and looping frame lookup, refusing GIFs too large to hold decoded');
