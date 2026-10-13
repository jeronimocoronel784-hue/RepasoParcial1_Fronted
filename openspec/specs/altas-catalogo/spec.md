# altas-catalogo Specification

## Purpose

Permite agregar libros y clientes desde sus formularios con validación estricta y actualización de vistas sin recargar, como Ejercicio 4 del TPI de Frontend.

## Requirements

### Requirement: Poblado de opciones de alta de libro desde datos locales

El sistema SHALL poblar en `vista-libros` el campo editorial (`#libro-editorial`) como `select` con una opción por editorial existente, el campo género (`#libro-genero`) como `select` con una opción por género existente más una opción «Sin clasificar» que representa ausencia de género, y el campo autores (`#libro-autores`) como `select` múltiple (o control equivalente multiselección) con una opción por autor existente, usando los ids estables de `estado` como valores y los nombres como texto visible, preservando los ids y `names` (`editorial`, `genero`, `autores`) de Fase 1.

#### Scenario: Selects poblados al cargar y tras cada alta

- **WHEN** la página carga o se registra un libro, editorial, género o autor nuevo en `estado`
- **THEN** `#libro-editorial` lista todas las editoriales, `#libro-genero` lista todos los géneros más «Sin clasificar», y `#libro-autores` lista todos los autores con sus valores iguales a sus ids

#### Scenario: Género «Sin clasificar» representa ausencia

- **WHEN** el usuario elige «Sin clasificar» en `#libro-genero`
- **THEN** el libro resultante guarda `generoId` nulo y el catálogo lo presenta como «Sin clasificar»

### Requirement: Validación y alta de libro con id determinista

El sistema SHALL validar el alta de libro de modo que el título y el ISBN no estén vacíos (tras trim), el ISBN sea único comparado sin espacios ni guiones contra los libros de `estado`, el precio sea numérico mayor a cero, la editorial elegida exista en `estado.editoriales`, se elija al menos un autor y todos los elegidos existan en `estado.autores`, y el género, si no es «Sin clasificar», exista en `estado.generos`; solo si todo pasa SHALL agregar el libro a `estado.libros` con un id nuevo determinista y estable calculado como max+1 numérico por prefijo `lib-` (ej. si el máximo es `lib-6`, el nuevo es `lib-7`).

#### Scenario: Alta de libro válida

- **WHEN** se envía `form#form-libro` con título «Nuevo Libro», ISBN «978-00-0000-9» no usado, precio `5000`, editorial `ed-1`, autores `["aut-1"]` y género «Sin clasificar»
- **THEN** se agrega a `estado.libros` un libro con id `lib-7`, `generoId` nulo y los datos ingresados

#### Scenario: ISBN duplicado con distinto formato se rechaza

- **WHEN** se intenta dar de alta un libro cuyo ISBN normalizado (sin espacios ni guiones) coincide con el de un libro existente (ej. «978 84-376-0494-7» frente a «978-84-376-0494-7»)
- **THEN** el alta no se agrega y se muestra un error junto al formulario indicando ISBN duplicado

#### Scenario: Libro inválido no se agrega

- **WHEN** se envía el formulario con título vacío, precio `0` o negativo, sin autores, con editorial inexistente o con género asignado inexistente
- **THEN** no se agrega ningún libro y se muestran errores junto al formulario describiendo cada campo inválido

### Requirement: Validación y alta de cliente con email único

El sistema SHALL validar el alta de cliente de modo que el nombre completo (campos `nombre` y `apellido` de `form#form-cliente`, preservados de Fase 1) y el email no estén vacíos (tras trim), el email tenga formato válido (texto con `@` y dominio con punto, sin espacios interiores), y el email sea único comparado sin espacios exteriores y case-insensitive contra los clientes de `estado`; solo si todo pasa SHALL agregar el cliente a `estado.clientes` con un id nuevo determinista y estable calculado como max+1 numérico por prefijo `cli-` (ej. si el máximo es `cli-3`, el nuevo es `cli-4`), preservando los demás campos del formulario (`dni`, `telefono`) sin reglas nuevas de unicidad. Este fix AGREGA reglas de formato sin contradecir el mínimo del PDF (Ejercicio 4: nombre+email no vacíos, email válido y único): `nombre`/`apellido` no vacíos (tras trim) y con solo letras (incluidos acentos/ñ), espacios, apóstrofe y guion, con al menos una letra; `dni` vacío se permite, pero si trae contenido SHALL contener solo dígitos de 7-8 (permitiendo puntos intermedios tipo `30.123.456` que se normalizan quitando los puntos); `telefono` vacío se permite, pero si trae contenido SHALL contener solo dígitos y separadores (`+`, `-`, espacios, paréntesis) con 6-15 dígitos tras quitar los separadores. Cada campo inválido SHALL producir un error en español visible junto al formulario (`#errores-cliente`).

#### Scenario: Alta de cliente válida

- **WHEN** se envía `form#form-cliente` con nombre «Lucía», apellido «Fernández», email «lucia.fernandez@ejemplo.com» no usado
- **THEN** se agrega a `estado.clientes` un cliente con id `cli-4` y los datos ingresados

