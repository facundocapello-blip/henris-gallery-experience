import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const propuesta = pathToFileURL(resolve('preview/henris-propuesta-gemini-20261106/index.html')).href;

test('permite abrir la app autorizada sin cambiar la guía', async ({ page }) => {
  await page.addInitScript(() => {
    window.open = (...args) => { window.__apertura = args; return null; };
  });
  await page.goto(propuesta);
  await page.getByRole('button', { name: 'Abrir la app' }).click();
  expect(await page.evaluate(() => window.__apertura)).toEqual([
    'https://www.appsheet.com/start/7f05d824-ccdc-4dc7-ad55-8a43f7739d0b',
    '_blank',
    'noopener,noreferrer',
  ]);
});

test('mantiene las capturas dentro de una pantalla estrecha', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(propuesta);
  const sizes = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(sizes.page).toBeLessThanOrEqual(sizes.viewport);
  await page.getByRole('button', { name: 'Ampliar captura: Pedido' }).click();
  await expect(page.locator('#viewer')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await expect(page.locator('#viewer')).not.toBeVisible();
});
