# Auditoría de aceptación — Henris Gallery, vista como Matías

Fecha: 2026-10-31 · App vigente: `7f05d824-ccdc-4dc7-ad55-8a43f7739d0b` (`HENRIS-982559713`, definición `1.000409` o posterior — avanza con cada guardado del editor, no se re-verificó el número exacto el 31/10 · Prototype)
Autor del informe: sesión de OpenCode con acceso al repo, a las páginas publicadas y a las capturas reales.

---

## 0. Advertencia de método (leer antes que nada)

**No pude operar la app real.** El link `https://www.appsheet.com/start/7f05d824-...` responde `302` a
`appsheet.com/Account/Login?provider=google`. No tengo sesión de Google ni clic simulado en AppSheet
(la app real ignora eventos sintéticos, ya documentado en `ESTADO.md`). Por lo tanto:

| Tipo de evidencia | Qué incluye |
|---|---|
| **EJECUTADO HOY** | Páginas publicadas (HTTP), capturas y video reales del repo, réplica de práctica del onboarding recorrida en Edge headless a 390×844 |
| **DOCUMENTADO (mano, 28–30/10)** | Alta real de pedido + obra + pago parcial y borrado en `7f05d824`, fórmulas leídas en la hoja, formularios abiertos, validaciones de cliente/moneda |
| **NO PROBADO** | Recorrido completo en la app real hoy, iPhone/Safari real, VoiceOver, sincronización/offline, duplicados, permisos de borrado por tabla, sobrepago real, conversión de moneda |

Lo que sigue separa explícitamente cada categoría. **No hay simulación presentada como prueba ejecutada.**

---

## 1. Preparación: qué se identificó

- App buena: `7f05d824` · `HENRIS-982559713` · definición `1.000409` · Prototype · 2 usuarios (`facu.capello@hotmail.com` edita, `maticgpt@gmail.com` usa) · sign-in Google obligatorio, «allow all signed-in users» apagado.
- Copia a NO usar: `3300a579` (`HenrisGallery·STAGINGE2E`) · 0 usuarios · alta de pedido rota.
- Datos: Pedidos/Pagos/Clientes/Pedido_Items en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- Conteos al 31/10: Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39 (incluye el pedido de prueba «Casa Vidal»).
- Páginas: las 5 rutas del circuito responden 200 (web, onboarding, guía visual, mapeo v1 y mapeo de campos).
- La página de onboarding publicada es idéntica al repo (difiere solo en fin de línea CRLF/LF, mismo contenido).

---

## 2. Recorridos: esperado vs. real

### 2.1 App real (evidencia de la prueba manual del 30/10, no repetida hoy)

| # | Operación | Esperado | Real documentado | Evidencia |
|---|---|---|---|---|
| 1 | Alta de pedido | Cliente, fecha, entrega, moneda, estado | Se creó `PED-67b96ed4` en la hoja `Pedidos` | `docs/QA-APP-20261030.md` §9 |
| 2 | Agregar obra | Ítem con medida y precio; total del pedido | Total 1.200 / saldo 1.200 | ídem |
| 3 | Pago parcial 500 | Pagado 500, saldo 700, estado Parcial | Correcto, **pero la cabecera tardó unos segundos** en actualizar | ídem |
| 4 | Borrado | Pago, ítem y pedido fuera de las hojas | Conteos volvieron a 23/37/38 | ídem |
| 5 | Validación cliente/moneda vacíos | No guarda y avisa | «Completá este campo» en ambos | `docs/HENRIS-QA-20261028.md` |
| 6 | Fórmulas | Total = Σ precios; Pagado = Σ pagos «Pagado»; Saldo = Total − Pagado | Leídas y consistentes en 35 pedidos | ídem |

**Conclusión de este bloque:** el circuito pedido → obra → pago → saldo **funciona** en la app real. Es lo único que permite decir que el núcleo está vivo.

### 2.2 Lo que sí ejecuté hoy: réplica de práctica publicada

Recorrido completo de `staging/onboarding-20261031/` en Edge headless, 390×844, con clics y tipeo reales sobre la réplica (datos ficticios, sin red):

| Prueba | Resultado real |
|---|---|
| Recorrido guiado de 29 pasos (7 módulos) | Completa; el globo nunca queda fuera de pantalla; un H1; sin desborde horizontal (390/390) |
| Alta del pedido de práctica | Guarda y abre la ficha con Total/Pagado/Saldo en USD |
| Dos obras (1.200 + 800) | Total 2.000, saldo 2.000 — suma correcta |
| Pago de 5.000 sobre un total de 2.000 | **Aceptado sin aviso: Pagado 5.000, Saldo −3.000** |
| Segundo y tercer pago (500 y 1.500) | Sigue acumulando: Pagado 7.000, Saldo −5.000 |
| Obra con precio −500 | Rechazada, pero con mensaje genérico «Completá este dato para guardar.» sobre un campo que sí está completo |
| Cantidad | No existe el concepto: cada obra es una fila |
| Consola / errores JS | Sin errores (solo 404 de favicon) |

