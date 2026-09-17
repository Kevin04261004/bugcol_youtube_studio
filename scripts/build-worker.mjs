import fs from 'node:fs/promises';
import {build} from 'esbuild';
const files={};
for(const [path,type] of Object.entries({'index.html':'text/html; charset=utf-8','style.css':'text/css; charset=utf-8','app.js':'text/javascript; charset=utf-8','cloud.js':'text/javascript; charset=utf-8','core.js':'text/javascript; charset=utf-8','vendor/fflate.js':'text/javascript; charset=utf-8','vendor/mp4-muxer.js':'text/javascript; charset=utf-8'}))files['/'+path]={body:await fs.readFile('dist/'+path,'utf8'),type};
await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});
await build({entryPoints:['server/worker.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'neutral',target:'es2022',define:{STATIC_FILES:JSON.stringify(files)}});
await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Worker and authenticated cloud storage routes built');
