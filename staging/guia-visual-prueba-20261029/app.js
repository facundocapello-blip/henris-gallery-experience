'use strict';
const steps = [
  {title:'Crear un pedido', description:'En Henris APP, iniciá un pedido y completá los datos que la aplicación te solicite.', result:'El pedido queda registrado para agregar sus trabajos.', note:'La pantalla de alta no está verificada para esta guía. Si no encontrás cómo crear el pedido, consultá al administrador.', shots:[]},
  {title:'Agregar una obra', description:'Dentro del pedido, agregá el trabajo y completá los datos disponibles, como tipo y medidas.', result:'La obra queda asociada al pedido.', note:'Las pantallas son referencias de momentos distintos; pueden verse diferentes en tu cuenta.', shots:[['assets/tipo-trabajo.webp','Selector de tipo de trabajo en AppSheet'],['assets/medidas.webp','Campos de ancho, alto y unidad en AppSheet']]},
  {title:'Registrar un pago', description:'En el pedido, agregá el pago y revisá importe, medio y estado antes de guardar.', result:'El pago queda asociado al pedido. Sincronizá si la aplicación lo solicita.', note:'No marques como recibido un pago que todavía no cobraste.', shots:[['assets/pago.webp','Formulario de pago de referencia en AppSheet']]},
  {title:'Consultar el saldo', description:'Volvé al pedido y revisá el total, lo pagado y el saldo pendiente.', result:'Podés ver cuánto falta cobrar después de sincronizar.', note:'Los importes de las capturas son de referencia y pueden pertenecer a pedidos distintos.', shots:[['assets/saldo.webp','Total, pagado y saldo en una pantalla de referencia de AppSheet']]}
];
const $ = id => document.getElementById(id);
let current = 0;
let lastOpener = null;
function showStep(index) {
  current = Math.max(0, Math.min(steps.length - 1, index));
  const step = steps[current];
  $('step-count').textContent = `PASO 0${current + 1} / 04`;
  $('step-title').textContent = step.title;
  $('step-description').textContent = step.description;
  $('step-result').textContent = step.result;
  $('step-note').textContent = step.note;
  $('progress').textContent = `${current + 1} / 4`;
  $('prev').disabled = current === 0;
  $('next').textContent = current === 3 ? 'Volver al inicio ↺' : 'Siguiente →';
  document.querySelectorAll('[data-step]').forEach((button, i) => { if (i === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); });
  $('no-shot').hidden = step.shots.length > 0;
  $('shots').hidden = step.shots.length === 0;
  $('shots').replaceChildren();
  step.shots.forEach(([src, alt]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'shot'; button.setAttribute('aria-label', `Ampliar captura: ${alt}`);
    const image = document.createElement('img'); image.src = src; image.alt = alt;
    const label = document.createElement('span'); label.className = 'shot-label'; label.setAttribute('aria-hidden', 'true');
    label.textContent = src.includes('tipo-trabajo') ? 'Tipo de trabajo' : src.includes('medidas') ? 'Medidas' : src.includes('pago') ? 'Datos del pago' : 'Saldo pendiente';
    button.append(image, label); button.addEventListener('click', () => openImage(button, src, alt)); $('shots').append(button);
  });
  $('visual-caption').textContent = step.shots.length ? 'Capturas de referencia · tocá para ampliar. Pueden ser de distintos pedidos.' : 'Guía de referencia · la operación real ocurre en AppSheet.';
  const panel = $('tutorial'); panel.classList.remove('animate-step'); void panel.offsetWidth; panel.classList.add('animate-step');
}
function openImage(button, src, alt) {
  lastOpener = button; $('dialog-image').src = src; $('dialog-image').alt = alt; $('dialog-title').textContent = alt;
  $('image-dialog').showModal(); $('close-dialog').focus();
}
$('image-dialog').addEventListener('close', () => { if (lastOpener) lastOpener.focus(); });
$('close-dialog').addEventListener('click', () => $('image-dialog').close());
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => showStep(Number(button.dataset.step))));
$('prev').addEventListener('click', () => showStep(current - 1));
$('next').addEventListener('click', () => showStep(current === 3 ? 0 : current + 1));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reduce.matches;
function renderMotion() { document.documentElement.classList.toggle('motion-off', motionPaused); $('motion-toggle').setAttribute('aria-pressed', String(motionPaused)); $('motion-toggle').textContent = motionPaused ? 'Activar animaciones' : 'Detener animaciones'; }
$('motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; renderMotion(); });
if (reduce.addEventListener) reduce.addEventListener('change', event => { if (event.matches) { motionPaused = true; renderMotion(); } });
renderMotion();
