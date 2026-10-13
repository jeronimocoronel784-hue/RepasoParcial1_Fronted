# Proposal

## Why

El TPI Frontend Librería (Programación III, UTN) parte de archivos vacíos (`index.html` de 0 bytes, `js/` vacío, sin CSS ni README). El Ejercicio 1 (20 pts) exige la estructura HTML y las 5 pantallas como base estática sobre la que se montarán CSS (fase 2) y JS funcional con localStorage (fases 3-6). Sin esta base con ids/names estables en español, las fases siguientes no tienen contratos DOM a los que atarse.

## What Changes

- `index.html` como único punto de entrada: documento HTML5 válido (`lang="es"`, `meta charset`, `meta viewport`, `<title>`), con `header`/`nav`/`main`/`footer` y 5 `section` conmutables con ids estables: `vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas`, `vista-historial`.
- Vista Catálogo (`vista-catalogo`): título de la librería, buscador por título (`label` + `input[type="search"]#buscador-catalogo`), listado con título/ISBN/editorial/género/autores/precio, regla "Sin clasificar" si no hay género; contenedores `lista-catalogo`, `catalogo-vacio`, `busqueda-sin-resultados`.
- Vista Libros (`vista-libros`): formulario de alta (`form#form-libro` con título, ISBN, editorial, género, autores, precio + botón "Agregar libro") y listado (`tabla-libros` con `thead`/`th`, `cuerpo-tabla-libros`, `libros-vacio`).
- Vista Clientes (`vista-clientes`): formulario de alta (`form#form-cliente` con nombre, apellido, DNI, email, teléfono + botón "Agregar cliente") y listado (`tabla-clientes`, `cuerpo-tabla-clientes`, `clientes-vacio`).
- Vista Ventas (`vista-ventas`): `select#venta-cliente` de cliente, bloque de renglones (`renglones-venta` + botón "Agregar renglón" con `select` libro + cantidad), resumen (`resumen-venta`: subtotal/descuentos/total) y botón "Registrar venta"; contenedores `mensaje-venta-exito`, `mensaje-venta-error`.
- Vista Historial (`vista-historial`): listado de ventas (`tabla-historial`, `cuerpo-tabla-historial`, `historial-vacio`) + contenedor de detalle (`detalle-venta`).
- Accesibilidad/maqueta estática: cada `input`/`select` con `label for` asociada, botones con texto-acción en español, tablas con `thead`/`th scope`, 1-2 filas estáticas de ejemplo por listado, mensajes globales `mensaje-exito` / `mensaje-error`.
- Cableado de assets sin implementarlos: `<link rel="stylesheet" href="css/styles.css">` y `<script src="js/data.js">` + `<script src="js/main.js">` al cierre de `body`.

## Capabilities

### New Capabilities

- `estructura-base`: shell del documento HTML5, landmarks semánticos (header/nav/main/footer, section/article), accesibilidad base de formularios/tablas/botones, contenedores de estado global y cableado de `css/styles.css`, `js/data.js`, `js/main.js`.
- `vistas-libreria`: las 5 vistas conmutables (catálogo, libros, clientes, ventas, historial) con sus formularios, tablas, renglones, resumen, detalle y estados (vacío / sin resultados / éxito / error), con ids y names estables en español para JS de fases 3-5.

### Modified Capabilities

- Ninguna (repo sin specs previas; `openspec list --specs` devuelve vacío).

## Impact

- Afecta solo `index.html` (de 0 bytes a estructura completa). `css/styles.css`, `js/data.js`, `js/main.js` solo se referencian, no se implementan.
- Sin dependencias, sin CDNs, sin librerías/frameworks (restricción estricta del TPI).
- Sin comportamiento JS ni estilos: verificación por inspección DOM/validador HTML, no por tests de ejecución.
- Riesgo principal: ids/names inconsistentes romperían fases 3-5; se mitiga fijándolos en la spec `vistas-libreria` y en `design.md`.
