# Estado de Henris Gallery Experience

## Onboarding guiado en ruta nueva (sin publicar) · 2026-10-30

- Nueva carpeta `staging/onboarding-20261031/` con `index.html`, `tour.css`, `tour.js` y `chuleta.html`. Vanilla, sin dependencias ni build. No toca la candidata editorial ni la presentación publicadas.
- Contenido: hero con una sola salida, comparación Excel→app, réplica de la app (Pedidos, Obras, Pagos, Clientes) con datos ficticios en memoria, recorrido de 26 pasos en 7 módulos, ecuación Total − Pagado = Saldo y chuleta imprimible de cuatro pasos.
- La app real no se toca: el recorrido corre sobre la réplica, sin red y sin escrituras. Esta página no carga el iframe de AppSheet.
- Verificado localmente en Chromium (ventana de 1000 px y marcos de 320, 650 y 1440 px): los 26 pasos con clics reales —alta de pedido, obra y pago—, totales y saldo correctos (2.050 − 800 = 1.250), foco en el campo de práctica, sin desborde horizontal y consola sin errores. Lighthouse 100 accesibilidad, 100 buenas prácticas y 100 SEO en `index.html` y en `chuleta.html`.
- Sin verificar: `prefers-reduced-motion` con emulación real del sistema (reglas CSS y ramas JS revisadas, no probadas), Safari físico y VoiceOver. La ventana de este entorno no compone frames: el scroll y las animaciones se probaron con `requestAnimationFrame` sustituido y no se pudieron tomar capturas.
- Pendiente: commit y push. `.github/workflows/pages.yml` ya incluye el paso que copia los cuatro archivos a `_site/staging/onboarding-20261031/`.

## Candidata editorial publicada en ruta propia · 2026-10-30

- Nuevo paso en `.github/workflows/pages.yml`: copia solo `staging/guia-operativa-candidata/index.html` a `_site/staging/guia-operativa-candidata/`. No reemplaza la presentación ni la guía ya publicadas.
- Commit `fdece1d`, run `40997706004` success. Verificado en vivo: HTTP 200, HTML idéntico al local (SHA256 `dab59f5e…`), consola sin errores ni requests fallidos, un H1, `scrollWidth` igual al ancho de ventana a 985 px, iframe de AppSheet con `data-src` sin cargar hasta pulsar. Lighthouse: 100 accesibilidad, 100 buenas prácticas, 100 SEO.
- Pendiente real: Safari físico, VoiceOver y acceso de Mati/Marine. La candidata quedó pública con `noindex`, que no es control de acceso.

## Cierre y verificación · 2026-10-30

- Verificado: `origin/main` = `d865bab`, run `40952515313` success; nada sin pushear. HTTP 200 y consola sin errores en las dos URLs publicadas; HTML de la guía idéntico al local (SHA256 `fe596437…`).
- Sin commit: `ESTADO.md`, este archivo y `staging/guia-operativa-candidata/index.html`. `staging/guia-operativa-candidata/index - copia.html` es una copia idéntica no rastreada; no se borró ni se commiteó.
- Sin cambios en AppSheet ni en datos. Sigue pendiente: correos de Mati/Marine, iPhone Safari físico, VoiceOver y validar el formulario de alta vigente.

## Captura real de Nuevo pedido · 2026-10-29
- Incorporada a la guía visual una copia recortada de `Videos/Screenshot 2026-10-28 21-36-52.png`: solo formulario, sin listado de clientes ni chrome del navegador; original intacto. Referencia fechada 28/10/2026, no prueba del formulario vigente.
- Commit publicado `d865bab`, run `40952515313` success. HTML, JS y captura responden 200 e iguales al local; imagen cargada y consola sin errores en Chromium online. Cuatro pasos y ampliaciones probados localmente. Presentación anterior idéntica a `dddcb2c`; sin cambios en AppSheet.

## Guía visual de prueba · 2026-10-29

