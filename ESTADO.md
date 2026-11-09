# ESTADO — HENRIS GALLERY

Actualizado: 2026-11-09 (candidata narrativa revisada, pendiente de publicar).

## Publicado
- [Propuesta Gemini con prueba de 5 minutos](https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-propuesta-gemini-20261106/): `6b785b5`, HTTP 200, HTML igual al repo, bloque y botón presentes en navegador, consola sin errores; workflow `42375113646` exitoso. Rollback: `03d8dfc`.
- [Guía visual](https://facundocapello-blip.github.io/henris-gallery-experience/staging/guia-visual-prueba-20261029/): «Henris Gallery · Guía visual», capturas editadas con íconos; `main` en `03d8dfc`. HTTP 200, consola sin errores y HTML idéntico al repo. Workflow `42324890542`: success.
- [Entrada](https://facundocapello-blip.github.io/henris-gallery-experience/staging/): «Henris Gallery · guía de uso», 200 y consola sin errores; enlaza práctica, app, video, chuleta y mapeo. La guía visual tiene URL propia.
- AppSheet `7f05d824` (`HENRIS-982559713`), versión `1.000413`: botones y cuatro títulos traducidos, verificados parcialmente; acceso Google, dos usuarios según registro previo. `Facturado` y `Conciliado_Contabilidad` tienen inicial `NO` según revisión 31/10.
- Demo video `staging/henris-web-20261031/` y demás rutas registradas en `PROJECT_STATUS.md`; video y pasos se verificaron el 02/11. Mail al Duque enviado el 31/10; textos en `docs/PROXIMOS-PASOS.md` y `docs/MAIL-DUQUE.md`.

## Abierto
- Prueba de contenido: 1/1; `npm test`: 4/4. Pendiente revisión móvil y devolución del amigo.
- Pedir a su amigo que pruebe la guía visual y la app; necesita cuenta Google autorizada. Revisar títulos restantes y descripción de cotización sin alterar cálculos.
- Probar Safari/iPhone real y VoiceOver; Playwright local no está instalado. La guía publicada se probó con clics programáticos, no con un iPhone físico.
- Marine sin usuario; datos de prueba de «Casa Vidal» se conservan por decisión de Facundo.
- Histórico parcial aceptado para la prueba: 58 pedidos en la vista; 11 números del Excel no aparecían, causa no investigada. No completar ni borrar por ahora.
- Auditoría 31/10: falta cantidad, vista consolidada de deudores y el onboarding acepta sobrepagos. Revisar antes de uso operativo.
- Comparar la propuesta Gemini con la guía anterior; Playwright local no está instalado.
- Candidata narrativa del 9/11 en `preview/henris-narrativa-20261109/`: HTML único de 273.658 bytes, cinco momentos y ficha acumulativa $100/$40/$60, enlace a `7f05d824`, sin errores de consola. Falta autorización para publicar en `/staging/henris-narrativa-20261109/`; la guía de cuatro pasos y la propuesta del 6/11 no se tocan.
- `ESTADO.md` y `PROJECT_STATUS.md` tienen actualización local sin commit; código y prueba de la propuesta están subidos. La narrativa tampoco está commiteada.

## Trampas
- Dos apps homónimas: usar `7f05d824`; `3300a579` tiene rota el alta de pedido.
- Pages cachea: contrastar SHA-256; HTTP 200 no garantiza interacción. El video tuvo un IIFE sin invocar y una llave faltante; se corrigió el 02/11.
- AppSheet puede ignorar clics y tipeo simulados: el QA anterior de `Comentarios` fue falso positivo.
- La lista de pedidos, el video y algunas capturas originales muestran datos reales o personales; no publicar sin anonimizar. La guía visual usa capturas editadas y saldo ficticio.
