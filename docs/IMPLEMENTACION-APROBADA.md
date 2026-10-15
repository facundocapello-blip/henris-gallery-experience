# Implementación según adjuntos de raíz · 15/10/2026

Se reutilizó la aplicación existente. `index.html` abre el nuevo recorrido; `legacy.html` conserva el simulador anterior y su mapeo completo de 19 campos. No se reconstruyó desde cero.

Referencias verificadas en esta revisión: `1.png`, `2.png`, `3.png`, `4.png` y las nueve páginas de `5.pdf`, revisadas visualmente. El PDF muestra composiciones conceptuales de la app; no certifica columnas de AppSheet. La lámina `cc284daa-c8c5-413c-9860-965dda8ae2d4.jfif` contiene la mascota original. Se conserva el recurso local ya preparado, sin generar reemplazos.

El nuevo flujo usa Pedido → Obras → Pagos → Resumen, marfil/carbón/terracota, títulos contenidos, Excel a la izquierda y marco fino a la derecha. A 390 px se elimina el marco; Origen Excel / Resultado en la app conserva la selección. Hay mapeo por selección, copias animadas con pausa y repetición y modo sin movimiento. La referencia nunca cambia al modificar el pedido. USD y ARS de la planilla ilustrativa nunca se agregan.

Cliente, canal, estados operativos y relación pedido/obras/pagos concuerdan con las agrupaciones del Canvas. Moneda, claves, límites, catálogo mínimo y unicidad son propuestas de demo, no reglas certificadas de AppSheet. Las dos obras de ejemplo se consideran únicas. Un ítem contiene su propia clave y una referencia opcional a ART-001 / ART-002; no se implementa inventario productivo. Cambiar el título de un ítem lo separa del catálogo.

Ejemplo HG-001: USD 1.200 total, USD 300 pagado, USD 900 saldo. Previsualizar USD 400 no registra nada. Confirmar deja USD 700 pagado / USD 500 saldo; deshacer restaura USD 300 / USD 900. Saldar solo abre el formulario. Confirmaciones usan token idempotente y guardia local contra doble clic. Crear otro pedido reemplaza el pedido activo previa confirmación; el simulador anterior conserva su modo de múltiples pedidos.

Persistencia nueva: `henris-experience-v2`, separada del simulador anterior. Valida identidad, relaciones, importes y piezas únicas al recuperar. Si el almacenamiento falla, la sesión continúa con advertencia. Datos inválidos no se sobrescriben antes de una acción explícita de guardado/reinicio. No hay llamadas externas ni integración real.

## Ejecutar y verificar

```sh
npm ci
npm start
# Abrir http://localhost:4173
npm test
npm run test:e2e
```

Node 20+, Chromium instalado o `npx playwright install chromium`. Las capturas se generan en `test-results/approved-desktop.png`, `approved-mobile-390.png` y `mapping-*.png`. El servidor es local, no una publicación pública.

## Límites

Safari/iPhone físico pendiente. El modo libre nuevo edita un pedido activo; el archivo legacy conserva múltiples pedidos. No hay inventario, producción, entrega ni sincronización reales. La moneda se bloquea si existen importes; para usar ARS se crea un pedido vacío. Los formularios guardan al confirmar; navegar sin guardar descarta la edición pendiente. No se publicaron cambios ni se modificó AppSheet o planillas.

## Resultados ejecutados

- `npm test`: 7/7 aprobadas.
- `npm run test:e2e`: 16/16 aprobadas antes de incorporar el escenario adicional de recuperación/reinicio/pausa.
- `npx playwright test tests/approved.spec.js`: 6/6 aprobadas después de incorporarlo, en escritorio y móvil. Las 12 comprobaciones de legado ya habían pasado sin cambios posteriores en su implementación.
- `node --check experience.js`, `node --check experience-domain.js`, `git diff --check`: sin errores.
- Consola nueva sin errores durante recorrido financiero. Validación móvil en Chromium, no Safari físico.
- Capturas finales en `docs/previews/aprobada/`: resumen con USD 700 pagado / USD 500 saldo y mapeo sin movimiento en ambos tamaños. Se compararon visualmente con las maquetas 1–4; se preservó la composición y se redujeron títulos. La referencia no exige copiar controles de sistema ficticios.
