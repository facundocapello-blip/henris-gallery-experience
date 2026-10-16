import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const route=process.argv[3]||'panel-gestion-mapeo/';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root+route,{waitUntil:'networkidle',timeout:30000});
  await page.locator('.balance-number').waitFor();
  assert.equal(await page.locator('.bottom-nav button').count(),4,'Existing bottom navigation changed');
  assert.equal((await page.locator('.balance-number').innerText()).trim(),'$710.500','Dashboard changed');
  const saved=await page.evaluate(()=>localStorage.getItem('henris-panel-gestion-v1'));
  await page.getByRole('button',{name:/Ver cómo funciona el mapeo/}).click();
  await page.locator('.map-explanation').waitFor();
  assert.equal(await page.locator('.map-step').count(),4);
  assert.equal(await page.locator('.map-step.selected').count(),1);
  assert.ok((await page.locator('.map-explanation').innerText()).includes('registro ilustrativo'));
  await page.screenshot({path:'test-results/henris-mapeo-'+route.replaceAll('/','')+'-origen-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:/Siguiente/}).click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('Pedido.id'));
  await page.getByRole('button',{name:/Siguiente/}).click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('Obra.pedidoId'));
  assert.ok((await page.locator('.map-insight').innerText()).includes('$675.000'),'Sum of two works not shown');
  await page.getByRole('button',{name:/Siguiente/}).click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('Pago.pedidoId'));
  assert.ok((await page.locator('.map-insight').innerText()).includes('$660.000'),'Balance explanation not correct');
  await page.screenshot({path:'test-results/henris-mapeo-'+route.replaceAll('/','')+'-pagos-'+width+'.png',fullPage:true});
  assert.equal(await page.locator('button[data-action="guide-next"]').isDisabled(),true);
  await page.getByRole('button',{name:/Anterior/}).click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('Obra.pedidoId'));
  await page.locator('button[data-action="guide-step"][data-id="0"]').click();
  assert.ok((await page.locator('.map-explanation').innerText()).includes('N.º pedido'));
  const now=await page.evaluate(()=>localStorage.getItem('henris-panel-gestion-v1'));
  assert.equal(now,saved,'Mapping tour must not modify order storage');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Horizontal overflow');
  if(width===390)assert.ok(await page.evaluate(()=>{const n=document.querySelector('.bottom-nav').getBoundingClientRect();return n.bottom<=innerHeight+1&&n.top>=0;}),'Mobile tabs not fixed');
  await page.getByRole('button',{name:/Abrir pedido de ejemplo/}).click();
  assert.ok((await page.locator('.page-title').innerText()).includes('12350'),'Linked example order not opened');
  assert.deepEqual(errors,[],'JavaScript errors');
  await page.close();
 }
 console.log('PASS: mapping tour 4 stages, real demo values, navigation, read-only, 390px mobile/desktop, no regressions');
}finally{await browser.close();}
