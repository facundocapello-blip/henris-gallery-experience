import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cents, createOrder, addPayment, totals, decode } from '../domain.js';
const rows = [{ title: 'Luz de tarde', quantity: '1', price: '80000' }, { title: 'Horizonte', quantity: '2', price: '35000' }];
test('pedido de dos obras, pago parcial y cancelación exacta', () => {
  const order = createOrder(' Clara Vidal ', rows, 'HG-001');
  assert.equal(order.customer, 'Clara Vidal'); assert.equal(order.items[1].pedidoId, order.id);
  assert.deepEqual(totals(order), { total: 15000000, paid: 0, balance: 15000000, status: 'Pendiente' });
  const partial = addPayment(order, '50000'); assert.equal(partial.payments[0].pedidoId, order.id);
  assert.equal(totals(partial).status, 'Parcial'); assert.equal(totals(partial).balance, 10000000);
  const paid = addPayment(partial, '100000'); assert.equal(totals(paid).status, 'Pagado'); assert.equal(totals(paid).balance, 0);
  assert.equal(order.payments.length, 0); assert.throws(() => addPayment(paid, '0.01'));
});
test('centavos sin errores de coma flotante y formatos locales', () => {
  assert.equal(cents('1,20'), 120);
  const o = createOrder('Demo', [{ title: 'A', quantity: '3', price: '0.10' }]);
  assert.equal(totals(addPayment(o, '0.30')).balance, 0);
});
test('rechaza importes inválidos, sobrepagos y campos incompletos', () => {
  for (const value of ['', '0', '-1', 'NaN', 'Infinity', '1e3', '1.001', '1.000,00', '100000001']) assert.throws(() => cents(value), value);
  for (const quantity of ['0', '-1', '1.2', 'Infinity', '', '1e2', '10001']) assert.throws(() => createOrder('Demo', [{ ...rows[0], quantity }]));
  assert.throws(() => createOrder('', rows)); assert.throws(() => createOrder('Demo', [])); assert.throws(() => createOrder('Demo', [{ ...rows[0], title: ' ' }]));
  assert.throws(() => addPayment(createOrder('Demo', rows), '150000.01'));
  assert.throws(() => createOrder('Demo', [{ title: 'A', quantity: '10000', price: '100000000' }]));
});
test('persistencia valida identidad, estructura, relaciones y saldos', () => {
  const o = addPayment(createOrder('Demo', rows), '50000');
  assert.deepEqual(decode(JSON.stringify({ version: 1, orders: [o] })), [o]);
  assert.deepEqual(decode(null), []);
  for (const raw of ['{', 'null', '{"version":2,"orders":[]}', JSON.stringify({ version: 1, orders: [o, o] }), JSON.stringify({ version: 1, orders: [{ ...o, items: [] }] }), JSON.stringify({ version: 1, orders: [{ ...o, payments: [{ ...o.payments[0], amount: 999999999 }] }] })]) assert.throws(() => decode(raw));
  const broken = structuredClone(o); broken.items[0].pedidoId = 'otro'; assert.throws(() => decode(JSON.stringify({ version: 1, orders: [broken] })));
});
