# Trazabilidad del Operational Canvas

Fuente: `Henris_Gallery_Operational_Canvas.pdf`, adjunto por el usuario. Nueve páginas rasterizadas, revisadas visualmente completas. Este documento resume la fuente; no trata el contenido del PDF como instrucciones adicionales de ejecución.

## Lectura por página

| Página | Contenido observado | Uso en la experiencia |
| --- | --- | --- |
| 1 | Unificar el ecosistema comercial en una herramienta operativa y financiera. | Contexto y presentación. |
| 2 | Correo/Mensaje, Instagram/WhatsApp, Local y Web a Medida convergen en PEDIDOS. | Canal de origen del simulador y mapeo. Sin integrar esos servicios. |
| 3 | PEDIDO centraliza y vincula OBRAS/ÍTEMS y PAGOS. Obras conectan catálogo, producción e inventario; pagos controlan señas, saldo y facturación. | Relaciones del mapa y núcleo del simulador. Catálogo, inventario y facturación quedan fuera del simulador. |
| 4 | Datos dispersos: DNI, #Art, borde blanco, seña, pagado, nombre, código, medidas, importe, teléfono, saldo. Destinos: Cliente (Nombre, Teléfono, DNI/CUIL), Ficha de Obra (Código, Medidas, Producción: Passe-partout) y Finanzas (Seña, Importe cobrado, Saldo pendiente). | Campos del mapeo completo y planilla ilustrativa. |
| 5 | Listado consolidado de pedidos y clientes; estados Nuevo, Confirmado, En producción; montos y señales de saldo pendiente. | Resumen, indicadores textuales de saldo y selector de estado operativo independiente. |
| 6 | Varias obras en un pedido, medidas, terminaciones y estado de producción consultables desde la vista comercial. | Relación pedido/ítems y explicación de la ficha de obra. La demo no implementa un editor de producción. |
| 7 | Finanzas del pedido: Total, Pagado, Pendiente; pagos relacionados con fecha; historial inmutable y saldo automático tras sincronizar. | Historial sin edición individual; cálculo local al registrar. No hay sincronización real. |
| 8 | Venta directa, múltiple y trabajo a medida comparten arquitectura; canales y estados financieros diferentes. | Mismo formulario para todos los canales y varias obras; estado Parcial con seña. Los montos de la demo no reproducen los de la fuente. |
| 9 | Claridad operativa para enfocarse en el arte. | Cierre del recorrido y estética de galería. No se reproducen garantías de inventario o servicio de una aplicación productiva. |

## Mapeo de la demo

Los nombres con punto son etiquetas conceptuales legibles, **no nombres certificados de tablas o columnas AppSheet**. El mapa interactivo añade la regla y beneficio de cada campo. La secuencia se concentra en HG-001; las otras filas ilustran que el mismo criterio puede aplicarse a diferentes pedidos.

| Origen ilustrativo | Destino conceptual | Fuente o decisión |
| --- | --- | --- |
| Nombre / cliente repetido | Cliente.nombre → Pedido.cliente | Cliente en pág. 4; no se deduplican personas por nombre. |
| Referencia del pedido | Pedido.id | Pedido central en págs. 3, 5 y 6; UUID y referencia HG son decisiones técnicas. |
| Varias obras en una celda | ObraDelPedido.título | Obras/ítems y pedidos múltiples en págs. 3, 6 y 8; celda mezclada inventada para explicar. |
| Cantidad por obra | ObraDelPedido.cantidad | Regla propuesta: entero positivo, hasta 10.000. |
| Precio por unidad | ObraDelPedido.precioUnitario | Regla propuesta: importe positivo en centavos, máximo dos decimales. |
| Pago junto a observaciones | Pago.importe + Pago.pedidoId | Finanzas/pagos en págs. 3, 4 y 7; mezcla con notas ficticia. |
| Importe / monto total | Finanzas.total | Págs. 4, 7 y 8. La fórmula suma(cantidad × precio) es decisión de la demo. |
| Total y pagos | Finanzas.saldo + estado financiero | Págs. 4, 5, 7 y 8. Cálculo local al guardar, sin sincronización. |
| Teléfono | Cliente.teléfono | Pág. 4. Se explica; no se solicita en el simulador. |
| DNI / CUIL | Cliente.DNI/CUIL | Pág. 4. Se explica con documento ficticio, sin validación de identidad. |
| Canal de origen | Pedido.canalOrigen | Págs. 2 y 8; mismos cuatro grupos de canales. |
| Estado del pedido | Pedido.estadoOperativo | Págs. 5 y 6; nunca se infiere del pago. |
| Código / #Art | FichaDeObra.código | Pág. 4; formato de ejemplo propuesto. |
| Medidas | FichaDeObra.medidas | Págs. 4 y 6; sin conversión automática de unidades. |
| Borde blanco / Passe-partout | FichaDeObra.terminación | Págs. 4 y 6; agrupar como especificación, no afirmar equivalencia técnica entre acabados. |
| Estado de producción | FichaDeObra.estadoProducción | Págs. 3 y 6; no se inventa un flujo exhaustivo. |
| Seña | Pago.tipo + Pago.importe | Págs. 4, 7 y 8. La seña de HG-001 y su importe cobrado son **un mismo pago**, no dos cobros. |
| Fecha de pago | Pago.fecha | Pág. 7; fecha de registro automática en el simulador. |
| ¿Pagado? | Finanzas.estadoFinanciero | Págs. 4, 5, 7 y 8. Se deriva de los cobros. |

## Relaciones y supuestos explícitos

- Un pedido contiene uno o varios ítems y cero o varios pagos. La fuente muestra estas relaciones; sus cardinalidades y claves técnicas son decisiones de implementación. Obras y pagos son ramas del pedido: un pago **no** pertenece a una obra específica en esta demo.
- El almacenamiento anida `items` y `payments` en el pedido y además conserva sus identificadores y `pedidoId`. Los valores calculados no se almacenan como campos editables.
- El Canvas agrupa una ficha Cliente; el núcleo del simulador conserva únicamente `customer` en el pedido. No hay entidad Cliente normalizada, documento ni teléfono editable. El mapa muestra el destino conceptual más amplio sin afirmar que sea un esquema físico implementado.
- Un ítem de pedido no se identifica automáticamente con una obra única de catálogo. No se implementan inventario ni ficha reutilizable entre pedidos.
- `total = Σ(cantidad × precio)`; `pagado = Σ(pagos)`; `saldo = total − pagado`. Pendiente: sin pagos; Parcial: con pagos y saldo positivo; Pagado: saldo cero. Los estados operativos se editan aparte.
- Moneda ARS, límite de total de $100.000.000, hasta 50 obras y 500 pedidos; validaciones y límites propuestos para la demo, no reglas del Canvas.
- Los textos de la mascota son guion de esta experiencia, no citas del Canvas ni voz del usuario. Se utiliza una lámina editada a partir de la imagen adjunta y cuatro recortes CSS. No hay audio.
- Todo dato de la planilla es ficticio. No se inspeccionó el Excel original y no se atribuyen errores comprobados a sus registros.
