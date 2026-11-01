# Cambios pendientes en la app — para hacer a mano

App: `7f05d824` (`HENRIS-982559713`) · definición `1.000409` o posterior (avanza con cada guardado) · **Prototype: lo que guardes les cambia la app a Mati al instante**. No hay "publicar".
Base: `docs/AUDITORIA-MATIAS-20261031.md`.

## Antes de tocar nada (5 min)

1. En el editor: **Manage → Versions**. Anotá la versión actual (`1.000409`) y confirmá que podés restaurarla.
2. Abrí la planilla «Base de Datos Marketing y Ventas» y hacé una copia del archivo (Archivo → Hacer una copia). No es respaldo de la app, es respaldo de los datos.
3. Todo se prueba con un pedido `PRUEBA - no cobrar` y se borra al final.

---

## 1. Poner la app en español (10 min, sin riesgo)

**Dónde:** editor → engranaje **Settings** → **Localization**.
- `Locale`: **Spanish (Argentina)** — es-AR.
- `Time zone`: **America/Argentina/Buenos_Aires**.

**Por qué:** hoy la app muestra «PEDIDOS FORM», «Cancel», «Save», «View», «Add», «Syncing…», «Pull to sync», «Are you sure? No / Delete» y fechas «oct 30, 2026».

**Verificar:** abrí el alta de un pedido. La fecha tiene que leerse en castellano (ej. `30/10/2026`) y los botones decir Guardar / Cancelar / Sincronizar. Si algún texto queda en inglés, es texto propio de la vista, no del sistema: se corrige en **UX → Views** (nombre de la vista) y en el nombre de la tabla.

---

## 2. Que los importes muestren la moneda (20 min)

Hoy la ficha dice «Total 500 / Pendiente 500» sin decir si son pesos o dólares, y la app maneja pedidos en ARS y USD.

**Dónde:** **Data → Columns → Pedidos → Add Virtual Column** (tres veces):

| Nombre | Tipo | App formula |
|---|---|---|
| `Total_Moneda` | Text | `CONCATENATE([Moneda_Venta], " ", TEXT([Total_Pedido], "#.##0,00"))` |
| `Pagado_Moneda` | Text | `CONCATENATE([Moneda_Venta], " ", TEXT([Pagado], "#.##0,00"))` |
| `Saldo_Moneda` | Text | `CONCATENATE([Moneda_Venta], " ", TEXT([Saldo_Pendiente], "#.##0,00"))` |

Después, en **UX → Views → Pedidos_Detail** (y en la lista si se puede), mostrá esas columnas en lugar de los números pelados.

**Ojo:** los nombres `[Pagado]` y `[Saldo_Pendiente]` tienen que coincidir exactamente con los de tu tabla. Si no aparecen en el autocompletado, buscá el nombre real en Columns.

**Verificar:** pedido en USD tiene que decir `USD 1.200,00`; uno en ARS, `ARS 1.200,00`.

---

## 3. Vista «Por cobrar» (30 min)

Es la que responde «¿quién me debe?» sin abrir pedido por pedido.

**Dónde:** **Data → Slices → New Slice**
- Name: `Pedidos_Por_Cobrar`
- Source table: `Pedidos`
- Row filter condition: `[Saldo_Pendiente] > 0`

**Después:** **UX → Views → New View**
- For this data: `Pedidos_Por_Cobrar`
- View type: **Table** (mejor que deck para leer deuda)
- Position: **menu** (o primary, si querés que esté en la barra de abajo)
- Group by: `Cliente` → agregado **SUM** sobre `Saldo_Pendiente`
- Sort by: `Saldo_Pendiente` descendente

**Verificar:** tiene que listar solo pedidos con saldo y, agrupado por cliente, mostrar cuánto debe cada uno. Probá con el pedido `PRUEBA - no cobrar` con saldo y después con saldo cero: tiene que desaparecer de la vista.

**Límite honesto:** AppSheet no te da un «total general adeudado» en la cabecera de una lista. La suma por cliente es lo más cerca que se llega sin scripts.

---

## 4. Limpiar datos de prueba (20 min)

