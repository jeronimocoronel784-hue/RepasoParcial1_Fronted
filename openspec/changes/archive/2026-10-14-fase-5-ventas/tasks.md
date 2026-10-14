# Tasks

## 1. Modelo de ventas en memoria

- [x] 1.1 Agregar `estado.ventas = []` en `js/data.js` como colección en memoria y verificar que `node --check js/data.js` pasa y `estado.ventas` inicia vacío sin tocar `DATOS_INICIALES`.
- [x] 1.2 Documentar en el comentario de `estado` que Fase 6 lo persistirá y verificar por inspección que no hay `localStorage` ni `fetch` en `js/data.js`.

## 2. Composición de venta (cliente + renglones editables)

- [x] 2.1 Poblar `select#venta-cliente` desde `estado.clientes` (placeholder + repoblado tras cada alta de Fase 4 y al mostrar la vista) y verificar que un cliente dado de alta en Clientes aparece en Ventas sin recargar.
- [x] 2.2 Implementar borrador `ventaBorrador` con agregar renglón (libro + cantidad), fusión por suma ante duplicado, cambio de cantidad y quita de renglón, con render de `renglones-venta` solo con `createElement`/`textContent`, y verificar que agregar `lib-1` dos veces deja un solo renglón con cantidad sumada y que quitar deja el resumen recalculado.
- [x] 2.3 Cablear botón "Agregar renglón" y controles quitar por renglón (único agregado HTML/JS documentado) con `preventDefault` donde aplique y verificar que el borrador se edita sin registrar venta ni recargar.

## 3. Cálculos y validación de confirmación

- [x] 3.1 Implementar `subtotal = cantidad × precio` y `total = Σ subtotales` en números con `toFixed(2)` solo al mostrar renglón/resumen, y verificar con borrador `lib-1 ×2 + lib-4 ×1` que el total mostrado es `39500.00`.
- [x] 3.2 Implementar validación de confirmación (cliente seleccionado, ≥1 renglón, cada cantidad `Number.isInteger && > 0`) con errores en español en `mensaje-venta-error`, y verificar que confirman bloqueados los casos: sin cliente, sin renglones, cantidad `0`, `-1`, `1.5` y no numérica.

## 4. Confirmación con snapshot e historial

- [x] 4.1 Confirmar venta válida con id `siguienteId("v-", estado.ventas)`, fecha, cliente y renglones con snapshot (`libroId`, título y precio copiados) más `clienteNombre`, push a `estado.ventas`, y verificar que `estado.ventas` suma el registro con id correlativo y que el snapshot no cambia si luego cambia el precio en catálogo.
- [x] 4.2 Renderizar `cuerpo-tabla-historial` (id/fecha, cliente, total) + `historial-vacio` y `detalle-venta` por selección (cliente, renglones libro/cantidad/precio, total) con `toFixed(2)` al mostrar y sin edición/eliminación, y verificar que tras confirmar aparece la fila y el detalle muestra los valores copiados.
- [x] 4.3 Limpiar el borrador/formulario tras confirmar y mostrar `mensaje-venta-exito`, ocultando `mensaje-venta-error`, y verificar que el formulario queda listo para una nueva venta con el historial actualizado.

## 5. Integración y restricciones

- [x] 5.1 Reemplazar contenidos estáticos de ejemplo de Ventas/Historial por renders dinámicos, conservar `resumen-descuentos` intacto y verificar navegando las 5 vistas que no hay errores de JS y que `hidden` conmuta bien.
- [x] 5.2 Verificación final de restricciones: inspeccionar `index.html`, `js/data.js` y `js/main.js` comprobando sin CDNs/`fetch`/`localStorage`, sin cambios a la validación de altas de Fase 4, página funcional con doble clic y `node --check` de ambos JS en verde.
