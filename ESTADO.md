# Henris Gallery — estado
Actualizado: 2026-10-30 (verificado con git, gh, curl y Chromium)

## Publicado
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `6a59adf` (= origin/main), árbol limpio.
- Contenido online = `472ec03`; `6a59adf` (tabla del guion sin desborde en móvil) todavía sin deployar: 3 runs en cola desde 17:36, ninguno en progreso.
- `/staging/henris-ad-20261031/` — 200. `henris-presentacion.mp4` (21 s, 1080×1920, 2,19 MB) con SHA-256 idéntico al local, `henris-demo-real.mp4` (15 s, app real) y `henris-demo.mp4` (13 s, maqueta).
- `/staging/demo-20261031/` — 200, guion de 4 min + los tres videos; online todavía con el desborde que corrige `6a59adf`.
- `/staging/onboarding-20261031/` — 200, práctica en 7 partes, un H1, consola limpia; `/staging/guia-operativa-candidata/` y `/staging/guia-visual-prueba-20261029/` — 200.
- App `7f05d824` (`HENRIS-982559713`, def. `1.000409`, Prototype), usuarios `facu.capello@hotmail.com` y `maticgpt@gmail.com`.

## Abierto
- Reintentar el deploy de `6a59adf` y verificar el SHA de la página del guion.
- Borrar los datos de prueba: cliente «Casa Vidal», 1 pedido, 1 ítem, 1 pago (hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39; antes 15/23/37/38).
- El «+» de Pedidos solo aparece entrando por el menú ☰; el botón de abajo abre una vista sin alta. Requiere permiso de Facundo.
- Marine sin usuario (el correo lo maneja Facundo). Sin verificar: Safari/iPhone real, VoiceOver y `prefers-reduced-motion` del sistema.
- `Comentarios` del pedido no se guardó (revisar a mano); capturas de la guía sin tomar; archivar la copia `3300a579`.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` (STAGINGE2E, 0 usuarios) tiene el alta de pedido rota.
- Datos en dos archivos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- Pages cachea y la cola de Actions se traba: verificar el contenido por SHA, no por «deploy success».
- AppSheet no acepta clics simulados (Guardar y fechas no responden a `dispatchEvent`): la app real se opera a mano.
- La lista de Pedidos y el panel lateral muestran clientes reales: recortar todo video de la app.
- Los totales tardan segundos en recalcular; no es error. El globo del tour necesita `requestAnimationFrame`: enfocar la pestaña. `noindex` no es control de acceso.
