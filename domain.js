export const STORAGE_KEY = 'henris-gallery-v1';
export const MAX_CENTS = 100_000_000_00;
export const CHANNELS = ['Correo / Mensaje', 'Instagram / WhatsApp', 'Local', 'Web a medida'];
export const OPERATIONS = ['Nuevo', 'Confirmado', 'En producción'];
export function cents(value) {
  const text = String(value).trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(text)) throw new Error('Usá un importe positivo con hasta dos decimales.');
  const n = Math.round(Number(text.replace(',', '.')) * 100);
  if (!Number.isSafeInteger(n) || n <= 0 || n > MAX_CENTS) throw new Error('El importe debe ser mayor que cero y no superar $100.000.000.');
  return n;
}
function validText(value) { return typeof value === 'string' && value.trim().length > 0 && value.length <= 120; }
export function totals(order) {
  const total = order.items.reduce((a, i) => a + i.quantity * i.price, 0);
  const paid = order.payments.reduce((a, p) => a + p.amount, 0);
  return { total, paid, balance: total - paid, status: paid === 0 ? 'Pendiente' : total === paid ? 'Pagado' : 'Parcial' };
}
export function createOrder(customer, rows, id = crypto.randomUUID(), channel = 'Local') {
  if (!validText(customer)) throw new Error('Ingresá el nombre del cliente ficticio (hasta 120 caracteres).');
  if (!Array.isArray(rows) || !rows.length || rows.length > 50) throw new Error('Agregá entre 1 y 50 obras.');
  const items = rows.map(row => {
    if (!validText(row.title)) throw new Error('Todas las obras necesitan un nombre (hasta 120 caracteres).');
    const quantity = Number(row.quantity);
    if (!/^\d+$/.test(String(row.quantity)) || !Number.isInteger(quantity) || quantity <= 0 || quantity > 10000) throw new Error('La cantidad debe ser un entero entre 1 y 10.000.');
    return { id: crypto.randomUUID(), pedidoId: id, title: row.title.trim(), quantity, price: cents(row.price) };
  });
  if (!CHANNELS.includes(channel)) throw new Error('Seleccioná un canal de origen válido.');
  const order = { id, customer: customer.trim(), channel, operation: 'Nuevo', items, payments: [] };
  if (totals(order).total > MAX_CENTS) throw new Error('El total del pedido no puede superar $100.000.000.');
  return order;
}
export function addPayment(order, value) {
  const amount = cents(value);
  if (amount > totals(order).balance) throw new Error('El pago no puede superar el saldo pendiente.');
  return { ...order, payments: [...order.payments, { id: crypto.randomUUID(), pedidoId: order.id, amount, date: new Date().toISOString() }] };
}
export function decode(raw) {
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.orders) || data.orders.length > 500) throw new Error('Datos incompatibles');
  const ids = new Set();
  for (const o of data.orders) {
    if (!validText(o.id) || ids.has(o.id) || !validText(o.customer) || !CHANNELS.includes(o.channel) || !OPERATIONS.includes(o.operation) || !Array.isArray(o.items) || o.items.length < 1 || o.items.length > 50 || !Array.isArray(o.payments)) throw new Error('Pedido inválido');
    ids.add(o.id);
    for (const i of o.items) if (!validText(i.id) || i.pedidoId !== o.id || !validText(i.title) || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 10000 || !Number.isSafeInteger(i.price) || i.price <= 0 || i.price > MAX_CENTS) throw new Error('Obra inválida');
    for (const p of o.payments) if (!validText(p.id) || p.pedidoId !== o.id || !Number.isSafeInteger(p.amount) || p.amount <= 0 || typeof p.date !== 'string' || !Number.isFinite(Date.parse(p.date))) throw new Error('Pago inválido');
    const t = totals(o);
    if (!Number.isSafeInteger(t.total) || t.total > MAX_CENTS || !Number.isSafeInteger(t.paid) || t.balance < 0) throw new Error('Saldo inválido');
  }
  return data.orders;
}
