import {cents, totals, CHANNELS, OPERATIONS} from './domain.js';
import {payment, undo, validate} from './experience-domain.js';
const STORAGE='henris-panel-gestion-v1';
const main=document.querySelector('#main'), title=document.querySelector('#page-title'), subtitle=document.querySelector('#page-subtitle');
const fmt=new Intl.NumberFormat('es-AR',{maximumFractionDigits:2});
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const money=(v,c='ARS')=>(c==='ARS'?'$':'USD ')+fmt.format(v/100);
const makeId=()=>crypto.randomUUID();
const item=(id,title,price)=>({id:makeId(),pedidoId:id,title,unique:false,quantity:1,price:price*100});
function sample(id,customer,channel,operation,name,balance,paid=0){
 const order={id,customer,channel,operation,currency:'ARS',items:[item(id,name,balance+paid)],payments:[]};
 if(paid)order.payments.push({id:'initial',pedidoId:id,amount:paid*100,method:'Transferencia',date:'2026-10-15T12:00:00Z'});
 return order;
}
function defaults(){return [
 sample('12350','Julieta R.','Instagram / WhatsApp','En producción','Composición personalizada',660000,15000),
 sample('12349','David Fernández','Instagram / WhatsApp','Nuevo','Lámina enmarcada',5000),
 sample('12348','Ana García','Web a medida','En producción','Obra de galería',22000),
 sample('12347','Lucía Ortega','Local','Confirmado','Fotografía fine art',10000),
 sample('12346','Marcos Luna','Local','Nuevo','Lámina fine art',8000),
 sample('12345','Cecilia P.','Instagram / WhatsApp','En producción','Estudio de luz',5500)
].map(o=>{if(o.id==='12350'){o.items=[item(o.id,'Fotografía Horizonte',420000),item(o.id,'Composición personalizada',255000)];}return o;});}
function read(){try{const raw=localStorage.getItem(STORAGE);if(!raw)return defaults();const rows=JSON.parse(raw);if(!Array.isArray(rows)||rows.length>250)throw Error('Datos inválidos');rows.forEach(validate);return rows;}catch{return defaults();}}
let orders=read(),view=new URLSearchParams(location.search).has('presentacion')?'presentation':'home',active=null,formState=null,error='',toastTimer,guideStep=0,presentationStep=0,tutorialActive=false,tutorialStage=0,tutorialOriginal=null;
const current=()=>orders.find(o=>o.id===active);
const summary=()=>({valid:orders.length,production:orders.filter(o=>o.operation==='En producción').length,balance:orders.reduce((n,o)=>n+totals(o).balance,0)});
function save(next){next.forEach(validate);if(!tutorialActive)localStorage.setItem(STORAGE,JSON.stringify(next));orders=next;}
function update(o){save(orders.map(x=>x.id===o.id?o:x));}
function notice(value){const el=document.querySelector('#toast');el.textContent=value;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
const chip=(value,color)=>`<span class="chip ${color}">${esc(value)}</span>`;
function card(o){const t=totals(o);return `<article class="order-card"><div class="order-card-head"><div><h3>${esc(o.customer)}</h3><div class="order-ref">#${esc(o.id)} · ${esc(o.channel)}</div></div><div class="status-stack"><div class="order-amount">${money(t.balance,o.currency)}</div>${chip(t.status,t.status==='Pagado'?'green':'gold')}</div></div><div class="order-card-foot">${chip(o.operation,'blue')}<button class="detail-link" data-action="detail" data-id="${esc(o.id)}">${o.items.length} ${o.items.length===1?'obra':'obras'} · Ver detalle ›</button></div></article>`;}
function home(){const s=summary();return `<p class="eyebrow">RESUMEN OPERATIVO · DATOS FICTICIOS</p><div class="stats"><section class="stat"><span class="stat-label">Pedidos</span><strong class="stat-number">${s.valid}</strong><span class="stat-caption">Registrados</span></section><section class="stat"><span class="stat-label">En producción</span><strong class="stat-number">${s.production}</strong><span class="stat-caption">Pedidos activos</span></section></div><section class="balance-card"><span class="balance-label">Saldo pendiente de cobro</span><strong class="balance-number">${money(s.balance)}</strong><span class="balance-caption">Calculado a partir de obras y pagos</span></section><button class="primary add-main" data-action="new">+ Nuevo pedido</button><button class="tutorial-entry" data-action="tutorial"><span class="tutorial-entry-icon" aria-hidden="true">▶</span><span><strong>¿Cómo se usa la app?</strong><small>Practicalo paso a paso, sin guardar datos</small></span><span aria-hidden="true">→</span></button><div class="section-heading"><h2>Pedidos recientes</h2><button class="text-button" data-action="orders">Ver todos ›</button></div><div class="order-list">${orders.slice(0,3).map(card).join('')}</div><section class="circuit" aria-label="Circuito integrado"><h3>Circuito integrado</h3><div class="circuit-flow"><div class="circuit-step"><span class="circle"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg></span><span>Pedido</span></div><i class="circuit-connector"></i><div class="circuit-step"><span class="circle"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 18 6-5 4 3 3-4 4 5"/></svg></span><span>Obras</span></div><i class="circuit-connector"></i><div class="circuit-step"><span class="circle"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 15h5"/></svg></span><span>Pagos</span></div></div><p class="circuit-note">Un mismo pedido vincula obras y cobros. Tocá una tarjeta para ver el detalle.</p><button class="story-entry" data-action="presentation"><span><b>Conocé Henris Gallery</b><small>Presentación guiada · 2 minutos</small></span><span aria-hidden="true">→</span></button><button class="map-entry" data-action="mapping">Ver cómo funciona el mapeo <span aria-hidden="true">→</span></button></section><p class="note">Datos ficticios. No conecta ni modifica AppSheet.</p>`;}
function ordersPage(){return `<h2 class="page-title">Pedidos</h2><p class="page-description">Consultá pedidos, obras, cobros y saldos ficticios.</p><button class="primary add-main" data-action="new">+ Nuevo pedido</button><div class="order-list">${orders.map(card).join('')}</div><button class="text-button" data-action="reset">Reiniciar datos ficticios</button>`;}
function detail(){const o=current();if(!o)return home();const t=totals(o);return `<button class="back" data-action="orders">‹ Volver a pedidos</button><h2 class="page-title">Pedido #${esc(o.id)}</h2><p class="page-description">${esc(o.customer)} · ${esc(o.channel)}</p><section class="surface"><div class="meta-row"><span>Estado operativo</span>${chip(o.operation,'blue')}</div><div class="meta-row"><span>Estado del cobro</span>${chip(t.status,t.status==='Pagado'?'green':'gold')}</div><div class="money-row total"><span>Total del pedido</span><strong>${money(t.total,o.currency)}</strong></div><div class="money-row paid"><span>Pagado</span><strong>${money(t.paid,o.currency)}</strong></div><div class="money-row balance"><span>Saldo pendiente</span><strong>${money(t.balance,o.currency)}</strong></div></section><div class="block-title"><h2>Obras del pedido</h2><button class="inline-action" data-action="add-item">+ Agregar obra</button></div>${o.items.length?`<section class="surface">${o.items.map(i=>`<div class="list-row"><div><b>${esc(i.title)}</b><small>Cantidad ${i.quantity}</small></div><strong>${money(i.quantity*i.price,o.currency)}</strong></div>`).join('')}</section>`:'<div class="empty">Agregá la primera obra para calcular el total.</div>'}<div class="block-title"><h2>Pagos</h2>${t.balance>0&&o.items.length?'<button class="inline-action" data-action="add-payment">+ Registrar</button>':''}</div>${o.payments.length?`<section class="surface">${o.payments.map((p,n)=>`<div class="list-row"><div><b>Pago ${n+1}</b><small>${esc(p.method)}</small></div><strong>${money(p.amount,o.currency)}</strong></div>`).join('')}</section>`:'<div class="empty">Todavía no hay pagos registrados.</div>'}${o.payments.length&&o.payments.at(-1).id!=='initial'?'<button class="text-button danger" data-action="undo">↶ Deshacer último pago demo</button>':''}${o.items.length&&t.balance>0?'<button class="primary add-main" data-action="add-payment">Registrar pago pendiente</button>':''}`;}
function newOrder(){return `<button class="back" data-action="home">‹ Volver al panel</button><h2 class="page-title">Nuevo pedido</h2><p class="page-description">Creá un pedido ficticio y agregale las obras.</p><form id="order-form"><label class="field">Cliente<input name="customer" maxlength="120" required placeholder="Nombre del cliente" autocomplete="off"></label><label class="field">Origen<select name="channel">${CHANNELS.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><label class="field">Moneda<select name="currency"><option value="ARS">Pesos (ARS)</option><option value="USD">Dólares (USD)</option></select></label><label class="field">Estado operativo<select name="operation">${OPERATIONS.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><p class="form-error" role="alert">${esc(error)}</p><button class="primary" type="submit">Crear y agregar obras</button></form><p class="note">No se registran pedidos reales.</p>`;}
function addItem(){const o=current();if(!o)return home();return `<button class="back" data-action="detail">‹ Volver al pedido</button><h2 class="page-title">Agregar obra</h2><p class="page-description">Pedido #${esc(o.id)} · ${esc(o.customer)}</p><form id="item-form"><label class="field">Obra<input name="title" required maxlength="120" placeholder="Nombre de la obra"></label><label class="field">Cantidad<input name="quantity" inputmode="numeric" type="number" min="1" max="10000" value="1" required></label><label class="field">Precio unitario (${o.currency})<input name="price" inputmode="decimal" required placeholder="Ej. 15000"></label><label class="field">Tipo de obra<select name="unique"><option value="yes">Pieza única</option><option value="no">Edición múltiple</option></select></label><p class="form-error" role="alert">${esc(error)}</p><button class="primary" type="submit">Guardar obra</button></form>`;}
function addPayment(){const o=current();if(!o)return home();const t=totals(o);return `<button class="back" data-action="detail">‹ Volver al pedido</button><h2 class="page-title">Registrar pago</h2><p class="page-description">Pedido #${esc(o.id)} · Saldo ${money(t.balance,o.currency)}</p><form id="payment-form"><label class="field">Importe (${o.currency})<input name="amount" inputmode="decimal" required placeholder="Ej. 400" autocomplete="off"></label><label class="field">Medio de pago<select name="method"><option>Transferencia</option><option>Efectivo</option><option>Tarjeta</option></select></label><div id="payment-preview" class="preview" aria-live="polite">Ingresá un importe para previsualizar el saldo.</div><p class="form-error" role="alert">${esc(error)}</p><button class="primary" type="submit">Confirmar pago demo</button></form><p class="note">La vista previa no registra pagos. Confirmar registra solo en esta demo local.</p>`;}
function works(){const rows=orders.flatMap(o=>o.items.map(i=>({o,i})));return `<h2 class="page-title">Obras</h2><p class="page-description">Obras vinculadas a los pedidos ficticios.</p>${rows.length?`<section class="surface">${rows.map(({o,i})=>`<div class="list-row"><div><b>${esc(i.title)}</b><small>Pedido #${esc(o.id)} · ${esc(o.customer)} · ${i.quantity} unidad(es)</small><button class="detail-link" data-action="detail" data-id="${esc(o.id)}">Ver pedido ›</button></div><strong>${money(i.price*i.quantity,o.currency)}</strong></div>`).join('')}</section>`:'<div class="empty">Todavía no hay obras.</div>'}`;}
function payments(){const rows=orders.flatMap(o=>o.payments.map(p=>({o,p}))).reverse();return `<h2 class="page-title">Pagos</h2><p class="page-description">Historial local de pagos del simulador.</p>${rows.length?`<section class="surface">${rows.map(({o,p})=>`<div class="list-row"><div><b>${esc(o.customer)}</b><small>Pedido #${esc(o.id)} · ${esc(p.method)}</small><button class="detail-link" data-action="detail" data-id="${esc(o.id)}">Ver pedido ›</button></div><strong>${money(p.amount,o.currency)}</strong></div>`).join('')}</section>`:'<div class="empty">Todavía no hay pagos.</div>'}`;}

const guideLabels=['Origen','Pedido','Obras','Pagos'];
function guide(){
 const o=orders.find(x=>x.id==='12350')||orders[0];
 if(!o)return '<button class="back" data-action="home">‹ Volver al panel</button><div class="empty">Creá un pedido ficticio para explorar el mapeo.</div>';
 const t=totals(o), art=o.items[0], p=o.payments[0];
 const guideRows=[
  {headline:'De un registro a datos ordenados',desc:'El mapeo indica qué dato de origen corresponde a cada campo de la aplicación. Acá usamos un registro ilustrativo, no una importación real.',source:'Registro de origen (ejemplo)',dest:'Datos organizados',rows:[['N.º pedido',o.id,'Identificador',o.id],['Cliente',o.customer,'Cliente',o.customer],['Canal',o.channel,'Origen',o.channel]],insight:'Identificar el pedido evita confundir registros y permite mantener sus datos relacionados.'},
  {headline:'Primero se crea el pedido',desc:'El cliente, el canal y el identificador forman la cabecera. Todas las obras y los pagos se vinculan después a este mismo pedido.',source:'Campos de origen',dest:'Entidad Pedidos',rows:[['N.º pedido',o.id,'Pedido.id',o.id],['Cliente',o.customer,'Pedido.cliente',o.customer],['Canal',o.channel,'Pedido.canal',o.channel]],insight:'El identificador del pedido funciona como referencia común. No hay que repetir los datos del cliente para cada pago.'},
  {headline:'Cada obra se vincula al pedido',desc:'Un pedido admite varias obras. Cada obra conserva su nombre, cantidad y precio, y se asocia mediante el identificador del pedido.',source:'Detalle de obras (ejemplo)',dest:'Ítems / Obras',rows:[['Primera obra',art?.title||'Sin obras','Obra.nombre',art?.title||'—'],['Cantidad',String(art?.quantity||0),'Obra.cantidad',String(art?.quantity||0)],['Precio unitario',art?money(art.price,o.currency):'—','Obra.precio',art?money(art.price,o.currency):'—'],['Referencia del pedido',o.id,'Obra.pedidoId',o.id]],insight:o.items.length+' obra(s) vinculada(s) · Total calculado: '+money(t.total,o.currency)+'.'},
  {headline:'Pagos y saldo quedan conectados',desc:'Cada pago se asocia al pedido. La aplicación suma las obras, descuenta los cobros y calcula automáticamente el saldo pendiente.',source:'Cobro registrado (ejemplo)',dest:'Pagos y resumen',rows:[['N.º pedido',o.id,'Pago.pedidoId',o.id],['Medio de pago',p?.method||'Sin pagos','Pago.medio',p?.method||'—'],['Importe cobrado',money(t.paid,o.currency),'Total pagado',money(t.paid,o.currency)],['Total de obras',money(t.total,o.currency),'Saldo pendiente',money(t.balance,o.currency)]],insight:'Total '+money(t.total,o.currency)+' − Pagado '+money(t.paid,o.currency)+' = Saldo '+money(t.balance,o.currency)+'.'}
 ];
 const d=guideRows[guideStep];
 const rowHtml=d.rows.map(([l,v,target,out])=>`<div class="map-pair"><div class="map-cell"><small>${esc(l)}</small><strong>${esc(v)}</strong></div><span class="map-arrow" aria-hidden="true">→</span><div class="map-cell map-dest"><small>${esc(target)}</small><strong>${esc(out)}</strong></div></div>`).join('');
 return `<button class="back" data-action="home">‹ Volver al panel</button>
 <p class="eyebrow">MAPEO VISUAL · DATOS FICTICIOS</p>
 <h2 class="page-title">Del dato al pedido</h2>
 <p class="page-description">Entendé cómo se conectan los datos del origen con Pedidos, Obras y Pagos, usando un mismo ejemplo.</p>
 <div class="map-progress" aria-label="Etapas del mapeo">${guideLabels.map((label,i)=>`<button type="button" class="map-step ${guideStep===i?'selected':''}" data-action="guide-step" data-id="${i}" aria-pressed="${guideStep===i}"><span>${i+1}</span>${label}</button>`).join('')}</div>
 <section class="map-explanation" aria-live="polite"><span class="map-counter">PASO ${guideStep+1} DE 4</span><h3>${d.headline}</h3><p>${d.desc}</p>
 <div class="map-columns"><span>${d.source}</span><span>${d.dest}</span></div>
 <div class="map-pairs">${rowHtml}</div>
 <div class="map-insight"><span class="map-insight-icon" aria-hidden="true">✓</span><span>${esc(d.insight)}</span></div></section>
 <div class="map-controls"><button class="inline-action" data-action="guide-prev" ${guideStep===0?'disabled':''}>‹ Anterior</button><button class="primary" data-action="guide-next" ${guideStep===3?'disabled':''}>Siguiente →</button></div>
 <div class="map-outcome"><div><strong>Resultado en el simulador</strong><span>Pedido #${esc(o.id)} · ${esc(o.customer)}</span></div><div class="map-outcome-amount">${money(t.balance,o.currency)}<small>Saldo pendiente</small></div></div>
 <button class="map-open-order" data-action="detail" data-id="${esc(o.id)}">Abrir pedido de ejemplo <span aria-hidden="true">↗</span></button>
 <p class="note">Es una demostración conceptual con datos ficticios. No importa Excel ni sincroniza con AppSheet; los nombres técnicos mostrados son ilustrativos.</p>`;
}


const presentationNames=['El desafío','La propuesta','Cómo se conecta','El resultado'];
function presentation(){
 const o=orders.find(order=>order.id==='12350')||orders[0];
 const t=o?totals(o):null;
 const name=o?esc(o.customer):'Cliente de ejemplo';
 const number=o?esc(o.id):'—';
 const total=t?money(t.total,o.currency):'—';
 const paid=t?money(t.paid,o.currency):'—';
 const balance=t?money(t.balance,o.currency):'—';
 const count=o?o.items.length:0;
 const cards=[
  {
   eyebrow:'EL PUNTO DE PARTIDA',
   title:'Del dato disperso a una gestión clara.',
   lead:'Un pedido puede comenzar por WhatsApp, seguir con varias obras y cobrar en distintos momentos. El desafío es mantener todo conectado.',
   visual:`<div class="story-sources"><div class="story-source"><span>01</span><b>Consulta del cliente</b><small>Mensaje o Instagram</small></div><div class="story-source"><span>02</span><b>Obras del pedido</b><small>Cantidad y precio</small></div><div class="story-source"><span>03</span><b>Cobros</b><small>Pagos parciales</small></div></div><div class="story-connector" aria-hidden="true">↓</div><div class="story-result"><span>PUNTO ÚNICO DE CONSULTA</span><strong>Un pedido, toda su información.</strong><small>Sin perder la relación entre obras y pagos.</small></div>`,
   note:'La propuesta organiza el circuito comercial sin modificar cómo llegan los pedidos.'
  },
  {
   eyebrow:'LA SOLUCIÓN',
   title:'Cada pedido reúne sus obras y sus pagos.',
   lead:'El panel concentra la información y permite seguir el estado operativo y financiero por separado.',
   visual:`<div class="story-case"><div class="story-case-header"><div><small>PEDIDO DE EJEMPLO</small><strong>#${number} · ${name}</strong></div><span class="chip blue">${esc(o?.operation||'Nuevo')}</span></div><div class="story-case-grid"><div><span>OBRAS VINCULADAS</span><strong>${count}</strong><small>Total ${total}</small></div><div><span>COBROS RECIBIDOS</span><strong>${paid}</strong><small>Pagos registrados</small></div></div><div class="story-balance"><span>SALDO PENDIENTE</span><strong>${balance}</strong></div></div>`,
   note:'Los importes provienen del ejemplo ficticio del simulador. Si se actualiza, también cambia este resumen.'
  },
  {
   eyebrow:'EL MAPEO',
   title:'Cada dato llega a su lugar.',
   lead:'El mapeo explica qué campos pertenecen al pedido y cuáles se guardan como obras o pagos relacionados.',
   visual:`<div class="story-map"><div class="story-map-title"><span>ORIGEN ILUSTRATIVO</span><span>DESTINO EN LA APP</span></div><div class="story-map-row"><span>N.º de pedido</span><span aria-hidden="true">→</span><strong>Pedido.id</strong></div><div class="story-map-row"><span>Obra / cantidad / precio</span><span aria-hidden="true">→</span><strong>Obra.pedidoId</strong></div><div class="story-map-row"><span>Cobro recibido</span><span aria-hidden="true">→</span><strong>Pago.pedidoId</strong></div></div><button class="story-inline-link" data-action="mapping">Explorar el mapeo completo <span aria-hidden="true">↗</span></button>`,
   note:'Este esquema es conceptual: no representa una importación automática desde Excel.'
  },
  {
   eyebrow:'EL VALOR',
   title:'Menos búsqueda. Más claridad para decidir.',
   lead:'La misma información se puede consultar por pedido, por obra y por pago, con saldos calculados en cada momento.',
   visual:`<div class="story-benefits"><div><span aria-hidden="true">01</span><p><strong>Seguimiento comercial</strong><small>Encontrar el contexto de un pedido sin revisar mensajes sueltos.</small></p></div><div><span aria-hidden="true">02</span><p><strong>Cobros visibles</strong><small>Conocer lo pagado y lo pendiente de cada pedido.</small></p></div><div><span aria-hidden="true">03</span><p><strong>Circuito demostrable</strong><small>Mostrar el flujo completo antes de incorporar datos reales.</small></p></div></div>`,
   note:'Esta web es una demostración con datos ficticios. AppSheet y las planillas reales siguen separados.'
  }
 ];
 const current=cards[presentationStep];
 return `<button class="back" data-action="home">‹ Volver al panel</button>
 <div class="story-kicker"><span>PRESENTACIÓN DE HENRIS GALLERY</span><span>2 MIN · 4 PASOS</span></div>
 <div class="story-progress" aria-label="Progreso de presentación">${presentationNames.map((label,i)=>`<button type="button" data-action="presentation-step" data-id="${i}" aria-label="Paso ${i+1}: ${label}" aria-pressed="${presentationStep===i}" class="${i<=presentationStep?'done':''} ${i===presentationStep?'current':''}"><span class="sr-only">${label}</span></button>`).join('')}</div>
 <section class="story-slide" aria-live="polite"><span class="story-step">0${presentationStep+1} / 04 · ${current.eyebrow}</span><h2>${current.title}</h2><p class="story-lead">${current.lead}</p>${current.visual}<p class="story-note">${current.note}</p></section>
 <div class="story-controls"><button class="inline-action" data-action="presentation-prev" ${presentationStep===0?'disabled':''}>‹ Anterior</button>${presentationStep<3?'<button class="primary" data-action="presentation-next">Continuar →</button>':'<button class="primary" data-action="home">Probar simulador →</button>'}</div>
 ${presentationStep===3?'<button class="story-secondary" data-action="mapping">Ver el mapeo paso a paso ↗</button>':''}
 <p class="story-disclaimer">Experiencia demostrativa · Sin conexión a AppSheet ni datos reales.</p>`;
}


function startTutorial(){
 if(tutorialActive)return;
 tutorialOriginal=orders;tutorialActive=true;tutorialStage=0;
 orders=[];active=null;view='home';error='';formState=null;
 history.replaceState(null,'',location.pathname+'?tutorial');
 render();document.querySelector('.shell main')?.scrollTo(0,0);window.scrollTo(0,0);
}
function stopTutorial(){
 if(!tutorialActive)return;
 orders=tutorialOriginal;tutorialOriginal=null;tutorialActive=false;tutorialStage=0;
 active=null;view='home';error='';formState=null;
 history.replaceState(null,'',location.pathname);
 render();document.querySelector('.shell main')?.scrollTo(0,0);window.scrollTo(0,0);
}
const tutorialCopy=[
 ['PASO 1 DE 4 · PEDIDOS','Creá tu primer pedido','Tocá «+ Nuevo pedido». Esta práctica se hace en memoria: al salir, tus pedidos originales quedan como estaban.'],
 ['PASO 1 DE 4 · PEDIDOS','Completá los datos del cliente','Usamos «Cliente de práctica» y un origen de contacto. Tocá «Crear y agregar obras» para continuar.'],
 ['PASO 2 DE 4 · OBRAS','Asociá una obra al pedido','Preparé una obra de ejemplo de $10.000. Probá cambiar nombre, cantidad o precio y tocá «Guardar obra».'],
 ['PASO 3 DE 4 · PAGOS','Consultá el total antes de cobrar','Ya podés ver el total calculado a partir de la obra. Tocá «+ Registrar» para simular un pago parcial.'],
 ['PASO 3 DE 4 · PAGOS','Registrá un pago parcial','El pago de prueba es de $3.000. Mirá la vista previa del saldo y tocá «Confirmar pago demo».'],
 ['PASO 4 DE 4 · RESUMEN','¡Así se calcula el saldo!','El detalle muestra el total de obras, lo pagado y el saldo pendiente. Terminá la guía para recuperar los pedidos originales.']
];
function tutorialDecorate(){
 if(!tutorialActive)return;
 const [label,heading,help]=tutorialCopy[tutorialStage];
 let target=null,placement='beforebegin';
 if(tutorialStage===0){main.querySelector('button.tutorial-entry')?.remove();target=main.querySelector('button[data-action="new"]');placement='afterend';}
 if(tutorialStage===1){target=main.querySelector('#order-form');}
 if(tutorialStage===2){target=main.querySelector('#item-form');}
 if(tutorialStage===3){target=main.querySelector('button[data-action="add-payment"]');}
 if(tutorialStage===4){target=main.querySelector('#payment-form');}
 if(tutorialStage===5){target=main.querySelector('.money-row.balance');}
 if(!target)return;
 const callout=`<aside class="tutorial-callout" role="status" aria-label="Tutorial interactivo" data-tutorial-stage="${tutorialStage}"><div class="tutorial-top"><span>${label}</span><button data-action="tutorial-exit" class="tutorial-close" aria-label="Salir del tutorial">✕ Salir</button></div><h3>${heading}</h3><p>${help}</p>${tutorialStage===5?'<button class="primary tutorial-done" data-action="tutorial-exit">Terminar y recuperar mis datos →</button>':''}</aside>`;
 if(tutorialStage===5){target.classList.add('tutorial-focus');target.closest('.surface').insertAdjacentHTML('afterend',callout);}
 else{target.classList.add('tutorial-focus');target.insertAdjacentHTML(placement,callout);}
 if(tutorialStage===1){const input=main.querySelector('#order-form input[name="customer"]');if(input)input.value='Cliente de práctica';}
 if(tutorialStage===2){
  const form=main.querySelector('#item-form');
  form.querySelector('input[name="title"]').value='Fotografía de práctica';
  form.querySelector('input[name="quantity"]').value='1';
  form.querySelector('input[name="price"]').value='10000';
 }
 if(tutorialStage===4){
  const input=main.querySelector('#payment-form input[name="amount"]');
  input.value='3000';input.dispatchEvent(new Event('input',{bubbles:true}));
 }
}

function render(){const headings={home:['Panel de gestión','Operación comercial centralizada'],orders:['Pedidos','Gestión de pedidos'],detail:['Detalle del pedido','Obras, pagos y saldo'],new:['Nuevo pedido','Datos ficticios'],item:['Agregar obra','Obras vinculadas al pedido'],payment:['Registrar pago','Control de cobros'],works:['Obras','Obras de la galería'],payments:['Pagos','Historial de cobros'],mapping:['Cómo funciona','Del origen al panel'],presentation:['Henris Gallery','Una nueva forma de organizar los pedidos']};const [h,s]=headings[view]||headings.home;title.textContent=h;subtitle.textContent=s;main.innerHTML=({home,orders:ordersPage,detail,new:newOrder,item:addItem,payment:addPayment,works,payments,mapping:guide,presentation})[view]();tutorialDecorate();const nav=['mapping','presentation'].includes(view)?'home':['detail','new','item','payment'].includes(view)?'orders':view;document.querySelectorAll('[data-nav]').forEach(b=>{b.classList.toggle('active',b.dataset.nav===nav);if(b.dataset.nav===nav)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
function action(name,id){
 if(name==='tutorial'){startTutorial();return;}
 if(name==='tutorial-exit'){stopTutorial();notice('Práctica finalizada. Tus datos están intactos.');return;}
 if(tutorialActive){
  if(name==='home'){stopTutorial();return;}
  if(!((tutorialStage===0&&name==='new')||(tutorialStage===3&&name==='add-payment'))){
   notice('Seguí el paso indicado o usá «Salir» para terminar la práctica.');return;
  }
 }
 error='';switch(name){case'home':view='home';break;case'presentation':view='presentation';presentationStep=0;break;case'presentation-step':if(!['0','1','2','3'].includes(String(id)))return;presentationStep=Number(id);view='presentation';break;case'presentation-next':presentationStep=Math.min(3,presentationStep+1);view='presentation';break;case'presentation-prev':presentationStep=Math.max(0,presentationStep-1);view='presentation';break;case'mapping':view='mapping';guideStep=0;break;case'guide-step':if(!['0','1','2','3'].includes(String(id)))return;guideStep=Number(id);view='mapping';break;case'guide-next':guideStep=Math.min(3,guideStep+1);view='mapping';break;case'guide-prev':guideStep=Math.max(0,guideStep-1);view='mapping';break;case'orders':view='orders';break;case'detail':if(id)active=id;view=current()?'detail':'home';break;case'works':view='works';break;case'payments':view='payments';break;case'new':view='new';if(tutorialActive)tutorialStage=1;break;case'add-item':view='item';break;case'add-payment':{const o=current();if(!o||totals(o).balance<=0){notice('El pedido no tiene saldo pendiente.');return;}view='payment';formState={token:makeId(),committed:false};if(tutorialActive)tutorialStage=4;break;}case'undo':{const o=current();if(!o||!o.payments.length)return;update(undo(o));notice('Último pago deshecho.');view='detail';break;}case'reset':if(confirm('¿Reiniciar todos los datos ficticios de este simulador?')){save(defaults());active=null;view='home';notice('Simulador reiniciado.');}break;default:return;}if(view==='presentation'&&!location.search.includes('presentacion'))history.replaceState(null,'',location.pathname+'?presentacion');else if(view!=='presentation'&&location.search.includes('presentacion'))history.replaceState(null,'',location.pathname);render();document.querySelector('.shell main')?.scrollTo({top:0,behavior:'instant'});window.scrollTo({top:0,behavior:'instant'});}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b)action(b.dataset.action,b.dataset.id);});
document.addEventListener('submit',e=>{const f=e.target;if(!['order-form','item-form','payment-form'].includes(f.id))return;e.preventDefault();const fd=new FormData(f);try{if(f.id==='order-form'){
 const customer=String(fd.get('customer')||'').trim();if(!customer||customer.length>120)throw Error('Ingresá un nombre válido.');const order={id:String(Date.now()).slice(-8),customer,channel:String(fd.get('channel')),currency:String(fd.get('currency')),operation:String(fd.get('operation')),items:[],payments:[]};validate(order);save([order,...orders]);active=order.id;view='item';if(tutorialActive)tutorialStage=2;notice('Pedido creado. Agregá una obra.');
}else if(f.id==='item-form'){
 const o=current(),quantity=Number(fd.get('quantity')),unique=fd.get('unique')==='yes',price=cents(fd.get('price'));const i={id:makeId(),pedidoId:o.id,title:String(fd.get('title')||'').trim(),quantity,unique,price};const next={...o,items:[...o.items,i]};validate(next);update(next);view='detail';if(tutorialActive)tutorialStage=3;notice('Obra agregada.');
}else if(f.id==='payment-form'){
 if(!formState||formState.committed)return;const o=current(),next=payment(o,fd.get('amount'),String(fd.get('method')),formState.token);validate(next);update(next);formState.committed=true;view='detail';if(tutorialActive)tutorialStage=5;notice('Pago demo registrado.');
}error='';render();window.scrollTo({top:0,behavior:'instant'});}catch(ex){error=ex.message;const alert=f.querySelector('.form-error');if(alert)alert.textContent=error;}});
document.addEventListener('input',e=>{if(!e.target.closest('#payment-form'))return;const f=e.target.closest('#payment-form'),o=current(),p=f.querySelector('#payment-preview');try{const next=payment(o,new FormData(f).get('amount'),new FormData(f).get('method'),formState.token),t=totals(next);p.innerHTML=`Vista previa · Sin registrar<strong>Pagado: ${money(t.paid,o.currency)} · Saldo: ${money(t.balance,o.currency)}</strong>`;}catch{p.textContent='Ingresá un importe positivo, hasta '+money(totals(o).balance,o.currency)+'.';}});
if(new URLSearchParams(location.search).has('tutorial'))startTutorial();else render();
