# Henris Gallery — Demo controlada para Mati (19/10/2026)

Estado: CANDIDATA PARA DEMOSTRACIÓN, NO APROBADA PARA PRODUCCIÓN.

## Enlaces
- Demo STAGING: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-v4-20261019/
- AppSheet STAGING: https://www.appsheet.com/start/3300a579-5a49-4738-98f5-19979e4952e4
- Repositorio: https://github.com/facundocapello-blip/henris-gallery-experience

## Guion breve para mostrar a Mati (5–8 minutos)
1. **Excel → App**: presentar la intención: visualizar el origen de los campos del Excel histórico y su destino documental en las tablas nuevas. Mostrar un campo de Pedidos, uno de Obras/Ítems y uno de Pagos. Aclarar que el mapeo documental no certifica la migración ni visibilidad exacta en AppSheet.
2. **Pasos / Tu primer pedido**: seguir los siete pasos con el ejemplo completamente ficticio 1024 (ARS). Cliente → nuevo pedido → moneda → dos obras ($120.000 + $45.000) → seña ($50.000) → parcial ($30.000) → revisión de saldo ($85.000) y entrega. El avance por pasos no graba nada en AppSheet.
3. **Pagos / simulador**: comenzar en Total $165.000, Pagado $80.000, Saldo $85.000; agregar $25.000 (saldo $60.000); deshacer (saldo $85.000); explicar que pagos reales se cargan únicamente en AppSheet y se revisan luego de sincronizar.
4. **Demostrar circuito real solo si se acuerda y usando STAGING**: revisar el caso de prueba STG-E2E-20261019; dos obras, tres pagos, total y pagado $150.000, saldo $0 luego de sincronizar. No cargar datos reales en una demo.
5. Cerrar recogiendo aprobación funcional, correcciones concretas y responsables.

## Evidencia ya registrada
- Publicación GitHub Pages y tests Chrome documentados en QA-V43.md y PROJECT_STATUS.md.
- AppSheet STAGING: + Nuevo pedido visible y operativo, 2 obras, 3 pagos, Total/Pagado/Saldo confirmados; sin cambios a PRD.
- El usuario confirmó que V4.3 abre y permite navegar desde Safari en su iPhone el 19/10/2026. Esto no equivale a una prueba E2E de pagos en Safari.

## Limitaciones que deben explicitarse
- Faltan capturas reales de varias pantallas AppSheet. Los espacios vacíos o rótulos «Captura real pendiente» son deliberados; no se deben reemplazar con imágenes inventadas.
- Web interactiva = maqueta independiente sin datos reales ni conexión activa a AppSheet.
- Mapeo de 66 campos = documentación, no migración certificada.
- Las ramas main y staging/henris-v4-20261019 divergen; no fusionar indiscriminadamente.

## Criterios de salida
**Para mostrar a Mati:** URL activa, flujo de navegación básico, cálculos del simulador estables, advertencia visible de maqueta, ningún registro real modificado. No es imprescindible completar todas las capturas.

**Para PRD:** aprobación funcional de Mati/Marine, definición de qué componentes entran en alcance, respaldo y rollback, verificación de permisos/accesos, control de claves y relaciones, pruebas de pedido y pagos parciales tras sincronizar, control de datos ficticios, criterios de indicadores (período, moneda, fecha venta vs cobro), y validación móvil suficiente.

## Decisión vigente
No modificar producción, ni sustituir la ruta estable. Presentar STAGING y recolectar feedback antes de preparar un pase a PRD.
