# Tasks

## 1. Modelo de datos en memoria (js/data.js)

- [x] 1.1 Definir `DATOS_INICIALES` con 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios con ids estables (`ed-*`, `gen-*`, `aut-*`, `cli-*`) y verificar en consola que cada colección tiene el conteo mínimo y los ids son únicos.
- [x] 1.2 Definir 6 libros con `{ id, titulo, isbn, editorialId, generoId|null, autorIds[], precio }` donde cada `editorialId`/`autorIds` resuelve a registros existentes, `generoId` es null en al menos un libro o referencia un género existente, y verificar con una comprobación manual (recorrido en consola) que todas las referencias resuelven.
- [x] 1.3 Exponer el estado mutable en memoria inicializado desde `DATOS_INICIALES` sin `localStorage` ni `fetch`, y verificar que `js/data.js` no contiene las cadenas `localStorage` ni `fetch` y carga sin errores antes de `js/main.js`.

## 2. Render dinámico del catálogo (js/main.js)

- [x] 2.1 Implementar resolución por mapas (`obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerNombresAutores`) con fallback («Sin clasificar» para género ausente) y verificar que cada libro del conjunto inicial resuelve editorial, género o «Sin clasificar», y autores.
- [x] 2.2 Implementar `crearTarjetaLibro` con `createElement` + `textContent` (sin `innerHTML` con datos) que expone título, ISBN, editorial, género, autores y precio, y verificar que un dato con `<b>` de prueba se muestra como texto literal y no como HTML.
- [x] 2.3 Implementar `renderCatalogo` que reemplaza las tarjetas estáticas de `#lista-catalogo`, gestiona `hidden` de `#catalogo-vacio` / `#busqueda-sin-resultados`, y verificar con 6 libros que hay 6 `article` sin restos estáticos, y con array vacío que aparece `#catalogo-vacio`.

## 3. Filtro por título y navegación mínima (js/main.js)

- [x] 3.1 Implementar `normalizar` (`trim` + minúsculas) y `filtrarLibros` (coincidencia parcial case-insensitive; vacío muestra todo; sin coincidencias muestra `#busqueda-sin-resultados`) sobre evento `input` de `#buscador-catalogo`, y verificar que «  quij  » filtra correctamente, el vacío restaura todo y «zzz-sin-coincidencia» muestra el mensaje en español.
- [x] 3.2 Implementar `mostrarVista` + delegación de `click` en `nav a[data-view]` con `preventDefault()` y conmutación vía `hidden` (vista inicial `vista-catalogo`), y verificar que cada enlace muestra solo su vista sin errores y que `index.html` y `css/styles.css` quedan sin modificar (`git status` limpio salvo `js/`).

## 4. Verificación integral de Fase 3

- [ ] 4.1 Verificación integral manual: abrir `index.html` con doble clic, recorrer las 5 vistas, confirmar catálogo de 6 tarjetas con «Sin clasificar» visible en al menos una, filtro con los 3 casos (parcial/vacío/sin coincidencias), consola sin errores y ausencia de CDNs/`fetch`/`localStorage`/ABM auxiliar.
