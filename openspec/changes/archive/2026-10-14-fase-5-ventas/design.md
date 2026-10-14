# Design

## Context

Ver `proposal.md` (Why). Estado actual: `index.html` ya trae `vista-ventas` (`select#venta-cliente`, `renglones-venta` con un renglón ejemplo `libro`/`cantidad`, botón agregar renglón, `resumen-venta` con `resumen-subtotal/descuentos/total`, `mensaje-venta-exito/error`) y `vista-historial` (`tabla-historial`, `cuerpo-tabla-historial`, `historial-vacio`, `detalle-venta`); `js/data.js` expone `estado` sin colección `ventas`; `js/main.js` tiene patrón establecido (Fases 3-4): funciones puras de validación/cálculo + renders con `createElement`/`textContent`, `siguienteId(prefijo, colección)`, `mostrarErrores`, `preventDefault`. Ver `specs/ventas/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**
- Borrador de venta en memoria editable (agregar/fusionar, cambiar cantidad, quitar) con resumen recalculado en vivo.
- Confirmación atómica con snapshot histórico y `estado.ventas` consultable desde el historial.
- Reutilizar ids/contenedores de Fase 1 y patrones de Fase 4 para que el apply sea mínimo y reversible.

**Non-Goals:**
- Persistencia (`localStorage`, Fase 6), edición/eliminación de ventas, descuentos reales (el bloque `resumen-descuentos` se conserva intacto mostrando `$0`/`0.00`), ABM de editoriales/géneros/autores, cambios visuales de Fase 2.

## Decisions

1. **Borrador separado de `estado.ventas` (`ventaBorrador = { clienteId, renglones: [{ libroId, cantidad }] }`).**
   Rationale: evita ventas a medio armar en el historial y permite editar/quitar/recacular sin mutar nada permanente hasta confirmar. Alternativa (mutar `estado.ventas` directamente y marcar borrador) descartada: contaminaría el historial y complicaría la validación atómica.

2. **Política anti-duplicados: fusión por suma.**
   Rationale: una sola política como exige la consigna; sumar es la UX esperada en carritos y evita una rama de error adicional. Alternativa (rechazar duplicado con mensaje) descartada: obligaría al usuario a borrar y re-agregar para corregir cantidades. Se documenta en spec y se anuncia al fusionar (p. ej. el renglón existente actualiza su cantidad).

3. **Snapshot histórico en cada renglón confirmado (`{ libroId, titulo, precioUnitario, cantidad, subtotal }` + venta `{ id, fecha, clienteId, clienteNombre, renglones, total }`).**
   Rationale: la consigna exige leer la venta sin depender del catálogo actual; copiar título/precio/nombre congela la lectura. Alternativa (guardar solo ids y resolver contra `estado`) descartada: rompería la lectura si el precio cambia (violación explícita del requisito).

4. **Cálculo en números, formato solo al mostrar (`toFixed(2)` en renders de renglón/resumen/historial/detalle).**
   Rationale: evita deriva por redondeo acumulado; `subtotal = cantidad × precio` y `total = Σ subtotales` siempre sobre `Number`. Alternativa (redondear al calcular) descartada: introduce errores de centavos.

5. **Validación de cantidad con `Number()` estricto: entero, finito, > 0.**
   Rationale: cubre los cuatro inválidos exigidos (cero, negativa, decimal, no numérica) con un solo predicado `Number.isInteger(n) && n > 0`; rechaza `""`, `"abc"`, `1.5`, `0`. Alternativa (validar el string con regex) descartada: duplica la lógica del `input[type=number]` sin ventaja.

6. **Id determinista `v-` + max+1 reutilizando `siguienteId("v-", estado.ventas)`.**
   Rationale: mismo patrón probado de Fase 4 (`lib-`, `cli-`); determinista y estable sin dependencias. Fecha generada al confirmar (fecha local del sistema).

7. **Renders reutilizando contenedores Fase 1 con el mínimo agregado documentado.**
   `select#venta-cliente` se puebla como `poblarSelectsLibro` (opción placeholder + clientes de `estado`, repoblado tras cada alta de Fase 4); `renglones-venta` se reconstruye por borrador con `select[name=libro]` + `input[name=cantidad]` + botón quitar por renglón (único agregado: botón quitar dentro de cada renglón); resumen escribe `resumen-subtotal/total` (descuentos intacto); historial reconstruye `cuerpo-tabla-historial` + `detalle-venta` por selección; errores/éxito usan `mensaje-venta-error/exito` + patrón `mostrarErrores`. Todo dato vía `textContent`/`createElement`, nunca `innerHTML`.

## Risks / Trade-offs

- [Riesgo] El renglón ejemplo estático de `index.html` y las filas ejemplo del historial deben reemplazarse por renders dinámicos → Mitigación: el apply los elimina al primer render (como hizo Fase 3 con el catálogo) y lo verifica por inspección.
- [Riesgo] `select#venta-cliente` desincronizado tras alta de cliente en otra vista → Mitigación: repoblar el select en cada alta de cliente y al mostrar `vista-ventas`, preservando la selección vigente si sigue existiendo.
- [Riesgo] `input[type=number]` entrega strings vacíos o decimales según navegador → Mitigación: validación estricta con `Number()` cubre todos los casos sin confiar en `min`/`step` del HTML.
- [Trade-off] Fusión silenciosa podría confundir si el usuario esperaba dos líneas → Mitigación: al fusionar se actualiza visiblemente la cantidad del renglón existente (el resumen cambia), comportamiento documentado en el spec.

## Migration Plan

Sin migración: cambio aditivo en memoria. Rollback = revertir `js/main.js` + `estado.ventas` de `js/data.js`. Sin despliegue (página estática local).

## Open Questions

Ninguna: la política de duplicados, el formato de id y el alcance de snapshot quedaron fijados por la consigna.
