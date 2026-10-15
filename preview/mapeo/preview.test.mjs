import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { chromium, expect } from '@playwright/test';

const root = fileURLToPath(new URL('.', import.meta.url));
const url = process.env.HENRIS_PREVIEW_URL || 'http://127.0.0.1:4182/Henris-mapeo-vista-previa.html';
const manifest = JSON.parse(await readFile(root + 'sources/manifest.json', 'utf8'));
const rules = vm.runInNewContext((await readFile(root + 'rules.js', 'utf8')) + '; RULES;');
let browser;
before(async () => { browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] }); await mkdir(root + 'capturas', { recursive: true }); });
after(async () => { await browser.close(); });

for (const [name, width, height] of [['escritorio', 1440, 1100], ['movil-390', 390, 844]]) {
  test(`${name}: 40 cabeceras auténticas, grupos y destinos sin equivalencias inventadas`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    const sourceGroups = manifest.groups.filter(g => g.id !== 'completo');
    assert.equal(sourceGroups.flatMap(g => g.cells).length, 40);
    let count = 0;
    for (const group of sourceGroups) {
      await page.locator(`#groups button[data-group="${group.id}"]`).click();
      await expect(page.locator('#sheet-image')).toHaveAttribute('alt', new RegExp(group.range));
      assert.ok(await page.locator('#sheet-image').evaluate(img => img.complete && img.naturalWidth > 0));
      for (const cell of group.cells) {
        await page.locator(`.source-hit[data-column="${cell.column}"]`).click();
        await expect(page.locator('.source-hit[aria-pressed=true]')).toHaveCount(1);
        await expect(page.locator('#origin-ref')).toHaveText(`${cell.cell} · ${cell.label}`);
        const rule = rules[cell.column];
        if (rule.status === 'pending') {
          await expect(page.locator('#destination-name')).toHaveText('Sin destino confirmado');
          await expect(page.locator('#pending-tray')).toBeVisible();
          await expect(page.locator('.phone-field.active')).toHaveCount(0);
        } else {
          await expect(page.locator('#destination-name')).toHaveText(rule.destination);
          await expect(page.locator(`.phone-field[data-target="${rule.target}"].active`)).toHaveCount(1);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, cell.cell + ' page overflow');
        const d = await page.locator('#connection-base').getAttribute('d'); assert.ok(d?.startsWith('M '));
        count++;
      }
    }
    assert.equal(count, 40); assert.deepEqual(errors, []);
    await page.close();
  });

  test(`${name}: animación, pausa real, continuación, avance y reinicio`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
    await page.goto(url); await page.getByRole('button', { name: 'Reproducir', exact: false }).click();
    await expect(page.locator('#traveler')).toBeVisible();
    await page.getByRole('button', { name: 'Pausar', exact: false }).click();
    const before = await page.locator('#field-counter').textContent();
    const animationStates = await page.evaluate(() => document.getAnimations().map(a => a.playState));
    assert.equal(animationStates.length, 2); assert.ok(animationStates.every(x => x === 'paused'));
    await page.waitForTimeout(2850);
    await expect(page.locator('#field-counter')).toHaveText(before);
    await page.getByRole('button', { name: 'Continuar', exact: false }).click();
    await expect(page.locator('#field-counter')).not.toHaveText(before, { timeout: 4000 });
    await page.locator('#restart').click(); await expect(page.locator('#field-counter')).toContainText('01 / 40');
    await expect(page.locator('#traveler')).toBeHidden();
    await page.locator('#next').click(); await expect(page.locator('#field-counter')).toContainText('02 / 40');
    await page.locator('#previous').click(); await expect(page.locator('#field-counter')).toContainText('01 / 40');
    await expect(page.locator('#previous')).toBeDisabled();
    await page.close();
  });

  test(`${name}: movimiento reducido, teclado, cabeceras ampliables y cuatro pantallas del teléfono`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto(url);
    await expect(page.locator('#static-mode')).toBeChecked(); await expect(page.locator('#play')).toBeDisabled();
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    await page.locator('#next').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#origin-ref')).toContainText('E1');
    await page.locator('#open-all').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#source-dialog')).toBeVisible();
    assert.ok(await page.locator('#full-source-image').evaluate(img => img.complete && img.naturalWidth > 3000));
    await page.keyboard.press('Escape'); await expect(page.locator('#source-dialog')).not.toBeVisible(); await expect(page.locator('#open-all')).toBeFocused();
    for (const [view, column] of [['client', 'AH'], ['works', 'D'], ['payments', 'Q'], ['finance', 'Y']]) {
      await page.locator(`.phone-tabs button[data-view="${view}"]`).click();
      await expect(page.locator(`.phone-tabs button[data-view="${view}"]`)).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#origin-ref')).toContainText(column + '1');
    }
    await page.close();
  });

  test(`${name}: archivo autónomo, sin solicitudes externas ni errores de consola; capturas`, async () => {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const requests = [], errors = [];
    page.on('request', r => { if (r.url().startsWith('http') && !r.url().startsWith('http://127.0.0.1:4182/')) requests.push(r.url()); });
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url); await page.waitForLoadState('networkidle');
    await page.screenshot({ path: root + `capturas/${name}-pagina.png`, fullPage: true });
    if (name === 'escritorio') await page.locator('#flow-canvas').screenshot({ path: root + 'capturas/escritorio-mapeo.png' });
    else {
      await page.locator('#phone').evaluate(n => window.scrollTo(0, scrollY + n.getBoundingClientRect().top - 64));
      const phoneBounds = await page.locator('#phone').boundingBox(), controlsBounds = await page.locator('.player').boundingBox();
      assert.ok(phoneBounds.y + phoneBounds.height <= controlsBounds.y + 1, 'El teléfono completo puede verse por encima de los controles');
      await page.screenshot({ path: root + 'capturas/movil-telefono.png' });
    }
    assert.deepEqual(requests, []); assert.deepEqual(errors, []);
    await page.close();
  });
}

