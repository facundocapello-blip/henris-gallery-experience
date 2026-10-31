# Henris Gallery — estado
Actualizado: 2026-10-31 12:19 (hora de Buenos Aires; verificado con git, gh, curl, consola del navegador, Outlook y editor de AppSheet)

## Publicado
- Página: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/ — 200, 6.146 bytes, SHA-256 igual al local, consola sin errores, video de 15 s inline cargando (readyState 4). Presentación en negro: frase grande, celular con el video real adentro y el recorrido en 4 pasos (pedido → obra → pago → saldo) + CTA «Abrir la app».
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `7d9a40e` = origin/main, árbol limpio, sin stash.
- Resto online (200): `/staging/henris-ad-20261031/` (tres mp4), `/staging/demo-20261031/` (guion, archivado, ya no es el foco), `/staging/onboarding-20261031/`, `/staging/guia-visual-prueba-20261029/`, `/mapeo-v1/` (mapa animado del Excel) y `/mapeo-campos-pedidos/` (mapeo campo por campo).
- App `7f05d824` (`HENRIS-982559713`, prototipo): sign-in obligatorio con Google, «allow all signed-in users» apagado, 2 usuarios — `facu.capello@hotmail.com` (edita) y `maticgpt@gmail.com` (usa). Barra inferior arreglada el 30/10: abre la lista `Pedidos` con el «+» y `Pedidos_Panel` quedó en el menú.
- 31/10 (guardado en el editor y verificado tras recargar): `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` tienen INITIAL VALUE `"NO"`, para que la planilla tenga SI/NO desde el alta.

## Abierto
- Mandar la app al Duque: el mail **ya se envió** el 31/10 12:07 a `facundocapello@gmail.com` (verificado en Enviados de Outlook, asunto «Henris Gallery - pasos a seguir (31/10)», 1.949 caracteres). Falta lo único indispensable: su mail para agregarlo en Share → *Use app*, porque con el sign-in restringido hoy no entra.
- Los pasos accionables están en `docs/PROXIMOS-PASOS.md` y el texto para el Duque en `docs/MAIL-DUQUE.md`; ambos copiados a Drive.
- Datos de prueba del cliente «Casa Vidal» (1 pedido, 1 ítem, 1 pago; hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39) sin borrar, por decisión de Facundo.
- Marine sin usuario. Sin probar en Safari/iPhone real ni con VoiceOver.
- La vista `PIloto_Historico` (sobre `STG_Pedidos_Piloto`) se miró pero no se contaron sus filas ni se validó el import completo.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` (STAGINGE2E, 0 usuarios) tiene rota el alta de pedido.
- Pages cachea y la cola de Actions se traba: verificar el contenido por SHA-256, nunca por «deploy success».
- AppSheet ignora clics y tipeo simulados en la app real: el QA de `Comentarios` fue falso positivo (la columna existe, está en el form y es editable). La app se opera a mano.
- El editor sí se maneja por automatización, con tres condiciones: la ventana de OpenCode al frente; los inputs de la grilla de columnas son `readOnly` y se editan desde el panel del lápiz; y en el asistente CodeMirror el texto entra con `document.execCommand('insertText')` porque las comillas no pasan por teclado.
- Datos en dos archivos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- La lista de Pedidos y el video de la app muestran clientes reales: recortar antes de publicar afuera.
