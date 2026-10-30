# Henris Gallery — estado
Actualizado: 2026-10-30 (verificado con git, gh y Chromium)
## Publicado
- Web: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-gemini-fusion-20261020/ — HTTP 200, consola sin errores. Contenido fijo al HTML `dddcb2c`.
- Guía visual: https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/ — HTTP 200, consola limpia, HTML idéntico al local. Fuente `d865bab`.
- Candidata editorial: https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-operativa-candidata/ — HTTP 200, consola limpia, HTML idéntico al local (SHA256 `dab59f5e…`), un H1, sin desborde a 985 px, iframe de AppSheet sin cargar hasta pedirlo. Lighthouse 100 en accesibilidad, buenas prácticas y SEO. Fuente `fdece1d`, run `40997706004` success; `noindex`.
- AppSheet `3300a579-5a49-4738-98f5-19979e4952e4`, definición `1.000044`, Prototype; login Google obligatorio; 0 compartidos además del propietario.
## Abierto
- Sin commitear: `ESTADO.md` y `PROJECT_STATUS.md` (esta actualización) y la copia `staging/guia-operativa-candidata/index - copia.html`, idéntica a la publicada.
- Sin pushear: nada; `fdece1d` es `origin/main`. La rama local `main` quedó atrás (solo desactualizada).
- Respaldo previo solo en `%TEMP%\opencode\henris-respaldo-20261029-…`; temporal, no permanente.
- Pedir los correos Google de Mati y Marine, agregarlos y probar acceso; después alta de pedido, 2 ítems, 2 pagos, sync y saldo con iPhone Safari físico.
- Antes de reemplazar la web publicada con la candidata: QA de acceso, Safari/VoiceOver y snapshot `dddcb2c` preservado. La candidata solo se probó en Chromium (985 y 616 px).
- Confirmar que las capturas de la guía corresponden al formulario de alta vigente.
## Trampas
- «Henris Gallery» no identifica entorno: interno `HenrisGallery·STAGINGE2E-982559713`; la Sheet activa es `1LPJASJE…`.
- El panel «Nuevo pedido» del dashboard era un detalle de `Inicio`, no el formulario; se quitó en `1.000041`.
- El `0 / 66` dejaba visible el detalle previo; la corrección está en `dddcb2c`, no en `1c2c2f7`.
- Pages sirve caché: push ≠ publicación; verificar run y URL con `?v=`.
- `noindex` no es control de acceso: la candidata es pública para quien tenga el link.
- Imágenes lazy en `data:` dan `naturalWidth 0` hasta hacer scroll: no son assets rotos.
