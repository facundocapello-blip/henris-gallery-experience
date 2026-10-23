# Henris V4.3 — verificación 19/10/2026

## Integración y publicación confirmadas
- Archivo exacto de Library: Henris_Gallery_V4_3_Validada_20261019.html, versión 4, 101138 bytes.
- SHA256: 882be4ddcabe6988f133edaec8c9dbfaba7ef534b6f8949b3c3c390ca53f1f77.
- Blob GitHub idéntico: 41aade1a2277e933d900f902e525bab87dab1f03.
- Commit STAGING: c341ef8a3f9eb2498e17fa3313440a6f27ead8b7.
- Workflow aditivo en main: 3de8c73c7a89fe4a658683bca03011957594f034. Solo agrega snapshot fijo a ruta separada; conserva archivos y rutas estables.
- Actions run 39315902553: completed/success, incluido Deploy y verificaciones preexistentes.
- URL abierta y probada: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-v4-20261019/

## Pruebas en Chrome conectado sobre URL publicada
- Vista inicial 29 campos; completa 66/66; volver a esenciales 29/29.
- Fecha_Pedido: origen B/MES PEDIDO + C/CARPETA; destino Pedidos · Fecha_Pedido; requiere validación.
- Demo inicial ARS: Total 165000, Pagado 80000, Saldo 85000.
- Agregar 25000: Pagado 105000, Saldo 60000. Deshacer: Saldo 85000.
- Sobrepago 85001 rechazado con mensaje y sin incorporarlo.
- Pago 85000: saldo 0 y estado Saldado.
- Reiniciar restaura 80000/85000.
- Viewport efectivo 390×844: sin desbordamiento horizontal; esenciales y pago de 25000 funcionan.
- Sin errores de consola capturados en webTab.

## Pendientes y límites
- Safari/iPhone físico no probado.
- Mapeo es documental, no certificación de esquema/pantallas AppSheet.
- Observación visual: Fecha_Pedido reutiliza captura de pagos; su correspondencia visual requiere revisión. HTML original conservado sin alteraciones para esta integración.
- Captura de navegador retornó imagen uniforme; no se considera evidencia visual válida.
