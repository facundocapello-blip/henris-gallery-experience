import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base=process.argv[2]||'https://facundocapello-blip.github.io/henris-gallery-experience/';
const url=new URL('mapeo-hibrido-v3-v1/',base.endsWith('/')?base:base+'/').href;
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.HENRIS_BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
try{
for(const width of [1440,390,768]){
 const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
 assert.equal(response.status(),200);
 assert.equal(await page.locator('body').getAttribute('data-prototype'),'henris-v3-v1-static');
 assert.equal(await page.locator('table th').count(),3);
 assert.equal(await page.locator('.phone').count(),1);
 assert.equal(await page.locator('.selected td').count(),3);
 assert.ok((await page.locator('.selected').innerText()).includes('HG024'));
 assert.ok((await page.locator('.app-fields').innerText()).includes('Silent lake'));
 assert.ok((await page.locator('.app-fields').innerText()).includes('100x150'));
 const b=await page.evaluate(()=>{
 const rect=q=>{const r=document.querySelector(q).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
 return{source:rect('.excel-panel'),phone:rect('.phone'),connector:rect('.visual-connector'),stage:rect('.map-stage'),scroll:document.documentElement.scrollWidth,viewport:innerWidth};
 });
 assert.ok(b.scroll<=b.viewport+1,JSON.stringify(b));
 assert.ok(b.source.height<350,'Excel too tall: '+b.source.height);
 if(width>=701){assert.ok(b.source.right<b.connector.x && b.connector.right<b.phone.x,'Horizontal mapping elements overlap: '+JSON.stringify(b));assert.ok(Math.abs(b.source.y-b.phone.y)<35,'Source and phone are not aligned at the top: '+JSON.stringify(b));}
 else assert.ok(b.source.bottom<b.connector.y && b.connector.bottom<b.phone.y,'Mobile mapping order incorrect: '+JSON.stringify(b));
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'test-results/henris-hybrid-static-'+width+'.png',fullPage:true});
 await page.close();
}
console.log('HYBRID_STATIC_PREVIEW_OK: compact source + arrow + phone, no overflow or overlap, 390/768/1440');
}finally{await browser.close();}
