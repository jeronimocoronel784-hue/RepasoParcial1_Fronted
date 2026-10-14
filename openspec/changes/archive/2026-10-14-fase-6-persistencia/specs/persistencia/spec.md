# Spec Delta — persistencia

## Purpose

Persistir libros, clientes y ventas en el localStorage del navegador para que sobrevivan recargas, y documentar la entrega en README.md con las claves exactas y la tabla de los 8 casos manuales del PDF.

## ADDED Requirements

### Requirement: Claves versionadas y carga inicial sin duplicados

El sistema SHALL persistir las colecciones en `localStorage` bajo las claves exactas `libreriaUTN.libros.v1`, `libreriaUTN.clientes.v1` y `libreriaUTN.ventas.v1`, cada una con el JSON del array correspondiente. Al iniciar, si las tres claves existen y parsean correctamente SHALL usar los datos guardados; si alguna falta o es ilegible SHALL cargar `DATOS_INICIALES` de `js/data.js` para esa colección. Reabrir la página SHALL NOT duplicar registros.

#### Scenario: Primera apertura carga ejemplos

- **WHEN** el navegador no tiene ninguna de las tres claves guardadas y se abre `index.html`
- **THEN** el catálogo muestra los 6 libros iniciales, los 3 clientes iniciales y el historial vacío, sin errores de JS

#### Scenario: Reapertura usa lo guardado sin duplicar

- **WHEN** se dieron de alta 1 libro y 1 cliente, se confirmó 1 venta, y se recarga la página
- **THEN** libros, clientes e historial muestran exactamente los mismos registros (conteos idénticos, sin duplicados) y la consola no muestra errores

#### Scenario: Clave corrupta degrada a ejemplos para esa colección

- **WHEN** `libreriaUTN.libros.v1` contiene texto que no es JSON válido y se abre la página
- **THEN** el catálogo muestra los libros de `DATOS_INICIALES`, las demás colecciones usan sus datos guardados si son válidos, y la página funciona con normalidad

### Requirement: Guardado tras cada mutación con degradación a memoria

El sistema SHALL guardar en `localStorage` tras cada mutación: alta de libro, alta de cliente y confirmación de venta. Toda lectura y escritura de `localStorage` SHALL estar dentro de `try/catch`: si el navegador lo bloquea (cuota excedida, modo privado) SHALL degradar a memoria, conservar la sesión actual funcional y no romper renders ni validaciones.

#### Scenario: Alta de libro persiste

- **WHEN** se da de alta un libro válido y luego se recarga la página
- **THEN** el libro sigue en el catálogo y en la tabla de libros, y `libreriaUTN.libros.v1` contiene su JSON

#### Scenario: Alta de cliente persiste

- **WHEN** se da de alta un cliente válido y luego se recarga la página
- **THEN** el cliente sigue en la tabla de clientes y en el `select` de ventas, y `libreriaUTN.clientes.v1` contiene su JSON

#### Scenario: Venta confirmada persiste

- **WHEN** se confirma una venta válida y luego se recarga la página
- **THEN** la venta sigue en el historial con su detalle intacto, y `libreriaUTN.ventas.v1` contiene su JSON

#### Scenario: localStorage bloqueado no rompe la app

- **WHEN** el navegador lanza excepción al escribir (cuota/modo privado) durante un alta o venta
- **THEN** la operación en memoria se completa igual, las vistas se actualizan y no aparece ningún error fatal de JS

### Requirement: Historial conserva precios snapshot tras recarga

El sistema SHALL conservar en `localStorage` cada venta con los precios unitarios y títulos copiados al momento de la confirmación. Si el precio de un libro cambia solo en `libreriaUTN.libros.v1` y se recarga, el historial SHALL seguir mostrando los valores snapshot originales de cada venta.

#### Scenario: Precio histórico inmutable tras edición del catálogo guardado

- **WHEN** se confirma una venta, luego se cambia solo el precio de ese libro en `libreriaUTN.libros.v1` y se recarga
- **THEN** el detalle de la venta muestra el precio unitario y el total originales, no el precio editado

### Requirement: README.md de entrega con claves y tabla de casos manuales

El sistema SHALL incluir un `README.md` nuevo en la raíz con: autor (Jerónimo Coronel — Grupo 3, con marca visible si falta otro integrante), pasos para abrir `index.html` sin npm (doble clic o Live Server), navegación entre las 5 vistas, funcionalidades implementadas y pendientes (pendientes: ninguna — editar/eliminar no exigidos), ubicación de los datos iniciales (`js/data.js`, `DATOS_INICIALES`), funcionamiento y límites de `localStorage` (depende de navegador/perfil/ubicación de apertura incl. `127.0.0.1:5500` vs `file://`, no comparte entre usuarios), ubicación y estructura del catálogo guardado para la comprobación guiada del docente (claves exactas + forma del JSON), procedencia de imágenes (ninguna, todo propio), y tabla de los 8 casos manuales del PDF con columnas Caso / Resultado esperado / Resultado observado / Método.

#### Scenario: README completo para el docente

- **WHEN** el docente abre `README.md` y sigue sus pasos con doble clic o Live Server
- **THEN** encuentra autor, apertura, navegación, funcionalidades, ubicación de datos, límites de localStorage, claves exactas con forma del JSON, procedencia de imágenes y la tabla de 8 casos con resultados esperados definidos

#### Scenario: Tabla cubre los 8 casos del PDF

- **WHEN** se revisa la tabla de casos del README
- **THEN** contiene los 8 casos: (1) búsqueda parcial en mayúsculas + vacía + inexistente; (2) alta libro ISBN duplicado y nuevo; (3) alta cliente email inválido/duplicado-mayúsculas/nuevo; (4) venta sin cliente, cantidad 0/negativa/decimal, libro repetido; (5) venta válida 2×precioA + 1×precioB con subtotales/total; (6) precio histórico tras cambio en localStorage + recarga; (7) recarga tras altas y venta sin duplicar; (8) teclado + 320/1280px — cada fila con Caso, Resultado esperado, Resultado observado y Método
