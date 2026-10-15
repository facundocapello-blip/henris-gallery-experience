# Henris Gallery Experience v1.0

Web interactiva en español para aprender el circuito de **pedidos → obras/ítems y pagos → saldo**. Reconstrucción desde cero: el checkout inicial solo tenía `README.md` y `CODEX_TASK.md`, sin código de un simulador previo.

## Ejecutar

Requiere Node.js 20 o posterior (verificado con 24.19.0). La aplicación no necesita dependencias de producción, claves, APIs ni base de datos.

```sh
cd /workspace/henris-gallery-experience
npm start
```

El servidor escucha en el puerto **4173**, configurable mediante `PORT`. Es un servidor de desarrollo; para hosting estático publicar `index.html`, `styles.css`, `app.js`, `domain.js` y `assets/`. La ruta de navegación vive en el fragmento de la URL y no requiere reescrituras del servidor.

## Qué permite hacer

- Recorrido guiado con retroceso, avance, salida y reinicio, o exploración libre.
- Transformación de una planilla ficticia: copias de los valores viajan hacia sus destinos, con pausa, pasos manuales, omisión y repetición. La preferencia del sistema por movimiento reducido activa la versión estática; también hay un control manual.
- Mapeo de 19 campos, con origen, destino, regla, beneficio y referencia a páginas del Canvas cuando corresponde. Seleccionar un campo resalta su relación; en móvil su destino también aparece dentro de la celda seleccionada.
- Mascota del usuario, preparada desde la lámina adjunta, con cuatro poses y globos en el flujo del documento. Sin audio ni movimientos decorativos permanentes.
- Crear pedidos con varias obras, cantidades y precios; registrar pagos parciales y completar el saldo. Validaciones de campos, importes, cantidades y sobrepagos.
- Separar canal de origen y estado operativo (Nuevo, Confirmado, En producción) del estado financiero (Pendiente, Parcial, Pagado).
- Consultar Resumen, Pedidos, Obras y Pagos; historial de pagos, persistencia local y reinicio con confirmación.

## Fuentes, decisiones y límites

Se revisaron visualmente las **9 páginas** de `Henris_Gallery_Operational_Canvas.pdf` adjunto; el PDF es rasterizado y no contiene texto extraíble. La [trazabilidad del Canvas](docs/CANVAS.md) distingue su contenido de las decisiones de implementación. El enlace de Drive estuvo bloqueado por la red, pero el archivo adjunto permitió completar la revisión.

El Canvas es conceptual, no un diccionario de columnas AppSheet. La demo conserva sus agrupaciones y relaciones; los nombres de campos técnicos, UUID, cardinalidades y validaciones se documentan como decisiones propias. No importa ni interpreta automáticamente una planilla real. La planilla ilustrativa y los pedidos de ejemplo son ficticios.

El simulador implementa el núcleo comercial y financiero. Teléfono, DNI/CUIL, medidas, código, passe-partout y estado de cada obra se explican en el mapeo; **no son un editor de catálogo o producción** en esta versión. Tampoco incluye facturación, inventario real, sincronización entre dispositivos o integraciones.

La mascota se preparó con una edición de la imagen proporcionada para retirar el fondo y disponer sus cuatro poses en una lámina transparente; los recortes se realizan con CSS. No se creó un personaje sustituto. Asset: `assets/mascota-poses.png`.

**Solo datos ficticios.** No hay conexión a AppSheet STAGING, producción ni planillas. La app no hace solicitudes a APIs externas ni carga tipografías o librerías remotas. Los importes se guardan en centavos enteros para evitar errores de coma flotante. Cada obra/ítem y pago tiene su identificador y `pedidoId`; el cliente se conserva como nombre en el pedido para el alcance mínimo del simulador.

`localStorage` usa la clave `henris-gallery-v1`. Un registro inválido muestra una advertencia y permite comenzar otra demo; no se interpreta ni se sobrescribe hasta guardar un nuevo pedido o reiniciar. Si el almacenamiento no está disponible, se avisa que la sesión es temporal. No usar este almacenamiento para datos reales. Los pagos no se editan ni eliminan individualmente; el reinicio borra toda la demo.

## Pruebas

```sh
npm ci --cache /workspace/.npm-cache
npm test
npm run test:e2e
```

Fuera del entorno cloud se puede omitir `--cache` o usar una ruta escribible. Playwright utiliza `/usr/bin/chromium` cuando existe; si no, instalar su navegador con `npx playwright install chromium`. Se puede indicar otro ejecutable con `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. No se requiere descargar navegadores en el entorno actual.

Los resultados y límites de la validación están en [VALIDACION.md](docs/VALIDACION.md). Las pruebas de navegador generan capturas en `test-results/` (ignorado por Git). No se ha publicado un sitio público; la validación usa el servidor interno.

Capturas de la entrega: [inicio en escritorio](docs/previews/desktop-inicio.png), [inicio a 390 px](docs/previews/mobile-390-inicio.png) y [transformación en versión estática](docs/previews/desktop-transformacion.png).
