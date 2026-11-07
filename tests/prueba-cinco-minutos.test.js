import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la guía propone una prueba segura de cinco minutos', () => {
  const html = readFileSync('preview/henris-propuesta-gemini-20261106/index.html', 'utf8');
  const bloque = html.match(/<section[^>]*id="probar"[\s\S]*?<\/section>/)?.[0];
  assert.ok(bloque, 'falta la sección de prueba');
  for (const texto of ['Probala en 5 minutos', 'pedido de prueba', 'agregá una obra', 'registrá un pago', 'consultá el saldo', 'dónde te trabaste', 'cuenta de Google autorizada', 'pueden quedar guardados', 'datos reales']) {
    assert.ok(bloque.toLocaleLowerCase('es').includes(texto.toLocaleLowerCase('es')), `falta: ${texto}`);
  }
  assert.ok(html.includes('https://www.appsheet.com/start/7f05d824-ccdc-4dc7-ad55-8a43f7739d0b'));
});
