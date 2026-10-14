# ventas Specification

## Purpose
Registra ventas de libros a clientes existentes con renglones, cálculos y snapshot histórico, más su historial consultable, como Ejercicio 5 del TPI sin persistencia.

## Requirements

### Requirement: Composición de venta con cliente y renglones editables

El sistema SHALL permitir componer una venta seleccionando un cliente existente desde `select#venta-cliente` poblado desde `estado.clientes` (incluye altas de Fase 4) y agregando renglones de libro existente + cantidad entera mayor a cero; antes de confirmar SHALL permitir cambiar cantidades y quitar renglones. Ante libro duplicado SHALL aplicar una única política de fusión: si el libro ya está en la venta se suma la cantidad al renglón existente en lugar de crear otro.

#### Scenario: Select de cliente incluye altas de Fase 4

- **WHEN** se abre `vista-ventas` tras dar de alta un cliente nuevo en Fase 4
- **THEN** `select#venta-cliente` lista ese cliente junto a los iniciales con su id estable como valor y nombre visible

#### Scenario: Libro duplicado se fusiona en el renglón existente

- **WHEN** la venta ya contiene el libro `lib-1` con cantidad 2 y se agrega `lib-1` con cantidad 3
- **THEN** sigue habiendo un solo renglón para `lib-1` y su cantidad pasa a 5

#### Scenario: Editar y quitar renglones antes de confirmar

- **WHEN** la venta en borrador tiene dos renglones y el usuario cambia la cantidad de uno y quita el otro
- **THEN** el borrador refleja una sola línea con la cantidad editada y el resumen se recalcula sin registrar venta alguna

### Requirement: Cálculos por renglón y total con presentación a 2 decimales

El sistema SHALL mostrar por cada renglón libro, cantidad, precio unitario y subtotal donde subtotal = cantidad × precio, y total = suma de subtotales; SHALL presentar importes con 2 decimales mediante `toFixed(2)` solo al mostrar, nunca para calcular. SHALL impedir confirmar sin cliente, sin renglones o con cantidades inválidas (cero, negativa, decimal, no numérica) mostrando error en español en `mensaje-venta-error`.

#### Scenario: Subtotal y total correctos con 2 decimales al mostrar

- **WHEN** el borrador tiene `lib-1` (precio 15000, cantidad 2) y `lib-4` (precio 9500, cantidad 1)
- **THEN** los subtotales mostrados son `30000.00` y `9500.00` y el total mostrado es `39500.00`, calculados sobre números sin redondeo intermedio

#### Scenario: Confirmación bloqueada sin cliente

- **WHEN** se intenta confirmar una venta con renglones válidos pero sin cliente seleccionado
- **THEN** no se registra venta y `mensaje-venta-error` describe que falta el cliente

#### Scenario: Confirmación bloqueada sin renglones o con cantidad inválida

- **WHEN** se intenta confirmar sin renglones, o con cantidad `0`, `-1`, `1.5` o texto no numérico
- **THEN** no se registra venta y `mensaje-venta-error` describe el problema en español

### Requirement: Confirmación con id determinista y snapshot histórico en memoria

El sistema SHALL registrar al confirmar una venta válida un objeto con id determinista (`v-` + max+1 numérico, ej. si el máximo es `v-2` el nuevo es `v-3`), fecha, cliente, renglones y total; cada renglón SHALL copiar el precio unitario como valor histórico más los datos descriptivos necesarios (título del libro, nombre del cliente) para leer la venta sin depender del catálogo actual. SHALL guardar las ventas en `estado.ventas` solo en memoria, sin `localStorage`.

#### Scenario: Venta confirmada con snapshot histórico

- **WHEN** se confirma una venta válida del cliente `cli-1` con `lib-1` cantidad 2
- **THEN** `estado.ventas` suma un registro con id `v-N` correlativo, fecha, cliente, renglón con `libroId`, título copiado, precio unitario copiado, cantidad, subtotal y total

#### Scenario: Venta legible tras cambio de catálogo

- **WHEN** se consulta una venta ya registrada después de que el precio del libro cambió en el catálogo
- **THEN** la venta muestra el precio unitario y título copiados al momento de la confirmación, no los valores actuales

#### Scenario: Sin persistencia en navegador

- **WHEN** se inspecciona la implementación de ventas
- **THEN** no hay lecturas ni escrituras a `localStorage` y las ventas viven solo en `estado.ventas` en memoria

### Requirement: Historial consultable sin edición y limpieza tras confirmar

El sistema SHALL listar en `tabla-historial` (`tbody#cuerpo-tabla-historial`) cada venta con id/fecha, cliente y total más `historial-vacio` cuando no hay ventas, y SHALL mostrar al seleccionar una venta su detalle en `detalle-venta` con cliente, renglones (libro, cantidad, precio) y total; SHALL NOT permitir editar ni eliminar ventas. Al confirmar SHALL limpiar el formulario para una nueva venta y mostrar `mensaje-venta-exito` con el resultado.

#### Scenario: Historial lista ventas registradas

- **WHEN** hay dos ventas registradas en `estado.ventas`
- **THEN** `cuerpo-tabla-historial` muestra dos filas con id/fecha, cliente y total y `historial-vacio` queda oculto

#### Scenario: Detalle de venta seleccionada

- **WHEN** se selecciona una venta del historial
- **THEN** `detalle-venta` muestra su cliente, cada renglón con libro/cantidad/precio copiados y su total

#### Scenario: Confirmación limpia el formulario y anuncia éxito

- **WHEN** se confirma una venta válida
- **THEN** el borrador queda vacío para una nueva venta, el historial incluye la nueva fila y `mensaje-venta-exito` muestra el resultado en español

### Requirement: Restricciones técnicas de la fase de ventas

El sistema SHALL implementar las ventas solo con HTML semántico, CSS propio existente y Vanilla JS mutando `estado` en `js/main.js` (más `estado.ventas` en `js/data.js`), reutilizando contenedores y mensajes de Fase 1, y SHALL NOT usar librerías, frameworks, CDNs, `fetch`, `localStorage`, ni modificar la lógica de altas de Fase 4, ni editar/eliminar ventas, ni introducir cambios visuales salvo el agregado mínimo documentado en design.

#### Scenario: Sin dependencias ni cambios a altas

- **WHEN** se inspeccionan `index.html`, `js/data.js` y `js/main.js` tras el apply
- **THEN** no hay `<script>` a CDNs, ni `fetch`, ni accesos a `localStorage`, la validación y alta de libros/clientes de Fase 4 sigue intacta y la página funciona con doble clic local
