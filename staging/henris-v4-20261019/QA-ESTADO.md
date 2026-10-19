# Henris V4 — validación 19/10/2026

## Fuentes y alcance
- Base GitHub V4.1: `feat/henris-v4-iphone-real-appsheet`, `preview/henris-v4-iphone/index.html`.
- Rama aislada de integración: `staging/henris-v4-20261019`, `staging/henris-v4-20261019/index.html`.
- Maqueta local del 19/10: `Henris_Gallery_V4_3_Candidata.html`; **no** es idéntica al archivo integrado en esta rama.
- Producción (`main`), AppSheet y Google Sheets: sin cambios.

## QA ejecutado sobre V4.3 local (NO sobre la rama GitHub)
Chromium cargado mediante `page.set_content()`, porque `file://` devolvió ERR_BLOCKED_BY_ADMINISTRATOR.
- 390 px y 1280 px: 29 esenciales, 66 completos.
- Selección `Fecha_Pedido`: destino técnico `Pedidos · Fecha_Pedido`.
- Pago ficticio +ARS 25.000: pagado ARS 105.000, saldo ARS 60.000; deshacer devuelve ARS 85.000.
- Sin errores JS de página ni overflow horizontal.
- Capturas locales realizadas.
**No extrapolar estas pruebas a la rama GitHub.**

## Controles estáticos sobre la rama GitHub
- Archivo recuperado por API después del commit.
- Conserva 29/66, bloque de pagos, captura real y fallback, reproducción/pausa y cambio de campo.
- Falta QA de navegador sobre la versión exacta de la rama.

## Bloqueo de publicación
El workflow `.github/workflows/pages.yml` solo ejecuta en `main` y copia una lista explícita de rutas. No incorpora `staging/henris-v4-20261019/`. Publicar una URL Pages requeriría modificar y ejecutar el pipeline, con revisión y autorización de ese cambio estructural. No se modifica `main` en esta etapa.

## Pendientes
1. Comparación funcional y visual completa entre V4.3 local y archivo GitHub.
2. Ejecutar pruebas de la versión exacta del PR en Chromium y Safari físico.
3. Revisar resaltado del campo sobre capturas reales; no afirmar equivalencias visuales no verificadas.
4. Publicación aislada en STAGING, sin sustituir rutas estables, después de QA.
