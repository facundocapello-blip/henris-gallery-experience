# Henris Gallery Experience v1.0

## Objetivo
Construir y ejecutar una web responsive en español para iPhone y PC: recorrido guiado y modo libre sobre pedidos, obras, pagos y saldos. El repositorio fue creado para esta demo y inicialmente solo contiene README.md. No asumir que existe código de un simulador anterior.

## Fuentes y recursos
- Operational Canvas original (9 páginas según el usuario): https://drive.google.com/file/d/18mnczq__Hmtwd6Vlneiktlg1McPS-_Df/view
- El usuario adjuntó en el chat su mascota real: una lámina con cuatro poses del mismo personaje 3D, ropa negra y cabello oscuro con mechón blanco (micrófono, auriculares/saludo, preocupación y celebración). Usar la imagen adjunta; la descripción NO autoriza a generar un reemplazo. La imagen todavía no está guardada en este repositorio.
- Buscar primero archivos del simulador en el workspace y adjuntos. Reutilizarlos si aparecen. Si no aparecen, indicar en documentación que se trata de una reconstrucción.
- Leer el Canvas adjunto antes de afirmar fidelidad a sus nueve páginas. Si falta acceso, avanzar con el simulador provisional y documentar esa limitación.

## Funcionalidad
- Inicio con acceso a recorrido guiado y modo libre.
- Crear pedidos demo con cliente ficticio y una o varias obras, cantidad y precio.
- Total calculado como suma de cantidad por precio de los ítems.
- Pagos parciales asociados a cada pedido; saldo = total menos suma de pagos.
- Validar importes finitos y positivos, cantidades enteras positivas, campos obligatorios y pagos que excedan el saldo.
- Mostrar estados pendiente, pago parcial y pagado según el saldo.
- Navegación entre resumen, pedidos, obras y pagos; detalle por pedido.
- Recorrido con avanzar, retroceder, salir y volver a iniciar; explicar cada etapa con la mascota real.
- Si se añade voz, debe ser opcional, activada por un botón y con texto equivalente visible. No afirmar que es la voz del usuario.
- Persistencia local con recuperación ante datos inválidos y opción explícita para reiniciar la demo.
- Renderizar texto de formularios de forma segura; evitar innerHTML con entradas del usuario.
- Diseño cómodo en 390 px y escritorio, sin desbordamiento horizontal, con etiquetas y foco visibles.

## Límites
Solo datos ficticios. No leer, conectar ni modificar AppSheet STAGING o producción ni sus planillas. No añadir credenciales ni APIs a la demo. No inventar una mascota ni afirmar que se probó o publicó algo sin evidencia.

## Entrega y pruebas
Implementar la app, instalar lo necesario y ejecutarla. Preferir una solución sencilla compatible con hosting estático. Probar en navegador escritorio y móvil: navegación, recorrido completo, creación de pedido con dos obras, pago parcial, cancelación del saldo, rechazo de valores inválidos/sobrepago, persistencia y reinicio. Verificar teclado y consola. Documentar comandos, resultados reales y pendientes. Preparar vista previa web si el entorno lo permite; distinguir vista previa local de un enlace público. Avanzar sin pedir confirmaciones rutinarias.