test('artefacto autónomo: ejecución del HTML sin servidor ni recursos externos', async () => {
  const page = await browser.newPage();
  const requests = []; page.on('request', r => { if (!r.url().startsWith('data:')) requests.push(r.url()); });
  await page.route('**/*', route => route.abort());
  const html = await readFile(root + 'Henris-mapeo-vista-previa.html', 'utf8');
  await page.setContent(html); await expect(page.locator('#origin-ref')).toContainText('D1');
  await page.locator('#next').click(); await expect(page.locator('#origin-ref')).toContainText('E1');
  assert.ok(html.includes(manifest.sha256));
  assert.ok(!html.includes('fetch(')); assert.ok(!html.includes('localStorage.setItem'));
  assert.equal(Object.values(rules).filter(r => r.status === 'pending').length, 26);
  assert.deepEqual(requests, []);
  await page.close();
});

test('apertura mediante file:// en el navegador del entorno', async t => {
  const page = await browser.newPage();
  try {
    await page.goto(new URL('Henris-mapeo-vista-previa.html', import.meta.url).href);
    await expect(page.locator('#origin-ref')).toContainText('D1');
  } catch (error) {
    if (error.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR')) t.skip('La política del navegador bloquea file://; la apertura directa de archivos no puede verificarse aquí.');
    else throw error;
  }
  await page.close();
});

test('recorrido automático completo: 40 campos, final y pose de celebración', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference' });
  await page.goto(url); await page.locator('#speed').selectOption('1200');
  const seen = new Set();
  await page.exposeFunction('recordPreviewField', text => seen.add(text));
  await page.evaluate(() => {
    const counter = document.querySelector('#field-counter');
    window.recordPreviewField(counter.textContent);
    new MutationObserver(() => window.recordPreviewField(counter.textContent)).observe(counter, { childList: true, subtree: true, characterData: true });
  });
  await page.locator('#play').click();
  await expect(page.locator('#playback-status')).toHaveText('Recorrido completo · 40 campos revisados.', { timeout: 55000 });
  assert.equal(seen.size, 40); await expect(page.locator('#mascot')).toHaveClass('mascot pose-celebrate');
  await expect(page.locator('#traveler')).toBeHidden();
  await page.close();
});
