# Henris Gallery · Mapeo V3 (híbrido editorial)

Prototipo independiente de la versión 02. Ruta: `/muestra-mapeo-v3/`.

- Fuente verificada: `pedidos.xlsx`, hoja `Hoja1`, D3 #ARt=HG024, E3 DESCRIPCION=Silent lake, F3 MEDIDAS=100x150. Sin inferir unidades.
- Vista de origen reinterpretada como UI. Evidencia expandible usa la captura anonimizada publicada en `/muestra-mapeo/excel-continuo.png`.
- Tarjetas flotantes animadas por trayectoria SVG Bézier, línea y partícula suaves; origen y destino dinámicos para desktop y mobile.
- Botones reproducir/pausar/continuar/anterior/siguiente/reiniciar, modo sin movimiento y soporte prefers-reduced-motion.
- 26 columnas pendientes documentadas, sin destinos inventados.
- Mascota original compartida desde `/assets/mascota-poses.png`.
- Sin modificar demo principal, muestras anteriores, AppSheet ni Google Sheets. Los datos no se persisten.

Verificación integrada en workflow Pages: `node preview/muestra-mapeo-v3/verify-live.mjs <URL_BASE_PUBLICA>`. Prueba Playwright en 1440px y 390px, HTTP de recursos, recorrido, reinicio, selección de campo, pendientes, desborde y errores JS. No reemplaza prueba Safari física.
