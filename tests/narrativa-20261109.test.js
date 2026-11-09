import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ruta = 'preview/henris-narrativa-20261109/index.html';

test('la presentación narrativa es un HTML autónomo con el circuito pedido → obra → pago → saldo', () => {
  const html = readFileSync(ruta, 'utf8');

  // Autónomo: nada se pide a un servidor externo.
  assert.equal((html.match(/<script[^>]+src=/g) ?? []).length, 0, 'no debe cargar scripts externos');
  assert.equal((html.match(/<link[^>]+rel="stylesheet"/g) ?? []).length, 0, 'no debe cargar hojas externas');

  // Apunta a la app correcta y no a la homónima con el alta rota.
  assert.ok(html.includes('https://www.appsheet.com/start/7f05d824-ccdc-4dc7-ad55-8a43f7739d0b'));
  assert.ok(!html.includes('3300a579'));

  // Circuito ficticio completo.
  for (const texto of ['MOMENTO 1 DE 5', 'MOMENTO 2 DE 5', 'MOMENTO 3 DE 5', 'MOMENTO 4 DE 5', 'MOMENTO 5 DE 5']) {
    assert.ok(html.includes(texto), `falta ${texto}`);
  }
  for (const importe of ['$100', '$40', '$60']) {
    assert.ok(html.includes(importe), `falta el importe ${importe}`);
  }

  // Lo ilustrativo se distingue de lo real y se advierte sobre la app.
  assert.ok(html.includes('no capturas reales de AppSheet'));
  assert.ok(html.includes('datos ficticios'));
  assert.ok(html.includes('cuenta Google autorizada'));
  assert.ok(html.includes('pueden quedar guardados'));

  // Accesibilidad mínima declarada en el propio documento.
  assert.ok(html.includes('prefers-reduced-motion'));
  assert.ok(html.includes(':focus-visible'));
  assert.ok(html.includes('Saltar a la historia del pedido'));
});
