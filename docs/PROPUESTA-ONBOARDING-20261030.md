# Henris Gallery — propuesta de onboarding y motion
Fecha: 2026-10-30 · Base analizada: `staging/guia-operativa-candidata/index.html` (`fdece1d`, 865 líneas, 73 KB)
Estado: **propuesta, sin implementar**.

---

## 0. Condición que define el diseño

La app real vive en un `iframe` de **otro origen** (`appsheet.com`) y exige login con Google autorizado.
Consecuencia: **no se puede resaltar ni leer la interfaz real**. Cualquier "recorrido sobre la app" se hace
sobre una **réplica fiel en HTML/CSS** con datos de ejemplo, rotulada como tal, y las capturas reales
quedan como referencia. Practicar se practica en la réplica: nunca se escribe en la app ni en la planilla.

---

## 1. Diagnóstico: dónde se pierde alguien que viene de Excel

| # | Problema | Evidencia en el archivo | Por qué duele a este usuario |
|---|---|---|---|
| 1 | Niega el objetivo antes de mostrarlo | Línea 375: «falta agregar y probar las cuentas de Mati y Marine antes de compartir la guía» | Es lo primero que lee un cliente. Comunica obra en construcción y desconfianza. |
| 2 | Ocho botones que llevan al mismo lado | «Abrir AppSheet» aparece en nav, hero, camino 2, banner de acceso (x2), fallback, FAB flotante y sección «Operar» | Ante ocho salidas iguales, elige la más grande y se va: abandona la guía. |
| 3 | Decide antes de entender | «Elegí cómo empezar» (línea 400) con dos caminos | Le pide una decisión de navegación cuando todavía no sabe qué gana con la app. |
| 4 | El paso a paso es texto, no demostración | Pasos 1–4 (líneas 638–687): tres frases por paso | Viene de Excel: entiende viendo la celda, no leyendo «cabecera» o «ítems relacionados». |
| 5 | Lenguaje que supone oficio | «cabecera», «ítems relacionados», «campos consolidados», «conciliación comercial», «acción manual» | Son términos de sistema, no de mostrador. No sabe qué tocar. |
| 6 | Promesas condicionales | «si está disponible», «según los campos disponibles», «de acuerdo con» (x6) | Le avisa que puede fallar. Refuerza la desconfianza que ya traía. |
| 7 | Tipografía de contrato | 9 px (9 veces), 10 px (18), 11 px (23) | A 11 px, un dueño de 55 años no lee; hace zoom o cierra. |
| 8 | El panel derecho no muestra la app | Banner de login + tres avisos de fallback (líneas 504–525) | Ocupa media pantalla para decir «no se ve». El espacio más valioso gastado en excusas. |
| 9 | Sección técnica con el mismo peso visual | «Diccionario y mapeo de 66 campos» (líneas 529–607) | El dueño no mapea columnas: eso es tarea de quien administra. Lo asusta. |
| 10 | Cierre que repite | Sección «Trabajar en Henris Gallery» (612–623) | Un párrafo más y dos botones que ya existían. No agrega información, sí ruido. |
| 11 | Sin puente desde Excel | Solo el título del `<details>` menciona «Excel histórico» | Nunca le traduce: columna = campo, fila = registro, 4 hojas = 4 tablas. Ese es el miedo central. |
| 12 | Sin señal de progreso real | «1 / 4» y nada más | No sabe cuánto falta ni puede retomar donde quedó. |

---

## 2. Nuevo flujo y estructura del paso a paso

### 2.1 Orden nuevo de la página (motivo en una frase)

1. **Hero con la promesa y una sola salida** — *un solo CTA primario elimina la parálisis de elegir.*
2. **«Lo que ya hacés, ahora en un solo lugar»** (3 comparaciones Excel → app) — *traduce el valor al idioma que ya domina.*
3. **Recorrido guiado de 5 módulos** — *aprende haciendo sobre réplica, no leyendo.*
4. **Chuleta de 4 pasos** (referencia escrita imprimible) — *lo que vuelve a consultar cuando ya sabe.*
5. **Para quien administra** (mapeo 66 campos, colapsado, al final) — *saca del camino lo que no es para el dueño.*
6. **Pie con un solo enlace a la app.**

Se elimina: el selector de dos caminos, la sección «Operar» duplicada, el FAB flotante y los tres avisos
de fallback (quedan dos, integrados en el paso donde importan).

### 2.2 Módulos del recorrido guiado

