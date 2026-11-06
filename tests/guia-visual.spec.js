import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

test('la captura del pedido aprovecha el espacio sin cortar el texto', async ({ page }) => {
  await page.goto(pathToFileURL(resolve('staging/guia-visual-prueba-20261029/index.html')).href);
  const visual = page.locator('#step-visual');
  const image = page.locator('#shots img').first();
  await expect(image).toBeVisible();
  const sizes = await visual.evaluate((panel) => {
    const image = panel.querySelector('img');
    const caption = panel.querySelector('.visual-caption');
    return {
      panel: panel.clientWidth,
      image: image.getBoundingClientRect().width,
      captionFits: caption.scrollWidth <= caption.clientWidth,
      pageFits: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });
  expect(sizes.image).toBeGreaterThan(sizes.panel * 0.6);
  expect(sizes.captionFits).toBe(true);
  expect(sizes.pageFits).toBe(true);
  await image.click();
  await expect(page.locator('#image-dialog')).toBeVisible();
});

test('cada paso muestra una captura dentro de un celular', async ({ page }) => {
  await page.goto(pathToFileURL(resolve('staging/guia-visual-prueba-20261029/index.html')).href);
  for (const step of ['Pedido', 'Obra', 'Pago', 'Saldo']) {
    await page.getByRole('button', { name: new RegExp(`^0[1-4] ${step}$`) }).click();
    const frame = page.locator('#shots .phone-capture');
    await expect(frame).toHaveCount(1);
    await expect(frame.locator('img')).toBeVisible();
    const screenshotRatio = await frame.locator('img').evaluate(async image => {
      await image.decode();
      return image.naturalHeight / image.naturalWidth;
    });
    expect(screenshotRatio).toBeGreaterThan(2);
  }
});
