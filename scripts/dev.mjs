import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/session'){res.writeHead(200,{'Content-Type':'application/json'});return res.end('{"user":null}');}
  if(url.pathname.startsWith('/api/')||url.pathname==='/signin-with-chatgpt'){res.writeHead(503,{'Content-Type':'text/plain; charset=utf-8'});return res.end('서버 작업 폴더와 로그인은 운영 사이트에서 사용하세요.');}
  try{
    const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!file.startsWith(root+sep)){res.writeHead(403);return res.end();}
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(5173,'127.0.0.1',()=>console.log('버콜 스튜디오: http://localhost:5173'));
