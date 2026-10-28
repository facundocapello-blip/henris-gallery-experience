# Estado de Henris Gallery Experience

## Ejecución AppSheet 2026-10-28

Se trabajó sobre el ID de AppSheet indicado por el usuario, sin crear copia, cambiar datos comerciales ni publicar. El registro de cambios, QA y bloqueos está en [docs/HENRIS-QA-20261028.md](docs/HENRIS-QA-20261028.md). Se corrigió localmente el estado vacío del diccionario de 66 campos en la web y se preparó su workflow; **no hubo push ni republicación**. **Pendiente prioritario:** autenticación y prueba con Mati/Marine e iPhone físico.

Actualizado: 2026-10-15. Registro inicial, no auditoría funcional completa.

## Fuentes verificadas
- Repositorio: https://github.com/facundocapello-blip/henris-gallery-experience (main)
- README.md identifica Experience v1.0, web interactiva con datos ficticios y sin integración con AppSheet.
- CODEX_TASK.md y docs/ existen en el repositorio.
- URL de trabajo informada previamente por el usuario: https://facundocapello-blip.github.io/henris-gallery-experience/muestra-mapeo/ (no verificada en esta auditoría).

## Decisiones y límites
- Mantener la separación demo web / AppSheet STAGING / producción.
- Prioridad visual solicitada: propuesta híbrida minimalista, planilla estilizada como interfaz y flechas/animaciones profesionales.
- Conservar mapeo y recorrido pedidos, ítems, pagos y saldos.

## Pendiente
- Verificar el estado de la URL pública y la revisión exacta desplegada.
- Inspeccionar implementación de la propuesta híbrida y validar móvil antes de nuevos cambios.

## Iteración V3 · Mapeo híbrido (2026-10-15)
- Propuesta implementada en `preview/muestra-mapeo-v3/index.html`, destino público previsto `/muestra-mapeo-v3/`.
- No toca producción, STAGING, Google Sheets, ni demo principal; las rutas anteriores permanecen disponibles.
- Incorporado chequeo de navegador automatizado post-deploy. Los resultados reales dependen del run de Actions; Safari iPhone físico pendiente.
