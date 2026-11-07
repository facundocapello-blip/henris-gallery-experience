# Estado de Henris Gallery Experience

## Propuesta Gemini revisada · 2026-11-06

- ZIP recibido, revisado y conservado; versión corregida aislada en `preview/henris-propuesta-gemini-20261106/index.html`, sin modificar la guía publicada ni AppSheet.
- Cambios: acceso a app `7f05d824` habilitado, capturas más grandes, nota duplicada quitada y desborde a 320 px corregido. Las cuatro imágenes embebidas coinciden con las capturas anonimizadas existentes.
- Verificado en Chromium mediante clics programáticos: acceso dirige a la URL correcta sin abrirla durante la prueba, ampliación abre/cierra, 320/390/768/1280 px simulados sin desborde; consola sin errores. JS sintácticamente válido y `npm test` 4/4. Playwright no instalado; sin Safari/iPhone real ni VoiceOver.
- Solo local, sin commit ni publicación. Se agregó `tests/propuesta-gemini.spec.js`, que no pudo ejecutarse por falta de Playwright. Referencia de diseño: `awesome-design-md/references/design-md/apple/DESIGN.md`, adaptando jerarquía y espacio, sin copiar marca.

## Capturas completas en la guía · 2026-11-06

- Publicada con commit `5be2d2e`: cuatro pantallas completas con íconos reales, títulos y botones editados al español. Se ocultan datos personales y detalles del pedido; saldo y cliente son ficticios. Las imágenes se identifican como editadas.
- Verificado en vivo: HTML, JS, CSS y cuatro imágenes 200 e idénticos al repo, cuatro pasos y ampliación con clics programáticos, consola sin errores; workflow `42276941215` success. Rollback al commit `b01bf87`.
- La captura del primer paso se revisó en Edge headless; en iframe de 386 px no hubo desborde y la ampliación abrió mediante clic programático. Las cuatro imágenes tienen proporción 738 × 1600 y carecen de EXIF. No se probó Safari real.
- `npm test`: 4 pruebas aprobadas; Playwright no está instalado y la prueba e2e no se pudo ejecutar. El detector de diseño informó siete advertencias preexistentes; no se modificaron las secciones fuera de alcance.

## Presentación con capturas de celular · 2026-11-05

- Publicada en https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/ con commit `b01bf87`. HTML, JS, CSS y cuatro imágenes responden 200 y coinciden con el local (SHA-256, texto con saltos normalizados). En navegador, cuatro pasos y ampliación responden a clics programáticos; consola sin errores. Workflow `42124328212` seguía en curso al verificar.

- AppSheet `7f05d824`: nombres visibles de formularios configurados como «Nuevo pedido», «Agregar obra», «Registrar pago» y «Nuevo cliente», guardados en versión `1.000413` (anterior `1.000412`). Tras recargar, «Nuevo pedido» se observó en la app y «Nuevo cliente» en el editor; los otros dos no se probaron en la app.
- Guía visual local: cuatro capturas recibidas, recortadas para quitar nombres y datos personales, dentro de un marco de celular. En la imagen de saldo los importes fueron reemplazados por cifras ficticias y la guía lo indica; en pago se ocultó una selección.
- Verificación local: cuatro pasos cambian de imagen, recursos responden 200, consola sin errores en la página, iframe de 386 px sin desborde y ampliación abierta por JavaScript; `npm test` aprobó 4 pruebas. Playwright no está instalado; no se ejecutó la prueba e2e y no se verificaron capturas de pantalla del resultado ni Safari real.
- Antes del push la guía era solo local. No se cambiaron datos ni cálculos de AppSheet; descripción de cotización y campos obligatorios siguen pendientes.

## AppSheet: textos del sistema · 2026-11-05

- En la app `7f05d824`, versión anterior `1.000411`, se tradujeron diez textos de sistema: Guardar, Cancelar, Ver, Agregar, Listo, Buscar, Nuevo, Editar, Eliminar y Sincronizar. Guardado como `1.000412`; los diez valores persistieron tras recargar el editor.
- En la app, tras recargar, se observaron «Sincronizar» y «Agregar»; al abrir un formulario en blanco se observaron «Guardar» y «Cancelar». No se guardaron pedidos ni pagos.
- Las capturas recibidas muestran títulos de formularios en inglés y etiquetas confusas; siguen pendientes. `Cotizacion_USD` tiene condiciones de mostrar y requerir cuando la moneda del pago difiere de la del pedido; no se cambiaron esas condiciones ni su descripción.
- Las capturas incluyen datos personales y de clientes: no agregarlas al repositorio ni publicarlas sin anonimizar.

