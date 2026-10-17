import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('qwen-presentacion/',base.endsWith('/')?base:base+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response.status(),200,'Hosted Qwen page must load');
  assert.match(await page.title(),/Henris Gallery/);
  assert.equal(await page.locator('#mapeo .mapeo__card').count(),13,'Preserve 13 Qwen examples');
  await page.locator('.filter-btn[data-filter="Pagos"]').click();
  assert.equal(await page.locator('#mapeo .mapeo__card').count(),3,'Payments filter should show 3 examples');
  await page.locator('input#search').fill('SEÑA');
  assert.ok((await page.locator('#mapeo .mapeo__card').count())>=1,'Search must work');
  await page.locator('input#search').fill('');
  await page.locator('.filter-btn[data-filter="todos"]').click();
  await page.locator('.mapeo__card').first.click();
  assert.match(await page.locator('#mapeoDetail').innerText(),/Origen · Excel/,'Click detail');
  await page.locator('.demo__nav-item[data-view="pagos"]').click();
  assert.equal(await page.locator('.demo__view.active').getAttribute('data-view'),'pagos');
  await page.locator('.demo__nav-item[data-view="pedidos"]').click();
  assert.deepEqual(errors,[],'No JS exceptions');
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,cardCount:document.querySelectorAll('.mapeo__card').length}));
  assert.ok(metrics.scrollWidth<=metrics.width+1,JSON.stringify(metrics));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.screenshot({path:'test-results/henris-qwen-'+width+'-inicio.png',fullPage:false});
  await page.locator('#mapeo').scrollIntoViewIfNeeded();
  await page.screenshot({path:'test-results/henris-qwen-'+width+'-mapeo.png',fullPage:false});
  if(width===390){
   const old=await page.locator('.nav__links').evaluate(e=>getComputedStyle(e).display);
   await page.locator('.nav__burger').click();
   const newer=await page.locator('.nav__links').evaluate(e=>getComputedStyle(e).display);
   console.log('Known mobile nav limitation (original Qwen code):',old,'to',newer);
  }
  await page.close();
 }
 console.log('QWEN_ISOLATED_PREVIEW_OK: original HTML 13 mapping cards, filtering, details, simulation tabs, 390/1440');
}finally{await browser.close();}
