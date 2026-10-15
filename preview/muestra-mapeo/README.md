# Muestra 02 · Tres campos con nombre y valor

Esta muestra conserva la vista anterior (`preview/mapeo/`, commit `ddf63bd`) y la demo principal v1.0.0 (`d171036`). No extiende el rediseño a otras vistas ni modifica el dominio, los formularios o los datos persistidos de la aplicación.

## Fuente y anonimización

Se generó **una única captura continua A1:AN3** de `pedidos.xlsx`, hoja `Hoja1`: cuarenta columnas, cabeceras y dos filas reales. La imagen no se arma a partir de grupos ni se reconstruye con HTML. Se puede desplazar horizontalmente y ampliar.

La copia temporal usada para imprimir reemplaza, cuando contienen datos, las referencias internas/web (A, AN), notas (J), receptores (R, V), documento, cliente, contacto y mail (AG–AJ). No modifica las celdas originales de catálogo ni sus posiciones. No se publica el libro ni una copia con sus 460 filas. Solo se conserva el PNG anonimizado y metadatos de los tres valores elegidos.

El SHA-256 del Excel original permanece `29af598898fdf46fde0b22ab2daa62f8bb45f792bde713327b246bc869d48b5a`. `render_source.py` verifica que las identidades originales comprobadas no aparezcan en el texto del PDF antes de retener la captura. Los archivos temporales se eliminan al finalizar.

| Celda auténtica | Cabecera | Valor que viaja | Destino de la muestra |
| --- | --- | --- | --- |
| D3 | #ARt | HG024 | Código de la obra |
| E3 | DESCRIPCION | Silent lake | Descripción |
| F3 | MEDIDAS | 100x150 | Medidas |

Se conserva el texto exacto; no se agregan unidades a `100x150`. Las tres correspondencias pertenecen al núcleo conceptual documentado de Ficha de Obra. No se implementa una importación de pedidos ni una nueva ficha funcional en la demo principal.

## Comportamiento

- Al seleccionar una celda, se resalta su posición exacta en la captura.
- Una tarjeta pequeña lleva su nombre y valor por una curva con aceleración/frenado suaves.
- Hay una sola conexión activa. Los otros campos cargados conservan su valor y una marca de confirmación, sin añadir líneas.
- La pantalla comienza vacía y se completa al llegar cada dato. El destino recibe un énfasis breve y el valor permanece.
- Pausa y continuación conservan el punto del recorrido; anterior/siguiente seleccionan y trasladan el campo correspondiente. Reiniciar vacía los tres campos.
- Las posiciones se recalculan con scroll, zoom y cambios de tamaño, incluso durante una pausa. Si el origen se desplaza fuera de la ventana, se oculta la conexión para no dibujar un extremo falso.
- La opción sin movimiento y la preferencia del sistema cargan el mismo contenido de forma estática mediante selección o avance manual.
- Los 26 campos pendientes de la versión anterior siguen visibles y seleccionables. No se les asignan destinos ni se modifican valores al consultarlos.
- Se reutilizan las cuatro poses de la mascota original, sin sustituir el personaje.

## Ejecutar y verificar

Desde la raíz del repositorio:

```sh
python3 preview/muestra-mapeo/build.py
python3 -m http.server 4183 --directory preview/muestra-mapeo
node --test preview/muestra-mapeo/sample.test.mjs
```

Para regenerar la captura se necesita el archivo adjunto original y LibreOffice, openpyxl y PyMuPDF:

```sh
python3 preview/muestra-mapeo/render_source.py /ruta/a/pedidos.xlsx
python3 preview/muestra-mapeo/build.py
```

Resultados locales de esta etapa: **8 pruebas de la muestra aprobadas**, sin omisiones, en Chromium a 1440 × 1100 y 390 × 844. Incluyen persistencia de cada llegada, secuencia completa, pausa, redimensionamiento, coincidencia geométrica de extremos, controles, zoom, pendientes, teclado, preferencia reducida, consola y ausencia de desbordamiento horizontal. También pasaron las **4 pruebas de dominio y 12 de navegador de la demo principal**.

No se probó un iPhone físico ni Safari de iOS. Se usaron estándares web compatibles con navegadores modernos, sin librerías remotas ni reproducción de audio.

## Publicación y preservación

El workflow de GitHub Pages conserva los archivos de la demo principal sin cambios y publica dos rutas adicionales:

- `/muestra-mapeo/`: esta muestra de tres campos.
- `/mapeo-v1/`: HTML autónomo de la vista previa anterior, idéntico al original.

El artefacto contiene solo los archivos de la app, los dos HTML de revisión y el PNG anonimizado. No incluye XLSX, scripts de captura, documentos personales ni copias temporales.

`verify-live.mjs` comprueba la URL HTTPS tras desplegar, verifica por SHA-256 la demo original, la vista anterior y el PNG, y ejecuta las 8 pruebas de esta muestra sobre la URL pública. Solo después de pasar escribe la confirmación en el resumen de GitHub Actions. El estado real debe comprobarse en esa ejecución; este documento por sí solo no prueba una publicación.

Rollback: volver a desplegar el commit anterior al de esta muestra restituye el artefacto de Pages anterior. La vista previa original también permanece en su rama `preview-mapeo-excel` y en `preview/mapeo/`. Ninguna operación de esta muestra migra o borra `localStorage` de la demo principal.
