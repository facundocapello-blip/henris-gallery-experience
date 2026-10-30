/* Henris Gallery · recorrido guiado, réplica y motion
   Vanilla JS. Sin dependencias. Todo el estado de práctica vive en memoria:
   no hay red, no se escribe nada en la app ni en la planilla. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n, moneda = "USD") =>
    (moneda === "ARS" ? "$ " : "USD ") + Number(n || 0).toLocaleString("es-AR");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const KEY = "henris.tour.v2";

  /* ---------------------------------------------------------------- datos */
  const db = {
    clientes: ["Estudio Méndez", "Galería Sur", "Casa Vidal"],
    pedidos: [
      {
        id: "P-1042",
        cliente: "Estudio Méndez",
        moneda: "USD",
        fecha: "28/10/2026",
        obras: [
          { desc: "Retrato familiar", ancho: 60, alto: 80, unidad: "cm", precio: 850, terminacion: "Marco negro" }
        ],
        pagos: [{ fecha: "29/10/2026", importe: 300, medio: "Transferencia" }]
      }
    ],
    nextId: 1043
  };

  const total = (p) => p.obras.reduce((a, o) => a + Number(o.precio || 0), 0);
  const pagado = (p) => p.pagos.reduce((a, x) => a + Number(x.importe || 0), 0);
  const saldo = (p) => total(p) - pagado(p);
  const pedidoById = (id) => db.pedidos.find((p) => p.id === id);

  /* --------------------------------------------------------------- estado */
  const state = {
    view: "pedidos",          // pedidos | obras | pagos | clientes | detalle | form-pedido | form-obra | form-pago
    activeId: db.pedidos[0].id,
    detalleTab: "obras",
    draft: {},
    lastSaved: null
  };
  const body = $("#ws-body");

  /* --------------------------------------------------------------- vistas */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function viewPedidos() {
    const cards = db.pedidos.map((p) => `
      <button type="button" class="rp-card" data-act="abrir" data-id="${p.id}" data-tour="item-pedido">
        <span class="c1">${esc(p.id)} · ${esc(p.cliente)}</span>
        <span class="c3"><b>${money(total(p), p.moneda)}</b><span>${p.obras.length} obra${p.obras.length === 1 ? "" : "s"} · saldo ${money(saldo(p), p.moneda)}</span></span>
        <span class="c2">Pedido del ${esc(p.fecha)}</span>
      </button>`).join("");
    return `
      <div class="rp-head">
        <div><p class="rp-title">Pedidos</p><p class="rp-sub">Cada fila es un pedido con sus obras y sus cobros.</p></div>
        <button type="button" class="btn btn-solid" data-act="nuevo-pedido" data-tour="btn-nuevo">Nuevo pedido</button>
      </div>
      <div class="rp-list" data-tour="lista-pedidos">${cards}</div>`;
  }

  function totalsBox(p) {
    return `
      <div class="rp-total">
        <div data-tour="total"><small>Total del pedido</small><strong data-num="total">${money(total(p), p.moneda)}</strong></div>
        <div data-tour="pagado"><small>Pagado</small><strong data-num="pagado">${money(pagado(p), p.moneda)}</strong></div>
        <div class="saldo" data-tour="saldo"><small>Saldo pendiente</small><strong data-num="saldo">${money(saldo(p), p.moneda)}</strong></div>
      </div>
      <div class="equation" data-tour="ecuacion" aria-hidden="true">
        <span class="chip">Total ${money(total(p), p.moneda)}</span>
        <span class="op">−</span>
        <span class="chip">Pagado ${money(pagado(p), p.moneda)}</span>
        <span class="op">=</span>
        <span class="chip result">Saldo ${money(saldo(p), p.moneda)}</span>
      </div>`;
  }

  function viewDetalle() {
    const p = pedidoById(state.activeId) || db.pedidos[0];
    if (!p) return viewPedidos();
    const obras = p.obras.length
      ? p.obras.map((o) => `
        <div class="rp-line">
          <span>${esc(o.desc)}</span>
          <span>${o.ancho}×${o.alto} ${esc(o.unidad)} · ${esc(o.terminacion || "sin terminación")}</span>
          <strong>${money(o.precio, p.moneda)}</strong>
        </div>`).join("")
      : `<p class="rp-empty">Todavía no hay obras en este pedido.</p>`;
    const pagos = p.pagos.length
      ? p.pagos.map((x) => `
        <div class="rp-line">
          <span>${esc(x.fecha)}</span>
          <span>${esc(x.medio)}</span>
          <strong>${money(x.importe, p.moneda)}</strong>
        </div>`).join("")
      : `<p class="rp-empty">Todavía no hay pagos registrados.</p>`;

    return `
      <div class="rp-breadcrumb"><button type="button" data-act="volver">← Pedidos</button><span>${esc(p.id)}</span></div>
      <div class="rp-head" data-tour="detalle-pedido">
        <div>
          <p class="rp-title">${esc(p.id)} · ${esc(p.cliente)}</p>
          <p class="rp-sub">Pedido del ${esc(p.fecha)} · moneda ${esc(p.moneda)}</p>
        </div>
        <div class="rp-actions">
          <button type="button" class="btn" data-act="ir-obra" data-tour="btn-agregar-obra">Agregar obra</button>
          <button type="button" class="btn" data-act="ir-pago" data-tour="btn-agregar-pago">Registrar pago</button>
        </div>
      </div>
      <div class="rp-tabs" role="tablist" aria-label="Detalle del pedido">
        <button type="button" class="rp-tab" role="tab" data-act="tab" data-tab="obras" aria-selected="${state.detalleTab === "obras"}" data-tour="tab-obras-detalle">Obras (${p.obras.length})</button>
        <button type="button" class="rp-tab" role="tab" data-act="tab" data-tab="pagos" aria-selected="${state.detalleTab === "pagos"}" data-tour="tab-pagos">Pagos (${p.pagos.length})</button>
      </div>
      <div class="rp-panel">${state.detalleTab === "obras"
        ? `<div class="rp-list" data-tour="lista-obras">${obras}</div>`
        : `<div class="rp-list" data-tour="lista-pagos">${pagos}</div>`}</div>
      ${totalsBox(p)}
      <span class="rp-save-check" id="save-check" role="status">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="#3A5F48" stroke-width="1.4"/><path d="M5 9.3l2.6 2.6L13 6.4" fill="none" stroke="#3A5F48" stroke-width="2" stroke-linecap="round"/></svg>
        Guardado en la práctica
      </span>`;
  }

  function viewAgg(table) {
    const isObra = table === "obras";
    const rows = db.pedidos.flatMap((p) =>
      (isObra ? p.obras : p.pagos).map((x) => `
        <div class="rp-line">
          <span>${esc(p.id)} · ${esc(p.cliente)}</span>
          <span>${isObra ? esc(x.desc) : esc(x.medio)}</span>
          <strong>${money(isObra ? x.precio : x.importe, p.moneda)}</strong>
        </div>`)).join("");
    return `
      <div class="rp-head">
        <div><p class="rp-title">${isObra ? "Obras" : "Pagos"}</p>
        <p class="rp-sub">Todas las ${isObra ? "obras" : "cobros"} de todos los pedidos, en una sola lista.</p></div>
      </div>
      ${rows ? `<div class="rp-list">${rows}</div>` : `<p class="rp-empty">Sin registros todavía.</p>`}`;
  }

  function viewClientes() {
    return `
      <div class="rp-head"><div><p class="rp-title">Clientes</p>
      <p class="rp-sub">Cada cliente agrupa sus pedidos. Antes era una hoja aparte.</p></div></div>
      <div class="rp-list">${db.clientes.map((c) => `
        <div class="rp-card" role="listitem" style="cursor:default">
          <span class="c1">${esc(c)}</span>
          <span class="c2">${db.pedidos.filter((p) => p.cliente === c).length} pedido(s)</span>
        </div>`).join("")}</div>`;
  }

  function viewFormPedido() {
    const opts = db.clientes.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
    return `
      <div class="rp-breadcrumb"><button type="button" data-act="volver">← Pedidos</button><span>Nuevo pedido</span></div>
      <div class="rp-head"><div><p class="rp-title">Nuevo pedido</p>
        <p class="rp-sub">Solo tres datos. Las obras y los pagos se agregan después.</p></div></div>
      <div class="rp-add">
        <div class="rp-field">
          <label for="f-cliente">Cliente</label>
          <select id="f-cliente" data-field="cliente" data-tour="campo-cliente">
            <option value="">Elegí un cliente…</option>${opts}
          </select>
          <small>Es la columna CLIENTE de tu planilla.</small><span class="err" role="alert"></span>
        </div>
        <div class="rp-field">
          <label for="f-moneda">Moneda del pedido</label>
          <select id="f-moneda" data-field="moneda" data-tour="campo-moneda">
            <option value="">Elegí la moneda…</option>
            <option value="USD">Dólares (USD)</option>
            <option value="ARS">Pesos (ARS)</option>
          </select>
          <small>Se define una vez por pedido y no cambia después.</small><span class="err" role="alert"></span>
        </div>
        <div class="rp-actions">
          <button type="button" class="btn btn-solid" data-act="guardar-pedido" data-tour="btn-guardar">Guardar pedido</button>
          <button type="button" class="btn" data-act="volver">Cancelar</button>
        </div>
        <span class="rp-save-check" id="save-check" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="#3A5F48" stroke-width="1.4"/><path d="M5 9.3l2.6 2.6L13 6.4" fill="none" stroke="#3A5F48" stroke-width="2" stroke-linecap="round"/></svg>
          Pedido guardado (solo en la práctica)
        </span>
      </div>`;
  }

  function viewFormObra() {
    return `
      <div class="rp-breadcrumb"><button type="button" data-act="volver-pedido">← ${esc(state.activeId)}</button><span>Nueva obra</span></div>
      <div class="rp-head"><div><p class="rp-title">Nueva obra</p>
        <p class="rp-sub">Una obra es un ítem del pedido: lo que se va a producir y cuánto sale.</p></div></div>
      <div class="rp-add">
        <div class="rp-field">
          <label for="f-desc">Qué se hace</label>
          <input id="f-desc" type="text" data-field="desc" data-tour="campo-desc" placeholder="Ej.: Retrato familiar" autocomplete="off">
          <small>En tu planilla era la descripción de la fila.</small><span class="err" role="alert"></span>
        </div>
        <div class="rp-row">
          <div class="rp-field">
            <label for="f-ancho">Ancho</label>
            <input id="f-ancho" type="number" inputmode="decimal" min="1" data-field="ancho" data-tour="campo-ancho" placeholder="60">
            <span class="err" role="alert"></span>
          </div>
          <div class="rp-field">
            <label for="f-alto">Alto</label>
            <input id="f-alto" type="number" inputmode="decimal" min="1" data-field="alto" data-tour="campo-alto" placeholder="80">
            <span class="err" role="alert"></span>
          </div>
        </div>
        <div class="rp-field">
          <label for="f-unidad">Unidad</label>
          <select id="f-unidad" data-field="unidad" data-tour="campo-unidad">
            <option value="">Elegí la unidad…</option>
            <option value="cm">Centímetros</option>
            <option value="m">Metros</option>
          </select>
          <span class="err" role="alert"></span>
        </div>
        <div class="rp-field">
          <label for="f-precio">Precio de la obra</label>
          <input id="f-precio" type="number" inputmode="decimal" min="1" data-field="precio" data-tour="campo-precio" placeholder="850">
          <small>Es el importe de esta obra, no el total del pedido.</small><span class="err" role="alert"></span>
        </div>
        <div class="rp-actions">
          <button type="button" class="btn btn-solid" data-act="guardar-obra" data-tour="btn-guardar">Guardar obra</button>
          <button type="button" class="btn" data-act="volver-pedido">Cancelar</button>
        </div>
        <span class="rp-save-check" id="save-check" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="#3A5F48" stroke-width="1.4"/><path d="M5 9.3l2.6 2.6L13 6.4" fill="none" stroke="#3A5F48" stroke-width="2" stroke-linecap="round"/></svg>
          Obra agregada (solo en la práctica)
        </span>
      </div>`;
  }

  function viewFormPago() {
    const p = pedidoById(state.activeId);
    return `
      <div class="rp-breadcrumb"><button type="button" data-act="volver-pedido">← ${esc(p.id)}</button><span>Nuevo pago</span></div>
      <div class="rp-head"><div><p class="rp-title">Registrar un pago</p>
        <p class="rp-sub">Solo lo que ya entró. Si todavía no lo cobraste, no se registra.</p></div></div>
      <div class="rp-add">
        <div class="rp-field">
          <label for="f-importe">Importe recibido</label>
          <input id="f-importe" type="number" inputmode="decimal" min="1" data-field="importe" data-tour="campo-importe" placeholder="300">
          <small>Saldo actual: ${money(saldo(p), p.moneda)}.</small><span class="err" role="alert"></span>
        </div>
        <div class="rp-field">
          <label for="f-medio">Medio de pago</label>
          <select id="f-medio" data-field="medio" data-tour="campo-medio">
            <option value="">Elegí el medio…</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
          <span class="err" role="alert"></span>
        </div>
        <div class="rp-actions">
          <button type="button" class="btn btn-solid" data-act="guardar-pago" data-tour="btn-guardar">Guardar pago</button>
          <button type="button" class="btn" data-act="volver-pedido">Cancelar</button>
        </div>
        <span class="rp-save-check" id="save-check" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="#3A5F48" stroke-width="1.4"/><path d="M5 9.3l2.6 2.6L13 6.4" fill="none" stroke="#3A5F48" stroke-width="2" stroke-linecap="round"/></svg>
          Pago registrado (solo en la práctica)
        </span>
      </div>`;
  }

  let lastView = null;
  function render() {
    const sameView = lastView === state.view;
    const keep = {};
    if (sameView) $$("[data-field]").forEach((el) => { keep[el.dataset.field] = el.value; });
    const html = {
      pedidos: viewPedidos,
      obras: () => viewAgg("obras"),
      pagos: () => viewAgg("pagos"),
      clientes: viewClientes,
      detalle: viewDetalle,
      "form-pedido": viewFormPedido,
      "form-obra": viewFormObra,
      "form-pago": viewFormPago
    }[state.view] || viewPedidos;
    body.innerHTML = html();
    if (sameView) $$("[data-field]").forEach((el) => {
      if (keep[el.dataset.field] !== undefined) el.value = keep[el.dataset.field];
    });
    lastView = state.view;
    $$("#ws-tabs .ws-tab").forEach((t) => {
      const isSub = ["obras", "pagos"].includes(state.view);
      const active = t.dataset.view === state.view || (isSub && t.dataset.view === "pedidos");
      t.setAttribute("aria-selected", String(active));
    });
    if (state.lastSaved === "obra") pulseNew("lista-obras");
    if (state.lastSaved === "pago") pulseNew("lista-pagos");
    if (state.saldoAnim && state.view === "detalle") {
      const { from, to, moneda } = state.saldoAnim;
      state.saldoAnim = null;
      motion.saldoShift(from, to, moneda);
    }
  }

  function pulseNew(sel) {
    const el = $(`[data-tour="${sel}"]`);
    if (el && !reduceMotion.matches) el.classList.add("rp-stagger");
    state.lastSaved = null;
  }

  /* --------------------------------------------------------------- acciones */
  function go(view) { state.view = view; render(); }

  document.addEventListener("click", (e) => {
    const topTab = e.target.closest("#ws-tabs .ws-tab");
    if (topTab) { go(topTab.dataset.view); return; }

    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;

    if (act === "abrir") { state.activeId = btn.dataset.id; state.detalleTab = "obras"; go("detalle"); }
    else if (act === "volver") go("pedidos");
    else if (act === "volver-pedido") { state.detalleTab = "obras"; go("detalle"); }
    else if (act === "tab") { state.detalleTab = btn.dataset.tab; render(); }
    else if (act === "nuevo-pedido") { state.draft = {}; go("form-pedido"); }
    else if (act === "ir-obra") go("form-obra");
    else if (act === "ir-pago") go("form-pago");
    else if (act === "guardar-pedido") savePedido();
    else if (act === "guardar-obra") saveObra();
    else if (act === "guardar-pago") savePago();
  });

  function showSaved() {
    const check = $("#save-check");
    if (check) check.classList.add("on");
  }

  function invalid(fields, msg) {
    fields.forEach((f) => {
      const err = $(`[data-field="${f}"]`)?.closest(".rp-field")?.querySelector(".err");
      if (err) err.textContent = msg;
    });
    const first = $(`[data-field="${fields[0]}"]`);
    if (first) first.focus({ preventScroll: true });
  }

  function savePedido() {
    const v = (f) => $(`[data-field="${f}"]`)?.value || "";
    const missing = [!v("cliente") && "cliente", !v("moneda") && "moneda"].filter(Boolean);
    if (missing.length) return invalid(missing, "Completá este dato para guardar.");
    const p = {
      id: "P-" + db.nextId++,
      cliente: v("cliente"),
      moneda: v("moneda"),
      fecha: new Date().toLocaleDateString("es-AR"),
      obras: [],
      pagos: []
    };
    db.pedidos.unshift(p);
    state.activeId = p.id;
    state.detalleTab = "obras";
    showSaved();
    if (tour.running) tour.next(900); else setTimeout(() => go("detalle"), 550);
  }

  function saveObra() {
    const p = pedidoById(state.activeId);
    const v = (f) => $(`[data-field="${f}"]`)?.value || "";
    const missing = ["desc", "ancho", "alto", "unidad", "precio"].filter((f) => !v(f));
    if (!p) return;
    if (missing.length) return invalid(missing, "Completá este dato para guardar.");
    p.obras.push({
      desc: v("desc"), ancho: v("ancho"), alto: v("alto"),
      unidad: v("unidad"), precio: Number(v("precio")), terminacion: "Sin definir"
    });
    state.lastSaved = "obra";
    state.detalleTab = "obras";
    showSaved();
    if (tour.running) tour.next(900); else setTimeout(() => go("detalle"), 550);
  }

  function savePago() {
    const p = pedidoById(state.activeId);
    const v = (f) => $(`[data-field="${f}"]`)?.value || "";
    const missing = ["importe", "medio"].filter((f) => !v(f));
    if (!p) return;
    if (missing.length) return invalid(missing, "Completá este dato para guardar.");
    const before = saldo(p);
    p.pagos.push({ fecha: new Date().toLocaleDateString("es-AR"), importe: Number(v("importe")), medio: v("medio") });
    state.lastSaved = "pago";
    state.saldoAnim = { from: before, to: saldo(p), moneda: p.moneda };
    state.detalleTab = "pagos";
    showSaved();
    if (tour.running) tour.next(900); else setTimeout(() => go("detalle"), 550);
  }

  /* ---------------------------------------------------------------- motion */
  const motion = (() => {
    const soft = () => reduceMotion.matches;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function animate(el, frames, opts) {
      if (!el) return;
      if (soft() || typeof el.animate !== "function") {
        el.style.opacity = "1"; el.style.transform = "none";
        return;
      }
      return el.animate(frames, Object.assign({ duration: 400, easing: "ease-out", fill: "both" }, opts));
    }

    function saldoShift(from, to, moneda) {
      const el = document.querySelector('[data-num="saldo"]');
      if (!el) return;
      if (soft()) { el.textContent = money(to, moneda); return; }
      const t0 = performance.now();
      const dur = 700;
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        const val = from + (to - from) * easeOut(k);
        el.textContent = money(Math.round(val), moneda);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }

    function countUp(el, to, moneda) {
      if (!el) return;
      if (soft()) { el.textContent = money(to, moneda); return; }
      const t0 = performance.now();
      (function step(now) {
        const k = Math.min(1, (now - t0) / 600);
        el.textContent = money(Math.round(to * easeOut(k)), moneda);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }

    function flow() {
      const svg = $("#flow");
      if (!svg || svg.dataset.done) return;
      svg.dataset.done = "1";
      svg.classList.add("run");
    }

    function morph() {
      const el = $("#morph");
      if (!el) return;
      el.classList.add("run");
    }

    return { animate, saldoShift, countUp, flow, morph, soft };
  })();

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          if (en.target.id === "flow") motion.flow();
          if (en.target.id === "morph") motion.morph();
        });
      }, { threshold: 0.4 })
    : null;
  ["flow", "morph"].forEach((id) => { const el = document.getElementById(id); if (el && io) io.observe(el); });

  /* ------------------------------------------------------------ recorrido */
  /* asegura la pantalla que el paso necesita, aunque se avance con «Siguiente» */
  function ensureFormPedido() { if (state.view !== "form-pedido") { state.draft = {}; go("form-pedido"); } }
  function ensureFormObra() { if (state.view !== "form-obra") go("form-obra"); }
  function ensureFormPago() { if (state.view !== "form-pago") go("form-pago"); }

  const MODULES = [
    { id: 0, name: "Qué es esto", target: "40 s" },
    { id: 1, name: "Crear un pedido", target: "90 s" },
    { id: 2, name: "Qué es una obra", target: "60 s" },
    { id: 3, name: "Medidas y precio", target: "2 min" },
    { id: 4, name: "Registrar un pago", target: "2 min" },
    { id: 5, name: "Consultar el saldo", target: "45 s" },
    { id: 6, name: "Del Excel a la app", target: "60 s" }
  ];

  const STEPS = [
    { m: 0, title: "Esto no es otra planilla",
      text: "Es el mismo trabajo de siempre: pedidos, obras y cobros. Solo que ahora están conectados.",
      setup: () => go("pedidos") },
    { m: 0, anchor: '[data-tour="tab-pedidos"]', title: "Cuatro secciones y nada más",
      text: "Pedidos, Obras, Pagos y Clientes. Son las hojas de tu Excel, con los datos enlazados." },

    { m: 1, anchor: '[data-tour="tab-pedidos"]', title: "Empezá por Pedidos",
      text: "Pedidos es la tabla central: todo lo demás cuelga de acá.",
      setup: () => go("pedidos") },
    { m: 1, anchor: '[data-tour="btn-nuevo"]', title: "Creá uno nuevo",
      text: "El botón abre un formulario en blanco.", advanceOn: true,
      setup: () => go("pedidos") },
    { m: 1, anchor: '[data-tour="campo-cliente"]', title: "Elegí el cliente",
      text: "Es la columna CLIENTE de tu planilla. Empezá a escribir y elegí de la lista.",
      practice: { field: "cliente", ok: (v) => !!v, hint: "Elegí un cliente de la lista." },
      setup: ensureFormPedido },
    { m: 1, anchor: '[data-tour="campo-moneda"]', title: "Fijá la moneda",
      text: "Pesos o dólares. Queda para todo el pedido.",
      practice: { field: "moneda", ok: (v) => !!v, hint: "Elegí una moneda." },
      setup: ensureFormPedido },
    { m: 1, anchor: '[data-tour="btn-guardar"]', title: "Guardá el pedido",
      text: "Queda creado y vacío. Las obras entran después.", setup: ensureFormPedido },

    { m: 2, anchor: '[data-tour="detalle-pedido"]', title: "Abrí el pedido",
      text: "Cada pedido tiene su propia lista de obras y de pagos.",
      setup: () => { state.activeId = (db.pedidos.find((x) => x.obras.length) || db.pedidos[0]).id; state.detalleTab = "obras"; go("detalle"); } },
    { m: 2, anchor: '[data-tour="lista-obras"]', title: "Una obra es una línea",
      text: "En tu planilla era una fila. Acá es parte del pedido y suma al total.", motion: "A4" },

    { m: 3, anchor: '[data-tour="btn-agregar-obra"]', title: "Agregá la obra",
      text: "Abre el formulario de la obra.", advanceOn: true },
    { m: 3, anchor: '[data-tour="campo-desc"]', title: "Qué se hace",
      text: "El nombre de la obra. Corto y claro.",
      practice: { field: "desc", ok: (v) => v.trim().length >= 3, hint: "Escribí al menos 3 letras." },
      setup: ensureFormObra },
    { m: 3, anchor: '[data-tour="campo-ancho"]', title: "Ancho",
      text: "Solo el número. La unidad va aparte.",
      practice: { field: "ancho", ok: (v) => Number(v) > 0, hint: "Poné un número mayor a 0." },
      setup: ensureFormObra },
    { m: 3, anchor: '[data-tour="campo-alto"]', title: "Alto",
      text: "Igual que el ancho: el número, sin la unidad.",
      practice: { field: "alto", ok: (v) => Number(v) > 0, hint: "Poné un número mayor a 0." },
      setup: ensureFormObra },
    { m: 3, anchor: '[data-tour="campo-unidad"]', title: "Unidad",
      text: "Centímetros o metros. Se elige una vez por obra.",
      practice: { field: "unidad", ok: (v) => !!v, hint: "Elegí centímetros o metros." },
      setup: ensureFormObra },
    { m: 3, anchor: '[data-tour="campo-precio"]', title: "Precio de esta obra",
      text: "Lo que sale esta pieza, no el total del pedido. El total lo suma la app.",
      practice: { field: "precio", ok: (v) => Number(v) > 0, hint: "Poné el precio de la obra." },
      setup: ensureFormObra },
    { m: 3, anchor: '[data-tour="btn-guardar"]', title: "Guardá la obra",
      text: "El total del pedido se actualiza solo.", setup: ensureFormObra },

    { m: 4, anchor: '[data-tour="tab-pagos"]', title: "Los cobros van aparte",
      text: "En Pagos registrás lo que ya entró. Una seña, un pago parcial o el total.", advanceOn: true,
      setup: () => { state.detalleTab = "pagos"; go("detalle"); } },
    { m: 4, anchor: '[data-tour="btn-agregar-pago"]', title: "Registrá el cobro",
      text: "Abre el formulario del pago.", advanceOn: true },
    { m: 4, anchor: '[data-tour="campo-importe"]', title: "Cuánto entró",
      text: "Solo plata recibida. Si todavía no lo cobraste, no se carga.",
      practice: { field: "importe", ok: (v) => Number(v) > 0, hint: "Poné el importe recibido." },
      setup: ensureFormPago },
    { m: 4, anchor: '[data-tour="campo-medio"]', title: "Cómo lo cobraste",
      text: "Transferencia, efectivo o tarjeta. Sirve para saber después.",
      practice: { field: "medio", ok: (v) => !!v, hint: "Elegí el medio de pago." },
      setup: ensureFormPago },
    { m: 4, anchor: '[data-tour="btn-guardar"]', title: "Guardá el pago",
      text: "El saldo baja al instante. Nadie tiene que restar a mano.", setup: ensureFormPago },

    { m: 5, anchor: '[data-tour="total"]', title: "Total: lo que suma el pedido",
      text: "Es la suma de las obras. Viene de la app, no de una fórmula tuya.", motion: "A3",
      setup: () => { state.detalleTab = "pagos"; go("detalle"); } },
    { m: 5, anchor: '[data-tour="saldo"]', title: "Saldo: lo que falta cobrar",
      text: "Total menos lo pagado. Si da cero, el pedido está cobrado.", motion: "A3",
      setup: () => { state.detalleTab = "pagos"; go("detalle"); } },

    { m: 6, anchor: "#morph", title: "Tu Excel no se tira",
      text: "La planilla vieja queda como archivo. Lo que cambia es dónde se carga de acá en adelante.",
      motion: "A2", setup: () => document.getElementById("morph")?.scrollIntoView({ block: "center" }) },
    { m: 6, anchor: "#morph", title: "Columna es campo, fila es registro",
      text: "Cada columna que ya usabas tiene su campo con nombre. Cada fila pasa a ser un registro con historia." },
    { m: 6, anchor: null, title: "Listo para empezar",
      text: "Abrí la app con tu cuenta autorizada. Y si te trabás, la chuleta tiene los cuatro pasos en una carilla." }
  ];

  const layer = document.createElement("div");
  layer.className = "tour-layer";
  layer.hidden = true;
  layer.innerHTML = `
    <div class="tour-ring" hidden></div>
    <div class="tour-pop" role="dialog" aria-modal="false" aria-labelledby="tp-title" aria-describedby="tp-text">
      <div class="tp-meta"><span id="tp-module"></span><span class="tp-step" id="tp-step"></span></div>
      <h3 id="tp-title" tabindex="-1"></h3>
      <p id="tp-text"></p>
      <p class="tp-hint" id="tp-hint"></p>
      <div class="tp-actions">
        <button type="button" class="btn" id="tp-prev">← Anterior</button>
        <button type="button" class="btn btn-solid tp-next" id="tp-next">Siguiente →</button>
        <button type="button" class="tp-ghost" id="tp-skip">Saltar módulo</button>
        <button type="button" class="tp-ghost" id="tp-exit">Salir</button>
      </div>
    </div>`;
  document.body.appendChild(layer);

  const bar = document.createElement("div");
  bar.className = "tour-bar";
  bar.innerHTML = "<span></span>";
  bar.hidden = true;
  document.body.appendChild(bar);

  const live = document.createElement("div");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";
  document.body.appendChild(live);

  const ring = $(".tour-ring", layer);
  const pop = $(".tour-pop", layer);
  const elTitle = $("#tp-title");
  const elText = $("#tp-text");
  const elHint = $("#tp-hint");
  const elMeta = $("#tp-module");
  const elStep = $("#tp-step");
  const btnPrev = $("#tp-prev");
  const btnNext = $("#tp-next");
  const btnSkip = $("#tp-skip");
  const btnExit = $("#tp-exit");

  const tour = {
    running: false,
    index: 0,
    next(delay = 0) {
      if (!this.running) return;
      const go2 = () => {
        if (this.index >= STEPS.length - 1) { this.finish(); return; }
        this.index += 1; this.show();
      };
      delay ? setTimeout(go2, delay) : go2();
    },
    prev() {
      if (!this.running || this.index === 0) return;
      this.index -= 1; this.show();
    },
    skipModule() {
      const m = STEPS[this.index].m;
      let i = this.index;
      while (i < STEPS.length && STEPS[i].m === m) i += 1;
      if (i >= STEPS.length) { this.finish(); return; }
      this.index = i; this.show();
    },
    start(at) {
      this.running = true;
      this.index = typeof at === "number" ? at : 0;
      layer.hidden = false; bar.hidden = false;
      document.documentElement.style.scrollBehavior = reduceMotion.matches ? "auto" : "smooth";
      this.show();
      $(".tour-restore")?.remove();
    },
    finish() {
      this.exit();
      save({ done: true, index: 0 });
      live.textContent = "Recorrido terminado.";
      announceBanner("Terminaste el recorrido. La chuleta tiene los cuatro pasos para consultar.", "chuleta");
    },
    exit() {
      this.running = false;
      layer.hidden = true; bar.hidden = true;
      ring.hidden = true;
      cleanupPractice();
      document.documentElement.style.scrollBehavior = "";
    },
    show() {
      const step = STEPS[this.index];
      if (!step) return;
      cleanupPractice();
      if (typeof step.setup === "function") step.setup();
      render();
      requestAnimationFrame(() => requestAnimationFrame(() => this.paint(step)));
      save({ index: this.index, done: false });
    },
    paint(step) {
      const mod = MODULES[step.m];
      elMeta.textContent = `Módulo ${step.m + 1} de ${MODULES.length} · ${mod.name} · ${mod.target}`;
      elStep.textContent = `Paso ${this.index + 1} de ${STEPS.length}`;
      elTitle.textContent = step.title;
      elText.textContent = step.text;
      elHint.textContent = "";
      btnPrev.disabled = this.index === 0;
      btnNext.textContent = this.index === STEPS.length - 1 ? "Terminar" : "Siguiente →";
      btnNext.disabled = false;
      $(".tour-bar span").style.width = `${Math.round(((this.index + 1) / STEPS.length) * 100)}%`;
      live.textContent = `Paso ${this.index + 1} de ${STEPS.length}. ${step.title}. ${step.text}`;

      const target = step.anchor ? $(step.anchor) : null;
      if (target) {
        const r = target.getBoundingClientRect();
        if (r.top < 80 || r.bottom > innerHeight - 40) {
          // salto instantáneo: el globo necesita la posición ya corregida, no a mitad de animación
          target.scrollIntoView({ block: "center", behavior: "auto" });
        }
      }
      position(target);
      if (target && !reduceMotion.matches) {
        motion.animate(target, [{ transform: "scale(1)" }, { transform: "scale(1.012)" }, { transform: "scale(1)" }], { duration: 420 });
      }
      if (step.practice) bindPractice(step, this);
      if (step.motion === "A4") {
        const list = $('[data-tour="lista-obras"]');
        if (list && !reduceMotion.matches) list.classList.add("rp-stagger");
      }
      if (step.motion === "A3") {
        const eq = $('[data-tour="ecuacion"]');
        if (eq && !reduceMotion.matches) { eq.classList.remove("run"); void eq.offsetWidth; eq.classList.add("run"); }
        const p = pedidoById(state.activeId) || db.pedidos[0];
        mixCount(p);
      }
      if (!step.practice) elTitle.focus({ preventScroll: true });
    }
  };

  function mixCount(p) {
    if (!p) return;
    const t = document.querySelector('[data-num="total"]');
    const pg = document.querySelector('[data-num="pagado"]');
    const s = document.querySelector('[data-num="saldo"]');
    motion.countUp(t, total(p), p.moneda);
    motion.countUp(pg, pagado(p), p.moneda);
    motion.countUp(s, saldo(p), p.moneda);
  }

  function centerPop() {
    ring.hidden = true;
    pop.style.left = "50%";
    pop.style.top = "50%";
    pop.style.transform = "translate(-50%,-50%)";
  }

  function position(target) {
    if (!target) {
      centerPop();
      return;
    }
    pop.style.transform = "none";
    const r = target.getBoundingClientRect();
    // si el objetivo quedó fuera de la ventana, el globo se centra para no quedar invisible
    if (r.bottom < 70 || r.top > innerHeight - 20) {
      centerPop();
      return;
    }
    const pad = 7;
    ring.hidden = false;
    ring.style.left = `${r.left - pad}px`;
    ring.style.top = `${r.top - pad}px`;
    ring.style.width = `${r.width + pad * 2}px`;
    ring.style.height = `${r.height + pad * 2}px`;
    ring.classList.toggle("pulse", !reduceMotion.matches);

    const pw = pop.offsetWidth, ph = pop.offsetHeight, gap = 14;
    const below = innerHeight - r.bottom - gap - 10;
    const above = r.top - gap - 10;
    let top;
    if (below >= ph) top = r.bottom + gap;
    else if (above >= ph) top = r.top - ph - gap;
    else if (below >= above) top = innerHeight - ph - 10;
    else top = 10;
    let left = r.left + r.width / 2 - pw / 2;
    left = Math.max(10, Math.min(left, innerWidth - pw - 10));
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    ring.classList.remove("pulse");
    if (!reduceMotion.matches) { void ring.offsetWidth; ring.classList.add("pulse"); }
  }

  let reposition = 0;
  const onMove = () => {
    if (!tour.running) return;
    cancelAnimationFrame(reposition);
    reposition = requestAnimationFrame(() => {
      const step = STEPS[tour.index];
      position(step && step.anchor ? $(step.anchor) : null);
    });
  };
  addEventListener("scroll", onMove, { passive: true });
  addEventListener("resize", onMove);

  /* ---------------------------------------------------------- práctica */
  let practiceEl = null;
  let practiceHandler = null;
  function cleanupPractice() {
    if (practiceEl && practiceHandler) {
      practiceEl.removeEventListener("input", practiceHandler);
      practiceEl.removeEventListener("change", practiceHandler);
    }
    practiceEl = null; practiceHandler = null;
  }

  function bindPractice(step, engine) {
    const el = $(`[data-field="${step.practice.field}"]`);
    if (!el) return;
    practiceEl = el;
    const check = () => {
      const ok = step.practice.ok(el.value);
      const err = el.closest(".rp-field")?.querySelector(".err");
      if (err) err.textContent = ok ? "" : (el.value ? step.practice.hint : "");
      btnNext.disabled = !ok;
      elHint.textContent = ok ? "" : step.practice.hint;
      if (ok && el.dataset.done !== "1") {
        el.dataset.done = "1";
        setTimeout(() => { if (engine.running && STEPS[engine.index] === step) engine.next(); }, 450);
      }
    };
    practiceHandler = check;
    el.addEventListener("input", check);
    el.addEventListener("change", check);
    check();
    el.focus({ preventScroll: true });
  }

  /* ------------------------------------------------- avance por clic real */
  document.addEventListener("click", (e) => {
    if (!tour.running) return;
    const step = STEPS[tour.index];
    if (!step || !step.advanceOn || !step.anchor) return;
    const target = $(step.anchor);
    if (target && target.contains(e.target)) setTimeout(() => tour.next(), 160);
  }, true);

  /* -------------------------------------------------------------- teclado */
  document.addEventListener("keydown", (e) => {
    if (!tour.running) return;
    if (e.key === "Escape") { tour.exit(); return; }
    if (e.target.matches("input,select,textarea") && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
    if (e.key === "ArrowRight" && !btnNext.disabled) { e.preventDefault(); tour.next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); tour.prev(); }
  });

  btnNext.addEventListener("click", () => tour.next());
  btnPrev.addEventListener("click", () => tour.prev());
  btnSkip.addEventListener("click", () => tour.skipModule());
  btnExit.addEventListener("click", () => tour.exit());

  /* ------------------------------------------------------------ progreso */
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, load(), data))); } catch (_) {}
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) { return {}; }
  }

  function announceBanner(text, action) {
    $(".tour-restore")?.remove();
    const el = document.createElement("div");
    el.className = "tour-restore";
    el.innerHTML = `<span>${esc(text)}</span>
      <span><button type="button" class="go">${action === "chuleta" ? "Ver la chuleta" : "Seguir"}</button>
      <button type="button" class="dismiss">Cerrar</button></span>`;
    document.body.appendChild(el);
    el.querySelector(".go").addEventListener("click", () => {
      if (action === "chuleta") location.href = "chuleta.html";
      else tour.start(load().index || 0);
    });
    el.querySelector(".dismiss").addEventListener("click", () => el.remove());
  }

  /* --------------------------------------------------------------- arranque */
  function bindStart(sel) {
    $$(sel).forEach((b) => b.addEventListener("click", () => {
      try { localStorage.removeItem(KEY); } catch (_) {}
      const restart = $("#restart-tour"); if (restart) restart.hidden = false;
      document.getElementById("practica")?.scrollIntoView({ block: "start" });
      setTimeout(() => tour.start(0), 260);
    }));
  }
  bindStart("#start-tour, #start-tour-2, #restart-tour");

  const saved = load();
  if (!saved.done && typeof saved.index === "number" && saved.index > 0) {
    announceBanner(`Quedaste en el paso ${saved.index + 1} del recorrido.`, "seguir");
  }

  render();
})();
