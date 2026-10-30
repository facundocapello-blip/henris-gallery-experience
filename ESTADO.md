# Henris Gallery — estado
Actualizado: 2026-10-30 (verificado con git, gh, curl y Chromium)

## Publicado
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `973380b` (= origin/main, deploy run success), árbol limpio.
- `/staging/onboarding-20261031/` — HTTP 200 (index, `chuleta.html`, `tour.js`, `tour.css`), verificado en vivo: «Parte 1 de 7», 0 mensajes de consola, un H1, sin desborde horizontal. Lighthouse local: accesibilidad, buenas prácticas y SEO 1.0.
- Práctica guiada probada en vivo: crear pedido (queda seleccionado el nuevo, sin saltar al de ejemplo) → obra → pago; total 850, pagado 300, saldo 550. Escribir en un campo ya no avanza solo ni muestra error rojo.
- `/staging/guia-operativa-candidata/` — HTTP 200, consola limpia, un H1, iframe de AppSheet con carga diferida.
- `/staging/guia-visual-prueba-20261029/` — HTTP 200, consola limpia.
- `/staging/henris-gemini-fusion-20261020/` — HTTP 200; snapshot congelado `dddcb2c` con el link repuntado en el deploy por `sed`.
- App `7f05d824` (`HENRIS-982559713`), def. `1.000409`, Prototype; usuarios `facu.capello@hotmail.com` y `maticgpt@gmail.com`. Las cuatro webs apuntan ahí (0 referencias a `3300a579`).

## Abierto
- Prueba funcional de la app: **hecha el 30/10** en `7f05d824` con datos de prueba y borrada (ver `docs/QA-APP-20261030.md` §9). Pedido `PED-67b96ed4` → obra 1.200 → seña 500 USD → saldo 700, `Parcial`; hojas con los conteos originales (Pedidos 23, Pagos 38, Pedido_Items 37).
- Fricciones detectadas en la app real: totales que tardan segundos en refrescar; borrado en ícono sin texto y confirmación en inglés; `Comentarios` del pedido no guardado (a revisar a mano).
- Usabilidad del onboarding: aplicados auto-avance solo en desplegables, sin error rojo al escribir, ancla `tab-pagos-detalle` (antes el globo apuntaba a la barra de arriba), el pedido creado ya no salta al de ejemplo, «siete partes» en vez de «seis módulos», «Abrir la app real», textos ≥14 px y barra de secciones que ya no se corta en móvil.
- Quedan sin aplicar del relevamiento: renombrar «Saltar parte» a algo más claro si se prueba con dueñas, y revisar el paso «Del Excel a la app» con datos reales de su planilla.
- Marine: falta su correo (lo maneja Facundo) y definir si carga o solo consulta.
- Sin verificar: Safari/iPhone real, VoiceOver y `prefers-reduced-motion` con la preferencia del sistema.
- Capturas de la guía (28/10) sin comparar contra el formulario vigente de `7f05d824`.
- La copia `3300a579` sigue existiendo: archivar cuando Facundo lo decida.

## Trampas
- Dos apps «Henris Gallery»: la buena es `7f05d824`; `3300a579` es la copia `STAGINGE2E` (0 usuarios, alta de pedido rota).
- En `3300a579`, «+ Nuevo pedido» va a `Pedidos_Form`, que no abre; «Editar» cae en el formulario de `Inicio_Schema`. El panel del dashboard ya se había quitado en `1.000041`.
- Datos de la app buena en dos archivos: Pedidos/Pagos/Clientes en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- Pages cachea: verificar run y URL con `?v=`. `noindex` no es control de acceso.
- El globo del tour necesita un `requestAnimationFrame` para pintarse: en una pestaña de fondo queda con el texto vacío hasta que se enfoca. Al verificar, enfocar la pestaña.
- Los totales de la app real (Total/Pagado/Saldo) se recalculan con unos segundos de atraso: no es un error de carga.
- El navegador del entorno perdió la sesión al reiniciarse el server: hay que rehacer el login de AppSheet. Imágenes lazy en `data:` dan `naturalWidth 0` hasta scrollear; no están rotas.
