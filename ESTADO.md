# Henris Gallery — estado
Actualizado: 2026-10-30 (verificado con git, gh, curl y Chromium)

## Publicado
- Base https://facundocapello-blip.github.io/henris-gallery-experience/ — rama `main`, HEAD `88c53ca`, árbol limpio; `git ls-remote` coincide con origin/main.
- `/staging/onboarding-20261031/` — HTTP 200 (index y `chuleta.html`), consola limpia, un H1, sin desborde horizontal.
- `/staging/guia-operativa-candidata/` — HTTP 200, consola limpia, un H1, iframe de AppSheet con carga diferida.
- `/staging/guia-visual-prueba-20261029/` — HTTP 200, consola limpia.
- `/staging/henris-gemini-fusion-20261020/` — HTTP 200; snapshot congelado `dddcb2c` con el link repuntado en el deploy por `sed`.
- App `7f05d824` (`HENRIS-982559713`), def. `1.000409`, Prototype; usuarios `facu.capello@hotmail.com` y `maticgpt@gmail.com`. Las cuatro webs apuntan ahí (0 referencias a `3300a579`).

## Abierto
- Prueba funcional de la app (pedido → obra → pago → saldo → reabrir): **no hecha**. Se perdió la sesión del navegador antes de cargar el formulario; hay que entrar con la cuenta del dueño y borrar el registro `PRUEBA`.
- Marine: falta su correo (lo maneja Facundo) y definir si carga o solo consulta.
- Sin verificar: Safari/iPhone real, VoiceOver y `prefers-reduced-motion` con la preferencia del sistema.
- Capturas de la guía (28/10) sin comparar contra el formulario vigente de `7f05d824`.
- La copia `3300a579` sigue existiendo: archivar cuando Facundo lo decida.

## Trampas
- Dos apps «Henris Gallery»: la buena es `7f05d824`; `3300a579` es la copia `STAGINGE2E` (0 usuarios, alta de pedido rota).
- En `3300a579`, «+ Nuevo pedido» va a `Pedidos_Form`, que no abre; «Editar» cae en el formulario de `Inicio_Schema`. El panel del dashboard ya se había quitado en `1.000041`.
- Datos de la app buena en dos archivos: Pedidos/Pagos/Clientes en «Base de Datos Marketing y Ventas»; Obras en «Base AppSheet».
- Pages cachea: verificar run y URL con `?v=`. `noindex` no es control de acceso.
- El navegador del entorno perdió la sesión al reiniciarse el server: hay que rehacer el login de AppSheet. Imágenes lazy en `data:` dan `naturalWidth 0` hasta scrollear; no están rotas.