- Borrar el pedido de «Casa Vidal» con su ítem y su pago (hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39).
- Revisar los registros con fechas **2099** (`29/10/2099`, entrega `8/11/2099`, `21/10/2099`). Ensucian totales y balances. Antes de borrarlos, confirmá que no son parte del import histórico.
- Conteos después: Pedidos 23, Pedido_Items 37, Pagos 38.

**Verificar:** la lista de Pedidos no muestra «Casa Vidal» ni fechas de 2099.

---

## 5. Usuarios (10 min)

**Dónde:** editor → **Share → Users → Add**.
- Falta el mail del **Duque** (rol *Use app*).
- Falta el mail de **Marine**.
- Confirmá que `maticgpt@gmail.com` es el que usa Mati.

**Verificar:** cada uno entra con su Google y no ve un cartel de «no tenés acceso». Sin esto, mandarles el link no sirve.

---

## 6. Prueba en iPhone real (15 min)

Con el guion de `docs/ALTA-MATI-MARINE-20261030.md`:
entrar → alta `PRUEBA - no cobrar` en USD → obra 40×50 USD 1.200 → pago USD 500 → ver saldo 700 → cerrar y reabrir → borrar.
Anotá pasa/no pasa por paso, con hora. Es lo único que no se puede simular desde acá.

---

## 7. Decisiones de fondo (no las hagas sin definir esto)

### 7.a Cantidad por ítem — el cambio más grande

Hoy `Pedido_Items` no tiene campo Cantidad: una fila = una pieza. Para «3 láminas iguales» hay que cargar 3 filas.

Si querés cantidad:
1. Agregar columna `Cantidad` (Number, Initial value `1`, Valid If `[_THIS] > 0`) en la hoja `Pedido_Items`.
2. **Data → Tables → Pedido_Items → Regenerate** para que AppSheet vea la columna.
3. Cambiar la fórmula de la hoja que calcula el total del pedido (`Pedidos!K`), que hoy **suma solo precio**, para que sume **cantidad × precio**. Anotá la fórmula vieja antes de tocarla.
4. Verificar que `Pedidos!M` (saldo = K − L) siga cerrando.

Riesgo: toca la planilla que hoy usa el negocio. Si se hace, se hace con copia y con un pedido de prueba.

### 7.b Sobrepago

La práctica del onboarding acepta pagar más que el total y deja **saldo −3.000** sin avisar. En la app real no está probado.

Un `Valid If` en `Pagos[Importe]` **no es confiable hoy** porque el saldo lo calcula la planilla y AppSheet lo lee recién después de sincronizar: puede bloquear de más o dejar pasar.

Camino corto y seguro: columna virtual en `Pagos` que avise.

- Name: `Aviso_Saldo`, tipo Text, App formula:
  `IF([Importe] > [Pedido_ID].[Saldo_Pendiente], "Ojo: el importe supera el saldo pendiente", "")`
- Mostrala en el formulario y en la ficha del pago.

Camino completo: mover Total/Pagado/Saldo de fórmulas de la hoja a **columnas virtuales de AppSheet** (`SUM(SELECT(...))`). Ahí el saldo se recalcula al instante, desaparece la demora de «cobré y sigue pendiente», y el `Valid If` funciona. Es más trabajo y la planilla queda con números viejos si alguien la mira directo.

### 7.c Demora del saldo

Mismo origen que 7.b. Si no se mueve a columnas virtuales, la guía tiene que decir «esperá unos segundos o tocá Sync» y el riesgo de cargar el pago dos veces sigue.

---

## Orden recomendado

Hoy, sin riesgo: **1 (idioma) → 2 (moneda) → 3 (Por cobrar) → 4 (limpiar) → 5 (usuarios) → 6 (iPhone)**.
Después, con decisión: **7.a** y **7.b/7.c** juntos, porque comparten la misma fórmula.

## Qué NO cambiar

- No tocar `3300a579` (la copia rota): se archiva o se ignora.
- No borrar `PIloto_Historico` sin haber contado sus filas (sigue pendiente).
- No mover Obras al archivo principal sin decidir antes: hoy Obras vive en otro Google Sheet.
- No cambiar la fórmula de la hoja sin copia y sin anotar la anterior.
