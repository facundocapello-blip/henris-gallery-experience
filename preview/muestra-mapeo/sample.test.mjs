import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const root = fileURLToPath(new URL('.', import.meta.url));
const base = process.env.HENRIS_SAMPLE_URL || 'http://127.0.0.1:4183/';
let browser;
before(async () => {
  const executablePath = process.env.HENRIS_BROWSER_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
  await mkdir(root + 'capturas', { recursive: true });
});
after(async () => browser.close());
const values = ['HG024', 'Silent lake', '100x150'];

async function assertAnchors(page) {
  const error = await page.evaluate(() => {
    const canvas = document.querySelector('#flow-canvas').getBoundingClientRect();
    const path = document.querySelector('#curve-base');
    const source = document.querySelector('.source-hit[aria-pressed=true]').getBoundingClientRect();
    const target = document.querySelector('.phone-field.active').getBoundingClientRect();
    const a = path.getPointAtLength(0), b = path.getPointAtLength(path.getTotalLength());
    return Math.max(Math.abs(canvas.left+a.x-source.left-source.width/2),Math.abs(canvas.top+a.y-source.bottom),Math.abs(canvas.left+b.x-target.left-5),Math.abs(canvas.top+b.y-target.top-target.height/2));
  });
  assert.ok(error < 2, 'Los extremos deben coincidir con las celdas correctas: '+error);
}

for (const [name, width, height] of [['desktop',1440,1100],['mobile-390',390,844]]) {
  test(`${name}: carga progresiva de nombre y valor, una conexión y llegada persistente`, async () => {
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
    await page.goto(base);
    await expect(page.locator('.phone-field-value')).toHaveText(['Por completar','Por completar','Por completar']);
    for(let i=0;i<3;i++) {
      await page.locator(`.field-choices button[data-index="${i}"]`).click();
      await expect(page.locator('#transfer-card')).toBeVisible();
      await expect(page.locator('#transfer-value')).toHaveText(values[i]);
      assert.equal(await page.locator('#curve-active').count(),1);
      await assertAnchors(page);
      await expect(page.locator(`.phone-field[data-index="${i}"] .phone-field-value`)).toHaveText(values[i],{timeout:4000});
      for(let j=0;j<=i;j++) await expect(page.locator(`.phone-field[data-index="${j}"] .phone-field-value`)).toHaveText(values[j]);
      for(let j=i+1;j<3;j++) await expect(page.locator(`.phone-field[data-index="${j}"] .phone-field-value`)).toHaveText('Por completar');
    }
    await expect(page.locator('#loaded-count')).toHaveText('3 de 3 campos cargados');
    await expect(page.locator('#mascot')).toHaveClass('mascot pose-celebrate',{timeout:2000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.close();
  });

  test(`${name}: pausa real, resize durante pausa, continuación y recorrido automático`,async()=>{
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
    await page.goto(base);await page.locator('#play').click();await page.waitForTimeout(350);await page.locator('#play').click();
    await expect(page.locator('#play-label')).toHaveText('Continuar');
    const transform=await page.locator('#transfer-card').evaluate(n=>n.style.transform);
    await page.waitForTimeout(600);assert.equal(await page.locator('#transfer-card').evaluate(n=>n.style.transform),transform);
    await expect(page.locator('.phone-field-value')).toHaveText(['Por completar','Por completar','Por completar']);
    await page.setViewportSize({width:width===390?430:1100,height});await page.waitForTimeout(80);await assertAnchors(page);
    await expect(page.locator('#play-label')).toHaveText('Continuar');
    await page.locator('#play').click();await expect(page.locator('#playback-status')).toHaveText('Recorrido completo · 3 de 3 campos cargados.',{timeout:10000});
    await expect(page.locator('.phone-field-value')).toHaveText(values);
    await page.locator('#restart').click();await expect(page.locator('.phone-field-value')).toHaveText(['Por completar','Por completar','Por completar']);
    await page.close();
  });

  test(`${name}: pendientes sin destinos, anterior/siguiente, zoom y sin movimiento`,async()=>{
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
    await page.goto(base);await page.locator('#static-mode').check();await expect(page.locator('#play')).toBeDisabled();
    await page.locator('.source-hit[data-index="0"]').click();await expect(page.locator('.phone-field-value').nth(0)).toHaveText(values[0]);
    await page.locator('#next').click();await expect(page.locator('.phone-field-value').nth(1)).toHaveText(values[1]);
    await page.locator('#previous').click();await expect(page.locator('#cell-reference')).toHaveText('Hoja1!D3');
    await page.locator('#zoom-in').click();await assertAnchors(page);await page.locator('#zoom-out').click();await assertAnchors(page);
    await expect(page.locator('#pending-list button')).toHaveCount(26);
    await page.locator('#pending-list button').first().click();await expect(page.locator('#connections')).toHaveCSS('visibility','hidden');
    await expect(page.locator('#trace-destination')).toHaveText('Pendiente · sin conexión');
    await expect(page.locator('.phone-field-value')).toHaveText([values[0],values[1],'Por completar']);
    await expect(page.locator('#mascot')).toHaveClass('mascot pose-worry');
    await page.locator('#restart').click();await expect(page.locator('.phone-field-value')).toHaveText(['Por completar','Por completar','Por completar']);
    await page.close();
  });

  test(`${name}: preferencia reducida, teclado, captura auténtica, consola y responsive`,async()=>{
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    const response=await page.goto(base);assert.equal(response.status(),200);
    await expect(page.locator('body')).toHaveAttribute('data-preview-version','muestra-2');
    await expect(page.locator('#static-mode')).toBeChecked();await expect(page.locator('#play')).toBeDisabled();
    assert.ok(await page.locator('#source-image').evaluate(n=>n.complete&&n.naturalWidth>7000&&n.naturalHeight>500));
    assert.equal(await page.locator('.sheet-stage img').count(),1);
    for(let i=0;i<3;i++){await page.locator(`.field-choices button[data-index="${i}"]`).focus();await page.keyboard.press('Enter')}
    await expect(page.locator('.phone-field-value')).toHaveText(values);await expect(page.locator('#transfer-card')).toBeHidden();
    await page.locator('#open-source').focus();await page.keyboard.press('Enter');await expect(page.locator('#source-dialog')).toBeVisible();
    await page.keyboard.press('Escape');await expect(page.locator('#source-dialog')).not.toBeVisible();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('#open-source').evaluate(n=>n.blur());
    if(name==='desktop')await page.locator('#flow-canvas').screenshot({path:root+'capturas/desktop-final.png'});
    else {await page.locator('#phone').evaluate(n=>scrollTo(0,scrollY+n.getBoundingClientRect().top-64));await page.screenshot({path:root+'capturas/mobile-final.png'})}
    assert.deepEqual(errors,[]);await page.close();
  });
}
