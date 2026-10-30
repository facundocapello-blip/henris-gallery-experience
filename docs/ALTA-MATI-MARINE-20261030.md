# Alta de Mati y Marine en la app — checklist

Fecha: 2026-10-30 · App: `3300a579-5a49-4738-98f5-19979e4952e4` · Definición: `1.000044` · Estado: **Prototype**

Esto es lo que falta para que el onboarding deje de ser una promesa y pase a ser una prueba real.
Ningún paso de acá modifica datos de clientes: se prueba con un pedido de ejemplo y se borra.

---

## 0. Lo que necesito de vos antes de tocar nada

| Dato | Para qué |
|---|---|
| Correo Google de Mati | Compartir la app; el login es obligatorio |
| Correo Google de Marine | Idem |
| ¿Las dos van a **cargar** o una solo **consulta**? | Define el rol: usuario o solo lectura |
| ¿Quién más va a usarla este mes? | El plan gratuito de prototipo permite hasta 10 usuarios activos, contando al dueño |

Sin los dos correos no hay nada que probar: la app hoy tiene **0 usuarios** además del propietario.

---

## 1. Antes de compartir (5 controles, 10 minutos)

1. **Entorno correcto.** Abrir la app en el editor y confirmar a qué hoja escribe. La trampa conocida:
   «Henris Gallery» no distingue entorno y el interno se llama `HenrisGallery·STAGINGE2E-982559713`.
   Si la app apunta a STAGING, no se comparte: primero se corrige.
2. **Formulario vigente.** Comparar el alta de pedido con las capturas del 28/10 que usa la guía.
   Si cambió un campo, la guía miente y hay que actualizarla antes de mandarla.
3. **Permisos de tabla.** Confirmar que Obras y Pagos no permiten borrar registros desde la app.
4. **Datos de prueba.** El pedido de prueba se marca como `PRUEBA - no cobrar` en el cliente o en la
   descripción. Así no se confunde con trabajo real.
5. **Plan.** El prototipo gratuito alcanza para la prueba con dos personas. Para uso comercial
   (clientes reales, todos los días) hay que decidir plan; no se decide en esta prueba.

---

## 2. Compartir (ruta general, a confirmar en la cuenta)

En el editor de AppSheet: **app → Share → Users** (o «Share app»), agregar los dos correos y asignar
rol. La ubicación exacta del menú puede variar según la versión; se confirma en pantalla antes de
tocar. No se cambia nada más de la app en este paso.

**Rollback:** si algo sale mal, se quita el usuario de la misma pantalla. No hace falta despublicar.

---

## 3. Guion de prueba (una sola sesión, 10 minutos)

Cada punto se anota **pasa / no pasa** con la hora. Si algo falla, se corta ahí: no se sigue.

| # | Qué hace la persona | Resultado esperado | ✓ |
|---|---|---|---|
| 1 | Abre el link en el iPhone y entra con su Google | Entra sin pedir permiso ni aprobación | |
| 2 | Crea un pedido `PRUEBA - no cobrar` con moneda USD | Aparece en la lista de Pedidos | |
| 3 | Le agrega una obra: 40×50 cm, USD 1.200 | El total del pedido pasa a USD 1.200 | |
| 4 | Registra un pago de USD 500 por transferencia | Pagado USD 500 y **saldo USD 700** | |
| 5 | Cierra la app, la vuelve a abrir | El pedido y el saldo siguen igual | |
| 6 | Desde la guía, hace el recorrido de práctica | No se guarda nada en la app real | |
| 7 | Borra el pedido de prueba (si tiene permiso) | La lista queda como estaba | |

**Criterio de aceptación:** 1 a 5 en verde. El 6 y el 7 son deseables, no bloqueantes.

---

## 4. Mensaje listo para mandarles

> Hola. Ya está la guía: https://facundocapello-blip.github.io/henris-gallery-experience/staging/onboarding-20261031/
>
> Antes de entrar a la app, hacé el recorrido de la guía: son 8 minutos y usa datos inventados, así
> no se toca nada real. Cuando termines, te comparto el acceso con tu correo de Google.
> Si algo no se entiende, anotalo y me lo decís: eso también es parte de la prueba.

---

## 5. Qué se registra al terminar

- Fecha, quién entró, qué dispositivo y navegador.
- Resultado de los 7 puntos.
- Capturas solo si hay un fallo (sirven para reproducirlo).
- Si falla: qué paso, qué se esperaba y qué pasó. Eso se anota en `PROJECT_STATUS.md`, no en un chat.

---

## Límites de esta prueba

- No se toca AppSheet producción ni STAGING sin tarea y permiso explícito.
- No se cargan datos de clientes reales en la prueba.
- Safari físico y VoiceOver solo quedan verificados si alguien los prueba en un iPhone real: no se
  pueden simular desde acá.
