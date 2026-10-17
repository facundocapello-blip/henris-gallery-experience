import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const route='mapeo-pedidos-relaciones/';
const url=new URL(route,base.endsWith('/')?base:base+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try {
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  assert.equal(response.status(),200);
  assert.equal(await page.locator('body').getAttribute('data-prototype'),'henris-pedido-obras-pagos');
  assert.equal((await page.locator('.stage-bar').innerText()).includes('MAPEO DE PEDIDOS'),true);
  assert.equal(await page.locator('button#replay').count(),0,'Hide rough animations while mapping is reviewed');
  assert.equal(await page.locator('.sheet-table th').count(),3,'Preserve compact Excel sample');
  assert.equal(await page.locator('.phone').count(),1,'Preserve phone');
  assert.equal(await page.locator('.app-fields .app-field').count(),3,'Phone must display only app fields');
  const parts=await page.locator('.relation-master,.relation-child').allInnerTexts();
  assert.equal(parts.length,3);
  assert.ok(parts[0].includes('Pedido'));
  assert.ok(parts[1].includes('Obras'));
  assert.ok(parts[2].includes('Pagos'));
  assert.match(await page.locator('.relation-context').innerText(),/no pertenece a una obra/);
  const b=await page.evaluate(()=>{
   const rect=q=>{const r=document.querySelector(q).getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
   return{source:rect('.excel-panel'),phone:rect('.phone'),strip:rect('.relation-strip'),pedido:rect('.relation-master'),obras:rect('.relation-child:first-child'),pagos:rect('.relation-child:last-child'),stage:rect('.map-stage'),scroll:document.documentElement.scrollWidth,viewport:innerWidth};
  });
  assert.ok(b.scroll<=b.viewport+1,'Overflow: '+JSON.stringify(b));
  assert.ok(b.strip.y>=b.source.bottom-1 && b.strip.bottom<=b.stage.bottom+1,'Relationship diagram must use available room within the mapping card: '+JSON.stringify(b));
  assert.equal(await page.locator('.map-stage>.display-grid>.relation-strip').count(),1,'Diagram must live inside the approved composition');
  if(width>=701){
   assert.ok(Math.abs(b.source.y-b.phone.y)<35,'Excel and phone alignment lost');
   assert.ok(b.strip.right<=b.phone.x+1,'Diagram must not intrude into the phone column: '+JSON.stringify(b));
   assert.ok(b.pedido.right<b.obras.x,'Diagram columns overlap: '+JSON.stringify(b));
   assert.ok(b.obras.right<=b.pagos.x,'The two branches overlap: '+JSON.stringify(b));
  } else {
   assert.ok(b.strip.y>=b.phone.bottom,'Mobile relationship must follow the phone: '+JSON.stringify(b));
   assert.ok(b.pedido.bottom<b.obras.y,'Mobile relationship must be vertically ordered: '+JSON.stringify(b));
   assert.ok(b.obras.right<=b.pagos.x,'Mobile branches should not overlap');
  }
  assert.deepEqual(errors,[],'No JS runtime errors');
  await page.screenshot({path:'test-results/henris-relaciones-'+width+'.png',fullPage:true});
  await page.close();
 }
 console.log('PASS: Pedido → Obras and Pagos relationships, approved Excel and phone unchanged, rough replay hidden, no overflow 390/768/1440');
} finally{await browser.close();}
