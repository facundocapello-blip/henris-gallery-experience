import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const root=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const route=process.argv[3]||'muestra-mapeo-compacta/';
const target=new URL(route,root.endsWith('/')?root:root+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try {
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(target,{waitUntil:'networkidle',timeout:30000});
  assert.equal(await page.locator('body').getAttribute('data-preview-version'),'muestra-compacta');
  assert.equal(await page.locator('.compact-table th').count(),3,'Exactly three useful Excel columns');
  assert.equal(await page.locator('.compact-table tbody tr').count(),2,'Only two source records');
  assert.equal(await page.locator('.source-hit').count(),3,'Exactly three clickable source cells');
  const sourceText=await page.locator('.compact-table').innerText();
  for(const value of ['HG024','Silent lake','100x150'])assert.ok(sourceText.includes(value));
  assert.equal(await page.locator('#destination-fields .phone-field').count(),3);
  assert.equal(await page.locator('.phone-note').count(),0,'No explanatory copy inside phone');
  const rects=await page.evaluate(()=>{
   const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
   return{source:rect('.source-panel'),phone:rect('.phone'),interpretation:rect('.interpretation'),scrollWidth:document.documentElement.scrollWidth,win:innerWidth};
  });
  assert.ok(rects.source.height<275,'Excel still too tall');
  assert.ok(rects.scrollWidth<=rects.win+2,'Horizontal overflow');
  if(width===1440)assert.ok(rects.source.right<rects.interpretation.x&&rects.interpretation.right<rects.phone.x,'Not laid out Excel → explanation → phone');
  if(width===390)assert.ok(rects.source.bottom<rects.phone.y,'Mobile order must be Excel then phone');
  await page.screenshot({path:'test-results/henris-compact-'+width+'-inicio.png',fullPage:true});
  await page.locator('.source-hit[data-index="1"]').click();
  await page.waitForFunction(() => document.querySelector('.phone-field[data-index="1"] .phone-field-value')?.textContent === 'Silent lake',null,{timeout:7500});
  const field2=await page.locator('.phone-field[data-index="1"] .phone-field-value').innerText();
  assert.equal(field2,'Silent lake');
  await page.locator('#restart').click();
  assert.equal(await page.locator('.phone-field-value.empty').count(),3);
  await page.locator('#play').click();
  await page.getByText('Recorrido completo · 3 de 3 campos cargados.').waitFor({timeout:18000});
  for(const value of ['HG024','Silent lake','100x150'])assert.equal(await page.locator('.phone-field-value').filter({hasText:value}).count(),1,value);
  if(width===1440){const p=await page.locator('#curve-active').getAttribute('d');assert.ok(p?.startsWith('M ')&&p.includes(' V ')&&p.includes(' H '),'SVG connection should travel via the clear lane beside the phone');}
  await page.screenshot({path:'test-results/henris-compact-'+width+'-completo.png',fullPage:true});
  await page.locator('#open-source').click();
  assert.equal(await page.locator('#source-dialog').evaluate(x=>x.open),true,'Full screenshot must remain accessible');
  await page.locator('#close-source').click();
  assert.equal(await page.locator('.pending-list button').count(),26,'Pending mappings changed');
  await page.locator('.pending-list button').first().click();
  assert.ok((await page.locator('#pending-detail').innerText()).includes('identifica'));
  assert.deepEqual(errors,[],'Unexpected JS page errors');
  await page.close();
 }
 console.log('PASS: compact Excel / 3 fields / mapping animation / phone / mobile + desktop / full original screenshot / original pending list');
} finally{await browser.close();}
