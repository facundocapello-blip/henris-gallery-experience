# Henris Gallery — estado
Actualizado: 2026-10-30 (verificado con git, gh y Chromium)
## Publicado
- Web: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-gemini-fusion-20261020/ — HTTP 200, consola sin errores. Contenido fijo al HTML `dddcb2c`.
- Guía visual: https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/ — HTTP 200, consola limpia, HTML idéntico al local. Fuente `d865bab`.
- Candidata editorial: https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-operativa-candidata/ — HTTP 200, consola limpia, HTML idéntico al local (SHA256 `dab59f5e…`), un H1, sin desborde a 985 px, iframe de AppSheet sin cargar hasta pedirlo. Lighthouse 100 en accesibilidad, buenas prácticas y SEO. Fuente `fdece1d`, run `40997706004` success; `noindex`.
- Onboarding guiado: https://facundocapello-blip.github.io/henris-gallery-experience/staging/onboarding-20261031/ — HTTP 200 en `index.html`, `tour.css`, `tour.js` y `chuleta.html`, los cuatro idénticos al local (SHA256 `dcd850de…`, `b185b135…`, `f8084646…`, `ba430305…`). Consola limpia; un H1; sin desborde a 320 px (`scrollWidth` 305); recorrido arranca, avanza y cierra; Lighthouse 100 accesibilidad, 100 buenas prácticas, 100 SEO. Fuente `75a464f`, run `41001296148` success; `noindex`.
- AppSheet `7f05d824-ccdc-4dc7-ad55-8a43f7739d0b` (interno `HENRIS-982559713`), definición `1.000409`, Prototype; login Google obligatorio; 2 usuarios: `facu.capello@hotmail.com` y `maticgpt@gmail.com` (las dos ya entraron).
- Las guías publicadas apuntan a esa app desde 2026-10-30. Antes apuntaban a `3300a579…` (copia `STAGINGE2E`, 0 usuarios y alta de pedido rota). Detalle en `docs/QA-APP-20261030.md`.
## Abierto
- **Alta de Mati y Marine**: checklist listo en `docs/ALTA-MATI-MARINE-20261030.md`. Faltan los dos correos Google y definir si cargan o solo consultan. Sin correos no hay prueba de punta a punta.
- Sin commitear: nada del onboarding; `75a464f` es `origin/main`.
- Sin verificar todavía: `prefers-reduced-motion` con la preferencia real del sistema (reglas CSS y ramas JS revisadas, no emuladas), Safari físico, VoiceOver y el recorrido completo con teclado en dispositivo real. Las capturas no se pudieron tomar: la ventana del entorno no compone frames.
- Respaldo previo solo en `%TEMP%\opencode\henris-respaldo-20261029-…`; temporal, no permanente.
- Pedir los correos Google de Mati y Marine, agregarlos y probar acceso; después alta de pedido, 2 ítems, 2 pagos, sync y saldo con iPhone Safari físico.
- Antes de reemplazar la web publicada con la candidata: QA de acceso, Safari/VoiceOver y snapshot `dddcb2c` preservado. La candidata solo se probó en Chromium (985 y 616 px).
- Confirmar que las capturas de la guía corresponden al formulario de alta vigente.
## Trampas
- «Henris Gallery» no identifica entorno: hay dos apps con el mismo nombre. La buena es `7f05d824` (`HENRIS`), con usuarios. La otra, `3300a579` (`HenrisGallery·STAGINGE2E`), es copia de prueba: 0 usuarios y el alta de pedido abre una vista vacía.
- En la copia `3300a579` el botón «+ Nuevo pedido» navega a `Pedidos_Form`, que no abre; «Editar» lleva al formulario de la tabla de menú (`Inicio_Schema`, campos OPERACIÓN/ANÁLISIS/MARKETING/MIGRACIÓN). No se arregla con una URL: hay que recrear la vista.
- Los datos de la app buena están en dos archivos: Pedidos/Pagos/Clientes en `Henris Gallery - Base de Datos Marketing y Ventas` y Obras en `Henris Gallery - Base AppSheet`.
- El panel «Nuevo pedido» del dashboard era un detalle de `Inicio`, no el formulario; se quitó en `1.000041`.
- El `0 / 66` dejaba visible el detalle previo; la corrección está en `dddcb2c`, no en `1c2c2f7`.
- Pages sirve caché: push ≠ publicación; verificar run y URL con `?v=`.
- `noindex` no es control de acceso: la candidata es pública para quien tenga el link.
- Imágenes lazy en `data:` dan `naturalWidth 0` hasta hacer scroll: no son assets rotos.
