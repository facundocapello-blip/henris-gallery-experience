# Henris Gallery — estado
Actualizado: 2026-10-29

## Publicado
- Web: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-gemini-fusion-20261020/ — HTTP 200; búsqueda sin resultados muestra «Sin resultados» y `0 / 66`; consola sin errores en Chromium.
- Rama `main` sincronizada con `origin/main`; último commit que disparó el deploy: `f8ecf3f`. Pages run `40799670835` terminó en **success**. La versión visible sigue fijada al HTML `dddcb2c` (contenido en vivo idéntico); la guía de Claude quedó en el repo, no publicada.
- AppSheet: ID `3300a579-5a49-4738-98f5-19979e4952e4`, definición `1.000044`, aún Prototype; Google sign-in obligatorio y «Allow all signed-in users» apagado. El propietario entró tras el cambio; no se probaron cuentas de terceros.

## Abierto
- La revisión de Claude quedó como candidata versionada en `staging/guia-operativa-candidata/index.html`, fuera del workflow de Pages: corregidos enlace de Pasos y texto de acceso sin marcadores. Probada en Chromium (buscador, navegación, iframe opcional), no en iPhone; no publicar todavía.
- Pedir los correos Google exactos de Mati y Marine, agregarlos como usuarios y probar que ambos pueden entrar; la lista de compartidos figura en 0 usuarios (más el propietario).
- Probar con esos usuarios y iPhone Safari físico el alta de pedido, dos ítems, dos pagos, sync, saldo y reintento; no crear pruebas en datos reales sin entorno seguro.
- Antes de reemplazar la web actual con la candidata, confirmar cuentas, hacer QA de acceso y Safari físico, y preservar el snapshot publicado `dddcb2c`.

## Trampas
- Nombre visible «Henris Gallery» no identifica entorno: nombre interno `HenrisGallery·STAGINGE2E-982559713`; la Sheet activa es `1LPJASJE...`, no la histórica del encargo.
- El panel «Nuevo pedido» del dashboard era un detalle de `Inicio`, no el formulario: producía compresión; se quitó en `1.000041`.
- `0 / 66` dejaba el detalle previo visible; la versión remota corregida vive en el commit fuente `dddcb2c`, no en el commit local `1c2c2f7`.
- GitHub Pages puede servir caché vieja; usar query `?v=...` y verificar el deploy, no equiparar push con publicación.
- La guía adjunta decía «privada» antes de exigir login; la candidata local fue corregida, su iframe se abre solo bajo pedido y no prueba Safari físico ni acceso de Mati/Marine.
- `noindex` en la candidata no sustituye control de acceso; el aviso «Pendiente (administrador)» se conserva hasta probar ambas cuentas.
