import { test, expect } from '@playwright/test';

async function addDemo(page) {
  await page.getByLabel('Cliente ficticio').fill('Clara Vidal');
  await page.getByLabel('Nombre de la obra').fill('Luz de tarde');
  await page.getByLabel('Precio unitario ($)', { exact: true }).fill('80000');
  await page.getByRole('button', { name: '+ Agregar obra', exact: true }).click();
  await page.getByLabel('Nombre de la obra').nth(1).fill('Horizonte');
  await page.getByLabel('Cantidad', { exact: true }).nth(1).fill('2');
  await page.getByLabel('Precio unitario ($)', { exact: true }).nth(1).fill('35000');
  await page.getByRole('button', { name: 'Crear pedido →', exact: true }).click();
}
test.beforeEach(async ({ page }) => { await page.goto('/legacy.html'); });

test('recorrido completo, pausa real, repetición, mapeo y controles', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.getByRole('button', { name: 'Iniciar recorrido →', exact: true }).click();
  await expect(page.locator('.guide-bar')).toContainText('2/5');
  await expect(page.getByText('Ejemplo ilustrativo · Datos ficticios', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ordenar la información →', exact: true }).click();
  await expect(page.locator('#sequence-status')).toContainText('1/4');
  await expect(page.locator('.fly-value').first()).toBeVisible();
  await page.getByRole('button', { name: 'Pausar', exact: true }).click();
  await page.waitForTimeout(2200);
  await expect(page.locator('#sequence-status')).toContainText('1/4');
  expect(await page.evaluate(() => document.getAnimations().every(a => a.playState === 'paused'))).toBe(true);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await expect(page.locator('#sequence-status')).toContainText('4/4', { timeout: 10000 });
  await page.getByRole('button', { name: 'Repetir animación ↻', exact: true }).click();
  await expect(page.locator('#sequence-status')).toContainText('1/4');
  await page.getByRole('button', { name: 'Omitir secuencia', exact: true }).click();
  await expect(page.locator('#sequence-status')).toContainText('4/4');
  await page.locator('[data-field=precio][data-side=source]').first().click();
  await expect(page.locator('[data-field=precio][data-side=destination]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#field-explanation')).toContainText('centavos enteros');
  await page.getByLabel('Sin movimiento', { exact: true }).check();
  await page.getByRole('button', { name: 'Repetir animación ↻', exact: true }).click();
  expect(await page.locator('.fly-value').count()).toBe(0);
  await page.getByRole('button', { name: 'Avanzar →', exact: true }).click();
  await expect(page.locator('.map-row')).toHaveCount(19);
  await page.getByRole('button', { name: 'Precio por unidad ↗', exact: true }).click();
  await expect(page.locator('#mapping-explanation')).toContainText('precioUnitario');
  await page.getByRole('button', { name: 'Retroceder', exact: false }).click();
  await expect(page).toHaveURL(/transformacion/);
  await page.getByRole('button', { name: 'Avanzar →', exact: true }).click();
  await page.getByRole('button', { name: 'Avanzar →', exact: true }).click();
  await addDemo(page);
  await page.getByRole('button', { name: 'Avanzar →', exact: true }).click();
  await expect(page).toHaveURL(/resultado/);
  await expect(page.locator('.result-order')).toContainText('Clara Vidal');
  await page.getByRole('button', { name: 'Volver a iniciar ↻', exact: true }).click();
  await expect(page.locator('.guide-bar')).toContainText('1/5');
  await page.getByRole('button', { name: 'Salir', exact: true }).click();
  await expect(page.locator('.guide-bar')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('pedido, validaciones, pagos, persistencia, navegación y reinicio', async ({ page }) => {
  await page.getByRole('link', { name: 'Simulador', exact: true }).click();
  await page.getByRole('button', { name: 'Crear pedido →', exact: true }).click();
  await expect(page.locator('#order-error')).toContainText('nombre del cliente');
  await page.getByLabel('Cliente ficticio').fill('Demo'); await page.getByLabel('Nombre de la obra').fill('Obra');
  for (const invalid of ['0', '-10', 'Infinity', '1.001']) {
    await page.getByLabel('Precio unitario ($)', { exact: true }).fill(invalid);
    await page.getByRole('button', { name: 'Crear pedido →', exact: true }).click();
    await expect(page.locator('.order-card')).toHaveCount(0);
    await expect(page.locator('#order-error')).not.toBeEmpty();
  }
  await page.getByLabel('Precio unitario ($)', { exact: true }).fill('100'); await page.getByLabel('Cantidad', { exact: true }).fill('1.5');
  await page.getByRole('button', { name: 'Crear pedido →', exact: true }).click(); await expect(page.locator('#order-error')).toContainText('entero');
  await page.getByLabel('Cantidad', { exact: true }).fill('1');
  await addDemo(page);
  const card = page.locator('.order-card');
  await expect(card.locator('.status')).toHaveText('Pendiente');
  await expect(card.locator('.order-metrics')).toContainText('150.000');
  await page.getByLabel('Registrar pago ($)', { exact: true }).fill('150000.01');
  await page.getByRole('button', { name: 'Registrar pago', exact: true }).click();
  await expect(card.locator('.form-error')).toContainText('superar el saldo');
  for (const value of ['-1', '0', 'NaN']) { await page.getByLabel('Registrar pago ($)', { exact: true }).fill(value); await page.getByRole('button', { name: 'Registrar pago', exact: true }).click(); await expect(card.locator('.status')).toHaveText('Pendiente'); }
  await page.getByLabel('Registrar pago ($)', { exact: true }).fill('50000'); await page.getByRole('button', { name: 'Registrar pago', exact: true }).click();
  await expect(card.locator('.status')).toHaveText('Parcial'); await expect(card.locator('.balance')).toContainText('100.000');
  await page.reload(); await expect(page.locator('.order-card .status')).toHaveText('Parcial');
  await page.getByRole('button', { name: 'Completar con el saldo', exact: true }).click(); await page.getByRole('button', { name: 'Registrar pago', exact: true }).click();
  await expect(card.locator('.status')).toHaveText('Pagado'); await expect(card.locator('.balance')).toContainText('$ 0');
  await page.getByText('Historial · 2 pago(s)', { exact: true }).click();
  await expect(card.locator('.payment-history')).toContainText('50.000');
  for (const name of ['Obras', 'Pagos', 'Resumen', 'Pedidos']) { await page.getByRole('button', { name, exact: true }).click(); await expect(page.locator('main')).toContainText('Clara Vidal'); }
  await page.reload(); await expect(page.locator('.status')).toHaveText('Pagado');
  await page.getByRole('button', { name: 'Reiniciar demo', exact: true }).click(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click(); await expect(card).toHaveCount(1);
  await page.getByRole('button', { name: 'Reiniciar demo', exact: true }).click(); await page.getByRole('button', { name: 'Borrar demo', exact: true }).click();
  await expect(card).toHaveCount(0); await page.reload(); await expect(card).toHaveCount(0);
});

test('390 px / escritorio, teclado, sin desbordamiento ni errores de consola', async ({ page }, testInfo) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Ir al contenido', exact: true })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
  for (const route of ['inicio', 'transformacion', 'mapeo', 'simulador', 'resultado']) {
    await page.goto('/legacy.html#' + route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
    await expect(page.locator('h1')).toBeVisible();
  }
  await page.goto('/legacy.html#simulador'); await addDemo(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-simulator.png`, fullPage: true });
  await page.goto('/legacy.html'); await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('movimiento reducido, almacenamiento corrupto y texto seguro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/legacy.html#transformacion'); await expect(page.getByLabel('Sin movimiento', { exact: true })).toBeChecked(); await expect(page.locator('#sequence-status')).toContainText('4/4');
  await page.evaluate(() => localStorage.setItem('henris-gallery-v1', '{broken')); await page.goto('/legacy.html#simulador'); await page.reload();
  await expect(page.getByText(/No pudimos recuperar/)).toBeVisible();
  await page.getByLabel('Cliente ficticio').fill('<img src=x onerror=alert(1)>');
  await page.getByLabel('Nombre de la obra').fill('<script>window.bad=true</script>');
  await page.getByLabel('Precio unitario ($)', { exact: true }).fill('1,20');
  await page.getByRole('button', { name: 'Crear pedido →', exact: true }).click();
  await expect(page.locator('.order-card h3')).toHaveText('<img src=x onerror=alert(1)>');
  expect(await page.locator('.order-card img, .order-card script').count()).toBe(0);
  await page.reload(); await expect(page.locator('.order-card h3')).toHaveText('<img src=x onerror=alert(1)>');
});

test('Canvas: canales, estados independientes y mascota disponible', async ({ page }) => {
  const asset = await page.request.get('/assets/mascota-poses.png'); expect(asset.status()).toBe(200); expect(asset.headers()['content-type']).toBe('image/png');
  await expect(page.getByRole('img', { name: 'Mascota de Henris Gallery · presentación con micrófono', exact: true })).toBeVisible();
  await page.goto('/legacy.html#mapeo');
  for (const source of ['Teléfono', 'DNI / CUIL', 'Código / #Art', 'Medidas', 'Borde blanco / Passe-partout', 'Seña', 'Fecha del pago']) await expect(page.getByRole('button', { name: source + ' ↗', exact: true })).toBeVisible();
  await page.goto('/legacy.html#transformacion');
  const ids = await page.locator('[data-side=destination]').evaluateAll(nodes => nodes.map(n => n.dataset.field));
  expect(ids.length).toBe(19);
  for (const id of ids) {
    await page.locator(`[data-field="${id}"][data-side=source]`).first().click();
    await expect(page.locator(`[data-field="${id}"][data-side=destination]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-side=destination].selected')).toHaveCount(1);
  }
  await page.goto('/legacy.html#simulador'); await page.getByLabel('Canal de origen', { exact: true }).selectOption('Instagram / WhatsApp'); await addDemo(page);
  await page.getByLabel('Estado operativo', { exact: true }).selectOption('En producción');
  await expect(page.locator('.order-card .status')).toHaveText('Pendiente');
  await page.getByRole('button', { name: 'Completar con el saldo', exact: true }).click(); await page.getByRole('button', { name: 'Registrar pago', exact: true }).click();
  await expect(page.locator('.order-card .status')).toHaveText('Pagado'); await expect(page.getByLabel('Estado operativo', { exact: true })).toHaveValue('En producción');
  await expect(page.locator('.order-card')).toContainText('Instagram / WhatsApp');
  await page.reload(); await expect(page.getByLabel('Estado operativo', { exact: true })).toHaveValue('En producción');
  await page.goto('/legacy.html#resultado'); await expect(page.getByRole('img', { name: 'Mascota de Henris Gallery · celebración', exact: true })).toBeVisible();
});

test('formulario y pago utilizables con teclado', async ({ page }) => {
  await page.goto('/legacy.html#simulador');
  await page.getByLabel('Cliente ficticio').focus(); await page.keyboard.type('Cliente teclado');
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Canal de origen', { exact: true })).toBeFocused();
  await page.getByLabel('Nombre de la obra').focus(); await page.keyboard.type('Obra teclado');
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Cantidad', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.type('10,50'); await page.keyboard.press('Enter');
  await expect(page.locator('.order-card')).toContainText('Cliente teclado');
  await page.getByLabel('Registrar pago ($)', { exact: true }).focus(); await page.keyboard.type('10,50'); await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Registrar pago', exact: true })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('.order-card .status')).toHaveText('Pagado');
  await page.getByRole('button', { name: 'Reiniciar demo', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Cancelar', exact: true })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.locator('.order-card')).toHaveCount(1);
});
