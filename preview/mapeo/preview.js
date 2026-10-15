(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const e = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const money = n => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n / 100);
  const groups = HEADER_SOURCE.groups.filter(g => g.id !== 'completo');
  const all = groups.flatMap(g => g.cells.map(c => ({ ...c, ...RULES[c.column], groupInfo: g })));
  const lookup = Object.fromEntries(all.map((f, i) => [f.column, i]));
  // These totals use an unchanged bundle of the existing validated domain functions.
  const sample = { id: 'HG-DEMO', customer: 'Clara Vidal', channel: 'Local', operation: 'Nuevo',
    items: [{ id: 'DEMO-001', pedidoId: 'HG-DEMO', title: 'Luz de tarde', quantity: 1, price: 8000000 }, { id: 'DEMO-002', pedidoId: 'HG-DEMO', title: 'Horizonte', quantity: 2, price: 3500000 }],
    payments: [{ id: 'PAGO-DEMO-001', pedidoId: 'HG-DEMO', amount: 5000000, date: '2026-10-15T12:00:00Z' }] };
  const sampleTotals = totals(sample);
  let index = lookup.D, currentGroup = '', playing = false, started = false;
  let timer = 0, deadline = 0, remaining = 2600, animations = [], visited = 0, drawFrame = 0;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let staticMode = media.matches;

  function disposeMotion() {
    clearTimeout(timer); timer = 0;
    animations.forEach(a => a.cancel()); animations = [];
    $('#traveler').hidden = true;
    $('#connection-flow').style.strokeDasharray = '';
    $('#connection-flow').style.strokeDashoffset = '';
  }
  function cancelPlayback() { disposeMotion(); playing = false; started = false; updatePlayer(); }
  function pose(name, text) {
    const names = { presentation: 'presentación con micrófono', wave: 'saludo con auriculares', worry: 'preocupación', celebrate: 'celebración' };
    $('#mascot').className = 'mascot pose-' + name;
    $('#mascot').setAttribute('aria-label', 'Mascota de Henris Gallery: ' + names[name]);
    $('#narrator-text').textContent = text;
  }
  function setNarration() {
    const f = all[index];
    if (f.status === 'pending') pose('worry', 'Este dato también importa. Lo dejamos visible y pendiente; no le inventamos un destino.');
    else pose('wave', f.status === 'rule' ? 'Acá no copiamos una marca: mostramos la regla que usa la demo para calcular su resultado.' : 'El mismo dato encuentra su lugar. La captura es del Excel; los valores del teléfono son ejemplos ficticios.');
  }
  function updatePlayer(message) {
    $('#play-label').textContent = playing ? 'Pausar' : started ? 'Continuar' : 'Reproducir';
    $('#play').firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
    $('#play').disabled = staticMode;
    $('#previous').disabled = index === 0;
    $('#next').disabled = index === all.length - 1;
    $('#timeline-progress').style.width = `${(index + 1) / all.length * 100}%`;
    $('#timeline').setAttribute('aria-valuenow', String(index + 1));
    $('#timeline').setAttribute('aria-valuetext', `${index + 1} de 40: ${all[index].label}`);
    if (message) $('#playback-status').textContent = message;
  }
  function phoneField(target, label, value, cls = '') {
    const n = e('div', 'phone-field ' + cls); n.dataset.target = target;
    n.append(e('span', 'phone-field-label', label), e('span', 'phone-field-value', value)); return n;
  }
  function phoneScreen(view) {
    const host = $('#phone-content'); host.replaceChildren();
    const titles = { works: 'OBRAS DEL PEDIDO', client: 'FICHA DEL CLIENTE', payments: 'PAGOS RELACIONADOS', finance: 'FINANZAS DEL PEDIDO', order: 'RESUMEN DEL PEDIDO' };
    const title = e('div', 'phone-section-label'); title.append(e('span', '', titles[view]), e('span', '', 'HG-DEMO')); host.append(title);
    const card = e('div', 'phone-card');
    if (view === 'works') {
      card.classList.add('art-card'); const thumb = e('div', 'art-thumb'); thumb.setAttribute('aria-hidden', 'true'); thumb.append(e('div', 'abstract-print')); card.append(thumb);
      card.append(phoneField('code', 'Código de la obra', 'DEMO-001'), phoneField('description', 'Título / descripción', sample.items[0].title));
      const compact = e('div', 'compact-fields'); compact.append(phoneField('dimensions', 'Medidas', '60 × 80 cm'), phoneField('border', 'Borde para agregar', 'Blanco · ejemplo'), phoneField('passe', 'Passe-partout', 'Sí · ejemplo'), phoneField('quantity', 'Cantidad', '1 · regla de la demo')); card.append(compact);
      host.append(card, e('div', 'phone-mini-card', '02 · Horizonte — 2 unidades'));
      host.append(e('p', 'phone-note', 'Código, medidas y terminaciones: vista conceptual del Canvas. El simulador validado mantiene su formulario actual.'));
    } else if (view === 'client') {
      card.append(phoneField('customer', 'Nombre del cliente', sample.customer), phoneField('document', 'DNI / CUIL', '00.000.000 · ficticio'), phoneField('contact', 'Teléfono', 'Sin dato de ejemplo'));
      host.append(card, e('p', 'phone-note', 'El Canvas reúne estos datos en Cliente. El simulador mínimo conserva solo el nombre dentro del pedido. No se añade una ficha funcional por esta vista.'));
    } else if (view === 'payments') {
      const info = e('div', 'phone-section-label'); info.append(e('span', '', 'REGISTRO DE PAGO'), e('span', '', 'EJEMPLO FICTICIO')); host.append(info);
      card.append(phoneField('paymentAmount', 'Importe del pago', money(sampleTotals.paid), 'large'), phoneField('paymentDate', 'Fecha del pago', '15 oct 2026 · ejemplo'), phoneField('paymentRelation', 'Pedido relacionado', 'HG-DEMO'));
      host.append(card, e('p', 'phone-note', 'Una seña y un pago final generan registros distintos. La fecha de este ejemplo no proviene de una operación real.'));
    } else if (view === 'finance') {
      card.append(phoneField('total', 'Total del pedido', money(sampleTotals.total)), phoneField('paid', 'Pagos recibidos', money(sampleTotals.paid)), phoneField('balance', 'Saldo pendiente', money(sampleTotals.balance), 'large'), phoneField('status', 'Estado financiero', 'Parcial'));
      host.append(card, e('div', 'phone-formula', '150.000 − 50.000 = 100.000'), e('p', 'phone-note', 'El estado financiero es independiente del estado operativo. Los cálculos son los de la demo existente.'));
    } else {
      card.append(phoneField('reference', 'Identificador de la demo', 'HG-DEMO'), phoneField('customer', 'Cliente', sample.customer), phoneField('channel', 'Canal de ejemplo', 'Local'), phoneField('operation', 'Estado operativo', 'Nuevo'));
      host.append(card, e('p', 'phone-note', 'No se convierte «i» ni el número web en el identificador de la app sin definir antes su relación.'));
    }
    $$('.phone-tabs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    const f = all[index];
    if (f.target) {
      const target = host.querySelector(`[data-target="${f.target}"]`);
      if (target) { target.classList.add('active'); host.scrollTop = Math.max(0, target.offsetTop - host.offsetTop - 90); }
    }
  }
  function sourceGroup(group) {
    if (currentGroup === group.id) return;
    currentGroup = group.id;
    const image = $('#sheet-image');
    image.src = group.data;
    image.alt = `Captura auténtica de pedidos.xlsx, Hoja1!${group.range}: ${group.cells.map(c => c.label).join('; ')}`;
    image.width = group.width; image.height = group.height;
    $('#sheet-image-wrap').style.minWidth = `${group.cells.length * 95 + 45}px`;
    $('#source-location').textContent = `Hoja1!${group.range}`;
    const host = $('#source-hotspots'); host.replaceChildren();
    group.cells.forEach(c => {
      const b = e('button', 'source-hit'); b.type = 'button'; b.dataset.column = c.column;
      b.style.left = `${c.x * 100}%`; b.style.width = `${c.width * 100}%`;
      b.setAttribute('aria-label', `${c.cell} · ${c.label}`); b.setAttribute('title', `${c.cell} · ${c.label}`); b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => select(lookup[c.column])); host.append(b);
    });
    $$('#groups button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.group === group.id)));
    const groupButton = $(`#groups button[data-group="${group.id}"]`);
    $('#groups').scrollLeft = Math.max(0, groupButton.offsetLeft - $('#groups').offsetLeft - 15);
    $('#group-position').textContent = `${groups.indexOf(group) + 1} / ${groups.length} grupos`;
  }
  function drawConnection() {
    const f = all[index], source = $(`.source-hit[data-column="${f.column}"]`);
    const target = f.status === 'pending' ? $('#pending-tray') : $(`[data-target="${f.target}"]`);
    if (!source || !target || target.hidden) return;
    const canvas = $('#flow-canvas').getBoundingClientRect(), a = source.getBoundingClientRect(), b = target.getBoundingClientRect();
    const stage = $('.sheet-stage').getBoundingClientRect();
    const sx = Math.max(stage.left + 8, Math.min(stage.right - 8, a.left + a.width / 2)) - canvas.left;
    const sy = a.bottom - canvas.top;
    const ex = b.left - canvas.left + (f.status === 'pending' ? 4 : 6), ey = b.top + b.height / 2 - canvas.top;
    const mobile = window.innerWidth <= 760;
    let path;
    if (mobile) {
      const gutter = Math.max(2, $('.phone-zone').getBoundingClientRect().left - canvas.left - 9);
      path = `M ${sx} ${sy} C ${sx} ${sy + 20}, ${gutter} ${sy + 20}, ${gutter} ${sy + 45} L ${gutter} ${ey - 16} Q ${gutter} ${ey}, ${ex} ${ey}`;
    } else {
      const gutter = f.status === 'pending' ? Math.max(5, ex - 16) : $('#phone').getBoundingClientRect().left - canvas.left - 32;
      path = `M ${sx} ${sy} C ${sx} ${sy + 35}, ${gutter} ${sy + 35}, ${gutter} ${sy + 65} L ${gutter} ${ey - 18} Q ${gutter} ${ey}, ${ex} ${ey}`;
    }
    const svg = $('#connections'); svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`); svg.classList.toggle('pending', f.status === 'pending');
    $('#connection-base').setAttribute('d', path); $('#connection-flow').setAttribute('d', path);
    $('#traveler').style.offsetPath = `path('${path}')`;
    $('#traveler').style.offsetRotate = '0deg';
  }
  function queueDraw() { cancelAnimationFrame(drawFrame); drawFrame = requestAnimationFrame(drawConnection); }
  function showField() {
    const f = all[index]; sourceGroup(f.groupInfo);
    $$('.source-hit').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.column === f.column)); b.classList.toggle('related', (f.related || []).includes(b.dataset.column)); });
    $('#field-counter').textContent = `CAMPO ${String(index + 1).padStart(2, '0')} / 40`;
    $('#mapping-status').textContent = f.status === 'pending' ? '? Pendiente de definir' : f.status === 'rule' ? 'ƒ Regla de la demo' : '✓ Mapeo documentado';
    $('#mapping-status').classList.toggle('pending', f.status === 'pending');
    $('#mapping-title').textContent = f.title;
    $('#origin-ref').textContent = `${f.cell} · ${f.label}`;
    $('#destination-name').textContent = f.destination || 'Sin destino confirmado';
    $('#trace-origin').textContent = `${f.column} · ${f.label}`;
    $('#trace-destination').textContent = f.destination || 'Pendiente de definir';
    $('#rule-kind').textContent = f.kind;
    $('#rule-text').textContent = f.rule;
    const related = $('#related-fields'); related.replaceChildren();
    if (f.related) f.related.forEach(column => { const field = all[lookup[column]]; related.append(e('span', '', `${column} · ${field.label}`)); });
    $('#pending-tray').hidden = f.status !== 'pending';
    phoneScreen(f.view); setNarration(); updatePlayer(`${f.cell} · ${f.label}${staticMode ? ' · vista estática' : ''}`);
    const image = $('#sheet-image'); if (!image.complete) image.addEventListener('load', queueDraw, { once: true });
    const selected = $(`.source-hit[data-column="${f.column}"]`), scroll = $('.sheet-stage');
    scroll.scrollLeft = Math.max(0, selected.offsetLeft + selected.offsetWidth / 2 - scroll.clientWidth / 2);
    queueDraw();
  }
  function select(next) { cancelPlayback(); index = Math.max(0, Math.min(all.length - 1, next)); showField(); }
  function animateField() {
    disposeMotion(); drawConnection();
    const duration = Number($('#speed').value), particle = $('#traveler');
    particle.textContent = all[index].label; particle.hidden = false;
    const travel = particle.animate([{ offsetDistance: '0%', opacity: 0 }, { offsetDistance: '0%', opacity: 1, offset: .12 }, { offsetDistance: '100%', opacity: 1, offset: .88 }, { offsetDistance: '100%', opacity: 0 }], { duration, easing: 'ease-in-out', fill: 'forwards' });
    const line = $('#connection-flow'), length = line.getTotalLength();
    line.style.strokeDasharray = String(length); line.style.strokeDashoffset = String(length);
    const flow = line.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration: duration * .8, fill: 'forwards', easing: 'ease-out' });
    animations = [travel, flow]; remaining = duration; deadline = performance.now() + duration;
    timer = setTimeout(advanceAuto, duration); updatePlayer(`En recorrido · ${all[index].cell} · ${all[index].label}`);
  }
  function advanceAuto() {
    if (!playing) return;
    visited++;
    if (visited >= all.length) {
      disposeMotion(); playing = false; started = false; index = all.length - 1; showField();
      pose('celebrate', '¡Recorrido completo! Los destinos claros y los pendientes quedan a la vista, sin perder información del origen.');
      updatePlayer('Recorrido completo · 40 campos revisados.'); return;
    }
    index = (index + 1) % all.length; showField(); animateField();
  }
  function playPause() {
    if (staticMode) return;
    if (playing) {
      playing = false; clearTimeout(timer); timer = 0; remaining = Math.max(0, deadline - performance.now()); animations.forEach(a => a.pause());
      updatePlayer(`En pausa · ${all[index].cell} · ${all[index].label}`); return;
    }
    playing = true;
    if (started && animations.length) {
      animations.forEach(a => a.play()); deadline = performance.now() + remaining; timer = setTimeout(advanceAuto, remaining); updatePlayer('Recorrido reanudado.');
    } else {
      started = true; visited = 0; animateField();
    }
  }
  function renderRules() {
    const host = $('#all-rules');
    all.forEach((f, i) => {
      const n = e('article', 'rule-entry ' + (f.status === 'pending' ? 'pending' : ''));
      const b = e('button', '', `${f.cell} · ${f.label} ↗`); b.type = 'button'; b.addEventListener('click', () => { select(i); $('#experience').scrollIntoView({ behavior: 'instant', block: 'start' }); });
      n.append(b, e('small', '', f.destination || 'Pendiente · sin destino confirmado'), e('p', '', f.rule)); host.append(n);
    });
  }
  groups.forEach(group => {
    const b = e('button', '', group.title); b.type = 'button'; b.dataset.group = group.id; b.setAttribute('aria-pressed', 'false'); b.append(e('span', '', String(group.cells.length).padStart(2, '0')));
    b.addEventListener('click', () => select(lookup[group.cells[0].column])); $('#groups').append(b);
  });
  const phoneChoices = { client: 'AH', works: 'D', payments: 'Q', finance: 'Y' };
  $$('.phone-tabs button').forEach(b => b.addEventListener('click', () => select(lookup[phoneChoices[b.dataset.view]])));
  $('#previous').addEventListener('click', () => select(index - 1)); $('#next').addEventListener('click', () => select(index + 1));
  $('#play').addEventListener('click', playPause);
  $('#restart').addEventListener('click', () => { select(0); pose('presentation', 'Volvemos al principio. Elegí un grupo o iniciá el recorrido por las 40 cabeceras del archivo.'); updatePlayer('Recorrido reiniciado · listo para explorar.'); });
  $('#speed').addEventListener('change', () => { if (playing) animateField(); else { disposeMotion(); started = false; updatePlayer(); } });
  const motion = $('#static-mode'); motion.checked = staticMode; motion.disabled = media.matches;
  function applyStatic() {
    cancelPlayback(); staticMode = media.matches || motion.checked; motion.checked = staticMode; motion.disabled = media.matches;
    $('#motion-note').textContent = media.matches ? 'Se respeta tu preferencia de reducir movimiento. Usá las flechas para avanzar.' : 'Pausa y avance manual en cualquier momento.';
    $('#speed').disabled = staticMode; $('#connection-flow').style.strokeDasharray = ''; $('#connection-flow').style.strokeDashoffset = ''; showField();
  }
  motion.addEventListener('change', applyStatic); media.addEventListener('change', applyStatic);
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) playPause(); });
  window.addEventListener('resize', () => { if (playing) playPause(); queueDraw(); });
  $('.sheet-stage').addEventListener('scroll', queueDraw, { passive: true }); $('#phone-content').addEventListener('scroll', queueDraw, { passive: true });
  const dialog = $('#source-dialog'); $('#full-source-image').src = HEADER_SOURCE.groups.find(g => g.id === 'completo').data;
  $('#open-all').addEventListener('click', () => { if (playing) playPause(); dialog.showModal(); $('#close-dialog').focus(); });
  $('#close-dialog').addEventListener('click', () => dialog.close());
  new ResizeObserver(queueDraw).observe($('#flow-canvas'));
  renderRules(); applyStatic(); pose('presentation', 'Empecemos por una obra. Tocá una cabecera y te muestro dónde encuentra su lugar.');
})();
