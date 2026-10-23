# Estado actual Henris Gallery — 19/10/2026

## Web V4.3
Implementada y publicada en https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-v4-20261019/
Archivo exacto integrado en commit c341ef8a3f9eb2498e17fa3313440a6f27ead8b7, sin reemplazar HTML estable. Pages run 39315902553 completed/success. Pruebas de navegación/mapeo 29/66 y pagos aprobadas en Chrome conectado; móvil efectivo 390×844 sin overflow. Ver QA-V43.md para evidencia y límites. Safari físico pendiente. Correspondencia visual de Fecha_Pedido con captura reutilizada de pagos pendiente de corrección/revisión.

## AppSheet STAGING E2E
- App ID 3300a579-5a49-4738-98f5-19979e4952e4. Producción 7f05d824-ccdc-4dc7-ad55-8a43f7739d0b se consultó solo para comparar el origen.
- Confirmado: STAGING y producción usan documentos distintos. No se modificó configuración ni datos de producción.
- El botón + Nuevo pedido ya existía, es visible en panel Pedidos y abre el formulario Pedidos_Form. Adds habilitado. No se reimplementó.
- Pedido ficticio creado: referencia STG-E2E-20261019; cliente de prueba existente STG-CAMPOS-20261014; comentarios marcan PRUEBA FICTICIA y exclusión de indicadores.
- Se definió moneda PESOS. Dos ítems identificados como ficticios: Obra A 100000 y Obra B 50000.
- Cálculos observados después de sincronizar: Total 150000; sin pagos: Pagado 0/Saldo 150000/Pendiente; seña 50000: Pagado 50000/Saldo 100000/Parcial; segundo 25000: Pagado 75000/Saldo 75000/Parcial; final 75000: Pagado 150000/Saldo 0/Pagado.
- Confirmación final: 2 obras, 3 pagos, Unsynced changes 0.
- La interfaz puede mostrar totales anteriores mientras sincroniza; los valores correctos se confirmaron después.
- Validación comprobada: bloquea precio si no se definió moneda y exige el alcance de medidas. Sin cambios de configuración necesarios.
- Los registros ficticios se conservan únicamente en STAGING como evidencia. No deben usarse en indicadores reales.

## Siguiente etapa
Safari iPhone físico pendiente. Análisis y marketing todavía no conectados ni ejecutados por esta tarea. Antes de calcular indicadores: verificar fuente, período, monedas y exclusión de pruebas.
