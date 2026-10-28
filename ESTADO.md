# Henris Gallery — estado
Actualizado: 2026-10-28

## Publicado
- Web: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-gemini-fusion-20261020/ — HTTP 200; búsqueda sin resultados muestra «Sin resultados» y `0 / 66`; consola sin errores en Chromium.
- Rama remota `main`: último commit `357aa2d` (workflow apunta al HTML `dddcb2c`). Pages run `40786264019` terminó en **success**; URL comprobada en Chromium con caché evitada.
- AppSheet: ID `3300a579-5a49-4738-98f5-19979e4952e4`, definición `1.000043`, aún Prototype; no se desplegó ni se probaron cuentas de terceros.

## Abierto
- La guía adjunta quedó como candidata local en `staging/guia-operativa-candidata/index.html`, fuera del workflow de Pages: hay que decidir si reemplazar la web publicada, luego probar antes de autorizar su publicación.
- Resolver acceso autenticado y permisos de Mati/Marine: el chequeo de AppSheet advierte cambios sin inicio de sesión.
- Probar con esos usuarios y iPhone Safari físico el alta de pedido, dos ítems, dos pagos, sync, saldo y reintento; no crear pruebas en datos reales sin entorno seguro.
- Conciliar la rama local `main` con `origin/main` (`357aa2d`): ramas divergentes; no hacer push ciego ni perder el registro QA local.

## Trampas
- Nombre visible «Henris Gallery» no identifica entorno: nombre interno `HenrisGallery·STAGINGE2E-982559713`; la Sheet activa es `1LPJASJE...`, no la histórica del encargo.
- El panel «Nuevo pedido» del dashboard era un detalle de `Inicio`, no el formulario: producía compresión; se quitó en `1.000041`.
- `0 / 66` dejaba el detalle previo visible; la versión remota corregida vive en el commit fuente `dddcb2c`, no en el commit local `1c2c2f7`.
- GitHub Pages puede servir caché vieja; usar query `?v=...` y verificar el deploy, no equiparar push con publicación.
- La guía adjunta decía «privada» y «requiere inicio de sesión» pese a la advertencia de AppSheet; su iframe ahora se abre solo bajo pedido y no prueba Safari físico ni permisos.
