import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('gemini-presentacion/',root.endsWith('/')?root:root+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(r.status(),200);
  await page.locator('.mapping-card').first().waitFor({timeout:10000});
  assert.equal(await page.locator('.mapping-card').count(),13,'Gemini original: 13 mapping examples');
  await page.screenshot({path:'test-results/henris-gemini-'+width+'-hero.png',fullPage:false});
  await page.locator('#mapeo').scrollIntoViewIfNeeded();
  await page.screenshot({path:'test-results/henris-gemini-'+width+'-mapeo.png',fullPage:false});
  await page.locator('.filter-btn[data-filter="Pagos"]').click();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.mapping-card').count(),3,'Pagos filters to 3 examples');
  await page.locator('.mapping-card').first().click();
  await page.waitForTimeout(650);
  assert.equal(await page.locator('.mapping-card.target-hit').count(),1,'Mapping reveal animation works');
  assert.match(await page.locator('.mapping-card.active').innerText(),/Regla de Transformación/i);
  await page.locator('.filter-btn[data-filter="all"]').click();
  await page.waitForTimeout(450);
  assert.equal(await page.locator('.mapping-card').count(),13);
  const sizes=await page.evaluate(()=>({vw:innerWidth,scroll:document.documentElement.scrollWidth,twind:!!document.querySelector('style[type="text/tailwindcss"]')}));
  assert.ok(sizes.scroll<=sizes.vw+1,'Horizontal overflow '+JSON.stringify(sizes));
  console.log('Gemini preview width '+width+': filtered, animated, 13 cards, errors: '+JSON.stringify(errors));
  await page.close();
 }
}finally{await browser.close()}