## Guía visual: capturas más grandes · 2026-11-05

- Cambio local en `staging/guia-visual-prueba-20261029/`: la captura única ocupa el ancho disponible y el texto inferior puede ajustarse; se conservan las capturas y su ampliación.
- En Chromium local: captura de 394 px en ventana de 1000 px; en un iframe de 386 px, captura de 297 px, sin desbordamiento horizontal, ampliación y paso siguiente activados por JavaScript. No se probó Safari real ni interacción física.
- `npm test`: 4 pruebas aprobadas. La nueva prueba `tests/guia-visual.spec.js` no se pudo ejecutar: Playwright no está instalado. No se publicó el cambio.

## Links de las guías repuntados a la app real · 2026-10-30

- Revisión de la app en AppSheet (solo lectura) y hallazgo: hay dos apps «Henris Gallery». La que linkeaban todas las guías, `3300a579` (`HenrisGallery·STAGINGE2E`), tiene 0 usuarios y no deja cargar pedidos. La que se usa es `7f05d824` (`HENRIS`, definición `1.000409`), con `maticgpt@gmail.com` y `facu.capello@hotmail.com` adentro.
- Cambiado `appsheet.com/start/3300a579…` → `.../start/7f05d824…` en `staging/onboarding-20261031/index.html`, `staging/guia-operativa-candidata/index.html` (12 ocurrencias, incluido el `data-src` del iframe), `staging/guia-visual-prueba-20261029/index.html` y `staging/henris-gemini-fusion-20261020/index.html`.
- La demo de Gemini se publica desde el snapshot congelado `dddcb2c`, así que además se agregó un `sed` en `pages.yml` que repunta el link al copiar, para no tocar el snapshot.
- Diagnóstico completo y evidencia en `docs/QA-APP-20261030.md`; checklist de alta actualizado en `docs/ALTA-MATI-MARINE-20261030.md` (falta solo el correo de Marine).
- No se modificó ninguna app, hoja ni usuario en AppSheet.
- Publicado y verificado en vivo (commit `b2d174c`, run `41006204196` success): las cuatro rutas responden HTTP 200 y ya no queda ninguna referencia a `3300a579` — onboarding 1, candidata 12, guía visual 2, demo de Gemini 3 referencias a `7f05d824`. En local, las cuatro cargan con un solo H1 y consola limpia. El link de la app abre el login de AppSheet, como corresponde.

## Onboarding guiado publicado en ruta propia · 2026-10-30

- Nueva carpeta `staging/onboarding-20261031/` con `index.html`, `tour.css`, `tour.js` y `chuleta.html`. Vanilla, sin dependencias ni build. No toca la candidata editorial ni la presentación publicadas.
- Contenido: hero con una sola salida, comparación Excel→app, réplica de la app (Pedidos, Obras, Pagos, Clientes) con datos ficticios en memoria, recorrido de 26 pasos en 7 módulos, ecuación Total − Pagado = Saldo y chuleta imprimible de cuatro pasos.
- La app real no se toca: el recorrido corre sobre la réplica, sin red y sin escrituras. Esta página no carga el iframe de AppSheet.
- Verificado localmente en Chromium (ventana de 1000 px y marcos de 320, 650 y 1440 px): los 26 pasos con clics reales —alta de pedido, obra y pago—, totales y saldo correctos (2.050 − 800 = 1.250), foco en el campo de práctica, sin desborde horizontal y consola sin errores. Lighthouse 100 accesibilidad, 100 buenas prácticas y 100 SEO en `index.html` y en `chuleta.html`.
- Sin verificar: `prefers-reduced-motion` con emulación real del sistema (reglas CSS y ramas JS revisadas, no probadas), Safari físico y VoiceOver. La ventana de este entorno no compone frames: el scroll y las animaciones se probaron con `requestAnimationFrame` sustituido y no se pudieron tomar capturas.
- Publicado en ruta propia: https://facundocapello-blip.github.io/henris-gallery-experience/staging/onboarding-20261031/ — commit `75a464f`, run `41001296148` success. Verificado en vivo: los cuatro archivos responden HTTP 200 e idénticos al local (SHA256 `dcd850de…`, `b185b135…`, `f8084646…`, `ba430305…`), consola sin errores, un H1, `scrollWidth` 305 a 320 px de ventana, recorrido que arranca, avanza y cierra, `noindex`. Lighthouse en vivo: 100 accesibilidad, 100 buenas prácticas, 100 SEO.

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
