# Henris Gallery — estado
Actualizado: 2026-11-01 22:55 (hora de Buenos Aires; verificado con git, gh, curl, consola del navegador y editor de AppSheet)

## Publicado
- Página: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/ — 200, 7.183 bytes, SHA-256 igual al local (`170d5b19…`), consola sin errores, video de 15 s inline cargando (readyState 4). Presentación en negro: frase grande, celular con el video real adentro y el recorrido en 4 pasos (pedido → obra → pago → saldo) + CTA «Abrir la app».
- Accesibilidad 01/11: la página cumplía axe con 0 violaciones pero no WCAG 2.2 AA. Corregido: landscape de celular ya no encoge el texto al 53% (7 px) porque apila con scroll; el botón del video expone `aria-pressed` y la descripción va por `aria-describedby`; se sacó `controls` nativo dentro del `<button>` (bug: con Reduce Motion no se podía pausar); foco `#4c8dff` (5,9:1) y borde del CTA 3,5:1; `<h1>`/`<h2>` reales, `<ol>` con números `aria-hidden`, CTA avisa que abre en pestaña nueva. Todo verificado en 844×390, 390×844 y 1366×768. El video no tiene audio, así que no lleva subtítulos.
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `a2ee9a1` = origin/main, árbol limpio, sin stash.
- Resto online (200): `/staging/henris-ad-20261031/` (tres mp4), `/staging/demo-20261031/` (guion, archivado, ya no es el foco), `/staging/onboarding-20261031/`, `/staging/guia-visual-prueba-20261029/`, `/mapeo-v1/` (mapa animado del Excel) y `/mapeo-campos-pedidos/` (mapeo campo por campo).
- App `7f05d824` (`HENRIS-982559713`, prototipo): sign-in obligatorio con Google, «allow all signed-in users» apagado, 2 usuarios — `facu.capello@hotmail.com` (edita) y `maticgpt@gmail.com` (usa). Barra inferior arreglada el 30/10: abre la lista `Pedidos` con el «+» y `Pedidos_Panel` quedó en el menú.
- 31/10 (guardado en el editor y verificado tras recargar): `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` tienen INITIAL VALUE `"NO"`, para que la planilla tenga SI/NO desde el alta.

## Abierto
- Mail con los pasos: enviado el 31/10 12:07 a `facundocapello@gmail.com` (verificado en Enviados de Outlook, asunto «Henris Gallery - pasos a seguir (31/10)», 1.949 caracteres).
- Los pasos accionables están en `docs/PROXIMOS-PASOS.md` y el texto para el Duque en `docs/MAIL-DUQUE.md`; ambos copiados a Drive.
- Datos de prueba del cliente «Casa Vidal» (1 pedido, 1 ítem, 1 pago; hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39) sin borrar, por decisión de Facundo.
- Marine sin usuario. Sin probar en Safari/iPhone real ni con VoiceOver: la accesibilidad se midió con Chrome headless (contraste, hitboxes, layout, axe), pero qué anuncia VoiceOver al enfocar el video no se puede saber sin un iPhone.
- La vista `PIloto_Historico` (sobre `STG_Pedidos_Piloto`) se miró pero no se contaron sus filas ni se validó el import completo.
- Auditoría de aceptación 31/10 (`docs/AUDITORIA-MATIAS-20261031.md`): la app real no se pudo operar sin sesión de Google (302 al login). Tres bloqueos antes de entregar a un tercero: no hay campo Cantidad, no está probada una vista consolidada de deudores y la réplica del onboarding acepta sobrepagos (saldo negativo).

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` (STAGINGE2E, 0 usuarios) tiene rota el alta de pedido.
- Pages cachea y la cola de Actions se traba: verificar el contenido por SHA-256, nunca por «deploy success».
- AppSheet ignora clics y tipeo simulados en la app real: el QA de `Comentarios` fue falso positivo (la columna existe, está en el form y es editable). La app se opera a mano.
- El editor sí se maneja por automatización, con tres condiciones: la ventana de OpenCode al frente; los inputs de la grilla de columnas son `readOnly` y se editan desde el panel del lápiz; y en el asistente CodeMirror el texto entra con `document.execCommand('insertText')` porque las comillas no pasan por teclado.
- Datos en dos archivos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- La lista de Pedidos y el video de la app muestran clientes reales: recortar antes de publicar afuera.
