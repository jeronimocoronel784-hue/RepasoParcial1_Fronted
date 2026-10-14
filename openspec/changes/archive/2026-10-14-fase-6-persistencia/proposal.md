# Proposal — fase-6-persistencia

## Why

La app está completa en memoria pero pierde libros, clientes y ventas al recargar, y no tiene README.md. El Ejercicio 6 (10 pts, último del TPI) exige persistencia en localStorage y documentación de entrega con los 8 casos manuales del PDF.

## What Changes

- Persistencia en `localStorage` bajo claves con prefijo versionado (`libreriaUTN.libros.v1`, `libreriaUTN.clientes.v1`, `libreriaUTN.ventas.v1`): al iniciar se usan los datos guardados si existen, si no se cargan `DATOS_INICIALES` sin duplicarlos al reabrir; se guarda tras cada mutación (alta libro, alta cliente, confirmación venta); todo dentro de `try/catch` (cuota/modo privado) con degradación a memoria.
- Nuevo `README.md` en raíz: autor (Jerónimo Coronel — Grupo 3, con marca si falta otro integrante), apertura de `index.html` sin npm (doble clic o Live Server), navegación entre las 5 vistas, funcionalidades implementadas y pendientes (ninguna: editar/eliminar no exigidos), ubicación de datos iniciales (`js/data.js`, `DATOS_INICIALES`), funcionamiento y límites de localStorage (por navegador/perfil/ubicación de apertura incl. `127.0.0.1:5500` vs `file://`, no comparte entre usuarios), ubicación y estructura del catálogo guardado para la comprobación guiada del docente (claves exactas + forma del JSON), procedencia de imágenes (ninguna, todo propio), y tabla de los 8 casos manuales del PDF (Caso / Resultado esperado / Resultado observado / Método; los observados se completan en el apply con evidencia real).
- Sin cambios en la lógica de negocio de fases 1–5 (solo se envuelve carga/guardado); sin estilos nuevos salvo mínimo documentado.

## Capabilities

### New Capabilities

- `persistencia`: persistencia localStorage (claves, carga inicial sin duplicados, guardado tras mutación, degradación a memoria) + README.md de entrega + cobertura documentada de los 8 casos manuales del PDF. Deltas ADITIVOS; no se reescriben specs base.

### Modified Capabilities

- Ninguna (los delta specs de este change son aditivos bajo `persistencia`; las restricciones "SHALL NOT localStorage" de fases 3–5 quedan acotadas a su fase y la excepción de Fase 6 se documenta en la nueva capacidad).

## Impact

- Afecta `js/data.js` (envolver inicialización de `estado` con carga desde localStorage) y `js/main.js` (guardar tras cada mutación: alta libro, alta cliente, confirmación venta).
- Nuevo archivo `README.md` en raíz. `docs/` sigue vacía salvo que el apply decida mover algo (no previsto).
- Sin nuevas dependencias: Vanilla JS, sin librerías/CDNs/fetch. La app sigue funcionando con doble clic local incluso si localStorage no está disponible (degradación a memoria).
