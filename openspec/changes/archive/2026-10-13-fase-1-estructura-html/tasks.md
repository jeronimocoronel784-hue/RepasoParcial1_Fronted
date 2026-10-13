# Tasks

## 1. Shell HTML5 y landmarks

- [x] 1.1 Crear el documento base en `index.html` (doctype, `lang="es"`, charset, viewport, `title`) con `header` (título + `nav` de 5 enlaces), `main`, `footer` y cableado `<link css/styles.css>` + `<script js/data.js>` y `<script js/main.js>`; verificar abriendo el archivo y comprobando landmarks y referencias presentes.
- [x] 1.2 Verificar accesibilidad base del shell (un `h1`, un `nav`, headings por `section`, sin librerías/CDNs) y validar con el validador HTML (W3C o equivalente); verificar cero errores de estructura.

## 2. Vistas Catálogo y Libros

- [x] 2.1 Maquetar `section#vista-catalogo` (título, `label`+`input#buscador-catalogo`, `div#lista-catalogo` con 1-2 `article` de ejemplo con los 6 campos y "Sin clasificar" en uno, `div#catalogo-vacio`, `div#busqueda-sin-resultados`); verificar por inspección DOM que ids, campos y estados existen.
- [x] 2.2 Maquetar `section#vista-libros` (`form#form-libro` con los 6 campos con id+name y botón "Agregar libro", `table#tabla-libros` con `thead` de 6 columnas, `tbody#cuerpo-tabla-libros` con 1-2 filas de ejemplo, `div#libros-vacio`, cada campo con `label for`); verificar que cada `label for` resuelve a su campo y que el `thead` está completo.

## 3. Vistas Clientes, Ventas e Historial

- [x] 3.1 Maquetar `section#vista-clientes` (`form#form-cliente` con 5 campos con id+name y botón "Agregar cliente", `table#tabla-clientes` con `thead` de 5 columnas, `tbody#cuerpo-tabla-clientes` con 1-2 filas de ejemplo, `div#clientes-vacio`, cada campo con `label for`); verificar etiquetas, `thead` y contenedor de vacío.
- [x] 3.2 Maquetar `section#vista-ventas` (`label`+`select#venta-cliente`, `div#renglones-venta` con un renglón ejemplo libro+cantidad, botón "Agregar renglón", `div#resumen-venta` con `resumen-subtotal/descuentos/total`, botón "Registrar venta", `mensaje-venta-exito/error`); verificar que todos los ids de la spec existen y que "Agregar renglón" no somete el formulario.
- [x] 3.3 Maquetar `section#vista-historial` (`table#tabla-historial` con `thead` ID-Fecha/Cliente/Ítems/Total, `tbody#cuerpo-tabla-historial` con 1-2 filas de ejemplo, `div#historial-vacio`, `div#detalle-venta` con ejemplo cliente+renglones+total); verificar `thead`, filas de ejemplo y contenedor de detalle.

## 4. Consistencia final y cierre (solo integración)

- [x] 4.1 Verificar consistencia global de ids/names contra `specs/vistas-libreria/spec.md` (sin renombres, en español, sin CSS/JS funcional agregado) y correr `openspec validate --change fase-1-estructura-html --strict`; verificar que la validación pasa.
