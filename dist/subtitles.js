// 영상 하나에 자막만 얹는 도구. 편집은 다른 곳에서 하고, 여기서는 시간과 글자만 다룬다.
export const MAX_CUES=2000;
const round=n=>Math.round(n*1000)/1000;
export const clampTime=(v,max=86400)=>Math.min(max,Math.max(0,Number(v)||0));

export function splitScript(text){
 return String(text||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,MAX_CUES);
}
// 대본만 있고 시간이 없을 때의 첫 배치. 길이를 모르면 한 줄 3초로 이어 붙인다.
export function layoutCues(lines,duration=0){
 const list=splitScript(Array.isArray(lines)?lines.join('\n'):lines);
 if(!list.length)return [];
 const span=duration>0?duration/list.length:3;
 return list.map((text,i)=>({id:'c'+(i+1),start:round(i*span),end:round((i+1)*span),text}));
}
// 시작 순서로 세우고, 앞 자막이 다음 자막을 넘어가면 거기서 끊는다. 겹친 자막은 화면에서 서로를 가린다.
export function normalizeCues(cues,duration=0){
 const limit=duration>0?duration:86400;
 const list=(cues||[]).filter(c=>c&&String(c.text??'').trim())
  .map(c=>({...c,start:clampTime(c.start,limit),end:clampTime(c.end,limit),text:String(c.text).trim()}))
  .sort((a,b)=>a.start-b.start||a.end-b.end);
 for(let i=0;i<list.length;i++){
  const next=list[i+1];
  if(list[i].end<=list[i].start)list[i].end=Math.min(limit,list[i].start+.4);
  if(next&&list[i].end>next.start)list[i].end=Math.max(list[i].start,next.start);
 }
 return list.filter(c=>c.end>c.start).map(c=>({...c,start:round(c.start),end:round(c.end)}));
}
export function cueAt(cues,seconds){
 const t=Number(seconds)||0;
 for(const c of cues||[])if(t>=c.start&&t<c.end)return c;
 return null;
}
const pad2=n=>String(n).padStart(2,'0');
export function srtTime(seconds,comma=true){
 const ms=Math.max(0,Math.round((Number(seconds)||0)*1000)),whole=Math.floor(ms/1000);
 return `${pad2(Math.floor(whole/3600))}:${pad2(Math.floor(whole/60)%60)}:${pad2(whole%60)}${comma?',':'.'}${String(ms%1000).padStart(3,'0')}`;
}
export function toSrt(cues){
 return normalizeCues(cues).map((c,i)=>`${i+1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n');
}
export function toVtt(cues){
 return 'WEBVTT\n\n'+normalizeCues(cues).map(c=>`${srtTime(c.start,false)} --> ${srtTime(c.end,false)}\n${c.text}\n`).join('\n');
}
const parseStamp=s=>{const m=/(\d+):(\d{2}):(\d{2})[.,](\d{1,3})/.exec(s)||/(\d+):(\d{2})[.,](\d{1,3})/.exec(s);
 if(!m)return null;
 return m.length===5?+m[1]*3600+ +m[2]*60+ +m[3]+ +m[4].padEnd(3,'0')/1000:+m[1]*60+ +m[2]+ +m[3].padEnd(3,'0')/1000;};
// SRT 와 VTT 를 같은 자리에서 읽는다. 번호 줄과 WEBVTT 머리글은 건너뛴다.
export function parseSrt(text){
 const cues=[];let current=null;
 for(const raw of String(text||'').replace(/^﻿/,'').split(/\r?\n/)){
  const line=raw.trim();
  if(/-->/.test(line)){
   const [from,to]=line.split('-->');
   const start=parseStamp(from),end=parseStamp(to);
   if(start==null||end==null)continue;
   current={id:'c'+(cues.length+1),start,end,text:''};cues.push(current);continue;
  }
  if(!current)continue;
  if(!line){current=null;continue;}
  current.text=current.text?current.text+'\n'+line:line;
 }
 return normalizeCues(cues);
}
