# Spec Delta

## Purpose

Define las 5 vistas conmutables de la librería (catálogo, libros, clientes, ventas, historial) con sus formularios, listados y estados, fijando ids y names estables en español para el JS de fases 3-5.

## ADDED Requirements

### Requirement: Vista Catálogo con buscador y listado de libros

La vista `vista-catalogo` SHALL mostrar el título de la librería, un buscador por título (`label` + `input[type="search"]#buscador-catalogo` con `name="buscador-catalogo"`), un contenedor `lista-catalogo` donde cada `article` expone título, ISBN, editorial, género, autores y precio, un contenedor `catalogo-vacio`, un contenedor `busqueda-sin-resultados`, y mostrar el texto "Sin clasificar" cuando un libro no tenga género. En esta fase el listado MAY contener 1-2 tarjetas estáticas de ejemplo.

#### Scenario: Catálogo con resultados

- **WHEN** la vista catálogo contiene libros
- **THEN** cada `article` del listado muestra título, ISBN, editorial, género (o "Sin clasificar"), autores y precio, y el buscador filtra por título

#### Scenario: Catálogo vacío o sin coincidencias

- **WHEN** no hay libros cargados o la búsqueda no coincide con ningún título
- **THEN** se muestra `catalogo-vacio` o `busqueda-sin-resultados` respectivamente con un mensaje en español

### Requirement: Vista Libros con formulario de alta y listado

La vista `vista-libros` SHALL contener `form#form-libro` con campos título (`#libro-titulo`, `name="titulo"`), ISBN (`#libro-isbn`, `name="isbn"`), editorial (`#libro-editorial`, `name="editorial"`), género (`#libro-genero`, `name="genero"`), autores (`#libro-autores`, `name="autores"`), precio (`#libro-precio`, `name="precio"`, numérico) y botón "Agregar libro", más `tabla-libros` con `thead` (Título, ISBN, Editorial, Género, Autores, Precio), `tbody#cuerpo-tabla-libros` y contenedor `libros-vacio`. En esta fase la tabla MAY incluir 1-2 filas estáticas de ejemplo.

#### Scenario: Alta de libro anticipada

- **WHEN** se revisa el formulario de libros
- **THEN** existen los seis campos con ids y names estables y el botón "Agregar libro" para someter el alta (funcionalidad JS en fase posterior)

#### Scenario: Listado de libros vacío o con ejemplos

- **WHEN** no hay libros o solo hay filas de ejemplo estáticas
- **THEN** la tabla conserva su `thead` completo y se muestra `libros-vacio` cuando no hay filas

### Requirement: Vista Clientes con formulario de alta y listado

La vista `vista-clientes` SHALL contener `form#form-cliente` con campos nombre (`#cliente-nombre`, `name="nombre"`), apellido (`#cliente-apellido`, `name="apellido"`), DNI (`#cliente-dni`, `name="dni"`), email (`#cliente-email`, `name="email"`, tipo email), teléfono (`#cliente-telefono`, `name="telefono"`) y botón "Agregar cliente", más `tabla-clientes` con `thead` (Nombre, Apellido, DNI, Email, Teléfono), `tbody#cuerpo-tabla-clientes` y contenedor `clientes-vacio`. En esta fase la tabla MAY incluir 1-2 filas estáticas de ejemplo.

#### Scenario: Alta de cliente anticipada

- **WHEN** se revisa el formulario de clientes
- **THEN** existen los cinco campos con ids y names estables y el botón "Agregar cliente" para someter el alta (funcionalidad JS en fase posterior)

#### Scenario: Listado de clientes vacío o con ejemplos

- **WHEN** no hay clientes o solo hay filas de ejemplo estáticas
- **THEN** la tabla conserva su `thead` completo y se muestra `clientes-vacio` cuando no hay filas

### Requirement: Vista Ventas con cliente, renglones y resumen

La vista `vista-ventas` SHALL contener `select#venta-cliente` (`name="cliente"`) con `label` asociada, contenedor `renglones-venta` donde cada renglón expone `select` de libro (`name="libro"`) y cantidad (`name="cantidad"`), botón "Agregar renglón", bloque `resumen-venta` con subtotal (`resumen-subtotal`), descuentos (`resumen-descuentos`) y total (`resumen-total`), botón "Registrar venta" y contenedores `mensaje-venta-exito` / `mensaje-venta-error`.

#### Scenario: Composición de venta anticipada

- **WHEN** se revisa la vista ventas
- **THEN** se puede elegir un cliente, agregar al menos un renglón libro+cantidad y ver el resumen con subtotal, descuentos y total antes de registrar

#### Scenario: Resultado del registro

- **WHEN** el registro de venta culmina con éxito o con error de validación
- **THEN** se muestra `mensaje-venta-exito` o `mensaje-venta-error` respectivamente con texto en español

### Requirement: Vista Historial con listado de ventas y detalle

La vista `vista-historial` SHALL contener `tabla-historial` con `thead` (ID/Fecha, Cliente, Ítems, Total), `tbody#cuerpo-tabla-historial`, contenedor `historial-vacio` y contenedor `detalle-venta` que al seleccionar una venta muestra cliente, renglones (libro, cantidad, precio) y total. En esta fase la tabla MAY incluir 1-2 filas estáticas de ejemplo.

#### Scenario: Historial vacío o con ejemplos

- **WHEN** no hay ventas registradas o solo hay filas de ejemplo estáticas
- **THEN** la tabla conserva su `thead` completo y se muestra `historial-vacio` cuando no hay filas

#### Scenario: Detalle de una venta

- **WHEN** se selecciona una venta del historial
- **THEN** `detalle-venta` muestra cliente, renglones con libro/cantidad/precio y total de esa venta
