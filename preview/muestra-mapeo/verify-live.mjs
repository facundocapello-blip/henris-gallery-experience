import assert from 'node:assert/strict';
import { readFile, appendFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const base=process.argv[2];
assert.ok(base&&new URL(base).protocol==='https:','Se requiere URL pública HTTPS');
const root=base.endsWith('/')?base:base+'/';
const sample=new URL('muestra-mapeo/',root).href;
let success=false,lastError;
for(let attempt=0;attempt<16;attempt++){
 try {
  const response=await fetch(sample,{signal:AbortSignal.timeout(15000)});
  assert.equal(response.status,200);
  const html=await response.text();assert.ok(html.includes('data-preview-version="muestra-2"'));
  success=true;break;
 }catch(error){lastError=error;if(attempt<15)await new Promise(r=>setTimeout(r,5000))}
}
if(!success)throw lastError;
const sha=body=>createHash('sha256').update(body).digest('hex');
for(const [url,file]of[[root,'index.html'],[new URL('mapeo-v1/',root).href,'preview/mapeo/Henris-mapeo-vista-previa.html'],[new URL('excel-continuo.png',sample).href,'preview/muestra-mapeo/excel-continuo.png']]){
 const response=await fetch(url);assert.equal(response.status,200,url);
 assert.equal(sha(Buffer.from(await response.arrayBuffer())),sha(await readFile(file)),url+' debe coincidir con el archivo esperado');
}
console.log('PUBLIC_HTTP_OK: muestra, captura anonimizada, vista anterior y demo original disponibles; contenido verificado por SHA-256.');
const result=spawnSync(process.execPath,['--test','preview/muestra-mapeo/sample.test.mjs'],{stdio:'inherit',env:{...process.env,HENRIS_SAMPLE_URL:sample}});
if(result.status!==0)process.exit(result.status||1);
console.log('PUBLIC_BROWSER_OK: 8 pruebas pasaron sobre la URL pública; escritorio y 390 px.');
console.log('VERIFIED_PREVIEW_URL: '+sample);
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,`## Vista previa publicada y verificada\n\n[**Abrir muestra de los tres campos**](${sample})\n\n- HTTP 200 y contenido esperado en la URL pública.\n- Captura continua anonimizada disponible y verificada por SHA-256.\n- Demo principal y vista anterior conservadas; contenido comprobado por SHA-256.\n- 8 pruebas de navegador aprobadas sobre la URL pública: escritorio y 390 px, carga progresiva, pausa, resize, reinicio, pendientes y movimiento reducido.\n- No se realizó una prueba en iPhone físico.\n`);
