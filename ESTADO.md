# ESTADO — HENRIS GALLERY

Actualizado: 2026-11-03 (verificado con git, curl y Chrome/CDP)

## Publicado
- Entrada: https://facundocapello-blip.github.io/henris-gallery-experience/staging/ — la **guía de uso** (200, 0 errores de consola). Botones: practicar con datos de ejemplo, abrir la app real, «Ver los 15 segundos», chuleta y mapeo. `main` = `origin/main` en `0ac315d`.
- Demo del video: `…/staging/henris-web-20261031/` — 200, **7.880 bytes**, SHA-256 `c1e2063a…` igual al local, 0 errores. Ya no es la entrada: se llega desde la guía.
- **Arreglado el 02/11**: el script era un IIFE `(() => { … })` **sin invocar** (`})` en vez de `})();`), más un `}` faltante en la línea 160. Por eso desde `7002664` no corría nada: play muerto y pasos sin iluminar. Ahora play arranca y los pasos se encienden a 1,2 s (Pedido), 5 s (Obra), 8 s (Pago), 11 s (Saldo) y **nada desde los 13 s** (placa final). Verificado en vivo.
- Resto del sitio 200: `henris-ad-20261031`, `demo-20261031` (archivado), `onboarding-20261031`, `guia-visual-prueba-20261029`, `mapeo-v1`, `mapeo-campos-pedidos`.
- App AppSheet `7f05d824` (`HENRIS-982559713`): sign-in con Google, 2 usuarios (facu edita, maticgpt usa); barra inferior arreglada el 30/10; `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` con INITIAL VALUE `"NO"` desde el 31/10.

## Abierto
- AppSheet `7f05d824`: versión `1.000413`; botones principales y cuatro títulos de formularios traducidos, comprobados parcialmente. Pendiente revisar descripciones; ver `PROJECT_STATUS.md`.
- Guía visual: capturas anonimizadas en marco de celular, solo local; pruebas de navegador Playwright pendientes porque no está instalado. Ver `PROJECT_STATUS.md`.
- Sin probar en Safari/iPhone real ni con VoiceOver (la accesibilidad se midió con Chrome headless).
- Marine sin usuario. Datos de prueba de «Casa Vidal» sin borrar (decisión de Facundo).
- Histórico: Facundo decidió dejarlo incompleto para la prueba con su amigo; no hace falta completar el import. Vista `PIloto_Historico`: 58 pedidos observados; 11 números identificables del Excel no aparecen en esa vista (no se determinó el motivo). No se modificaron datos.
- Auditoría 31/10: falta campo Cantidad, no hay vista consolidada de deudores y el onboarding acepta sobrepagos.
- Mail con pasos enviado el 31/10 12:07; texto en `docs/PROXIMOS-PASOS.md` y `docs/MAIL-DUQUE.md`.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` tiene rota el alta de pedido.
- Pages cachea: verificar por SHA-256 del HTML, nunca por «deploy success».
- Un `<script>` roto deja la página sin interacción y **el HTTP sigue en 200**, sin error visible salvo en consola. Un `})` en vez de `})();` no lanza excepción: define una función y no la ejecuta.
- AppSheet ignora clics y tipeo simulados: el QA de `Comentarios` fue falso positivo.
- La lista de Pedidos y el video muestran clientes reales: recortar antes de publicar afuera.
