import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const base=process.argv[2];
assert.ok(base && new URL(base).protocol==='https:','HTTPS requerido');
const sample=new URL('muestra-mapeo-v3/',base.endsWith('/')?base:base+'/').href;
let ok=false;
for(let i=0;i<16;i++){const response=await fetch(sample).catch(()=>null);if(response&&response.ok){const body=await response.text();if(body.includes('data-preview-version="muestra-3"')){ok=true;break}}await new Promise(r=>setTimeout(r,5000))}
assert.ok(ok,'V3 no publicada o distinta');
for(const u of ['muestra-mapeo/excel-continuo.png','assets/mascota-poses.png']){const r=await fetch(new URL(u,base));assert.equal(r.status,200,u)}
const browser=await chromium.launch(process.env.HENRIS_BROWSER_EXECUTABLE?{executablePath:process.env.HENRIS_BROWSER_EXECUTABLE}:{});
try{
 for(const vp of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport:vp,deviceScaleFactor:1});
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto(sample,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.pending-item').count(),26,'26 pendientes');
  assert.equal(await page.locator('.source-btn').count(),3,'3 campos origen');
  await page.locator('#play').click();
  await page.getByText('Recorrido completo · 3 de 3 campos cargados.').waitFor({timeout:16000});
  for(const value of ['HG024','Silent lake','100x150'])assert.equal(await page.locator('.target-value').filter({hasText:value}).count(),1,value);
  await page.locator('#restart').click();
  assert.equal(await page.locator('.target-value.empty').count(),3,'reinicio limpia destino');
  await page.locator('.source-btn').nth(1).click();
  await page.locator('.target-value').nth(1).getByText('Silent lake').waitFor({timeout:6000});
  await page.locator('.pending-item').first().click();
  assert.match(await page.locator('#pending-detail').innerText(),/Confirmar qué identifica/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+2),'overflow móvil');
  assert.deepEqual(errs,[],'sin errores JS');
  await page.close();
 }
 console.log('V3_PUBLIC_OK '+sample+' | escritorio y móvil 390px | animación, reinicio, selección, pendientes, assets');
}finally{await browser.close()}
