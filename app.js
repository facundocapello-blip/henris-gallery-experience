import { STORAGE_KEY, createOrder, addPayment, totals, decode, cents, CHANNELS, OPERATIONS } from './domain.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(n / 100);
const main = $('#main');
let orders = [], storageProblem = '', guided = false, step = 0, tab = 'pedidos', selected = 'cliente';
let sequence = 0, playing = false, timer, animations = [], flyers = [], reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const routes = ['inicio', 'transformacion', 'mapeo', 'simulador', 'resultado'];
const stepNames = ['Contexto', 'Transformación', 'Mapeo', 'Simulación', 'Resultado'];
try { orders = decode(localStorage.getItem(STORAGE_KEY)); }
catch { storageProblem = 'No pudimos recuperar la demo guardada. Podés comenzar una nueva; los datos inválidos no se usarán.'; }

const fields = [
  { id: 'cliente', source: 'Nombre / cliente repetido', target: 'Cliente.nombre → Pedido.cliente', value: 'Clara Vidal', group: 1, page: '4', rule: 'Agrupar el nombre en Cliente; la demo lo muestra dentro del pedido. La deduplicación automática por nombre sería una propuesta y no se aplica.', benefit: 'Consultar quién compra sin repetir el nombre en cada obra.' },
  { id: 'pedido', source: 'Referencia del pedido', target: 'Pedido.id', value: 'HG-001', group: 1, page: '3, 5, 6', rule: 'Conservar una referencia única por pedido; cada obra y pago apunta a ella. El formato HG y los UUID son decisiones de esta demo.', benefit: 'Encontrar todas las partes de una misma operación.' },
  { id: 'obra', source: 'Varias obras en una celda', target: 'ObraDelPedido.título', value: 'Luz de tarde / Horizonte', group: 2, page: '3, 6, 8', rule: 'Separar cada obra en un ítem independiente con su identificador y pedido asociado. La celda mezclada es ilustrativa.', benefit: 'Consultar y sumar cada obra sin interpretar texto mezclado.' },
  { id: 'cantidad', source: 'Cantidad por obra', target: 'ObraDelPedido.cantidad', value: '1 / 2', group: 2, rule: 'Validar una cantidad entera positiva por ítem.', benefit: 'Calcular el total con una regla consistente.' },
  { id: 'precio', source: 'Precio por unidad', target: 'ObraDelPedido.precioUnitario', value: '$ 80.000 / $ 35.000', group: 2, rule: 'Normalizar el importe; guardar centavos enteros y rechazar valores inválidos.', benefit: 'Evitar diferencias de formato y errores de redondeo.' },
  { id: 'pago', source: 'Pago junto a observaciones', target: 'Pago.importe + Pago.pedidoId', value: '$ 50.000', group: 3, page: '3, 4, 7', rule: 'Crear un pago independiente ligado al pedido; no superar su saldo. La mezcla con notas es ilustrativa.', benefit: 'Consultar el historial sin buscar pagos en notas.' },
  { id: 'total', source: 'Importe / monto total', target: 'Finanzas.total (calculado)', value: '$ 150.000', group: 4, page: '4, 7, 8', rule: 'La demo calcula el importe como suma de cantidad × precio unitario de los ítems. Esta fórmula de detalle es una decisión de implementación.', benefit: 'Tener un total reproducible para cada pedido.' },
  { id: 'saldo', source: 'Total y pagos del pedido', target: 'Finanzas.saldo + estado financiero', value: '$ 100.000 · Parcial', group: 4, page: '4, 5, 7, 8', rule: 'Saldo = total − suma de pagos. Sin pagos: pendiente; saldo positivo con pagos: parcial; saldo cero: pagado. Es independiente del estado operativo.', benefit: 'Saber qué falta cobrar sin hacer cuentas aparte.' },
  { id: 'telefono', source: 'Teléfono', target: 'Cliente.teléfono', value: 'Tel. ficticio 000-000', group: 1, page: '4', rule: 'Conservar como texto en Cliente, incluidos prefijos. No inferirlo de notas ni usarlo como identificador único.', benefit: 'Encontrar el contacto sin recorrer todas las obras.' },
  { id: 'documento', source: 'DNI / CUIL', target: 'Cliente.DNI/CUIL', value: 'Documento ficticio 00.000.000', group: 1, page: '4', rule: 'Agrupar el documento como texto del cliente. La demo usa un valor ficticio y no valida identidades.', benefit: 'Separar la identificación del cliente de los datos de producción.' },
  { id: 'canal', source: 'Canal de origen', target: 'Pedido.canalOrigen', value: 'Instagram / WhatsApp', group: 1, page: '2, 8', rule: 'Usar el mismo registro de pedido para correo/mensaje, Instagram/WhatsApp, local o web a medida.', benefit: 'Unificar el seguimiento sin importar dónde empezó la venta.' },
  { id: 'operativo', source: 'Estado del pedido', target: 'Pedido.estadoOperativo', value: 'Nuevo', group: 1, page: '5, 6', rule: 'Distinguir Nuevo, Confirmado y En producción. No convertir un pago en un cambio automático de producción.', benefit: 'Ver el avance del trabajo y el saldo como señales diferentes.' },
  { id: 'codigo', source: 'Código / #Art', target: 'FichaDeObra.código', value: 'ART-001 / ART-002', group: 2, page: '4', rule: 'Relacionar el código de cada obra con su ficha. La unicidad y formato técnico son una propuesta de la demo.', benefit: 'Identificar qué pieza se vendió.' },
  { id: 'medidas', source: 'Medidas', target: 'FichaDeObra.medidas', value: '60 × 80 cm / 40 × 50 cm', group: 2, page: '4, 6', rule: 'Mantener las medidas junto a la obra. La demo las conserva como texto sin convertir unidades.', benefit: 'Consultar especificaciones desde el pedido.' },
  { id: 'terminacion', source: 'Borde blanco / Passe-partout', target: 'FichaDeObra.terminación', value: 'Passe-partout blanco', group: 2, page: '4, 6', rule: 'Reorganizar el detalle de borde o passe-partout como especificación de producción, sin inferir equivalencias técnicas.', benefit: 'Evitar que una terminación quede escondida entre notas financieras.' },
  { id: 'produccion', source: 'Estado de producción', target: 'FichaDeObra.estadoProducción', value: 'En producción', group: 2, page: '3, 6', rule: 'Consultar el estado por obra desde el pedido que la reúne. El Canvas no define un flujo exhaustivo de estados.', benefit: 'Seguir varias obras dentro de una sola operación.' },
  { id: 'sena', source: 'Seña', target: 'Pago.tipo + Pago.importe', value: 'Seña · $ 50.000', group: 3, page: '4, 7, 8', rule: 'Registrar la seña como un pago relacionado. En el ejemplo seña e importe cobrado son el mismo pago, no dos importes sumables.', benefit: 'Mantener trazabilidad sin duplicar cobros.' },
  { id: 'fecha', source: 'Fecha del pago', target: 'Pago.fecha', value: '15/10/2026', group: 3, page: '7', rule: 'Conservar una fecha por pago. La demo registra automáticamente el momento de la operación y no permite editar pagos previos.', benefit: 'Reconstruir el historial de cobros.' },
  { id: 'pagado', source: '¿Pagado?', target: 'Finanzas.estadoFinanciero', value: 'Parcial', group: 4, page: '4, 5, 7, 8', rule: 'Sustituir una marca manual por un estado derivado de pagos y saldo. Parcial es la etiqueta de esta demo para un pedido con seña y deuda pendiente.', benefit: 'Evitar una marca de pagado que contradiga el saldo.' }
];
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function button(text, action, cls = '') { const b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', action); return b; }
function notice(text) { const n = $('#notice'); n.textContent = text; n.hidden = false; clearTimeout(notice.timeout); notice.timeout = setTimeout(() => { n.hidden = true; }, 6000); }
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, orders })); storageProblem = ''; return true; }
  catch { storageProblem = 'El navegador no permite guardar la demo. Los cambios se conservarán solo mientras esta página permanezca abierta.'; notice(storageProblem); return false; }
}
function stopSequence() { clearTimeout(timer); animations.forEach(a => a.cancel()); flyers.forEach(n => n.remove()); animations = []; flyers = []; playing = false; }
function navigate(route, focus = true) { if (location.hash === '#' + route) render(focus); else location.hash = route; }
function startGuide() { guided = true; step = 0; navigate('inicio'); }
function updateGuide() {
  const host = $('#guide'); host.replaceChildren();
  if (!guided) return;
  const bar = el('div', 'guide-bar'); const info = el('div'); info.append(el('p', '', `RECORRIDO GUIADO · ${step + 1}/5 — ${stepNames[step]}`));
  const dots = el('div', 'guide-dots'); dots.setAttribute('aria-hidden', 'true'); stepNames.forEach((_, i) => dots.append(el('span', i <= step ? 'active' : ''))); info.append(dots);
  const controls = el('div', 'guide-controls');
  const prev = button('← Retroceder', () => { step--; navigate(routes[step]); }); prev.disabled = step === 0;
  const next = button(step === 4 ? 'Volver a iniciar ↻' : 'Avanzar →', () => {
    if (step === 3 && !orders.length) { notice('Creá un pedido para ver su resultado.'); $('#customer')?.focus(); return; }
    step = step === 4 ? 0 : step + 1; navigate(routes[step]);
  }, 'primary');
  controls.append(prev, next, button('Salir', () => { guided = false; updateGuide(); notice('Saliste del recorrido. Podés seguir en modo libre.'); }));
  bar.append(info, controls); host.append(bar);
}
function heading(kicker, title, desc, num) {
  const head = el('div', 'page-heading'), copy = el('div'); copy.append(el('div', 'eyebrow', kicker), el('h1', '', title), el('p', '', desc)); head.append(copy, el('span', 'page-index', num)); main.append(head);
}
function sourceNote() { return el('aside', 'source-note', 'Basado en el Operational Canvas · 9 páginas revisadas. Pedido vincula obras/ítems y pagos; Cliente, Ficha de Obra y Finanzas agrupan la información. Los nombres técnicos, identificadores y reglas de validación son decisiones de esta demo. La planilla es ilustrativa y no reproduce datos reales.'); }
function narrator(pose, text, id) {
  const section = el('aside', `narrator narrator-${pose}`); if (id) section.id = id;
  const portrait = el('div', `mascot pose-${pose}`); portrait.setAttribute('role', 'img'); portrait.setAttribute('aria-label', 'Mascota de Henris Gallery · ' + ({ presentation: 'presentación con micrófono', wave: 'saludo con auriculares', worry: 'preocupación', celebrate: 'celebración' })[pose]);
  const bubble = el('div', 'speech'); bubble.append(el('span', 'eyebrow', 'TE ACOMPAÑO EN EL RECORRIDO'), el('p', '', text)); section.append(portrait, bubble); return section;
}
function updateNarrator(pose, text, id = 'sequence-narrator') { const host = document.getElementById(id); if (!host) return; const replacement = narrator(pose, text, id); host.replaceWith(replacement); }
function home() {
  main.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">UNA NUEVA FORMA DE VER TU GALERÍA</div><h1>Del dato suelto<br>al <em>nuevo orden.</em></h1><p>Cada obra tiene una historia.<br>Cada pedido, un lugar para encontrarla.</p><p>Descubrí cómo conectar pedidos, obras y pagos. Después, probá el circuito a tu ritmo.</p><div class="actions" id="home-actions"></div><p class="hero-note">Sin tocar tus datos reales. Sin miedo a equivocarte.</p></div><div class="artwork" role="img" aria-label="Tres fichas conectadas: un pedido, sus obras y sus pagos"><div class="art-sheets"><div class="art-sheet"><div class="art-num">01</div><div><b>Un pedido.</b><span>CLARA VIDAL · HG-001</span></div></div><div class="art-sheet"><div class="art-num">02</div><div><b>Cada obra.</b><span>LUZ DE TARDE + HORIZONTE</span></div></div><div class="art-sheet"><div class="art-num">03</div><div><b>Todo claro.</b><span>TOTAL → PAGOS → SALDO</span></div></div></div><div class="art-caption">EL ARTE DE ORGANIZAR LO IMPORTANTE</div></div></section><section class="intro-line"><h3>Menos buscar.<br>Más entender.</h3><div class="steps-preview"><div class="step-preview"><span>01 /</span><h3>Mirar el origen</h3><p>Una planilla ilustrativa. Un punto de partida compartido.</p></div><div class="step-preview"><span>02 /</span><h3>Conectar las piezas</h3><p>Cada dato encuentra su lugar y conserva su relación.</p></div><div class="step-preview"><span>03 /</span><h3>Aprender haciendo</h3><p>Creá un pedido y seguí sus pagos hasta el saldo final.</p></div></div></section>`;
  $('#home-actions').append(button(guided ? 'Ver la transformación →' : 'Iniciar recorrido →', () => { guided = true; step = 1; navigate('transformacion'); }, 'primary'), button('Explorar en modo libre', () => { guided = false; navigate('mapeo'); }));
  $('.hero-copy').append(narrator('presentation', 'Te propongo un recorrido corto: ordenar la información, seguir sus relaciones y practicar con tu primer pedido.')); main.append(sourceNote());
}
function chip(id, value, dest = false) {
  const f = fields.find(x => x.id === id), b = button('', () => selectField(id), 'field-chip'); b.dataset.field = id; b.dataset.side = dest ? 'destination' : 'source'; b.dataset.target = '→ ' + f.target; b.setAttribute('aria-pressed', String(id === selected));
  if (id === selected) b.classList.add('selected'); b.append(el('small', '', dest ? f.target : f.source), document.createTextNode(value ?? f.value)); return b;
}
function selectField(id) {
  selected = id;
  $$('[data-field]').forEach(n => { n.classList.toggle('selected', n.dataset.field === id); const control = n.tagName === 'BUTTON' ? n : $('button', n); control?.setAttribute('aria-pressed', String(n.dataset.field === id)); });
  const f = fields.find(x => x.id === id), box = $('#field-explanation');
  if (box) box.replaceChildren(el('strong', '', f.source + ' → ' + f.target), document.createTextNode(f.rule + ' ' + f.benefit));
  if ($('#mapping-explanation')) $('#mapping-explanation').textContent = `${f.source} → ${f.target}. ${f.rule} ${f.benefit}`;
}
function board() {
  const stage = el('div', 'mapping-stage'), source = el('section', 'panel'), dest = el('section', 'panel');
  const sh = el('div', 'panel-header'); sh.append(el('h3', '', 'La planilla de partida'), el('span', 'tag', 'ORIGEN')); source.append(sh, el('p', 'small muted', 'Ejemplo ilustrativo · Datos ficticios'));
  const rows = [
    [['pedido', 'HG-001'], ['cliente', ' Clara Vidal '], ['telefono', '000-000'], ['documento', '00.000.000'], ['canal', 'Instagram / WhatsApp'], ['operativo', 'Nuevo'], ['obra', 'Luz de tarde / Horizonte'], ['cantidad', '1 / 2'], ['precio', '80.000 / $35000'], ['pago', 'Entregó 50 mil · retirar viernes']],
    [['pedido', 'HG-001'], ['cliente', 'Clara Vidal'], ['codigo', 'ART-001 / ART-002'], ['medidas', '60x80 / 40x50 cm'], ['terminacion', 'Borde blanco / passe-partout'], ['produccion', 'En producción'], ['sena', 'Seña 50 mil · ver arriba'], ['fecha', '15/10/2026']],
    [['pedido', 'HG-002'], ['cliente', 'Julián Costa'], ['obra', 'Jardín'], ['cantidad', '1'], ['precio', '$ 42.000'], ['pago', 'Sin pago · llamar lunes']],
    [['pedido', 'HG-003'], ['cliente', 'Elena Ríos'], ['obra', 'Orilla'], ['cantidad', '1'], ['precio', '60000'], ['pago', 'Pagó $60.000']]
  ];
  rows.forEach((data, i) => {
    const row = el('div', 'source-row'), values = el('div', 'source-values');
    data.forEach(([id, val]) => {
      if (i < 2) values.append(chip(id, val));
      else { const n = el('span', 'field-chip'); n.append(el('small', '', fields.find(f => f.id === id).source), document.createTextNode(val)); values.append(n); }
    });
    row.append(el('span', 'row-num', `0${i + 1}`), values); source.append(row);
  });
  const derived = el('div', 'source-row'), dv = el('div', 'source-values'); dv.append(chip('total', '1 × 80.000 + 2 × 35.000'), chip('saldo', '150.000 − 50.000'), chip('pagado', '¿Pagado? · revisar seña')); derived.append(el('span', 'row-num', 'ƒ'), dv); source.append(derived);
  const dh = el('div', 'panel-header'); dh.append(el('h3', '', 'Un lugar para cada dato'), el('span', 'tag', 'DESTINO')); dest.append(dh, el('p', 'small muted', 'Detalle de HG-001 · otras filas: mismo criterio'));
  const groups = [ ['Pedido y cliente', 'pedido', ['pedido', 'cliente', 'telefono', 'documento', 'canal', 'operativo'], 1], ['Obras / ítems y ficha de obra', 'works', ['obra', 'cantidad', 'precio', 'codigo', 'medidas', 'terminacion', 'produccion'], 2], ['Pagos relacionados', 'payments', ['pago', 'sena', 'fecha'], 3], ['Finanzas del pedido', '', ['total', 'saldo', 'pagado'], 4] ];
  groups.forEach(([title, cls, ids, group], i) => {
    if (i === 1 || i === 2) { const relation = el('div', 'relation', i === 1 ? '↳ Del pedido: 1…n obras · pedidoId' : '↳ Del pedido (no de la obra): 0…n pagos · pedidoId'); relation.dataset.reveal = group; dest.append(relation); }
    const entity = el('section', `entity ${cls}`); entity.dataset.reveal = group; entity.append(el('h3', '', `${i + 1}. ${title}`));
    if (i === 1) {
      const items = el('div', 'demo-items');
      items.append(el('p', '', 'Ítem 01 · Luz de tarde · 1 × $80.000 = $80.000'), el('p', '', 'Ítem 02 · Horizonte · 2 × $35.000 = $70.000'), el('small', '', 'Dos registros distintos · ambos con pedidoId HG-001'));
      entity.append(items);
    }
    const values = el('div', 'source-values'); ids.forEach(id => values.append(chip(id, null, true))); entity.append(values); dest.append(entity);
  }); stage.append(source, el('div', 'flow-arrow', '→'), dest); return stage;
}
const sequenceText = ['Listo para ordenar. Seleccioná un campo para seguir su relación.', '1/4 · Pedido: una referencia reúne los datos del cliente.', '2/4 · Obras: cada ítem conserva cantidad, precio y pedidoId.', '3/4 · Pagos: cada importe se asocia al pedido, separado de las notas.', '4/4 · Resultado: total $150.000 − pagos $50.000 = saldo $100.000.'];
function paintSequence() {
  $$('[data-reveal]').forEach(n => n.classList.toggle('pending', Number(n.dataset.reveal) > sequence));
  const status = $('#sequence-status'); if (status) status.textContent = sequenceText[sequence];
  const pause = $('#pause-sequence'); if (pause) { pause.disabled = sequence === 0 || sequence === 4 || reduced; pause.textContent = playing ? 'Pausar' : 'Continuar'; }
  if ($('#seq-prev')) $('#seq-prev').disabled = sequence === 0;
  if ($('#seq-next')) $('#seq-next').disabled = sequence === 4;
  updateNarrator(sequence === 0 ? 'worry' : sequence === 4 ? 'celebrate' : 'wave', sequence === 0 ? 'Cuando mezclamos toda la información, cuesta seguir cada pedido y saber qué falta cobrar.' : sequence === 4 ? 'Ahora cada dato tiene su lugar: registrar una vez, encontrar cada obra y seguir lo pendiente.' : sequence === 1 ? 'El pedido reúne la operación y los datos del cliente, sin importar el canal de venta.' : sequence === 2 ? 'Cada obra conserva su ficha: código, medidas y producción. Todas siguen vinculadas al pedido.' : 'La seña se registra como un pago. Guardamos su fecha y la descontamos una sola vez del total.');
}
function flyGroup(group) {
  if (reduced) return;
  fields.filter(f => f.group === group).forEach(f => {
    const origin = $(`[data-field="${f.id}"][data-side=source]`), target = $(`[data-field="${f.id}"][data-side=destination]`);
    if (!origin || !target) return;
    const a = origin.getBoundingClientRect(), b = target.getBoundingClientRect();
    // Keep the origin and destination in the document; only their value copy moves.
    const copy = el('div', 'fly-value', f.value); Object.assign(copy.style, { left: a.left + 'px', top: a.top + 'px' }); document.body.append(copy); flyers.push(copy);
    const animation = copy.animate([{ transform: 'translate(0,0)', opacity: .9 }, { transform: `translate(${b.left - a.left}px,${b.top - a.top}px)`, opacity: 1 }], { duration: 950, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
    animations.push(animation); animation.onfinish = () => copy.remove();
  });
}
function schedule() { clearTimeout(timer); if (playing && sequence < 4) timer = setTimeout(() => advanceSequence(), 1900); }
function advanceSequence() { if (sequence >= 4) return; sequence++; flyGroup(sequence); if (sequence === 4) playing = false; paintSequence(); schedule(); }
function manualSequence(n) { stopSequence(); sequence = Math.max(0, Math.min(4, n)); paintSequence(); }
function transform() {
  sequence = 0;
  heading('01 / COMPRENDER EL CAMBIO', 'La misma información. Otra claridad.', 'Cuando mezclamos toda la información, cuesta seguir cada pedido y saber qué falta cobrar. Veamos cómo se conecta.', '01');
  main.append(narrator('worry', 'Cuando mezclamos toda la información, cuesta seguir cada pedido y saber qué falta cobrar.', 'sequence-narrator'));
  main.append(el('p', 'small muted', 'Seleccioná cualquier campo: su origen y destino se resaltan juntos. No describe errores comprobados de una planilla real.'));
  const controls = el('div', 'sequence-controls'); controls.append(button('Ordenar la información →', () => { stopSequence(); sequence = 0; if (reduced) manualSequence(4); else { playing = true; advanceSequence(); } }, 'primary'));
  const prev = button('← Paso', () => manualSequence(sequence - 1)); prev.id = 'seq-prev'; const next = button('Paso →', () => manualSequence(sequence + 1)); next.id = 'seq-next';
  const pause = button('Pausar', () => { playing = !playing; if (playing) { animations.forEach(a => { if (a.playState === 'paused') a.play(); }); schedule(); } else { clearTimeout(timer); animations.forEach(a => a.pause()); } paintSequence(); }); pause.id = 'pause-sequence';
  controls.append(prev, next, pause, button('Omitir secuencia', () => manualSequence(4)));
  const toggle = el('label', 'toggle'), input = el('input'); input.type = 'checkbox'; input.checked = reduced; input.id = 'static-mode'; toggle.append(input, document.createTextNode('Sin movimiento')); input.addEventListener('change', () => { reduced = input.checked; if (reduced) manualSequence(4); });
  controls.append(toggle); main.append(controls);
  const status = el('p', 'sequence-status'); status.id = 'sequence-status'; status.setAttribute('role', 'status'); main.append(status, board());
  const explanation = el('div', 'explain'); explanation.id = 'field-explanation'; explanation.setAttribute('aria-live', 'polite'); main.append(explanation);
  const actions = el('div', 'actions'); actions.append(button('Repetir animación ↻', () => { stopSequence(); sequence = 0; if (reduced) manualSequence(4); else { playing = true; advanceSequence(); } }), button('Ver mapeo completo →', () => navigate('mapeo')), button('Probar con un pedido', () => navigate('simulador'), 'primary')); main.append(actions, sourceNote());
  if (reduced) sequence = 4; paintSequence(); selectField(selected);
}
function mapping() {
  heading('02 / EL MAPA DE LOS DATOS', 'Cada dato, en su lugar.', 'El Canvas conecta pedidos, obras y pagos, y organiza la información en Cliente, Ficha de Obra y Finanzas. Explorá cada correspondencia.', '02');
  main.append(narrator('wave', 'Seguí cada campo desde su origen. El Canvas define los grupos; los nombres técnicos y las validaciones son decisiones de esta demo.'));
  const relation = el('div', 'relations-full'); relation.append(el('span', '', 'Pedido · id'), el('small', '', '1 → muchas / pedidoId'), el('span', '', 'Obras del pedido · id'), el('small', '', 'Pagos: muchos → 1 Pedido / pedidoId'), el('span', '', 'Pagos · id')); main.append(relation);
  const info = el('div', 'explain'); info.id = 'mapping-explanation'; info.setAttribute('aria-live', 'polite'); main.append(info);
  const list = el('div', 'map-list'); fields.forEach(f => {
    const row = el('article', 'map-row'); row.dataset.field = f.id;
    row.append(button(f.source + ' ↗', () => selectField(f.id)), el('div', 'destination', f.target), el('p', '', 'Regla de la demo: ' + f.rule), el('p', '', 'Beneficio: ' + f.benefit), el('span', 'tag', f.page ? `Canvas · pág. ${f.page}` : 'Regla propuesta de la demo')); list.append(row);
  }); main.append(list);
  const actions = el('div', 'actions'); actions.append(button('Ver la transformación', () => navigate('transformacion')), button('Probar con un pedido →', () => navigate('simulador'), 'primary')); main.append(actions, sourceNote()); selectField(selected);
}
function empty(text = 'Tu primera operación empieza acá.') { const n = el('div', 'empty'); n.append(el('div', 'empty-icon', '↳'), el('h3', '', text), el('p', '', 'Creá un pedido ficticio, agregá sus obras y registrá un pago. El saldo se calcula solo.')); return n; }
function makeInput(labelText, name, placeholder, value = '') {
  const wrapper = el('div', 'form-field'); const label = el('label', '', labelText), input = el('input'); label.htmlFor = name; input.id = name; input.name = name; input.placeholder = placeholder; input.value = value; input.required = true; input.maxLength = 120; wrapper.append(label, input); return wrapper;
}
let rowNumber = 0;
function itemRow(container) {
  const index = ++rowNumber, row = el('div', 'item-row'), top = el('div', 'item-top');
  const remove = button('Quitar obra', () => { row.remove(); refreshDraftTotal(); }); remove.setAttribute('aria-label', `Quitar obra ${index}`); top.append(el('span', '', `OBRA ${index}`), remove);
  const inputs = el('div', 'item-inputs'), title = makeInput('Nombre de la obra', `title-${index}`, 'Ej. Luz de tarde'); title.classList.add('title-field');
  const quantity = makeInput('Cantidad', `quantity-${index}`, '1', '1'), price = makeInput('Precio unitario ($)', `price-${index}`, '80000');
  $('input', title).dataset.kind = 'title'; $('input', quantity).dataset.kind = 'quantity'; $('input', quantity).inputMode = 'numeric'; $('input', price).dataset.kind = 'price'; $('input', price).inputMode = 'decimal';
  inputs.append(title, quantity, price); row.append(top, inputs); container.append(row); row.addEventListener('input', refreshDraftTotal);
}
function draftRows() { return $$('.item-row').map(row => Object.fromEntries($$('input', row).map(i => [i.dataset.kind, i.value]))); }
function refreshDraftTotal() {
  const target = $('#draft-total'); if (!target) return;
  try { const rows = draftRows(); if (!rows.length) throw Error(); let sum = 0; for (const r of rows) { if (!/^\d+$/.test(r.quantity) || Number(r.quantity) <= 0 || Number(r.quantity) > 10000) throw Error(); sum += cents(r.price) * Number(r.quantity); } target.textContent = money(sum); }
  catch { target.textContent = 'Completá las obras'; }
}
function newOrderForm() {
  const panel = el('section', 'panel'), form = el('form'); form.noValidate = true; form.id = 'order-form';
  panel.append(el('h2', 'form-title', 'Crear un pedido demo'), el('p', 'small muted', 'Usá nombres ficticios. Importes en pesos argentinos.'));
  const customer = makeInput('Cliente ficticio', 'customer', 'Ej. Clara Vidal'); form.append(customer);
  const channelField = el('div', 'form-field'), channelLabel = el('label', '', 'Canal de origen'), channelSelect = el('select'); channelLabel.htmlFor = 'channel'; channelSelect.id = 'channel'; CHANNELS.forEach(name => channelSelect.append(el('option', '', name))); channelSelect.value = 'Local'; channelField.append(channelLabel, channelSelect); form.append(channelField);
  const rows = el('div'); rows.id = 'draft-items'; form.append(rows); rowNumber = 0; itemRow(rows);
  form.append(button('+ Agregar obra', () => { if ($$('.item-row').length >= 50) { notice('El máximo es de 50 obras.'); return; } itemRow(rows); $('input', rows.lastElementChild).focus(); }));
  const total = el('div', 'live-total'); total.append(el('span', '', 'Total del pedido')); const b = el('b', '', 'Completá las obras'); b.id = 'draft-total'; total.append(b); form.append(total);
  const error = el('p', 'form-error'); error.id = 'order-error'; error.setAttribute('role', 'alert'); form.append(error);
  const submit = el('button', 'primary', 'Crear pedido →'); submit.type = 'submit'; form.append(submit);
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      if (orders.length >= 500) throw new Error('Alcanzaste el máximo de 500 pedidos. Reiniciá la demo para comenzar otra.');
      const order = createOrder($('#customer').value, draftRows(), crypto.randomUUID(), $('#channel').value); orders.push(order); save(); render(false); notice('Pedido creado. Ya podés registrar sus pagos.'); $('.order-card')?.focus();
    } catch (e) { error.textContent = e.message; updateNarrator('worry', 'Revisemos ese dato antes de guardar. ' + e.message, 'sim-narrator'); }
  }); panel.append(form); return panel;
}
function orderCard(order, index, allowPayment = true) {
  const t = totals(order), card = el('article', 'order-card'); card.tabIndex = -1; card.dataset.orderId = order.id;
  const head = el('div', 'order-heading'), title = el('div'); title.append(el('div', 'order-id', `PEDIDO HG-${String(index + 1).padStart(3, '0')} · ${order.id.slice(0, 8)}`), el('h3', '', order.customer));
  head.append(title, el('span', 'status ' + (t.status === 'Parcial' ? 'partial' : t.status === 'Pendiente' ? 'pending' : ''), t.status)); card.append(head, el('p', 'small muted', `${order.channel} · Estado operativo: ${order.operation}`));
  if (allowPayment) {
    const field = el('div', 'operation-field'), label = el('label', '', 'Estado operativo'), select = el('select'); select.id = `operation-${order.id}`; label.htmlFor = select.id;
    OPERATIONS.forEach(name => select.append(el('option', '', name))); select.value = order.operation;
    select.addEventListener('change', () => { orders = orders.map(o => o.id === order.id ? { ...o, operation: select.value } : o); save(); render(false); document.getElementById(select.id)?.focus(); notice('Estado operativo actualizado. Los pagos y el saldo se mantienen.'); });
    field.append(label, select); card.append(field);
  }
  order.items.forEach((item, i) => { const line = el('div', 'order-line'), detail = el('div', '', item.title); detail.append(el('small', '', `Ítem ${i + 1} · ${item.quantity} × ${money(item.price)}`)); line.append(detail, el('span', '', money(item.quantity * item.price))); card.append(line); });
  const metrics = el('div', 'order-metrics'); [['Total', t.total], ['Pagos', t.paid], ['Saldo', t.balance]].forEach(([label, value]) => { const n = el('div', label === 'Saldo' ? 'balance' : ''); n.append(el('span', '', label), el('b', '', money(value))); metrics.append(n); }); card.append(metrics);
  if (order.payments.length) { const details = el('details', 'payment-history'); details.append(el('summary', '', `Historial · ${order.payments.length} pago(s)`)); order.payments.forEach((p, i) => { const row = el('div', 'order-line'); row.append(el('span', '', `Pago ${i + 1} · ${new Date(p.date).toLocaleDateString('es-AR')}`), el('span', '', money(p.amount))); details.append(row); }); card.append(details); }
  if (allowPayment && t.balance > 0) {
    const form = el('form', 'pay-form'); form.noValidate = true;
    const label = el('label', '', 'Registrar pago ($)'), input = el('input'); input.id = `payment-${order.id}`; label.htmlFor = input.id; input.inputMode = 'decimal'; input.required = true; input.placeholder = 'Importe del pago'; input.maxLength = 16;
    const controls = el('div', 'pay-fields'), submit = el('button', 'primary', 'Registrar pago'); submit.type = 'submit'; controls.append(input, submit);
    const error = el('p', 'form-error'); error.setAttribute('role', 'alert');
    form.append(label, controls, error, button('Completar con el saldo', () => { input.value = (t.balance / 100).toFixed(2); input.focus(); }, 'link small'));
    form.addEventListener('submit', event => {
      event.preventDefault();
      try { const updated = addPayment(order, input.value); orders[orders.findIndex(o => o.id === order.id)] = updated; save(); render(false); const updatedCard = $$('[data-order-id]').find(n => n.dataset.orderId === order.id); updatedCard?.focus(); notice(totals(updated).balance === 0 ? 'Pedido pagado. El saldo quedó en cero.' : 'Pago registrado. El saldo se actualizó.'); }
      catch (e) { error.textContent = e.message; updateNarrator('worry', 'El pago necesita una revisión. ' + e.message, 'sim-narrator'); }
    }); card.append(form);
  } return card;
}
function stats() {
  const s = orders.reduce((acc, o) => { const t = totals(o); return { total: acc.total + t.total, paid: acc.paid + t.paid, balance: acc.balance + t.balance }; }, { total: 0, paid: 0, balance: 0 });
  const host = el('div', 'stats'); [['Total de pedidos', s.total], ['Pagos recibidos', s.paid], ['Saldo pendiente', s.balance]].forEach(([label, value]) => { const n = el('div', 'stat'); n.append(el('span', '', label), el('strong', '', money(value))); host.append(n); }); return host;
}
function resetDialog() {
  const dialog = el('dialog', 'reset-dialog'); dialog.setAttribute('aria-labelledby', 'reset-title'); const title = el('h2', '', '¿Empezar de nuevo?'); title.id = 'reset-title'; dialog.append(title, el('p', '', 'Se borrarán todos los pedidos y pagos de esta demo en este navegador. Esta acción no se puede deshacer.'));
  const actions = el('div', 'actions'); actions.append(button('Cancelar', () => dialog.close()), button('Borrar demo', () => {
    orders = []; try { localStorage.removeItem(STORAGE_KEY); storageProblem = ''; } catch { storageProblem = 'No se pudo borrar el almacenamiento del navegador. Revisá sus permisos.'; }
    dialog.close(); render(false); notice(storageProblem || 'Demo reiniciada. Podés crear tu primer pedido.');
  }, 'primary')); dialog.append(actions); document.body.append(dialog); dialog.addEventListener('close', () => dialog.remove()); dialog.showModal(); $('button', dialog).focus();
}
function simulator() {
  heading('03 / APRENDER HACIENDO', 'Tu galería, en práctica.', 'Creá pedidos, sumá obras y seguí cada pago. Todo sucede en este navegador, con datos ficticios.', '03');
  const latestPaid = orders.length && totals(orders.at(-1)).balance === 0;
  main.append(narrator(latestPaid ? 'celebrate' : 'wave', latestPaid ? '¡El último pedido está pagado! Su saldo es cero. El estado de producción sigue su propio circuito.' : 'Probá con dos obras. Después registrá una seña y completá el saldo. Un pedido puede estar pagado y seguir en producción.', 'sim-narrator'));
  if (storageProblem) main.append(el('div', 'source-note', storageProblem));
  const tabs = el('div', 'subnav'); [['resumen', 'Resumen'], ['pedidos', 'Pedidos'], ['obras', 'Obras'], ['pagos', 'Pagos']].forEach(([key, label]) => { const b = button(label, () => { tab = key; render(false); $(`.subnav button[data-tab="${key}"]`)?.focus(); }); b.dataset.tab = key; b.setAttribute('aria-pressed', String(tab === key)); tabs.append(b); }); tabs.append(button('Reiniciar demo', resetDialog, 'danger')); main.append(tabs);
  if (tab === 'resumen') { main.append(stats()); if (!orders.length) main.append(empty()); else orders.forEach((o, i) => main.append(orderCard(o, i, false))); }
  if (tab === 'pedidos') { const grid = el('div', 'sim-grid'), list = el('section'); list.setAttribute('aria-label', 'Pedidos creados'); list.append(el('h2', 'form-title', `Pedidos creados · ${orders.length}`)); if (!orders.length) list.append(empty()); else [...orders].reverse().forEach(o => list.append(orderCard(o, orders.indexOf(o)))); grid.append(newOrderForm(), list); main.append(grid); }
  if (tab === 'obras') {
    if (!orders.length) main.append(empty('Todavía no hay obras.'));
    orders.forEach((o, index) => { const panel = el('section', 'order-card'); panel.append(el('h3', '', `HG-${String(index + 1).padStart(3, '0')} · ${o.customer}`)); o.items.forEach((item, i) => { const line = el('div', 'order-line'); line.append(el('span', '', `Ítem ${i + 1} · ${item.title} · ${item.quantity} unidad(es)`), el('span', '', money(item.price) + ' c/u')); panel.append(line); }); main.append(panel); });
  }
  if (tab === 'pagos') { main.append(stats()); if (!orders.length) main.append(empty('Todavía no hay pagos.')); orders.forEach((o, i) => main.append(orderCard(o, i))); }
  const actions = el('div', 'actions'); actions.append(button('Ver resultado →', () => navigate('resultado'), 'primary'), button('Volver al mapeo', () => navigate('mapeo'))); main.append(actions);
}
function result() {
  const head = el('section', 'result-header'); head.append(el('div', 'eyebrow', '04 / UNA MIRADA MÁS CLARA'), el('h1', '', 'Registrar una vez. Entender todo.'), el('p', '', 'Cada pedido reúne sus obras y pagos. El saldo muestra lo pendiente, sin buscar entre notas ni hacer cuentas aparte.')); main.append(head, stats());
  head.append(narrator('celebrate', '¡Todo conectado! El pedido reúne sus obras y pagos. Registrar una vez te ayuda a encontrar cada dato y seguir lo que falta cobrar.'));
  const host = el('div', 'result-order'); if (orders.length) host.append(orderCard(orders.at(-1), orders.length - 1, false)); else host.append(empty('El resultado de tu próxima obra.'));
  const actions = el('div', 'actions'); actions.append(button('Probar con un pedido', () => { tab = 'pedidos'; navigate('simulador'); }, 'primary'), button('Volver a iniciar recorrido ↻', startGuide), button('Ver mapeo completo', () => navigate('mapeo'))); host.append(actions); main.append(host);
}
function render(focus = true) {
  stopSequence(); const requested = location.hash.slice(1); const route = routes.includes(requested) ? requested : 'inicio';
  if (guided) step = routes.indexOf(route);
  updateGuide(); main.replaceChildren(); ({ inicio: home, transformacion: transform, mapeo: mapping, simulador: simulator, resultado: result })[route]();
  $$('nav a').forEach(a => { if (a.hash === '#' + route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (focus) { main.focus(); window.scrollTo({ top: 0, behavior: 'instant' }); }
}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => { reduced = e.matches; if ($('#static-mode')) { $('#static-mode').checked = reduced; if (reduced) manualSequence(4); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) { clearTimeout(timer); playing = false; animations.forEach(a => a.pause()); paintSequence(); } });
window.addEventListener('hashchange', () => render());
render(false);
