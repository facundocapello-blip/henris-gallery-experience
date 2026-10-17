import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('claude-haiku-presentacion/',root.endsWith('/')?root:root+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390,deviceScaleFactor:1});
  const jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  assert.equal(response.status(),200);
  assert.match(await page.title(),/Henris Gallery/);
  assert.equal(await page.locator('.map-item').count(),14,'Claude Haiku original should show 14 examples');
  await page.screenshot({path:'test-results/henris-haiku-'+width+'-inicio.png',fullPage:false});
  if(width===390){
   await page.locator('#menuToggle').click();
   assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'),'true');
   assert.match(await page.locator('#mainNav').getAttribute('class'),/open/);
   await page.locator('#menuToggle').click();
  }
  await page.locator('#mapeo').scrollIntoViewIfNeeded();
  await page.locator('.filter[data-category="Pagos"]').click();
  assert.equal(await page.locator('.map-item').count(),3,'Three payment-related examples');
  await page.locator('#mapSearch').fill('Medio_Pago');
  assert.equal(await page.locator('.map-item').count(),1,'Search filters mapped fields');
  await page.locator('#mapSearch').fill('');
  await page.locator('.filter[data-category="Todos"]').click();
  assert.equal(await page.locator('.map-item').count(),14,'All mapping samples restored');
  await page.locator('.map-item[data-id="m02"]').click();
  assert.match(await page.locator('#mapDetail').innerText(),/Instagram/,'Channel mapping detail');
  assert.match(await page.locator('#mapDetail').innerText(),/Columna AM/);
  await page.screenshot({path:'test-results/henris-haiku-'+width+'-mapeo.png',fullPage:false});
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await page.locator('.app-tab[data-view="pagos"]').click();
  let before=await page.locator('.sums').innerText();
  assert.match(before,/300.000/,'Initial remaining balance');
  await page.locator('#payAmount').fill('100000');
  await page.locator('#payForm button[type="submit"]').click();
  let after=await page.locator('.sums').innerText();
  assert.match(after,/200.000/,'Balance after accepted payment');
  assert.match(after,/1.000.000/,'Paid sum after accepted payment');
  await page.locator('#payAmount').fill('300000');
  await page.locator('#payForm button[type="submit"]').click();
  assert.match(await page.locator('#payMsg').innerText(),/supera el saldo/);
  assert.match(await page.locator('.sums').innerText(),/200.000/,'Overpay must not change balance');
  await page.screenshot({path:'test-results/henris-haiku-'+width+'-pagos.png',fullPage:false});
  const metric=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(metric.scroll<=metric.viewport+1,'Page horizontal overflow: '+JSON.stringify(metric));
  assert.deepEqual(jsErrors,[],'JS exceptions width '+width);
  await page.close();
 }
 console.log('CLAUDE_HAIKU_ORIGINAL_OK: 14 mapping examples, responsive menu, search/filter, payment simulation, 390/768/1440, no JS errors or overflow');
}finally{await browser.close();}
