# Proposal — fase-4-altas

## Why

El TPI tiene formularios de alta (Fase 1), datos en memoria y catálogo/navegación (Fase 3), pero aún no permite agregar libros ni clientes: el Ejercicio 4 (15 pts) exige altas con validación y actualización de vistas sin recargar ni persistencia.

## What Changes

- Alta de libros desde `form#form-libro`: poblar editorial (`select`), género (`select` con opción «Sin clasificar» = ausencia) y autores (`select` múltiple o equivalente) desde los datos locales; validar título/ISBN no vacíos, ISBN único comparado sin espacios ni guiones, precio numérico > 0, editorial existente, al menos un autor y todos existentes, género asignado existente; generar id nuevo determinista y estable (max+1 por prefijo, ej. `lib-N`).
- Alta de clientes desde `form#form-cliente`: validar nombre completo + email no vacíos, email con formato válido, email único comparado sin espacios exteriores y case-insensitive; id nuevo determinista y estable (max+1 por prefijo, ej. `cli-N`).
- Envío con `preventDefault`, errores mostrados cerca del formulario (contenedores de Fase 1; si falta alguno, el agregado mínimo a `index.html` se documenta en design), solo agrega si todo pasa; tras alta correcta actualiza listados y opciones relacionadas (catálogo, tablas, selects) sin recargar. Sin editar ni eliminar registros.
- Conversión mínima de campos de libro en `index.html` (editorial/género/autores de `input` a `select`, preservando ids/names) documentada en design; sin cambios visuales (Fase 2) salvo lo mínimo documentado.
- Sin `localStorage` (Fase 6), sin ventas (Fase 5), sin ABM de editoriales/géneros/autores.

## Capabilities

### New Capabilities

- `altas-catalogo`: altas de libros y clientes con validación, ids deterministas y actualización de vistas sin recargar (Ejercicio 4).

### Modified Capabilities

- Ninguna — los delta specs de este change son aditivos y no reescriben requisitos de `estructura-base`, `vistas-libreria`, `presentacion-adaptable` ni `datos-catalogo`.

## Impact

- Afecta `js/main.js` (poblado de selects, validaciones, handlers de submit, re-render), `js/data.js` (solo mutación de `estado`, sin cambiar `DATOS_INICIALES` ni agregar persistencia) e `index.html` (conversión mínima de 3 campos a `select` + contenedores de error si faltan, preservando ids/names/landmarks).
- Sin nuevas dependencias: HTML semántico + CSS propio + Vanilla JS, sin librerías/frameworks/CDNs/`fetch`/`localStorage`.