| Módulo | Qué resuelve | Duración objetivo | Modo | Por qué |
|---|---|---|---|---|
| M0 · Qué es esto | «No es otra planilla: es un pedido con sus obras y sus pagos» | 40 s | Mostrar | Es contexto, no una tarea: se explica y se sigue. |
| M1 · Crear un pedido | Dónde empieza todo: cliente + moneda + guardar | 90 s | **Practicar** | Lo repite todos los días; hacerlo una vez con datos falsos fija el gesto. |
| M2a · Agregar una obra | Qué es un ítem y dónde vive | 60 s | Mostrar | Es una relación entre tablas: primero hay que entenderla, no tipearla. |
| M2b · Cargar medidas y precio | Medidas, unidad, precio, terminación | 2 min | **Practicar** | Es el reemplazo directo de las columnas del Excel: ahí está la fricción real. |
| M3 · Registrar un pago | Seña o cobro parcial, medio y receptor | 2 min | **Practicar** | Toca plata: practicar sin riesgo baja la desconfianza mejor que cualquier texto. |
| M4 · Consultar el saldo | Total, pagado, saldo, estado | 45 s | Mostrar | Es solo lectura: no hay nada que practicar. |
| M5 · Del Excel a la app | Columna→campo, fila→registro, 4 hojas→4 tablas | 60 s | Mostrar | Es un cambio mental, no una acción: se muestra con una animación. |

**Total primera vez: ~8 min**, con salida en cualquier paso y reanudación guardada. Cada módulo tiene
botón «Saltar este módulo» y el recorrido entero se puede cortar con `Esc`.

### 2.3 Formatos complementarios

- **Recorrido interactivo** — primera visita, 5 módulos, réplica de la app.
- **Chuleta de 4 pasos** — una A4 imprimible, un verbo por paso, sin jerga. Para tener al lado.
- **Animaciones cortas (2–6 s)** — solo donde hay secuencia: alta → obra → pago → saldo, y el saldo que
  se recalcula.
- **Sin video** en la v1: un MP4 mudo de 20 s suma 1–2 MB y no supera a la animación para estos pasos.
  Si más adelante se pide, va como `<video muted playsinline>` opcional, sin autoplay.

---

## 3. Motion graphics propuestos

Todos: sin audio, con pausa, y con estado final estático bajo `prefers-reduced-motion`.

| # | Qué muestra | Dónde | Duración | Disparo | Tecnología |
|---|---|---|---|---|---|
| A1 | Pedido → Obras → Pagos → Saldo: la línea se dibuja y cada nodo se enciende | Hero | 5 s | Automático, una vez | SVG `stroke-dashoffset` + CSS |
| A2 | Una fila de Excel se convierte en un registro con etiquetas | M5 | 4 s | Al entrar en el módulo | WAAPI (`transform`, `opacity`) |
| A3 | `Total − Pagado = Saldo`: la cuenta se arma término por término | M3 → M4 | 3,5 s | Al abrir M4, con botón «Repetir» | WAAPI |
| A4 | La lista de obras aparece escalonada (60 ms entre filas) | M2a | 1 s | Primera vez del módulo | CSS `animation-delay` |
| A5 | Campo que toca completar: anillo que late | Práctica M1–M3 | 1,2 s por campo | Por interacción, no auto | CSS `box-shadow` + SVG overlay |
| A6 | Confirmación de guardado: tilde que se dibuja | Práctica M1–M3 | 0,8 s | Tras «Guardar» del ejemplo | SVG `stroke-dashoffset` |
| A7 | Saldo que baja al registrar un pago (número + barra) | Práctica M3 | 2 s | Tras guardar el pago ejemplo | WAAPI sobre CSS custom property |
| A8 | Barra de progreso del recorrido | Fijo arriba | Continuo | Navegación | CSS `width` |

Límites: nunca más de una animación simultánea en pantalla; solo `transform` y `opacity` (o
`stroke-dashoffset`), nada que fuerce layout; tope de 5 s por pieza; se pausan al salir del viewport
(`IntersectionObserver`) y con `visibilitychange`.

---

## 4. Especificación de implementación (vanilla)

### 4.1 Archivos

```
staging/guia-operativa-candidata/
  index.html      (se reordena; sigue autocontenido en CSS base)
  tour.css        (+ ~6 KB)  estilos del recorrido, la réplica y las animaciones
  tour.js         (+ ~9 KB)  motor del recorrido + práctica + motion
  chuleta.html    (+ ~4 KB)  referencia imprimible de 4 pasos
```

