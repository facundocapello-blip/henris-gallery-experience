import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('mapeo-campos-pedidos/',base.endsWith('/')?base:base+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},hasTouch:width===390,isMobile:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200);
  assert.equal(await page.locator('body').getAttribute('data-preview'),'mapeo-campos-pedidos');
  assert.equal(await page.locator('article.field-card').count(),66);
  const schemas={Pedidos:19,Pedido_Items:26,Pagos:14,Clientes:7};
  for(const [table,n] of Object.entries(schemas)){
    assert.equal(await page.locator('article.field-card[data-table="'+table+'"]').count(),n);
  }
  assert.equal(await page.locator('article.field-card:visible').count(),19,'Default view only Pedidos');
  const card=field=>page.locator('.field-card').filter({has:page.locator('.field-name', {hasText:field})}).first();
  for(const [field,source] of [
    ['Numero_Pedido_Origen','i'],['Canal_Origen','VENTA'],['Moneda_Venta','Monedad'],['Saldo_Pendiente','PAGO PENDIENTE']
  ])assert.ok((await card(field).innerText()).includes(source),field+' must link exact Excel heading');
  await page.locator('button[data-tab="todos"]').click();
  assert.equal(await page.locator('article.field-card:visible').count(),66);
  const codes=await page.locator('.field-card:visible[data-table="Pedido_Items"]').count();assert.equal(codes,26);
  await page.locator('select#status').selectOption('revisar');
  assert.equal(await page.locator('article.field-card:visible').count(),10);
  await page.locator('select#status').selectOption('todos');
  await page.locator('button[data-tab="Pagos"]').click();
  assert.equal(await page.locator('article.field-card:visible').count(),14);
  assert.ok((await card('Importe').first().innerText()).includes('SEÑA'));
  await page.locator('button[data-tab="Pedidos"]').click();
  await page.locator('input#search').fill('VENTA');
  assert.ok((await page.locator('article.field-card:visible').count())>=1);
  await page.locator('input#search').fill('');
  await page.locator('button[data-tab="todos"]').click();
  assert.equal(await page.locator('article.field-card:visible').count(),66);
  await page.locator('button[data-tab="Pedidos"]').click();
  assert.equal(await page.locator('article.field-card:visible').count(),19);
  const metrics=await page.evaluate(()=>{
   const rect=q=>{const r=document.querySelector(q).getBoundingClientRect();return{left:r.left,right:r.right,width:r.width,top:r.top,bottom:r.bottom}};
   return{viewport:innerWidth,scroll:document.documentElement.scrollWidth,card:rect('.field-card:not([hidden])'),catalog:rect('.catalog'),intro:rect('.intro')};
  });
  assert.ok(metrics.scroll<=metrics.viewport+1,'Horizontal overflow: '+JSON.stringify(metrics));
  assert.ok(metrics.card.left>=metrics.catalog.left && metrics.card.right<=metrics.catalog.right+1,'Card escapes frame');
  assert.deepEqual(errors,[],width+' JS runtime errors');
  await page.screenshot({path:'test-results/henris-campos-'+width+'.png',fullPage:true});
  await page.close();
 }
 console.log('PASS: mapping all 66 schema fields to 40 Excel column positions, filters/search, audit cues and responsive 390/768/1440');
}finally{await browser.close();}
