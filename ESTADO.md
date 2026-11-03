# ESTADO — HENRIS GALLERY

Actualizado: 2026-11-02 (verificado con git, curl y Chrome/CDP)

## Publicado
- Página: https://facundocapello-blip.github.io/henris-gallery-experience/staging/henris-web-20261031/ — 200, **8.022 bytes**, SHA-256 `7a129ff5…` igual al local. Repo `main` = `origin/main` en `bb2a0ad`, árbol limpio.
- **Rota desde `7002664` (01/11)**: falta un `}` en `index.html` línea 160 → `SyntaxError: Unexpected token ')'` y no corre el único `<script>`. El botón de play no hace nada: no arranca el video ni se iluminan los pasos. Verificado en vivo el 02/11.
- Resto del sitio 200: `henris-ad-20261031`, `demo-20261031` (archivado), `onboarding-20261031`, `guia-visual-prueba-20261029`, `mapeo-v1`, `mapeo-campos-pedidos`.
- App AppSheet `7f05d824` (`HENRIS-982559713`): sign-in con Google, 2 usuarios (facu edita, maticgpt usa); barra inferior arreglada el 30/10; `Pagos.Facturado` y `Pagos.Conciliado_Contabilidad` con INITIAL VALUE `"NO"` desde el 31/10.

## Abierto
- **Prioridad**: cerrar el `}` de la línea 160, republicar y reverificar consola + play en vivo.
- Sin probar en Safari/iPhone real ni con VoiceOver.
- Marine sin usuario. Datos de prueba de «Casa Vidal» sin borrar (decisión de Facundo).
- `PIloto_Historico` sin contar filas ni validar el import. Auditoría 31/10: falta campo Cantidad, no hay vista consolidada de deudores y el onboarding acepta sobrepagos.
- Mail con pasos enviado el 31/10 12:07; texto en `docs/PROXIMOS-PASOS.md` y `docs/MAIL-DUQUE.md`.

## Trampas
- Dos apps homónimas: la buena es `7f05d824`; `3300a579` tiene rota el alta de pedido.
- Pages cachea: verificar por SHA-256 del HTML, nunca por «deploy success».
- AppSheet ignora clics y tipeo simulados: el QA de `Comentarios` fue falso positivo.
- Un `SyntaxError` en un `<script>` deja la página sin interacción y **el HTTP sigue en 200**: hay que mirar la consola, no solo el status.
- La lista de Pedidos y el video muestran clientes reales: recortar antes de publicar afuera.
