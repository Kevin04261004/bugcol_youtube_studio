import assert from 'node:assert/strict';
import {audioPackets,RATE} from '../dist/core.js';
// 4.68s ends between AAC frames: the reported backward-DTS boundary.
const lengths=[Math.round(4.68*RATE),17,1025,48001,1,Math.round(9.137*RATE)];
const clips=lengths.map((n,i)=>new Float32Array(n).fill((i+1)/10));
const expected=new Float32Array(lengths.reduce((a,b)=>a+b));let offset=0;
for(const clip of clips){expected.set(clip,offset);offset+=clip.length;}
const packets=[...audioPackets(clips)];offset=0;
for(let i=0;i<packets.length;i++){
 const p=packets[i];
 assert.equal(p.timestamp,Math.round(offset*1e6/RATE));
 if(i)assert.ok(p.timestamp>packets[i-1].timestamp);
 if(i<packets.length-1)assert.equal(p.data.length,1024);
 assert.deepEqual(p.data,expected.slice(offset,offset+p.data.length));offset+=p.data.length;
}
assert.equal(offset,expected.length);
assert.equal([...audioPackets([])].length,0);
// Longform: clocks stay contiguous over 30 minutes, including tiny clips.
const long=[...audioPackets(Array.from({length:1800},()=>new Float32Array(RATE+1)))];
assert.equal(long.reduce((n,p)=>n+p.data.length,0),1800*(RATE+1));
for(let i=1;i<long.length;i++)assert.equal(long[i].timestamp,Math.round(i*1024*1e6/RATE));
console.log('PASS: 4.68s boundary, short clips, exact PCM preservation, monotonic 30-minute timeline');
