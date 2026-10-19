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


## Actualización: Tu primer pedido — 19/10/2026
- Implementado en STAGING: recorrido de 7 pasos, caso ficticio 1024, dos obras 120000 + 45000 ARS; seña 50000, segundo pago 30000, saldo 85000 y pago final 85000.
- Cada paso informa dónde entrar, qué completar, qué calcula AppSheet y qué revisar tras sincronizar. Distingue pago, preparación y entrega.
- Guía antes del circuito y demo; diccionario completo después, desplegable; nombres comerciales primero y autoplay inicialmente pausado.
- Capturas faltantes identificadas por paso. Única captura real reutilizada: pagos relacionados/fecha, claramente rotulada como referencia histórica con otros datos. No se crearon pantallas ficticias.
- Commit de contenido e4609a43662f356d65601c523bebf690f8ee73aa; workflow main 35652a20f5c6ef860686b1b47af9331a80812672; Actions 39344441192.
- SHA256 de HTML: 48cb82c38a87d0fa1d08cf828bf7093d9ab46b019e4e79edbfb576ce7f76ba3e.
- Rollback: contenido anterior c341ef8a3f9eb2498e17fa3313440a6f27ead8b7 y workflow 3de8c73c7a89fe4a658683bca03011957594f034.
- Controles estáticos: sintaxis JS, IDs únicos, 7 pasos, cálculos; JSON de mapeo y lógica de pagos idénticos al HTML anterior.
- Prueba real en URL publicada, Chrome cloud 1363×936: 7 pasos/avance/retroceso/selección directa; siguiente deshabilitado al final; diccionario 66/66; pago simulado 25000 → pagado105000/saldo60000; deshacer restaura; captura carga con ancho natural320. Sin overflow horizontal de escritorio.
- Safari iPhone y nuevo layout móvil: pendientes de validación en dispositivo. No se modificó AppSheet ni producción en esta iteración.
- Aclaración del pendiente anterior Fecha_Pedido: revisión visual de 19/10 confirmó que el campo sí está debajo de Pagos en la captura. No se considera captura equivocada; el encuadre de la referencia sigue siendo mejorable.
