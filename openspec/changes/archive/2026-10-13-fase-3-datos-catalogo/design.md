# Design

## Context

Ver `proposal.md` (Why) y `specs/datos-catalogo/spec.md` para motivación y contrato de comportamiento. Estado actual: `index.html` con 5 vistas, ids estables (`lista-catalogo`, `buscador-catalogo`, `catalogo-vacio`, `busqueda-sin-resultados`, `vista-*`, `nav a[data-view]`) y tarjetas/filas estáticas de ejemplo; `css/styles.css` completo (Fase 2); `js/data.js` y `js/main.js` vacíos pero ya referenciados al cierre de `body` (orden: `data.js` primero). Restricciones duras: HTML semántico + CSS propio + Vanilla JS; prohibidos librerías/frameworks/CDNs/`fetch`; sin `localStorage` (es Fase 6); doble-clic local sin servidor.

## Goals / Non-Goals

**Goals:**

- Modelo en memoria con ids estables y relaciones resolubles por `main.js` sin duplicar literales.
- Catálogo 100 % generado desde datos, con estados vacío/sin-resultados reutilizando contenedores de Fase 1.
- Filtro por título normalizado y navegación mínima robusta con `hidden`.
- `data.js` estructurado para que Fase 6 envuelva persistencia sin refactorizar.

**Non-Goals:**

- Altas/bajas/modificaciones de libros, clientes, ventas o de editoriales/géneros/autores (fases 4–6).
- Persistencia (`localStorage`), carga remota (`fetch`), validaciones de negocio de ventas, cambios en `index.html` o `css/styles.css`.

## Decisions

### 1. Modelo: entidades normalizadas con ids con prefijo

`js/data.js` expone `DATOS_INICIALES = { editoriales, generos, autores, libros, clientes }` (constantes) más un estado mutable (`estado` o copias de trabajo) inicializado desde ellas. Ids string con prefijo para evitar colisiones y facilitar depuración: `ed-1`, `gen-1`, `aut-1`, `lib-1`, `cli-1`. Libro: `{ id, titulo, isbn, editorialId, generoId (null cuando «Sin clasificar»), autorIds[], precio }`. Cliente: `{ id, nombre, apellido, dni, email, telefono }`.

Alternativa considerada: embeber nombres literales dentro de cada libro (más simple) → rechazada porque duplica datos, impide resolver «Sin clasificar» de forma uniforme y complica reutilización en fases 4–5 (selects de ventas).

### 2. Resolución por mapas en `main.js`, no lógica en `data.js`

`data.js` solo declara datos; `main.js` construye `Map` id→registro y funciones puras `obtenerNombreEditorial(id)`, `obtenerNombreGenero(id)`, `obtenerNombresAutores(ids)`. Así el render y (futuras) fases 4–5 comparten la misma resolución.

Alternativa: resolver en `data.js` y guardar nombres denormalizados → rechazada porque mezcla datos con presentación y duplica fuente de verdad.

### 3. Render con `createElement` + `textContent`, sin `innerHTML` con datos

`crearTarjetaLibro(libro)` crea `article > h3 + p`s con `document.createElement` y asigna cada dato con `textContent` (p. ej. `"ISBN: " + libro.isbn`). `renderCatalogo(lista)` vacía `#lista-catalogo` y anexa tarjetas; luego actualiza `hidden` de `#catalogo-vacio` / `#busqueda-sin-resultados`. La limpieza inicial elimina las 2 tarjetas estáticas de ejemplo de Fase 1 en tiempo de ejecución, sin editar `index.html`.

Alternativa: plantillas con `innerHTML` → rechazada por riesgo de inyección (la spec exige texto seguro) y por mezclar datos con markup.

### 4. Filtro normalizado sobre evento `input`

`normalizar(texto) = texto.trim().toLowerCase()`; `filtrarLibros(termino)` filtra `titulo.toLowerCase().includes(terminoNormalizado)`; vacío → lista completa. Escucha `input` en `#buscador-catalogo` (respuesta inmediata, incluye limpiar con la «x» nativa de `type="search"`). Distingue «vacío global» (`catalogo-vacio`) de «filtro sin coincidencias» (`busqueda-sin-resultados`).

Alternativa: filtrar en `keyup`/`submit` → rechazada porque `input` cubre pegar, limpiar y lector de pantalla de forma uniforme.

### 5. Navegación mínima por `data-view` con `hidden`

`mostrarVista(id)` recorre las 5 `section[id^="vista-"]`, pone `hidden` en todas salvo la elegida; delegación de `click` en `nav` sobre `a[data-view]` con `preventDefault()` (evita salto de ancla) y activa la vista. Vista inicial: `vista-catalogo`. No toca clases CSS ni orden de tabulación (respeta restricción de `presentacion-adaptable` de no romper `hidden` desde CSS/JS indebidamente: aquí JS sí gestiona `hidden`, que es su propósito).

Alternativa: router por `location.hash` completo → rechazada por exceso de alcance; el hash se puede actualizar como mejora menor sin condicionar la spec.

## Risks / Trade-offs

- [Riesgo] Datos ficticios con tildes/ñ mal codificados → Mitigación: archivo UTF-8 sin BOM, coherente con `meta charset="utf-8"`; evitar caracteres problemáticos en ISBN/precios.
- [Riesgo] Referencia a id inexistente (typo en `editorialId`/`autorIds`) deja tarjeta incompleta → Mitigación: resolución con fallback («Desconocido»/«Sin clasificar») + verificación visual en apply de que cada libro resuelve todo.
- [Riesgo] Precio como número vs. string con formato → Mitigación: guardar número y formatear en render (`"$" + precio`); no hacer cálculos en esta fase.
- [Trade-off] Estado mutable copiado desde `DATOS_INICIALES` añade una línea de inicialización hoy → Gana Fase 6: persistencia se envuelve sin cambiar el modelo ni el render.
- [Trade-off] Sin `innerHTML` el código de creación de tarjetas es más verboso → Gana seguridad (XSS) y cumple la consigna explícita.
