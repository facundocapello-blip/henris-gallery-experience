import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const route=process.argv[3]||'panel-gestion-presentacion/';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root+route,{waitUntil:'networkidle',timeout:30000});
  await page.locator('.balance-number').waitFor();
  const original=await page.evaluate(()=>localStorage.getItem('henris-panel-gestion-v1'));
  assert.equal(await page.locator('.bottom-nav button').count(),4);
  assert.equal((await page.locator('.balance-number').innerText()).trim(),'$710.500');
  await page.locator('button.story-entry').click();
  assert.equal(await page.locator('.story-slide').count(),1);
  assert.ok((await page.locator('.story-slide h2').innerText()).includes('Del dato disperso'));
  assert.equal(await page.locator('.story-progress button').count(),4);
  assert.ok(page.url().includes('?presentacion'),'Presentation deep link must be shareable');
  await page.screenshot({path:'test-results/henris-presentacion-'+route.replaceAll('/','')+'-inicio-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:/Continuar/}).click();
  assert.ok((await page.locator('.story-slide').innerText()).includes('$660.000'));
  await page.getByRole('button',{name:/Continuar/}).click();
  assert.ok((await page.locator('.story-map').innerText()).includes('Pedido.id'));
  await page.getByRole('button',{name:/Explorar el mapeo completo/}).click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('registro ilustrativo'));
  await page.locator('button[data-action="home"]').click();
  await page.goto(root+route+'?presentacion',{waitUntil:'networkidle'});
  assert.ok((await page.locator('.story-slide h2').innerText()).includes('Del dato disperso'));
  await page.locator('button[data-action="presentation-step"][data-id="3"]').click();
  assert.ok((await page.locator('.story-slide h2').innerText()).includes('Menos búsqueda'));
  assert.ok((await page.locator('.story-benefits').innerText()).includes('Cobros visibles'));
  await page.screenshot({path:'test-results/henris-presentacion-'+route.replaceAll('/','')+'-cierre-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:/Probar simulador/}).click();
  assert.equal(await page.locator('.balance-number').count(),1);
  assert.ok(!page.url().includes('presentacion'),'Closing the tour should return to the normal URL');
  const now=await page.evaluate(()=>localStorage.getItem('henris-panel-gestion-v1'));
  assert.equal(now,original,'Presentation must not touch order storage');
  await page.locator('button[data-action="detail"]').first().click();
  assert.ok((await page.locator('.money-row.balance').innerText()).includes('$660.000'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Horizontal overflow');
  if(width===390)assert.ok(await page.evaluate(()=>{const n=document.querySelector('.bottom-nav').getBoundingClientRect();return n.bottom<=innerHeight+1&&n.top>=0;}),'Bottom navigation disappeared');
  assert.deepEqual(errors,[],'JavaScript error during presentation');
  await page.close();
 }
 console.log('PASS: guided presentation 4 steps, real example, mapping link, stable app navigation, no data mutations, mobile + desktop');
}finally{await browser.close();}
