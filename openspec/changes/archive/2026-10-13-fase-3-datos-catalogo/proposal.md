# Proposal

## Why

Fase 1 dejó `index.html` con 5 vistas y tarjetas/filas estáticas de ejemplo; Fase 2 dejó `css/styles.css` funcional; pero `js/data.js` y `js/main.js` están vacíos (0 bytes) aunque ya referenciados desde `index.html`. Sin JS el catálogo es estático y solo `vista-catalogo` es utilizable. El Ejercicio 3 (15 pts) exige el primer comportamiento real: modelo de datos en memoria y catálogo generado dinámicamente con filtro por título.

## What Changes

- Modelo en `js/data.js`: arrays/objetos con identificadores estables para libros, editoriales, géneros, autores y clientes; conjunto inicial mínimo (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes ficticios) con relaciones por id (libro → 1 editorial existente, 1+ autores existentes; género opcional contra género existente; al menos 1 libro sin género).
- Estructura `js/data.js` con constantes `DATOS_INICIALES` separadas del estado mutable en memoria (sin `localStorage`), para que Fase 6 pueda persistir sin refactorizar.
- Render en `js/main.js`: el catálogo se genera desde el array de libros y reemplaza las tarjetas estáticas de ejemplo de Fase 1; cada tarjeta muestra título, ISBN, editorial, género («Sin clasificar» si ausente), autores y precio.
- Filtro por título sobre `#buscador-catalogo`: case-insensitive, coincidencia parcial, trim en extremos; búsqueda vacía muestra todo; sin coincidencias muestra `busqueda-sin-resultados`; sin libros muestra `catalogo-vacio` (contenedores ya existentes de Fase 1).
- Pegamento mínimo de navegación: conmutar las 5 vistas desde el `nav` (mostrar/ocultar `section` con `hidden`), sin implementar altas/ventas/persistencia.
- Higiene obligatoria: funciones con responsabilidades reconocibles, eventos, inserción de datos de usuario solo como texto (`textContent`, nunca `innerHTML` con datos); prohibidos librerías/frameworks/CDNs/`fetch`.

## Capabilities

### New Capabilities

- `datos-catalogo`: modelo de datos en memoria con ids estables y relaciones (libros/editoriales/géneros/autores/clientes), render dinámico del catálogo desde datos, filtro por título con estados vacío/sin-resultados, y conmutación mínima de las 5 vistas.

### Modified Capabilities

- Ninguna. Las capacidades base (`estructura-base`, `vistas-libreria`, `presentacion-adaptable`) no cambian sus REQUIREMENTS: este change es aditivo y reutiliza sus ids/contenedores/estructura sin reescribirlos.

## Impact

- Afecta solo `js/data.js` (modelo) y `js/main.js` (render + filtro + navegación mínima).
- No toca `index.html` (ids, names, landmarks, `hidden`, contenedores de estado intactos) ni `css/styles.css`.
- Sin nuevas dependencias, sin `fetch`, sin `localStorage`, sin ABM de editoriales/géneros/autores (explícitamente fuera de alcance; fases 4–6).
