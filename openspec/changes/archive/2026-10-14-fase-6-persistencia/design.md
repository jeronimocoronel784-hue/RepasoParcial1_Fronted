# Design — fase-6-persistencia

## Context

Ver `proposal.md` (Why) y `specs/persistencia/spec.md` (requisitos). Estado actual observado:

- `js/data.js` (141 líneas): `DATOS_INICIALES` (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes) + `estado` mutable construido como copia profunda al cargar; `ventas: []` solo en memoria. Sin `localStorage`, sin `fetch`.
- `js/main.js` (~1038 líneas): renders, validaciones, altas y ventas mutando `estado`; tres puntos de mutación exitosa (alta libro, alta cliente, confirmación venta).
- Sin `README.md`; `docs/` vacía. Stack estricto: HTML semántico + CSS propio + Vanilla JS, sin librerías/CDNs/fetch, funciona con doble clic.

## Goals / Non-Goals

**Goals:**

- Envolver carga/guardado sin tocar la lógica de negocio de fases 1–5: un punto de carga al boot y un punto de guardado tras cada mutación.
- Fallo de persistencia nunca fatal: degradación a memoria.
- README que el docente pueda seguir sin ayuda, con claves exactas y tabla de 8 casos.

**Non-Goals:**

- No se edita ni elimina ningún registro (no exigido por el PDF).
- No cambian validaciones, cálculos, IDs deterministas ni snapshots de fases 4–5.
- No hay estilos nuevos previstos; si el apply necesita un mínimo, lo documenta.
- No hay migración de datos viejos (primera versión de claves, sufijo `.v1` reserva el formato).

## Decisions

1. **Tres claves separadas (`libreriaUTN.libros.v1` / `.clientes.v1` / `.ventas.v1`) en vez de una sola.**
   Rationale: la consigna las nombra así; permite al docente inspeccionar/borrar por colección en DevTools; una clave corrupta solo degrada su colección. Alternativa (una clave única) se descarta por peor comprobación guiada y fallo acoplado.

2. **Carga al boot donde nace `estado` (`js/data.js`), guardado donde ocurre la mutación (`js/main.js`).**
   Rationale: un único punto de lectura envuelve la inicialización y las fases 4–5 quedan intactas; los tres call-sites de mutación exitosa agregan una llamada de guardado. Alternativa (todo en `main.js`) se descarta porque `estado` ya existe antes de que `main.js` corra y duplicaría la lógica de fallback.

3. **Fallback por colección con validación liviana (es array no vacío-válido, si no → `DATOS_INICIALES`).**
   Rationale: tolera claves ausentes, JSON corrupto o edición manual del docente en DevTools sin romper la página. Sin validación de esquema profunda: fuera de alcance y el modelo ya garantiza forma al escribir.

4. **`DATOS_INICIALES` intacto como fuente de ejemplos; nunca se escribe en `localStorage` directamente.**
   Rationale: los ejemplos se regeneran idénticos en cada perfil/dispositivo nuevo; escribir el seed una vez y mutarlo rompería la semántica "si no hay guardado, ejemplos".

5. **Ventas se persisten tal cual (snapshot con precio/título copiados).**
   Rationale: el precio histórico ya viaja en el objeto venta en memoria; al serializarlo se conserva gratis. No se re-resuelve nada contra el catálogo al leer.

6. **Todo acceso a `localStorage` en `try/catch` con degradación silenciosa a memoria.**
   Rationale: cuota excedida y modo privado lanzan; la sesión actual debe seguir funcional. Sin mensajes al usuario salvo que el apply detecte un lugar ya existente donde quepa (no se crea UI nueva).

7. **README en raíz con secciones fijas y tabla de 8 casos (Caso / Resultado esperado / Resultado observado / Método).**
   Rationale: la consigna enumera el contenido; la columna de observados se completa en el apply con evidencia real de ejecución, nunca antes. Autor: Jerónimo Coronel — Grupo 3, con marca visible si falta otro integrante (ver Open Questions).

## Risks / Trade-offs

- [Riesgo] `localStorage` particionado por origen: `file://` vs `http://127.0.0.1:5500` no comparten datos → el README lo documenta como límite y los casos 6–7 se verifican bajo un mismo origen.
- [Riesgo] Edición manual del JSON en DevTools por el docente deja clave corrupta → mitigado por fallback por colección (spec, escenario dedicado).
- [Riesgo] Sin test runner en el repo: la verificación es manual (harness + checklist del usuario en el apply) → los tasks exigen evidencia de ejecución por caso, prohibido aprobar sin ejecutar.
- [Trade-off] Guardar el array completo tras cada mutación (simple, colecciones chicas) vs guardado incremental (complejo, innecesario a esta escala).

## Migration Plan

No aplica (primera versión de claves). Rollback: borrar las tres claves en DevTools o `localStorage.clear()` devuelve la app a los ejemplos. El sufijo `.v1` permite versionar el formato si el modelo cambia.

## Open Questions

- Nombre del otro integrante del Grupo 3 para el README (si lo hay): se pregunta al usuario en el apply; mientras tanto el README lleva marca visible de pendiente. No cambia specs, enfoque ni tasks.
