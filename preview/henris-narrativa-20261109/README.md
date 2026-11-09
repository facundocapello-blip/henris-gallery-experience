# Presentación narrativa — 2026-11-09

Candidata devuelta por Gemini Argo para reemplazar la guía por pasos. Muestra la historia de un
pedido ficticio: entra el pedido, se suma el enmarcado ($100), se registra un pago parcial ($40),
se consulta el saldo ($60) y todo queda reunido en la ficha.

- **Ruta publicada:** `/staging/henris-narrativa-20261109/`
- **Archivo:** `index.html` único y autónomo, sin recursos externos.
- **Origen:** `henris-gallery-narrative-presentation.zip` (React + Vite + Tailwind con
  `vite-plugin-singlefile`), compilado con Node 24 / Vite 7.3.2.
- **App enlazada:** `7f05d824-ccdc-4dc7-ad55-8a43f7739d0b` (la correcta).

## Diferencia contra el ZIP original

Se cambió el token de texto atenuado `#787067` por `#6F675E` en los seis archivos que lo usaban.
Motivo: `#787067` daba 4.06:1 sobre `#EFEAE1` y 4.44:1 sobre `#F7F4EE`, por debajo de AA para
texto normal en el pie y en los rótulos chicos. Con `#6F675E` el mínimo pasa a 4.64:1. También se
quitó la opacidad del placeholder del textarea. No se tocó copy, estructura ni comportamiento.

## Cómo regenerar

1. Descomprimir el ZIP en una carpeta fuera del repo.
2. Aplicar el cambio de token si se parte del original.
3. `npm ci && npm run build`
4. Copiar `dist/index.html` acá.

## Verificación hecha

- `npm run build` deja **un solo** `dist/index.html` (273.658 bytes), sin `<script src>` ni
  `<link rel="stylesheet">`.
- Recorrido de las cinco escenas con clic: la ficha acumula $100, $40 y $60; sin errores de consola.
- Flechas ← y → cambian de escena; foco visible con contorno de 2.5 px.
- A 386 px de ancho no hay desborde horizontal de la página; la línea de tiempo se desplaza
  dentro de su propio contenedor (540 px de contenido en 339 px visibles).
- `prefers-reduced-motion` y el interruptor manual de animaciones están implementados.
- `node --test tests/narrativa-20261109.test.js` en verde.
- Pendiente: Safari/iPhone real y lector de pantalla.

## Rollback

Borrar esta carpeta y su paso en `.github/workflows/pages.yml`. La guía anterior
(`/staging/guia-visual-prueba-20261029/`) y la propuesta del 6/11 no se tocan.
