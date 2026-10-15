# Vista previa 01 · Mapeo desde el Excel auténtico

Esta entrega es una propuesta funcional de **una sola página**, aislada de la aplicación pública. No aplica el rediseño general ni cambia la URL, las operaciones, el almacenamiento, el recorrido guiado, las cuatro poses o las funciones de la versión validada.

## Ver y probar

La opción más sencilla es descargar `Henris-mapeo-vista-previa.zip`, extraerlo y abrir `Henris-mapeo-vista-previa.html` en un navegador habitual de escritorio. El HTML incluye imágenes, estilos y scripts; no requiere instalar dependencias ni acceder a Internet.

En el entorno de desarrollo, desde la raíz del repositorio:

```sh
python3 -m http.server 4182 --directory preview/mapeo
```

Abrir el archivo `Henris-mapeo-vista-previa.html` servido por ese servidor. No confundir el servidor interno con una publicación accesible desde Internet.

**Límite de verificación:** el navegador administrado de este entorno bloquea `file://`. La apertura directa mediante ese protocolo no pudo verificarse. Sí se comprobó la ejecución del HTML autónomo sin servidor mediante carga en el navegador sin solicitudes de recursos, además de su funcionamiento servido por HTTP.

## Propuesta visual

- Cabeceras auténticas a todo el ancho del panel, agrupadas por columnas contiguas. Se conservan los colores y textos del documento. En móvil el grupo permite desplazamiento y se centra la columna seleccionada para mantener legibilidad.
- Un teléfono completo, con carcasa, cámara, pantalla y navegación de ejemplo; los destinos se iluminan dentro de su interfaz.
- Una flecha conecta la celda auténtica y su campo de destino. Al reproducir, una copia del nombre de la cabecera recorre la conexión. Hay pausa, continuación, reinicio, velocidad y pasos manuales.
- La preferencia del sistema de reducir movimiento activa la vista estática. Se mantiene la misma información y las mismas relaciones.
- Las correspondencias no definidas terminan en un área rotulada como pendiente, fuera de la pantalla del teléfono. No se presentan como campos implementados.
- En móvil, un resumen conserva origen y destino durante el recorrido y los controles permanecen accesibles.
- Se reutiliza la lámina de la mascota ya existente, con las cuatro poses y los mismos papeles: presentación, acompañamiento, preocupación ante pendientes y celebración al completar.

## Fuente auténtica y alcance

Archivo recibido: `pedidos.xlsx`.

- Hoja: `Hoja1`.
- 460 filas y 41 columnas en el rango registrado del archivo; **40 columnas con cabecera**, de A a AN. La columna adicional carece de encabezado.
- SHA-256 del original: `29af598898fdf46fde0b22ab2daa62f8bb45f792bde713327b246bc869d48b5a`.
- Capturas: **solo fila 1**. No se incluyen filas de operaciones, nombres, teléfonos o documentos reales en el artefacto de revisión.
- Método: se abren copias temporales del libro en LibreOffice, limitando el área de impresión a sus cabeceras; se exportan a PDF y se rasteriza ese contenido con PyMuPDF. Los valores, formatos y textos de las celdas originales no se reescriben. No son imágenes generadas ni tablas reconstruidas con HTML.
- Se conservan incluso las erratas originales y los dos encabezados idénticos `QUIEN LA RECIBIO?`, que se distinguen por sus columnas R y V.
- El Excel original no se modifica y **no se incluye** en el repositorio ni en el ZIP de revisión.
- El teléfono usa exclusivamente un pedido ficticio de ejemplo. Las cantidades y precios no se extraen del Excel. Los totales usan la función de dominio existente, incluida sin modificar sus cuerpos de función en el HTML autónomo.
- Las nueve páginas del Canvas siguen siendo la referencia conceptual. No se convierten en nueve pantallas nuevas: se conserva la estructura actual de la web.

## Qué está definido y qué no

Se recorren las 40 columnas en 11 grupos. **14 conexiones corresponden a conceptos o reglas del mapeo documentado; 26 se señalan como pendientes.** Esto no constituye una nueva validación funcional del modelo de datos.

Ejemplos que necesitan acuerdo antes de una migración o una nueva función:

- No hay columna Cantidad en este Excel; no se crea una fuente ficticia para ella.
- `PRECIO CUADRO` no se declara automáticamente precio unitario o total de un pedido.
- `CONTACTO` no se convierte en Teléfono sin confirmar su significado.
- `VENTA = WEB` no se equipara a Web a medida sin validar el catálogo de canales.
- Ni `i` ni `NUMERO DE PEDIDO WEB` se convierten automáticamente al identificador interno de pedido.
- Los netos no se suman a los importes de seña y segundo pago; hacerlo podría duplicar un cobro.
- Receptores, contabilidad, facturación y logística no reciben destinos nuevos inventados.

Esta vista conecta **nombres de campos**, no importa ni transforma registros reales. Las reglas pendientes son visibles durante la animación y en el listado completo. `rules.js` contiene el detalle y `sources/manifest.json` vincula cada zona interactiva con su captura y su coordenada original.

## Reproducir y validar

```sh
# Con las dependencias de desarrollo del proyecto ya instaladas:
python3 preview/mapeo/build_preview.py
node --test preview/mapeo/preview.test.mjs
```

El test requiere el servidor de vista previa en el puerto 4182. El script de captura es reproducible con el archivo original recibido:

```sh
python3 preview/mapeo/render_sources.py /ruta/a/pedidos.xlsx
python3 preview/mapeo/build_preview.py
```

Se utilizaron openpyxl, LibreOffice y PyMuPDF disponibles en el entorno. No se incorporaron dependencias a la aplicación principal.

Validación de esta etapa: 10 pruebas aprobadas y 1 omitida por el bloqueo de `file://`. Incluyen las 40 selecciones de campo en escritorio y 390 px, pausa sin avance, reanudación, reinicio, pasos manuales, movimiento reducido, teclado, modal de cabeceras, cuatro secciones del teléfono, ausencia de solicitudes externas y de errores de consola en el escenario de captura. También pasó el recorrido automático completo de los 40 campos, incluida la pose de celebración final. Capturas en `capturas/`.

No se volvieron a ejecutar las suites de la aplicación pública en esta etapa: sus archivos y funciones permanecen idénticos a la base. Su validación histórica sigue documentada en `docs/VALIDACION.md`.

## Aprobación y reversibilidad

La base es **v1.0.0 / d171036356b30a6e0a2babfd668911d1ff680520**. Todos los archivos nuevos están bajo `preview/mapeo/`; no se requiere tocar el resto del proyecto para revisar esta página.

La vista previa no se despliega a Pages. Una rama de revisión, si se comparte, solo contiene el material para descargar y no dispara el workflow de `main`. La versión pública conserva su commit y su URL. No hay publicación final ni rediseño integral hasta la aprobación del usuario.
