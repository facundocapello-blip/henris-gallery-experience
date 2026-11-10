# Codex — Henris Gallery Experience

- Antes de editar leer README.md, CODEX_TASK.md, docs/ y el código vigente. Verificar rama, diff y URL desplegada.
- Esta web es una **demo con datos ficticios**, no AppSheet real. No conectar ni modificar AppSheet producción, STAGING ni Google Sheets sin tarea y permisos explícitos.
- Mantener el flujo pedidos → obras/ítems → pagos → saldo, ejemplos y trazabilidad de mapeo.
- Priorizar interfaz minimalista profesional, planilla representada como UI (no Excel crudo), animaciones de flujo sobrias y mascotita original. Respetar decisiones aprobadas.
- Hacer cambios incrementales; no rehacer desde cero ni perder funciones ya validadas.
- Publicar cada iteración de prueba en hosting gratuito HTTPS y entregar URL; preservar rollback. Verificar despliegue y pruebas posibles; Safari real queda pendiente si no hay dispositivo.
- Registrar cambios comprobados en PROJECT_STATUS.md sin inventar pruebas.

---

## Skills y plugins recomendados en DeepSeek Harness

Mapa curado para este proyecto. Las skills se cargan con la herramienta `skill`;
los plugins ya están instalados en el perfil de DSH.

**Skills**

- `impeccable` — Presentaciones y UI de la propuesta: jerarquía, tipografía, motion.
- `figma` — Traer referencias visuales de Figma cuando el cliente las pase.
- `diagram-design` — Diagramas de flujo del proceso de venta.
- `office` — Fichas, presupuestos y documentos entregables.

**Plugins**

- **subagent-claude-code** — Implementar escenas nuevas delegando el build.
- **plugin-dock (Hub)** — Pedidos grandes ruteados.
- **better-sidebar** — Revisar HTML y assets sin salir del chat.

**Comandos**

`/arrancar` · `/estado` · `/revisar` · `/cerrar`
