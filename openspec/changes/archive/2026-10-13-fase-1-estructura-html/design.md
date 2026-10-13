# Design

## Context

Ver `proposal.md` (Why). Estado actual: `index.html` de 0 bytes, `js/data.js` y `js/main.js` vacíos, `docs/` vacía, sin `css/` ni README. Restricciones duras del TPI: HTML semántico, CSS propio en archivos externos, Vanilla JS, sin librerías/frameworks/CDNs; persistencia en localStorage recién desde fases 3-6. Este change solo entrega estructura + maqueta estática del Ejercicio 1 (20 pts); CSS (fase 2) y JS funcional (fases 3-5) quedan explícitamente fuera.

## Goals / Non-Goals

**Goals:**

- Un solo `index.html` válido que contenga las 5 vistas conmutables con landmarks semánticos y navegación en español.
- Fijar el contrato DOM (ids y `name` de cada campo, ids de formularios, tablas, `tbody`, contenedores de estado, resumen y detalle) que usará el JS de fases 3-5 sin renombres posteriores.
- Anticipar todos los estados que el JS necesitará (vacío, sin resultados, éxito, error) como contenedores presentes desde el día uno.
- Dejar cableados `css/styles.css`, `js/data.js` y `js/main.js` aunque se llenen en fases siguientes.

**Non-Goals:**

- No implementar estilos (fase 2), ni lógica JS, validaciones funcionales, conmutación por JS, ni localStorage (fases 3-6).
- No crear `css/styles.css` con contenido, ni README, ni contenido de `docs/`, ni datos reales en `js/data.js`.
- No agregar build tools, dependencias, CDNs ni múltiples páginas HTML.

## Decisions

### 1. Una sola página con 5 `section` conmutables en lugar de 5 archivos HTML

Qué: `vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas`, `vista-historial` como `section` hermanas dentro de `main`; el `nav` del `header` enlaza a cada una.

Por qué: el TPI pide "una sola página con 5 secciones/vistas conmutables"; simplifica la navegación sin router y deja un único punto de conmutación que el JS de fases 3-5 controlará (clase `activa` u oculta, a definir en esa fase).

Alternativas consideradas: 5 archivos HTML separados (descartado: rompe el requisito de página única y duplica header/nav/footer); conmutación solo con `:target` CSS (descartado como mecanismo definitivo porque la lógica de vistas corresponde a JS, aunque CSS pueda apoyar visualmente en fase 2).

### 2. Español total y estable para vistas, ids y `name`

Qué: todos los ids (`buscador-catalogo`, `form-libro`, `libro-titulo`, `venta-cliente`, `resumen-total`, `detalle-venta`, etc.) y `name` de campos en español, idénticos entre `id` y especificación.

Por qué: la consigna exige nombres en español consistentes para todo el TPI; fijarlos ahora evita renombres que romperían el JS de fases 3-5.

Alternativas consideradas: ids en inglés estilo código (descartado: viola la consigna y dificulta la corrección del Ejercicio 1).

### 3. `article` para tarjetas de catálogo, tablas con `thead`/`tbody` para listados tabulares

Qué: catálogo como lista de `article` (contenido heterogéneo título/ISBN/editorial/género/autores/precio); libros, clientes e historial como `table` con `thead > tr > th` y `tbody` con id propio (`cuerpo-tabla-libros`, `cuerpo-tabla-clientes`, `cuerpo-tabla-historial`).

Por qué: respeta la semántica HTML (tarjetas no tabulares vs. datos tabulares) y da al JS puntos de inserción claros (`tbody` + contenedores de vacío).

Alternativas consideradas: todo con `div` (descartado: pierde semántica y puntos del Ejercicio 1); catálogo también como tabla (descartado: las tarjetas con 6 campos heterogéneos se leen mejor como `article`).

### 4. Formularios nativos con `label for`, tipos correctos y botones submit con texto-acción

Qué: `form#form-libro` y `form#form-cliente` con `label for` por campo, `type="search"/"number"/"email"`, `required` donde la consigna lo implique, y botones `type="submit"` ("Agregar libro", "Agregar cliente", "Registrar venta"); ventas usa `select` + botón `type="button"` "Agregar renglón" para no someter el form.

Por qué: accesibilidad y validación nativa gratuita; el JS de fases 3-5 solo engancha `submit` sin reestructurar.

Alternativas consideradas: botones `div` clicables o todo `type="button"` con JS manual (descartado: inaccesible y sin validación nativa).

### 5. Maqueta estática mínima (1-2 filas/tarjetas de ejemplo) sin datos reales

Qué: cada listado incluye 1-2 filas o tarjetas estáticas de ejemplo coherentes con las columnas, más los contenedores de vacío/sin-resultados presentes pero ocultos o con texto guía.

Por qué: demuestra la estructura para la corrección del Ejercicio 1 sin inventar el dataset real (que pertenece a `js/data.js` en fase 3).

Alternativas consideradas: listados totalmente vacíos (descartado: no se aprecia la maqueta) o dataset completo embebido (descartado: pertenece a fase 3 y duplicaría fuente de datos).

### 6. Cableado anticipado de `css/styles.css`, `js/data.js`, `js/main.js`

Qué: `<link>` en `head`, dos `<script>` al cierre de `body` en orden `data.js` → `main.js`.

Por qué: fija el orden de carga (datos antes que lógica) y evita tocar `index.html` en fases 2-3 solo para cablear.

Alternativas consideradas: crear los archivos con contenido mínimo ahora (descartado: su contenido pertenece a fases 2-3); usar un solo JS (descartado: la consigna del repo ya separa `data.js`/`main.js`).

## Risks / Trade-offs

- [Riesgo] Ids o `name` inconsistentes entre `index.html` y la spec rompen fases 3-5 → Mitigación: la spec `vistas-libreria` es la fuente normativa; la última tarea del plan verifica id por id contra la spec.
- [Riesgo] Contenedores de estado ausentes obligan a reestructurar en fases 3-5 → Mitigación: tareas exigen crear `catalogo-vacio`, `busqueda-sin-resultados`, `libros-vacio`, `clientes-vacio`, `mensaje-venta-exito/error`, `historial-vacio`, `detalle-venta` en esta fase.
- [Riesgo] Exceso de maqueta estática confundida con datos reales → Mitigación: filas de ejemplo marcadas como tales y limitadas a 1-2 por listado; sin precios/totales calculados.
- [Trade-off] Sin JS de conmutación, las 5 vistas se ven apiladas en esta fase → Aceptado: la conmutación visual es fase 2 (CSS) + fases 3-5 (JS); la estructura queda lista para ello.

## Migration Plan

No hay migración: change greenfield sobre `index.html` vacío. Rollback = revertir el commit del apply. Fases siguientes solo agregan contenido a `css/` y `js/` y enganchan los ids aquí fijados, sin reestructurar.

## Open Questions

Ninguna que cambie specs, enfoque o tareas. Detalles deferibles a su fase: clase de vista activa (`activa` vs. `hidden`), reglas visuales (fase 2), validaciones JS y modelo localStorage (fases 3-6).
