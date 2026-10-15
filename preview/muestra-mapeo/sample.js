(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const node = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const targets = ['Código de la obra', 'Descripción', 'Medidas'];
  const rules = ['Se conserva el código de catálogo. No se confunde con el identificador del pedido.', 'La descripción se traslada como texto, sin recortarla ni reescribirla.', 'Se conserva «100x150» tal como está en el Excel. No se agregan unidades ni se convierte el valor.'];
  const fields = SAMPLE_SOURCE.sample.map((f, i) => ({ ...f, destination: targets[i], rule: rules[i] }));
  const loaded = new Set();
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 2600, depart = 240, arrival = 2040;
  let index = 0, scale = .6, motion = null, running = false, autoplay = false, frame = 0, pending = false;
  let staticMode = media.matches;

  function pose(p, text) {
    $('#mascot').className = 'mascot pose-' + p;
    $('#mascot').setAttribute('aria-label', 'Mascota de Henris Gallery: ' + ({ presentation: 'presentación', wave: 'acompañamiento', worry: 'preocupación', celebrate: 'celebración' })[p]);
    $('#narration').textContent = text;
  }
  function status(text) { $('#playback-status').textContent = text; }
  function controls() {
    $('#play-label').textContent = running ? 'Pausar' : motion ? 'Continuar' : 'Recorrer los 3 campos';
    $('#play-symbol').textContent = running ? 'Ⅱ' : '▶';
    $('#play').disabled = staticMode; $('#previous').disabled = index === 0; $('#next').disabled = index === fields.length - 1;
    $('#sample-progress').style.width = loaded.size / fields.length * 100 + '%';
    $('#loaded-count').textContent = `${loaded.size} de 3 campos cargados`;
    $$('.field-choices button, .source-hit').forEach(b => {
      b.setAttribute('aria-pressed', String(Number(b.dataset.index) === index && !pending));
      b.classList.toggle('loaded', loaded.has(Number(b.dataset.index)));
    });
    $$('.phone-field').forEach((n, i) => { n.classList.toggle('active', i === index && !pending); n.classList.toggle('loaded', loaded.has(i)); });
  }
  function clearFrame() { cancelAnimationFrame(frame); frame = 0; }
  function stop() { clearFrame(); running = false; autoplay = false; motion = null; $('#transfer-card').hidden = true; $$('.phone-field').forEach(n => n.classList.remove('arrived')); }
  function focusSource() {
    const cell = $(`.source-hit[data-index="${index}"]`), view = $('#sheet-viewport');
    view.scrollLeft = Math.max(0, cell.offsetLeft + cell.offsetWidth / 2 - view.clientWidth / 2);
  }
  function drawConnection() {
    const svg = $('#connections'), card = $('#transfer-card');
    if (pending) { svg.style.visibility = 'hidden'; card.hidden = true; return false; }
    const canvas = $('#flow-canvas').getBoundingClientRect(), source = $(`.source-hit[data-index="${index}"]`).getBoundingClientRect();
    const viewport = $('#sheet-viewport').getBoundingClientRect(), target = $(`.phone-field[data-index="${index}"]`).getBoundingClientRect();
    const center = source.left + source.width / 2;
    if (center < viewport.left || center > viewport.right) { svg.style.visibility = 'hidden'; card.hidden = true; return false; }
    svg.style.visibility = 'visible'; svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);
    const sx = center - canvas.left, sy = source.bottom - canvas.top, ex = target.left + 5 - canvas.left, ey = target.top + target.height / 2 - canvas.top;
    const gx = window.innerWidth <= 760 ? 2 : $('#phone').getBoundingClientRect().left - canvas.left - 30;
    const path = `M ${sx} ${sy} C ${sx} ${sy + 28}, ${gx} ${sy + 28}, ${gx} ${sy + 60} L ${gx} ${ey - 20} Q ${gx} ${ey}, ${ex} ${ey}`;
    $('#curve-base').setAttribute('d', path); $('#curve-active').setAttribute('d', path);
    return true;
  }
  function commit(i, flash) {
    loaded.add(i);
    const field = $(`.phone-field[data-index="${i}"]`), value = $('.phone-field-value', field);
    // User-originated text only enters textContent; no HTML interpretation.
    value.textContent = fields[i].value; value.classList.remove('empty');
    if (flash && !staticMode) field.classList.add('arrived');
    controls();
  }
  function paint() {
    const visible = drawConnection(), path = $('#curve-active');
    const length = path.getTotalLength();
    let progress = loaded.has(index) ? 1 : 0;
    if (motion) {
      const raw = Math.max(0, Math.min(1, (motion.elapsed - depart) / (arrival - depart)));
      progress = (1 - Math.cos(Math.PI * raw)) / 2;
      if (motion.elapsed >= arrival && !motion.committed) { motion.committed = true; commit(index, true); }
      if (motion.elapsed >= arrival + 450) $(`.phone-field[data-index="${index}"]`).classList.remove('arrived');
      const card = $('#transfer-card'); card.hidden = !visible || motion.elapsed >= arrival;
      if (!card.hidden) {
        const p = path.getPointAtLength(length * progress), box = $('#flow-canvas').getBoundingClientRect();
        const x = Math.max(0, Math.min(box.width - card.offsetWidth, p.x - card.offsetWidth / 2));
        card.style.transform = `translate(${x}px,${p.y - card.offsetHeight / 2}px)`;
        card.style.opacity = String(Math.min(1, motion.elapsed / 160));
      }
    }
    path.style.strokeDasharray = String(length); path.style.strokeDashoffset = String(length * (1 - progress));
    path.style.opacity = progress ? '1' : '.3';
  }
  function tick(now) {
    if (!motion || !running) return;
    motion.elapsed = Math.min(duration, motion.elapsed + Math.max(0, now - motion.last)); motion.last = now;
    paint();
    if (motion.elapsed >= duration) {
      const continueSequence = autoplay && index < fields.length - 1;
      const completed = fields[index];
      motion = null; running = false; $('#transfer-card').hidden = true;
      if (continueSequence) { begin(index + 1, true); return; }
      autoplay = false;
      if (loaded.size === 3) { pose('celebrate', '¡La ficha quedó completa! Código, descripción y medidas llegaron desde sus celdas, sin cambiar los valores.'); status('Recorrido completo · 3 de 3 campos cargados.'); }
      else status(`${completed.cell} · Valor cargado. Elegí el siguiente campo.`);
      controls(); paint(); return;
    }
    frame = requestAnimationFrame(tick);
  }
  function showSelection(i) {
    index = i; pending = false;
    $$('.pending-list button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    $('#cell-reference').textContent = 'Hoja1!' + fields[i].cell;
    $('#rule-title').textContent = fields[i].label + ' → ' + fields[i].destination;
    $('#rule-text').textContent = fields[i].rule;
    $('#trace-source').textContent = fields[i].label + ' · ' + fields[i].value;
    $('#trace-destination').textContent = fields[i].destination;
    $('#transfer-label').textContent = fields[i].label; $('#transfer-value').textContent = fields[i].value;
    focusSource(); controls();
  }
  function begin(i, sequence = false) {
    stop(); autoplay = sequence; showSelection(i);
    pose('wave', `${fields[i].label}: ${fields[i].value}. El nombre y el valor viajan juntos hasta ${fields[i].destination.toLowerCase()}.`);
    if (staticMode) { commit(i, false); paint(); status(`${fields[i].cell} · ${fields[i].value} cargado, sin movimiento.`); if (loaded.size === 3) pose('celebrate', 'Los tres campos están completos. La vista estática conserva exactamente la misma información.'); return; }
    motion = { elapsed: 0, last: performance.now(), committed: false }; running = true;
    status(`${fields[i].cell} · Trasladando nombre y valor…`); controls(); paint(); frame = requestAnimationFrame(tick);
  }
  function pause() { clearFrame(); if (!motion) return; running = false; status(`${fields[index].cell} · En pausa.`); controls(); }
  function play() {
    if (staticMode) return;
    if (running) { pause(); return; }
    if (motion) { running = true; motion.last = performance.now(); status(`${fields[index].cell} · Traslado reanudado.`); controls(); frame = requestAnimationFrame(tick); return; }
    if (loaded.size === fields.length) reset(false);
    const first = fields.findIndex((_, i) => !loaded.has(i)); begin(first < 0 ? 0 : first, true);
  }
  function reset(announce = true) {
    stop(); loaded.clear(); pending = false;
    $$('.phone-field-value').forEach(n => { n.textContent = 'Por completar'; n.classList.add('empty'); });
    showSelection(0); paint(); controls();
    pose('presentation', 'Primero el código, después la descripción y las medidas. Iniciá el recorrido y seguí cómo llega cada dato.');
    if (announce) status('Muestra reiniciada · 0 de 3 campos cargados.');
  }
  function resize() { if (pending) return; paint(); }
  function zoom(delta) {
    scale = Math.max(.4, Math.min(1, +(scale + delta).toFixed(1)));
    $('#sheet-image-wrap').style.width = SAMPLE_SOURCE.width * scale + 'px'; $('#zoom-label').textContent = Math.round(scale * 100) + '%';
    focusSource(); paint();
  }
  fields.forEach((f, i) => {
    const hit = node('button', 'source-hit'); hit.type = 'button'; hit.dataset.index = i;
    Object.assign(hit.style, { left: f.x * 100 + '%', top: f.y * 100 + '%', width: f.width * 100 + '%', height: f.height * 100 + '%' });
    hit.setAttribute('aria-label', `${f.cell} · ${f.label}: ${f.value}`); hit.addEventListener('click', () => begin(i)); $('#source-hotspots').append(hit);
    const b = node('button', '', f.value); b.type = 'button'; b.dataset.index = i; b.prepend(node('small', '', f.cell + ' · ' + f.label)); b.addEventListener('click', () => begin(i)); $('#field-choices').append(b);
    const phone = node('div', 'phone-field'); phone.dataset.index = i; phone.append(node('span', 'phone-field-label', f.destination), node('span', 'phone-field-value empty', 'Por completar')); $('#destination-fields').append(phone);
  });
  PENDING_FIELDS.forEach(f => {
    const b = node('button', '', `${f.column} · ${f.label}`); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      stop(); pending = true;
      $$('.pending-list button').forEach(n => n.setAttribute('aria-pressed', String(n === b)));
      $('#pending-detail').textContent = `${f.column} · ${f.label}. ${f.rule}`;
      $('#trace-source').textContent = `${f.column} · ${f.label}`; $('#trace-destination').textContent = 'Pendiente · sin conexión';
      pose('worry', 'Este campo queda pendiente. No se conecta con un destino que todavía no está definido.');
      status('Campo pendiente seleccionado · no se carga ningún valor.'); controls(); paint();
    }); $('#pending-list').append(b);
  });
  $('#play').addEventListener('click', play); $('#restart').addEventListener('click', () => reset());
  $('#previous').addEventListener('click', () => begin(Math.max(0, index - 1))); $('#next').addEventListener('click', () => begin(Math.min(2, index + 1)));
  $('#zoom-out').addEventListener('click', () => zoom(-.1)); $('#zoom-in').addEventListener('click', () => zoom(.1));
  const mode = $('#static-mode'); mode.checked = staticMode; mode.disabled = media.matches;
  function changeMode() {
    if (running) pause();
    staticMode = media.matches || mode.checked; mode.checked = staticMode; mode.disabled = media.matches;
    if (staticMode && motion) { const i = index; stop(); commit(i, false); }
    $('#motion-note').textContent = media.matches ? 'Se respeta tu preferencia de reducir movimiento. Seleccioná las celdas o usá las flechas.' : 'Pausa, anterior y siguiente disponibles durante el recorrido.';
    controls(); paint();
  }
  mode.addEventListener('change', changeMode); media.addEventListener('change', changeMode);
  window.addEventListener('resize', resize); $('#sheet-viewport').addEventListener('scroll', resize, { passive: true });
  new ResizeObserver(resize).observe($('#flow-canvas'));
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause(); });
  $('#source-image').addEventListener('load', () => { focusSource(); paint(); });
  const dialog = $('#source-dialog'); $('#open-source').addEventListener('click', () => { if (running) pause(); dialog.showModal(); $('#close-source').focus(); }); $('#close-source').addEventListener('click', () => dialog.close());
  zoom(0); reset(false); changeMode();
})();
