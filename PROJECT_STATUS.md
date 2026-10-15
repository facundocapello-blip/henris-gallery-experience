# Estado de Henris Gallery Experience

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

## Recorrido aprobado · 2026-10-15
- Rama `feat/gallery-approved-experience`, basada en main actualizado con adjuntos de raíz.
- Verificadas visualmente maquetas 1–4, las nueve páginas de 5.pdf y lámina de mascota. Se reutiliza simulador anterior en legacy.html y su mapeo completo.
- Entrada principal nueva: Pedido → Obras → Pagos → Resumen, pieza única/catálogo, moneda por pedido, vista previa/confirmación/idempotencia/deshacer, persistencia validada.
- Pruebas ejecutadas: 7 de lógica y 16 de navegador aprobadas (incluye legado y flujo nuevo; escritorio + 390 px). Se agrega comprobación específica de reinicio/recuperación/pausa en la nueva entrada.
- Capturas reales comparadas con maquetas: se ajustaron títulos, marco fino, paleta y composición; se eliminó animación automática entre pantallas. Móvil usa ancho directo.
- URL histórica /muestra-mapeo/ respondió HTTP 200; no identifica la revisión desplegada. No se publica esta rama ni se fusiona. Se actualizaron archivos del empaquetado para revisión futura.
- Pendiente Safari/iPhone físico. Comandos y limitaciones en docs/IMPLEMENTACION-APROBADA.md.
