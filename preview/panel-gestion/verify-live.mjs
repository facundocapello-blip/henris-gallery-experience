import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 const stable=await fetch(root);
 assert.equal(stable.status,200,'Main homepage unavailable');
 assert.ok((await stable.text()).includes('src="app.js"'),'Original homepage changed');
 assert.equal((await fetch(root+'muestra-mapeo/')).status,200,'Mapping preview unavailable');
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:844},hasTouch:width===390,isMobile:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(root+'panel-gestion-v2/',{waitUntil:'networkidle',timeout:30000});
  await page.locator('.balance-number').waitFor();
  assert.equal(await page.locator('.bottom-nav button').count(),4,'Expected four real tabs');
  assert.equal((await page.locator('.bottom-nav button.active').innerText()).trim(),'Panel');
  assert.ok((await page.locator('.circuit').innerText()).includes('Circuito integrado'),'Missing relationship diagram');
  assert.equal((await page.locator('.order-card .detail-link').first().innerText()).trim(),'2 obras · Ver detalle ›');
  if(width===390){
    assert.ok(await page.evaluate(()=>{const nav=document.querySelector('.bottom-nav').getBoundingClientRect();return nav.bottom <= window.innerHeight+1 && nav.top >= 0;}),'Mobile bottom navigation not visible');
  }
  await page.screenshot({path:'test-results/panel-premium-'+width+'.png',fullPage:true});
  assert.equal((await page.locator('.balance-number').innerText()).trim(),'$710.500');
  assert.equal(await page.locator('.order-card').count(),3);
  await page.locator('button[data-action="detail"]').first().click();
  assert.ok((await page.locator('.page-title').innerText()).includes('12350'));
  await page.locator('button[data-action="add-payment"]').last().click();
  await page.locator('input[name="amount"]').fill('400');
  assert.ok((await page.locator('#payment-preview').innerText()).includes('$659.600'),'Payment preview wrong');
  await page.locator('form#payment-form button[type="submit"]').click();
  assert.ok((await page.locator('.money-row.balance').innerText()).includes('$659.600'),'Payment confirmation wrong');
  await page.locator('button[data-action="undo"]').click();
  assert.ok((await page.locator('.money-row.balance').innerText()).includes('$660.000'),'Payment undo wrong');
  await page.locator('button[data-action="home"]').click();
  await page.locator('button[data-action="new"]').first().click();
  await page.locator('input[name="customer"]').fill('Cliente QA');
  await page.locator('#order-form button[type="submit"]').click();
  await page.locator('input[name="title"]').fill('Obra QA');
  await page.locator('input[name="price"]').fill('1000');
  await page.locator('#item-form button[type="submit"]').click();
  await page.locator('button[data-action="add-payment"]').first().click();
  await page.locator('input[name="amount"]').fill('200');
  await page.locator('#payment-form button[type="submit"]').click();
  assert.ok((await page.locator('.money-row.balance').innerText()).includes('$800'),'Multi-step sale wrong');
  await page.reload({waitUntil:'networkidle'});
  await page.locator('button[data-action="orders"]').click();
  assert.ok((await page.locator('main').innerText()).includes('Cliente QA'),'Persistence failed');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Horizontal overflow');
  assert.deepEqual(errors,[], 'Browser JS errors');
  await page.close();
 }
 console.log('PASS: published panel desktop + 390px, payments preview/confirm/undo, new order, works, persistence, stable versions');
}finally{await browser.close();}
