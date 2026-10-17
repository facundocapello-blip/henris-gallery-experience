# Henris Gallery — maqueta comercial interactiva

Abrí `index.html` directamente en el navegador. No requiere servidor, cuenta,
base de datos, claves ni conexión a servicios externos.

## Contenido

- **Presentación:** propuesta de valor de Henris Gallery.
- **Mapeo de pedidos:** 14 correspondencias (13 ejemplos documentados más el identificador
  generado por el sistema). Incluye búsqueda, filtro por categoría, filtro por estado y
  panel de detalle con campo actual → columna del Excel → regla de transformación.
- **Circuito:** Pedido → Obras/Ítems + Pagos, con la regla de saldo.
- **Simulación:** pedido ficticio HG-0248 con dos obras, una seña y un segundo pago.
  El saldo se calcula en JavaScript. Podés agregar un pago de prueba; no se guarda al recargar.

## Alcance y límites

- No es un CRM real, no tiene backend, login ni persistencia.
- No es una captura de AppSheet ni del Excel original.
- Las correspondencias son ejemplos documentados. El mapeo completo (66 campos:
  Pedidos 19, Obras/Ítems 26, Pagos 14, Clientes 7) requiere validación con el archivo original.
- Los nombres, teléfonos y pedidos de la simulación son ficticios.

## Edición

- Las correspondencias están en el arreglo `MAPPINGS` dentro de `index.html`.
- Los datos de la simulación están en el objeto `sim`.