**Dos hallazgos nuevos de esta corrida:**
1. La práctica enseña, sin querer, que se puede cobrar de más: el saldo negativo se muestra natural, sin advertencia. Si la app real tampoco valida, Matías puede cerrar un pedido «Pagado» con números que no cierran.
2. En la corrida completa del tour, los totales finales quedaron en los del pedido de ejemplo (USD 850 / 300 / 550) aunque se tipearon 1.200 y 500. No pude confirmar que los pasos «Guardá el pedido/obra/pago» guarden de verdad lo escrito: se puede avanzar con «Siguiente». Queda como defecto de la guía, no de la app.

### 2.3 Capturas y video reales (repo)

- `staging/henris-web-20261031/img/paso-*.png` y el video de 15 s (`henris-demo-real.mp4`, 720×1480) muestran la app real en el celular.
- El video de 15 s (`henris-demo-real.mp4`, 720×1480) muestra **tres pantallas del circuito real**: el formulario de pedido («Casa Vidal»), el detalle con la obra cargada y el formulario de pago de la seña; al final vuelve al detalle con Total 500 / Pagado 200 / Pendiente 300 / «Parcial». Corregido el 01/11: la primera versión de este informe decía que era «el mismo formulario sin acciones», y es falso — se verificó extrayendo fotogramas en 1, 5, 9 y 12 s. Lo que sí falta: no se ve el gesto de tipear ni un alta desde cero; es pantalla en movimiento con subtítulos, sin cursor.
- En las capturas: título «PEDIDOS FORM», botones «Cancel» y «Save», fecha «oct 30, 2026», acciones «View / Add», «Syncing…», y el detalle con **Total 500 / Pagado 0 / Pendiente 500 sin símbolo de moneda**.

---

## 3. Problemas críticos (impiden operar bien)

1. **No hay cantidad.** `Pedido_Items` no tiene campo Cantidad; una fila = una pieza (`docs/HENRIS-QA-20261028.md`, riesgo 3). El escenario «varios productos con cantidades» no se puede hacer como lo haría Matías; hay que cargar N filas. El total suma bien, pero el trabajo diario se vuelve mecánico y propenso a error.
2. **No está probado que exista una vista de deuda consolidada.** Lo comprobado es saldo por pedido y `Estado_Cobro` en la ficha. No hay evidencia de una lista «quién me debe», ordenada por saldo, con total adeudado. Sin eso, el criterio de aceptación («consultar quién le debe plata sin explicaciones») se cumple abriendo pedido por pedido.
3. **Sobrepago sin validar (réplica) y sin probar (app real).** La práctica acepta pagar más que el total y deja saldo negativo. En la app real no hay prueba de que se bloquee. Un cobro cargado dos veces o un cero de más no tiene red.
4. **Accesos.** La app tiene 2 usuarios. El Duque y Marine no están invitados: entran al login de Google y quedan afuera. Sigue en Prototype (tope de 10 usuarios del plan gratuito).
5. **Nada probado en iPhone/Safari real.** Es el dispositivo de uso. Se probó la guía a 390 px en Chromium, que no es lo mismo.

---

## 4. Problemas de usabilidad (lo que Matías no entendería)

| # | Qué ve Matías | Por qué le hace perder tiempo |
|---|---|---|
| 1 | App mitad en inglés: «PEDIDOS FORM», «Cancel», «Save», «View», «Add», «Syncing…», «Pull to sync», «Are you sure? No / Delete» | No sabe si «Save» guarda o sincroniza; la confirmación de borrado está en otro idioma |
| 2 | Fechas «oct 30, 2026» (mes en inglés, orden mes-día) | Para un argentino es ilegible y ambiguo con 10/11 |
| 3 | Importes sin moneda en la ficha («Total 500», «Pendiente 500») | Con pedidos en PESOS y USD mezclados, 500 no dice nada. Riesgo comercial real |
| 4 | Al cobrar, el saldo sigue igual unos segundos | Cree que no guardó y vuelve a cargar el pago (origen de duplicados) |
| 5 | Basura para borrar: ícono sin texto | Acción destructiva sin etiqueta, en inglés, junto al refresh |
| 6 | Cliente se elige de una lista desplegable de 16, sin buscador | Con 60 clientes se vuelve inmanejable en el celular |
| 7 | Formulario de 8 campos, con «Estado facturación» vacío y sin explicación | No sabe si es obligatorio; deja cosas vacías que la planilla espera |
| 8 | Dos apps con el mismo nombre y tres parecidas | Si alguien le manda el link viejo, cae en la copia rota |
| 9 | La guía, la chuleta y la app son tres lugares distintos | Sin ayuda dentro de la app; si se olvida, no sabe dónde mirar |

---

## 5. Mejoras prioritarias (máximo cinco, por impacto)

