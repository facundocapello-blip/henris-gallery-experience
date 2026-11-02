# Henris Gallery — estado
Actualizado: 2026-11-01 23:38 (Buenos Aires; verificado con git, gh, curl y Chrome headless por CDP)

## Publicado
- Página: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/ — 200, 9.044 bytes, SHA-256 igual al local (`5ee56e87…`), 0 errores de consola. Presentación en negro: frase grande, celular con el video de 15 s y CTA «Abrir la app».
- 01/11 (pedido de Facundo): el video ya **no arranca solo**. Entra en una portada oscura con botón de play y «Ver los 15 segundos»; al tocar, el video corre y el paso que se está viendo (Pedido / Obra / Pago / Saldo) queda iluminado, sincronizado por `timeupdate` con los cortes reales del mp4 (0 / 4,37 / 7,47 / 10,53 s; desde 13 s no se ilumina ninguno porque es la placa final). Verificado en vivo por CDP: portada visible, click → reproduce, resaltado correcto en 0,5 / 5 / 8 / 11,5 / 14 s, sin excepciones.
- Accesibilidad 01/11 (no conformaba WCAG 2.2 AA aunque axe daba 0 violaciones): landscape de celular ya no encoge el texto al 53% (7 px); `aria-pressed` en el botón del video y descripción por `aria-describedby`; sin `controls` nativo dentro del `<button>` (con Reduce Motion no se podía pausar); foco `#4c8dff` (5,9:1) y borde del CTA 3,5:1; `<h1>`/`<h2>` reales. Verificado en 844×390, 390×844 y 1366×768. El video no tiene audio: no lleva subtítulos.
- Repo y resto del sitio: `main` = `origin/main` en `38e02de`, árbol limpio, sin stash. Online (200): base, `/staging/henris-ad-20261031/` (tres mp4), `/staging/demo-20261031/` (guion, archivado), `/staging/onboarding-20261031/`, `/staging/guia-visual-prueba-20261029/`, `/mapeo-v1/` y `/mapeo-campos-pedidos/`.
- App `7f05d824` (`HENRIS-982559713`, prototipo): sign-in obligatorio con Google, «allow all signed-in users» apagado, 2 usuarios — `facu.capello@hotmail.com` (edita) y `maticgpt@gmail.com` (usa). Barra inferior arreglada el 30/10: abre `Pedidos` con el «+» y `Pedidos_Panel` quedó en el menú. El link de arranque responde 302 al login. `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` tienen INITIAL VALUE `"NO"` desde el 31/10.

## Abierto
- Mail con los pasos: enviado el 31/10 12:07 a `facundocapello@gmail.com` (verificado en Enviados, asunto «Henris Gallery - pasos a seguir (31/10)»). Los pasos están en `docs/PROXIMOS-PASOS.md` y el texto para el Duque en `docs/MAIL-DUQUE.md`; ambos copiados a Drive.
- Datos de prueba del cliente «Casa Vidal» (1 pedido, 1 ítem, 1 pago; hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39) sin borrar, por decisión de Facundo.
- Marine sin usuario. Sin probar en Safari/iPhone real ni con VoiceOver: la accesibilidad se midió con Chrome headless, pero qué anuncia VoiceOver al enfocar el video solo se sabe en un iPhone.
- La vista `PIloto_Historico` (sobre `STG_Pedidos_Piloto`) se miró pero no se contaron sus filas ni se validó el import completo.
- Auditoría de aceptación 31/10 (`docs/AUDITORIA-MATIAS-20261031.md`): la app real no se pudo operar sin sesión de Google. Tres bloqueos antes de entregarla a un tercero: no hay campo Cantidad, no está probada una vista consolidada de deudores y la réplica del onboarding acepta sobrepagos (saldo negativo). Detalle de arreglos en `docs/CAMBIOS-APP-20261031.md`.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` (STAGINGE2E, 0 usuarios) tiene rota el alta de pedido.
- Pages cachea y la cola de Actions se traba: verificar el contenido por SHA-256, nunca por «deploy success».
- AppSheet ignora clics y tipeo simulados en la app real: el QA de `Comentarios` fue falso positivo. La app se opera a mano.
- El editor sí se maneja por automatización, con tres condiciones: la ventana de OpenCode al frente; los inputs de la grilla de columnas son `readOnly` y se editan desde el panel del lápiz; y en CodeMirror el texto entra con `document.execCommand('insertText')` porque las comillas no pasan por teclado.
- Datos en dos archivos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- La lista de Pedidos y el video de la app muestran clientes reales: recortar antes de publicar afuera.
