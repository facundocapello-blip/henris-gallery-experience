import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('matias-propuesta-final/',root.endsWith('/')?root:root+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for (const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const r=await page.goto(url,{waitUntil:'networkidle',timeout:30000});assert.equal(r.status(),200);
  assert.equal(await page.locator('body').getAttribute('data-preview'),'astra-mapeo-66');
  assert.equal(await page.locator('#tabs .tab').count(),5);
  assert.equal(await page.locator('#fields .field').count(),19);
  assert.equal(await page.locator('.relation-card').count(),4,'Client/order/item/payment relationship cards remain visible');
  assert.equal(await page.locator('.intro h1').innerText(),'Del Excel al pedido.');
  assert.equal(await page.locator('.connector').count(),1,'Visible origin-destination connector');
  assert.equal(await page.locator('#detail-title').innerText(),'Canal Origen');
  assert.equal(await page.locator('#origins .column-letter').first().innerText(),'AM');
  assert.equal(await page.locator('#origins .column-name').first().innerText(),'VENTA');
  await page.screenshot({path:'test-results/henris-matias-final-'+width+'-inicio.png',fullPage:false});
  await page.locator('#tabs [data-tab="todos"]').click();
  assert.equal(await page.locator('#fields .field').count(),66);
  await page.locator('#status').selectOption('revisar');
  assert.equal(await page.locator('#fields .field').count(),10);
  await page.locator('#status').selectOption('todos');
  await page.locator('#tabs [data-tab="Pedidos"]').click();
  const selected=page.locator('#fields [data-field="Canal_Origen"]');
  await selected.click();
  assert.equal(await page.locator('#detail-technical').innerText(),'Canal_Origen');
  assert.equal(await page.locator('#origins .column-letter').first().innerText(),'AM');
  assert.equal(await page.locator('#origins .column-name').first().innerText(),'VENTA');
  await page.locator('#search').fill('pendiente');
  assert.ok(await page.locator('#fields .field').count()>0,'Search by rule must work');
  await page.locator('#search').fill('');
  await page.locator('#tabs [data-tab="Pagos"]').click();
  assert.equal(await page.locator('#fields .field').count(),14);
  await page.locator('#fields [data-field="Importe"]').click();
  const headers=await page.locator('#origins .column-name').allInnerTexts();
  assert.deepEqual(headers,['SEÑA','SEGUNDA PARTE PAGO']);
  await page.locator('#tabs [data-tab="Clientes"]').click();
  assert.equal(await page.locator('#fields .field').count(),7);
  await page.locator('#tabs [data-tab="Pedido_Items"]').click();
  assert.equal(await page.locator('#fields .field').count(),26);
  await page.locator('#tabs [data-tab="Pedidos"]').click();
  await page.locator('#fields [data-field="Canal_Origen"]').click();
  assert.equal(await page.locator('#detail').getAttribute('class'),'detail reveal','Connector should respond to field selection');
  if(width===390){
   assert.equal(await page.locator('#back').isVisible(),true);
   await page.waitForTimeout(850);
   const top=await page.locator('#detail').evaluate(e=>e.getBoundingClientRect().top);
   assert.ok(top>=-25 && top<=450,'Selected mobile field detail must enter the visible upper half of the screen: '+top);
  }
  const metrics=await page.evaluate(()=>{
   const xy=q=>{const r=document.querySelector(q).getBoundingClientRect();return{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width}};
   return{viewport:window.innerWidth,scroll:document.documentElement.scrollWidth,sidebar:xy('.side'),detail:xy('.detail'),split:xy('.split')};
  });
  assert.ok(metrics.scroll<=metrics.viewport+1,'Horizontal page overflow: '+JSON.stringify(metrics));
  if(width>=681)assert.ok(metrics.sidebar.right<=metrics.detail.left,'Two panel overlap: '+JSON.stringify(metrics));
  else assert.ok(metrics.sidebar.bottom<=metrics.detail.top+1,'Mobile panel order incorrect: '+JSON.stringify(metrics));
  assert.deepEqual(errors,[],'Javascript errors at '+width);
  await page.screenshot({path:'test-results/henris-astra-'+width+'-detalle.png',fullPage:false});
  await page.close();
 }
 console.log('SUCCESS Final Matias composition with 66 mapped fields, direct/derived/review badges, tabs, search, mobile navigation, no overlap 390/768/1440');
}finally{await browser.close();}
