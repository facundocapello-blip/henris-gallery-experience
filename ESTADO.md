# Henris Gallery — estado
Actualizado: 2026-10-31 05:35 (verificado con git, gh, curl, DOM renderizado y captura del sitio en vivo)

## Publicado
- **Página: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/** — 200. Presentación minimalista en negro: frase grande a la izquierda y el celular a la derecha con el video real de 15 s (`<video>` muted, loop, autoplay, sin controles) reproduciéndose adentro; un toque pausa; un solo CTA «Abrir la app». Verificado: `index.html` online SHA-256 idéntico al local (5.415 bytes), run `41182698112` success, DOM renderizado contiene el `<video>` y el `source` al mp4. Visto a 1280 y a 390 px; en móvil la página scrollea porque el `scale` del stage se apaga bajo 760 px. Publicada con nombres reales visibles («Casa Vidal», «Douge»): Facundo lo aprobó el 31/10.
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `ba77d16` (= origin/main), árbol limpio.
- Contenido online = `ba77d16` (incluye `dde4624`: tabla del guion sin desborde en móvil). Verificado por contenido, no por «deploy success»: `staging/demo-20261031/index.html` online SHA-256 `5E821AE0…89AAE` idéntico al local. Los tres `.mp4` (2.292.250 / 380.911 / 184.500 bytes) responden 200 en `/staging/henris-ad-20261031/`, que es donde apuntan los links del guion.
- `/staging/henris-ad-20261031/` — 200. `henris-presentacion.mp4` (21 s, 1080×1920, 2,19 MB) con SHA-256 idéntico al local, `henris-demo-real.mp4` (15 s, app real) y `henris-demo.mp4` (13 s, maqueta).
- `/staging/demo-20261031/` — 200, guion de 4 min con la tabla y los comandos ya sin desborde (`6a59adf`), más los tres videos.
- `/staging/onboarding-20261031/` — 200, práctica en 7 partes, un H1, consola limpia; `/staging/guia-operativa-candidata/` y `/staging/guia-visual-prueba-20261029/` — 200.
- App `7f05d824` (`HENRIS-982559713`, def. `1.000410`, Prototype), usuarios `facu.capello@hotmail.com` y `maticgpt@gmail.com`. El link de arranque responde `302` al login de Google con `appName=Henris Gallery` (31/10), así que la app sigue publicada; no se abrió la app en esta sesión, no hay captura nueva.

## Abierto
- Borrar los datos de prueba: cliente «Casa Vidal», 1 pedido, 1 ítem, 1 pago (hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39; antes 15/23/37/38). El 30/10 Facundo decidió dejarlo como está por ahora; se hace a mano porque AppSheet no acepta clics simulados.
- Marine sin usuario (el correo lo maneja Facundo). Sin verificar: Safari/iPhone real, VoiceOver y `prefers-reduced-motion` del sistema.
- `Comentarios` del pedido: **no era un error**. La columna existe (LongText), está en `Pedidos_Form`, es editable y sin fórmula; el QA del 30/10 dio vacío porque AppSheet ignora el tipeo simulado. Capturas de la guía sin tomar; archivar la copia `3300a579`.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` (STAGINGE2E, 0 usuarios) tiene el alta de pedido rota.
- Datos en dos archivos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- Pages cachea y la cola de Actions se traba: verificar el contenido por SHA, no por «deploy success».
- El «+» de Pedidos (resuelto 30/10 en def. `1.000410`): la barra inferior abría `Pedidos_Panel`, un dashboard, y los dashboards no muestran el botón de alta. Se intercambiaron posiciones: `Pedidos_Panel` quedó en el menú ☰ y la vista `Pedidos` (lista con Add) en la barra. Verificado en la app real de escritorio y en el preview móvil: el botón de abajo abre la lista y el «+» está.
- 31/10 (guardado en el editor, verificado tras recargar): en `Pagos`, las columnas `Facturado` y `Conciliado_Contabilidad` (Enum, opcionales) quedaban siempre vacías. Se les puso INITIAL VALUE `"NO"` para que la planilla tenga SI/NO desde el alta. No se automatizó el «SI»: marcar como facturado o conciliado es un acto contable aparte.
- Para editar desde OpenCode: la ventana de la app tiene que estar al frente (si no, ni tipear ni capturar). Los inputs de la grilla de columnas son `readOnly`; se editan abriendo el lápiz → panel y, para fórmulas, el asistente CodeMirror acepta texto con `document.execCommand('insertText')` sobre `.cm-content` (las comillas no entran por teclado).
- El editor de AppSheet pide sesión de Google: el navegador de OpenCode arranca sin sesión, hay que loguearse en esa pestaña (la sesión de Chrome no sirve). Entrar a la app buena por `/template/AppDef?appName=HENRIS-982559713&appId=7f05d824-…`; la lista `home/apps` es virtualizada y los iconos no identifican la app.
- AppSheet no acepta clics simulados (Guardar y fechas no responden a `dispatchEvent`): la app real se opera a mano.
- La lista de Pedidos y el panel lateral muestran clientes reales: recortar todo video de la app.
- Los totales tardan segundos en recalcular; no es error. El globo del tour necesita `requestAnimationFrame`: enfocar la pestaña. `noindex` no es control de acceso.