- Nueva carpeta aislada `staging/guia-visual-prueba-20261029/`, rama `prueba/henris-guia-visual-20261029`; la presentación y la candidata anterior no fueron sobrescritas. Se conservó sin tocar el archivo previo `index - copia.html`.
- Cuatro pasos con navegación, capturas de referencia recortadas, ampliación y ejemplo ficticio de saldo; alta de pedido sin captura ni campos supuestos. Controles de movimiento y preferencias de movimiento reducido implementados.
- Verificado localmente: sintaxis JS; pasos, avance, retroceso, reinicio, ampliación/cierre y pausa de movimiento en Chromium; ventana móvil aproximada de 426 px sin desborde; recursos HTTP 200, consola sin errores. Lighthouse accesibilidad 100; no se verificaron Safari físico ni VoiceOver.
- Publicada en ruta separada https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/ con commit `9e1236c`, run `40905768804` success. HTML y recursos HTTP 200; HTML igual al local; en Chromium online funcionan pasos, ampliación, retroceso y pausa sin errores de consola. Presentación anterior HTTP 200 e idéntica byte por byte a `dddcb2c`. No se modificaron AppSheet ni datos.

## Revisión visual de guía candidata · 2026-10-29

- `staging/guia-operativa-candidata/index.html`: portada editorial «Del pedido al saldo» con flujo tipográfico Pedido → Obras → Pagos → Saldo; adaptación de system font, jerarquía y superficies neutrales inspirada en `awesome-design-md/apple/DESIGN.md`. Mantiene el monocromo Henris, sin copiar logo ni agregar imágenes.
- Validado en Chromium a 616 px: un H1, sin overflow horizontal, búsqueda vacía muestra «Sin resultados», consola sin errores y sin solicitudes de fuentes externas. No es prueba de Safari/iPhone físico.
- Cambio local, fuera de Pages. No se hizo commit ni push; la guía candidata no se publicó. El acceso de Mati/Marine continúa pendiente.

## Ejecución AppSheet 2026-10-28

Se trabajó sobre el ID de AppSheet indicado por el usuario, sin crear copia, cambiar datos comerciales ni publicar. El registro de cambios, QA y bloqueos está en [docs/HENRIS-QA-20261028.md](docs/HENRIS-QA-20261028.md). Se corrigió localmente el estado vacío del diccionario de 66 campos en la web y se preparó su workflow; **no hubo push ni republicación**. **Pendiente prioritario:** autenticación y prueba con Mati/Marine e iPhone físico.

Actualizado: 2026-10-15. Registro inicial, no auditoría funcional completa.

## Fuentes verificadas
- Repositorio: https://github.com/facundocapello-blip/henris-gallery-experience (main)
- README.md identifica Experience v1.0, web interactiva con datos ficticios y sin integración con AppSheet.
- CODEX_TASK.md y docs/ existen en el repositorio.
- URL de trabajo informada previamente por el usuario: https://facundocapello-blip.github.io/henris-gallery-experience/muestra-mapeo/ (no verificada en esta auditoría).

## Decisiones y límites
- Mantener la separación demo web / AppSheet STAGING / producción.
- Prioridad visual solicitada: propuesta híbrida minimalista, planilla estilizada como interfaz y flechas/animaciones profesionales.
- Conservar mapeo y recorrido pedidos, ítems, pagos y saldos.

## Pendiente
- Verificar el estado de la URL pública y la revisión exacta desplegada.
- Inspeccionar implementación de la propuesta híbrida y validar móvil antes de nuevos cambios.

## Iteración V3 · Mapeo híbrido (2026-10-15)
- Propuesta implementada en `preview/muestra-mapeo-v3/index.html`, destino público previsto `/muestra-mapeo-v3/`.
- No toca producción, STAGING, Google Sheets, ni demo principal; las rutas anteriores permanecen disponibles.
- Incorporado chequeo de navegador automatizado post-deploy. Los resultados reales dependen del run de Actions; Safari iPhone físico pendiente.