#### Scenario: Email duplicado con distinta capitalización se rechaza

- **WHEN** se intenta dar de alta un cliente con email «  MARIA.GONZALEZ@ejemplo.com » existiendo «maria.gonzalez@ejemplo.com»
- **THEN** el alta no se agrega y se muestra un error junto al formulario indicando email duplicado

#### Scenario: Cliente inválido no se agrega

- **WHEN** se envía el formulario con nombre vacío o email vacío, con formato inválido (ej. «sin-arroba» o «a@b»)
- **THEN** no se agrega ningún cliente y se muestran errores junto al formulario describiendo cada campo inválido

#### Scenario: Apellido con números se rechaza

- **WHEN** se envía `form#form-cliente` con nombre «ASDASDASDDAFADSs», apellido «456225», DNI «adfdsfs», teléfono «asd8214» y email válido no usado
- **THEN** no se agrega ningún cliente y `#errores-cliente` muestra un error por cada campo de formato inválido (apellido, DNI, teléfono)

#### Scenario: Nombre con números se rechaza

- **WHEN** se envía `form#form-cliente` con nombre «Juan123», apellido válido y email válido no usado
- **THEN** no se agrega ningún cliente y se muestra un error indicando que el nombre solo admite letras

#### Scenario: Nombres compuestos válidos se aceptan

- **WHEN** se envía `form#form-cliente` con nombre «María José» o apellido «O'Brien» y email válido no usado, DNI y teléfono vacíos
- **THEN** se agrega el cliente con id correlativo `cli-N`

#### Scenario: DNI con letras o corto se rechaza; con puntos se acepta

- **WHEN** se envía `form#form-cliente` con DNI «adfdsfs» o «12» (y resto válido)
- **THEN** no se agrega ningún cliente y se muestra un error indicando que el DNI debe tener 7-8 dígitos
- **WHEN** se envía con DNI «30.123.456» (y resto válido)
- **THEN** se agrega el cliente con id correlativo `cli-N`

#### Scenario: Teléfono con letras se rechaza; formatos válidos se aceptan

- **WHEN** se envía `form#form-cliente` con teléfono «asd8214» (y resto válido)
- **THEN** no se agrega ningún cliente y se muestra un error indicando el formato de teléfono esperado
- **WHEN** se envía con teléfono «341-555-0101» o «+54 341 555-0101» (y resto válido)
- **THEN** se agrega el cliente con id correlativo `cli-N`

#### Scenario: DNI y teléfono vacíos se permiten

- **WHEN** se envía `form#form-cliente` con nombre, apellido y email válidos y DNI/telefono vacíos
- **THEN** se agrega el cliente con id correlativo `cli-N` (el PDF no exige esos campos)

### Requirement: Envío sin recarga, errores visibles y vistas actualizadas

El sistema SHALL manejar el submit de `form#form-libro` y `form#form-cliente` con `preventDefault`, mostrar los errores de validación en texto en español cerca del formulario correspondiente (contenedores de Fase 1 o el agregado mínimo documentado en design), no agregar nada si alguna validación falla, y tras un alta correcta SHALL actualizar sin recargar la página el catálogo (`#lista-catalogo`), la tabla correspondiente (`#cuerpo-tabla-libros` o `#cuerpo-tabla-clientes` con sus contenedores de vacío) y las opciones relacionadas (selects de libro y, para clientes, futuras referencias), insertando todo dato solo como texto seguro (`textContent`, nunca `innerHTML` con datos); SHALL NOT editar ni eliminar registros existentes.

#### Scenario: Alta correcta actualiza vistas sin recargar

- **WHEN** se registra un libro o cliente válido
- **THEN** la página no se recarga, el nuevo registro aparece en su tabla y (para libros) en `#lista-catalogo`, los selects relacionados incluyen la novedad, y el formulario muestra confirmación o queda limpio con los errores ocultos

#### Scenario: Alta inválida conserva datos y no muta estado

- **WHEN** se envía un formulario con errores de validación
- **THEN** la página no se recarga, `estado.libros` y `estado.clientes` quedan intactos, los errores quedan visibles junto al formulario y los listados no cambian

### Requirement: Restricciones técnicas de la fase de altas

El sistema SHALL implementar las altas solo con HTML semántico, CSS propio existente y Vanilla JS en `js/main.js` mutando `estado` de `js/data.js`, y SHALL NOT usar librerías, frameworks, CDNs, `fetch`, `localStorage`, ni implementar ventas (Fase 5), persistencia (Fase 6), edición/eliminación de registros, ABM de editoriales/géneros/autores, ni cambios visuales (Fase 2) salvo el agregado mínimo documentado en design.

#### Scenario: Sin dependencias ni persistencia ni ventas

- **WHEN** se inspeccionan `index.html`, `js/data.js` y `js/main.js` tras el apply
- **THEN** no hay `<script>` a CDNs, ni `fetch`, ni accesos a `localStorage`, ni lógica de ventas/persistencia/bajas/modificaciones, y la página funciona con doble clic local
