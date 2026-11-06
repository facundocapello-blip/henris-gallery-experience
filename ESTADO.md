# ESTADO — HENRIS GALLERY

Actualizado: 2026-11-06 (Git y comprobaciones locales).

## Publicado
- [Guía visual](https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/): versión visible «Henris Gallery · Guía visual», capturas anonimizadas en celular; `main` en `b01bf87`. HTTP 200, consola sin errores; archivos clave idénticos al repo. Workflow `42124328212`: success.
- [Entrada](https://facundocapello-blip.github.io/henris-gallery-experience/staging/): «Henris Gallery · guía de uso», 200 y consola sin errores; enlaza práctica, app, video, chuleta y mapeo. La guía visual tiene URL propia.
- AppSheet `7f05d824` (`HENRIS-982559713`), versión `1.000413`: botones y cuatro títulos traducidos, verificados parcialmente; acceso Google, dos usuarios según registro previo. `Facturado` y `Conciliado_Contabilidad` tienen inicial `NO` según revisión 31/10.
- Demo video `staging/henris-web-20261031/` y demás rutas registradas en `PROJECT_STATUS.md`; video y pasos se verificaron el 02/11. Mail al Duque enviado el 31/10; textos en `docs/PROXIMOS-PASOS.md` y `docs/MAIL-DUQUE.md`.

## Abierto
- Pedir a su amigo que pruebe la guía visual y la app; necesita cuenta Google autorizada. Revisar títulos restantes y descripción de cotización sin alterar cálculos.
- Probar Safari/iPhone real y VoiceOver; Playwright local no está instalado. La guía publicada se probó con clics programáticos, no con un iPhone físico.
- Marine sin usuario; datos de prueba de «Casa Vidal» se conservan por decisión de Facundo.
- Histórico parcial aceptado para la prueba: 58 pedidos en la vista; 11 números del Excel no aparecían, causa no investigada. No completar ni borrar por ahora.
- Auditoría 31/10: falta cantidad, vista consolidada de deudores y el onboarding acepta sobrepagos. Revisar antes de uso operativo.
- Cambio local sin publicar: capturas completas con íconos en la guía, editadas para privacidad; probar Playwright cuando esté disponible y pedir autorización antes del push. Ver `PROJECT_STATUS.md`.
- `ESTADO.md`, `PROJECT_STATUS.md`, la guía, la prueba y cuatro imágenes tienen cambios locales sin commit; no se hizo push de esta iteración.

## Trampas
- Dos apps homónimas: usar `7f05d824`; `3300a579` tiene rota el alta de pedido.
- Pages cachea: contrastar SHA-256; HTTP 200 no garantiza interacción. El video tuvo un IIFE sin invocar y una llave faltante; se corrigió el 02/11.
- AppSheet puede ignorar clics y tipeo simulados: el QA anterior de `Comentarios` fue falso positivo.
- La lista de pedidos, el video y algunas capturas originales muestran datos reales o personales; no publicar sin anonimizar. La guía nueva usa capturas recortadas y saldo ficticio.
