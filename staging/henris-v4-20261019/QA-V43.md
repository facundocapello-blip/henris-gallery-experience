# QA de la maqueta V4.3 — 19/10/2026

**Archivo probado:** `Henris_Gallery_V4_3_Validada_20261019.html` (artefacto local; aún no integrado exactamente a esta rama).

## Evidencia
- Chromium local con binario `/usr/bin/chromium` y Playwright.
- Carga exitosa con `page.set_content` en viewport móvil 390 × 844.
- Título observado: `Henris Gallery | Experiencia V4.3 · Mapeo y gestión`.
- Controles presentes: `Esenciales 29`, `Todos los campos 66`, `Pausar recorrido`, `Reiniciar`, `Registrar pago simulado`, `Confirmar pago`, `Deshacer último pago ficticio`.
- 29 campos esenciales visibles, distribuidos entre Pedidos (11), Obras / Ítems (9), Pagos (7) y Clientes (2).

## Limitación
Esta validación es de la **V4.3 local**. El HTML de esta rama GitHub es una derivación anterior V4.1 con reproducción automática; no se debe presentar como V4.3 idéntica ni como publicación pública.

## Próximos controles
1. Incorporar el archivo V4.3 exacto, con checksum de contenido.
2. QA sobre el archivo exacto de GitHub en 390 y 1280 px, incluyendo pagos y deshacer.
3. Preparar URL STAGING aislada; `main` y Pages estable no se tocan hasta revisar el plan de publicación.
4. Safari iPhone físico: pendiente.
