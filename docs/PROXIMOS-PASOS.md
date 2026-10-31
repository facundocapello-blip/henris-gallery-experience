# Henris Gallery — pasos a seguir

Actualizado: 2026-10-31. Estado de partida: `main` = `origin/main` en `f85a25a`, árbol limpio.

## Dónde está todo

- Página con el video: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/
- App: https://www.appsheet.com/start/7f05d824-ccdc-4dc7-ad55-8a43f7739d0b
- Mapa desde el Excel: https://facundocapello-blip.github.io/henris-gallery-experience/mapeo-v1/
- Mapeo campo por campo: https://facundocapello-blip.github.io/henris-gallery-experience/mapeo-campos-pedidos/

## Pasos, en orden

1. **Agregar al Duque.** En el editor de AppSheet → botón *share* → *Add users* → su mail de Google → rol **Use app** → *Done* → **SAVE**. La app tiene el sign-in restringido: sin este paso entra y le dice que no tiene acceso.
2. **Mandarle el mail.** Texto ya redactado en esta carpeta (`MAIL-DUQUE.md`). Primero el link de la página (abre sin login), después el link de la app.
3. **Probar en un iPhone real**, en Safari, y pasar VoiceOver. Nunca se hizo y es lo único que puede fallar en vivo.
4. **Decidir si la página sale del círculo.** Si va a gente de afuera, tapar en el video el cliente «Casa Vidal» y el nombre del pago antes de compartirla.
5. **Borrar los datos de prueba**: cliente «Casa Vidal», 1 pedido, 1 ítem y 1 pago (hoy Clientes 16, Pedidos 24, Pedido_Items 38, Pagos 39). A mano: AppSheet no acepta clics simulados.
6. **Usuario de Marine** cuando esté su mail.
7. **Revisar la vista «Histórico · revisión»** (`PIloto_Historico`, sobre `STG_Pedidos_Piloto`): contar filas y confirmar que el import del Excel está completo.

## Lo que ya está cerrado

- Página publicada y verificada (SHA-256 igual al local, consola sin errores, video cargando).
- Alta de pedidos con el «+» arreglada (30/10).
- `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` con valor inicial `"NO"` (31/10, verificado tras recargar).
- `Comentarios` descartado como error: la columna está bien.
- Guion de 4 minutos archivado: no se publica.
