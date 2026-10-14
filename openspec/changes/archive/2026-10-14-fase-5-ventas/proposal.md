# Proposal

## Why

El TPI ya tiene catálogo navegable (Fase 3) y altas de libros/clientes (Fase 4), pero aún no registra ventas: la vista Ventas e Historial de Fase 1 son estáticas y `estado` no tiene colección de ventas. El Ejercicio 5 (20 pts) exige cerrar el circuito comercial —componer, calcular, confirmar y consultar ventas— sin persistencia (Fase 6).

## What Changes

- Composición de venta: seleccionar cliente existente desde `select#venta-cliente` poblado desde `estado.clientes` (incluye altas de Fase 4); agregar renglones libro existente + cantidad entera > 0; permitir cambiar cantidades y quitar renglones antes de confirmar.
- Política anti-duplicados: si el libro ya está en la venta, se fusiona sumando la cantidad al renglón existente (una sola política, documentada en spec y design).
- Cálculos: cada renglón muestra libro, cantidad, precio unitario y subtotal; subtotal = cantidad × precio; total = suma de subtotales; presentación con 2 decimales vía `toFixed(2)` solo al mostrar, nunca para calcular.
- Validación de confirmación: impide confirmar sin cliente, sin renglones o con cantidades inválidas (cero, negativa, decimal, no numérica) con mensajes en español en `mensaje-venta-error`.
- Confirmación: registra venta con id determinista (`v-` + max+1), fecha, cliente, renglones y total; cada renglón copia precio unitario como valor histórico más título del libro y nombre del cliente para lectura sin depender del catálogo actual; guarda en `estado.ventas` solo en memoria.
- Historial: lista id/fecha/cliente/total y consulta de renglones en `detalle-venta`, sin editar ni eliminar; al confirmar limpia el formulario y muestra `mensaje-venta-exito`.
- Restricciones: sin `localStorage` (Fase 6), sin cambios a altas de Fase 4, sin cambios visuales salvo mínimos documentados reutilizando contenedores y mensajes de Fase 1.

## Capabilities

### New Capabilities
- `ventas`: composición, cálculo, validación, confirmación con snapshot histórico e historial de ventas del Ejercicio 5.

### Modified Capabilities
<!-- Sin cambios a requirements base: los deltas son aditivos y no reescriben estructura-base, vistas-libreria, presentacion-adaptable, datos-catalogo ni altas-catalogo. -->

## Impact

- Afecta `js/main.js` (nueva lógica de ventas: borrador de renglones, cálculos, validación, confirmación, renders de resumen e historial) y `js/data.js` (agregar `estado.ventas = []` como colección en memoria).
- Reutiliza `index.html` existente: `vista-ventas` (`select#venta-cliente`, `renglones-venta`, `resumen-venta` con `resumen-subtotal/total`, `mensaje-venta-exito/error`) y `vista-historial` (`tabla-historial`, `cuerpo-tabla-historial`, `historial-vacio`, `detalle-venta`); solo se permite el agregado mínimo documentado en design (p. ej. controles quitar renglón dentro de `renglones-venta`).
- Sin nuevas dependencias, sin CDNs/fetch, sin persistencia; la página sigue funcionando con doble clic local.
