# Validación de Henris Gallery Experience v1.0

Validación ejecutada el **15 de octubre de 2026** en el entorno cloud. Node.js 24.19.0, npm 11.9.0, Playwright 1.61.1 y Chromium del sistema. Todas las comprobaciones utilizaron datos ficticios.

## Resultados

| Comando o comprobación | Resultado observado |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` | Instalación reproducible desde lockfile, 3 paquetes de desarrollo. |
| `npm start` | Servidor iniciado en puerto 4173. |
| Solicitud HTTP de la página y del PNG de la mascota | HTTP 200. |
| `npm test` | 4 pruebas de lógica aprobadas, ninguna omitida ni fallida. |
| `npm run test:e2e` | 12 pruebas aprobadas: 6 escenarios en escritorio y los mismos 6 a 390 px; ninguna omitida ni fallida. |
| `node --check` sobre aplicación, dominio y servidor | Sin errores de sintaxis. |
| `git diff --check` | Sin errores de espacios en los archivos seguidos por Git. |

## Comportamiento verificado

1. Recorrido: contexto, transformación, mapeo, simulador y resultado; retroceso, avance, salida y reinicio. Navegación libre por las secciones.
2. Animación: copias visibles de valores, pausa sin avance, continuación hasta el cuarto paso, repetición y omisión. Preferencia de movimiento reducido y control manual sin animación.
3. Mapeo: las 19 claves seleccionan su destino; existe un único destino de campo seleccionado por vez. Las filas de otros pedidos son contexto estático: no se vincula el cliente de HG-002 con el de HG-001. Se explican las dos ramas del pedido y sus referencias.
4. Pedido con dos obras: 1 × $80.000 y 2 × $35.000 = $150.000. Pago de $50.000 → saldo $100.000 / Parcial. Pago final de $100.000 → saldo $0 / Pagado.
5. Rechazo de nombre vacío, obra vacía, cantidades cero/negativas/fraccionarias/no finitas, importes cero/negativos/no finitos/con más de dos decimales y sobrepagos.
6. Centavos: 3 × $0,10 y pago de $0,30 dejan saldo exactamente cero. Se admite coma o punto decimal sin separadores de miles.
7. Recarga: pedido, pagos, saldo, canal y estado operativo conservados. Reinicio con cancelación o borrado explícito, comprobado tras otra recarga.
8. Recuperación ante almacenamiento corrupto: aviso y nueva demo utilizable. Texto con etiquetas HTML se muestra como texto; no genera elementos ejecutables.
9. Separación entre estados: un pedido de Instagram/WhatsApp puede estar En producción y Pagado al mismo tiempo. Pagar no cambia el estado operativo.
10. Teclado: enlace para saltar al contenido, tabulación de formularios, envío de pedido y pago con Enter, apertura de reinicio y cierre con Escape. Foco visible definido en los controles.
11. Diseño: sin desbordamiento horizontal en las cinco vistas, tanto a 1440 × 1000 como a 390 × 844. Capturas completas revisadas visualmente; mascota en el flujo del documento, sin superposición fija sobre controles.
12. Consola: sin errores de JavaScript ni errores de consola durante el escenario de navegación y layout.

## Evidencia y reproducción

Las suites están en `tests/domain.test.js` y `tests/experience.spec.js`. Playwright genera capturas completas de inicio y simulador en `test-results/`; una captura es evidencia visual, no un enlace público. Los artefactos de pruebas se ignoran en Git. En caso de fallo, Playwright conserva una traza.

El repositorio inicial carecía de aplicación y suites. Esta entrega incorpora implementación y pruebas nuevas. No se modificaron `CODEX_TASK.md` ni fuentes externas.

## Límites comprobables

- La prueba móvil usa **Chromium con viewport de 390 px**, no Safari de iOS ni un iPhone físico. No se afirma compatibilidad certificada con Safari; queda recomendada una revisión en dispositivo real.
- El Canvas completo se revisó visualmente porque sus nueve páginas son imágenes. No se accedió a AppSheet, producción, STAGING ni planillas; no se verificaron errores de un Excel real.
- La capa de mapeo explica datos de catálogo y cliente más amplios que el formulario mínimo del simulador. El detalle de esta diferencia está en `CANVAS.md`.
- La persistencia es de un navegador, no multiusuario; no hay sincronización, autenticación, facturación ni inventario productivo. La simulación no equivale a una herramienta contable.
- Se ejecutó el servidor interno. La interfaz de onboarding no ofrece publicación ni enlace de vista previa web; **no se publicó un sitio público**. Publicar archivos estáticos es un paso posterior.
- Los avisos de Playwright sobre `NO_COLOR`/`FORCE_COLOR` solo afectan la salida coloreada del runner y no produjeron fallos de pruebas.