1. **Vista «Por cobrar»** (slice sobre Pedidos con Saldo_Pendiente > 0, ordenada de mayor a menor, con total adeudado arriba). Es lo que convierte la app en herramienta de gestión y no en planilla con otro color.
2. **Poner la app en español**: locale es-AR (fechas, textos de AppSheet, confirmaciones) y revisar que «Guardar», «Sincronizar» y «Borrar» se lean en castellano.
3. **Cerrar el circuito del dinero**: definir cantidad (campo Cantidad × Precio, o regla explícita «una fila por pieza» en la guía) y **bloquear sobrepagos** con mensaje propio.
4. **Mostrar siempre la moneda** en listas, fichas y totales; y que el saldo pendiente se vea con color/estado, no como número suelto.
5. **Prueba de aceptación en iPhone real** con el pedido `PRUEBA - no cobrar`, midiendo: entrar, alta, obra, pago parcial, reabrir, borrar; después limpiar «Casa Vidal» y los registros con fechas 2099.

Las mejoras cosméticas (tipografía, íconos, portada) no cambian ninguna de las notas de abajo.

---

## 6. Calificaciones (1–10)

| Criterio | Nota | Justificación |
|---|---|---|
| Facilidad para aprender | **7** | La guía de 29 pasos y la chuleta existen y funcionan a 390 px; pero están fuera de la app y la práctica permite avanzar sin guardar |
| Claridad visual | **6** | Formularios grandes y legibles; la mezcla español/inglés, las fechas en inglés y los importes sin moneda rompen la lectura |
| Velocidad para registrar una venta | **6** | 8 campos en el pedido + formulario aparte por obra, sin cantidad y con totales que tardan; viable, no rápido |
| Control de pagos y deudas | **6** | Saldo y estado por pedido correctos (probado 30/10); no hay vista consolidada de deudores |
| Confiabilidad de los datos | **6** | Fórmulas verificadas por lectura y un circuito real correcto; sin prueba de idempotencia, con datos 2099 mezclados y dos archivos de datos |
| Utilidad para administrar el negocio | **7** | Cubre pedidos, obras, pagos y clientes; le falta cantidad, catálogo y reportes |
| Preparación para uso cotidiano | **5** | Núcleo probado; accesos incompletos, idioma, iPhone sin probar y plan Prototype |

**¿Matías podría manejarla mañana sin capacitación ni asistencia?**
Parcialmente. Con el link y su usuario, y después de la guía, **sí puede cargar un pedido, una obra y un pago parcial** (está probado en la app real y en la réplica). **No** puede responder «¿quién me debe?» sin abrir pedido por pedido, y va a dudar cada vez que el saldo tarde en actualizarse o aparezca un cartel en inglés. Con una hora de acompañamiento y la chuleta impresa, sí; solo, la primera semana va a preguntar.

---

## 7. Veredicto

**Lista con observaciones.** El núcleo comercial está vivo y es correcto; la entrega como producto cerrado, no.

- **Para Matías (que ya la usa):** sirve hoy, con las observaciones de arriba.
- **Para el Duque o Marine (primera vez, solos):** **no** hasta resolver accesos, idioma y la vista de deuda.
- **Como «terminada»:** no. Faltan la prueba en iPhone real y el circuito de deuda consolidada.

---

## 8. Pruebas pendientes (explícitas)

1. Recorrido completo en la app real hoy (bloqueado: sin sesión de Google).
2. iPhone/Safari físico y VoiceOver.
3. Sobrepago, importe negativo y doble toque en «Guardar pago» en la app real.
4. Sincronización con Google Sheets, modo offline, conflicto entre dos dispositivos.
5. Permisos de borrado por tabla (Obras y Pagos).
6. Cobro con moneda distinta a la del pedido y redondeo del tipo de cambio.
7. Volumen: 60+ clientes, 100+ pedidos, búsqueda y tiempo de carga.
8. Vista `PIloto_Historico` / import del Excel (`STG_Pedidos_Piloto`): filas y completitud.
9. Plan y licencia para uso comercial (Prototype hoy).

---

## 9. Recomendación final

Antes de mandársela al Duque, en este orden:

1. Agregarle el usuario (Share → Use app) y hacer con él la prueba de 10 minutos del `docs/ALTA-MATI-MARINE-20261030.md`, en un iPhone real.
2. Poner la app en español y mostrar la moneda en todos los importes.
3. Crear la vista «Por cobrar» y probarla con un pedido con saldo.
4. Definir cantidad y bloquear sobrepagos; volver a correr el circuito pedido → obra → pago parcial → saldo final.
5. Recién entonces: borrar «Casa Vidal», los registros de 2099 y mandar el mail.

Si hay que entregar esta semana, se entrega **con acompañamiento y la chuleta**, no como autoservicio.

---

### Anexo: cómo se verificó

- `curl` al link de la app: `302 → /Account/Login?provider=google` (sin sesión no hay app).
- `HEAD` a las 5 rutas publicadas: 200.
- `npm test`: 4/4 verdes (lógica del simulador, no de AppSheet).
- Edge headless vía `playwright-core` (runtime local, sin instalar nada) a 390×844: recorrido de 29 pasos, alta, dos obras, tres pagos, obra negativa, sobrepago.
- Capturas reales del repo y 8 fotogramas del video de 15 s extraídos y revisados.
- Documentos: `docs/QA-APP-20261030.md`, `docs/HENRIS-QA-20261028.md`, `docs/ALTA-MATI-MARINE-20261030.md`, `ESTADO.md`.