`.github/workflows/pages.yml` debe copiar esos tres archivos además del `index.html`
(hoy copia solo `index.html`, línea del paso «Include editorial guide candidate»).

### 4.2 Modelo de datos del recorrido

```js
const TOUR = {
  version: 1,
  modules: [
    { id: "m1", title: "Crear un pedido", goal: "Dejá un pedido guardado",
      duration: 90, mode: "practice", motion: ["A5", "A6"],
      steps: [
        { anchor: "[data-tour=pedidos]", title: "Entrá en Pedidos",
          text: "Es la tabla central: cada fila es un pedido.",
          placement: "bottom" },
        { anchor: "[data-tour=nuevo-pedido]", title: "Tocá «Nuevo»",
          text: "Abre el formulario en blanco.", placement: "right" },
        { anchor: "[data-tour=campo-cliente]", title: "Elegí el cliente",
          text: "Antes lo escribías en la columna CLIENTE.",
          practice: { field: "cliente", validate: "required" } }
      ] }
  ]
};
```

### 4.3 Motor (API mínima)

```js
Tour.start("m1")   // abre el módulo; si hay progreso guardado, ofrece retomar
Tour.next() / Tour.prev() / Tour.goto(i)
Tour.skipModule()  // salta el módulo actual
Tour.exit()        // cierra todo y guarda progreso
Tour.pauseMotion() // congela animaciones (también con prefers-reduced-motion)
```

Reglas del motor:
- Posiciona el foco con `getBoundingClientRect()` y reposiciona con `ResizeObserver` + `scroll`.
- Contenedor de la capa con `pointer-events: none`; solo el globo y el anillo los reciben.
- Persistencia en `localStorage["henris.tour.v1"]` = `{ moduleID, stepIndex, done: [] }`.
- Sin JS: la réplica y la chuleta se ven completas y estáticas; el recorrido no arranca (no rompe nada).

### 4.4 Práctica sin riesgo

- Los formularios de práctica viven en la réplica y **no hacen red**: al «Guardar» solo actualizan
  estado en memoria y disparan A6/A7.
- Aviso fijo, una línea, encima del formulario: «Datos de ejemplo. No se guarda nada en la app real.»
- Validación mínima: requeridos + número en medidas/precio; error en texto, no solo en rojo.

### 4.5 Accesibilidad

- Contraste mínimo 4,5:1; se suben todos los textos de 9–11 px a 13 px como piso.
- El globo del recorrido es `role="dialog"` con `aria-labelledby`, `aria-describedby` y trampa de foco
  mientras está abierto; `Esc` cierra; `←/→` navega; `Enter` avanza.
- Anuncio de cada paso en una región `aria-live="polite"` fuera de foco.
- El progreso se comunica con texto (`Paso 2 de 9 · módulo 1 de 5`), no solo con la barra.
- `prefers-reduced-motion: reduce` → todas las piezas (A1–A7) saltan al último cuadro; A5/A6 quedan como
  cambio de color y texto, sin pulso.
- Ningún dato se transmite solo por movimiento: cada animación tiene su equivalente escrito.

### 4.6 Rendimiento

- Sin dependencias. Presupuesto real medido al implementar: `tour.css` + `tour.js` = **47,7 KB sin comprimir y 12,6 KB gzip** (el borrador estimaba 15 KB sin comprimir: quedó corto). La página completa —HTML + CSS + JS— son **17,9 KB gzip**, contra los 73 KB del HTML único de la candidata.
- `loading="lazy"` sigue en el iframe; el recorrido no lo toca ni lo instancia.
- Las animaciones se cancelan fuera de viewport; `content-visibility: auto` en la sección de mapeo.

### 4.7 Criterios de aceptación

1. Un usuario nuevo completa M1 sin leer más de 12 palabras por paso.
2. Teclado solo: recorre los 5 módulos, practica y sale con `Esc`.
3. Con movimiento reducido: mismo contenido, sin animación, sin pérdida de información.
4. 320 px y 1440 px: sin desborde horizontal; el globo nunca tapa el campo que señala.
5. Lighthouse accesibilidad ≥ 95 en la URL publicada.
6. La app real sigue sin tocarse: cero requests de escritura; el iframe solo se carga si se pide.

### 4.8 Esfuerzo estimado

Réplica + motor + 5 módulos + 8 piezas de motion + chuleta + workflow: **2 sesiones de trabajo**,
con entrega en una ruta nueva (`/staging/onboarding-20261031/`) para no tocar la candidata actual.
