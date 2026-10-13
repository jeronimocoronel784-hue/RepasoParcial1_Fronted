# Tasks — fase-4-altas

## 1. Ajuste mínimo de HTML (selects + errores por formulario)

- [x] 1.1 Convertir `#libro-editorial`, `#libro-genero`, `#libro-autores` a `select` (autores `multiple`) preservando ids/names/labels y agregar `#errores-libro` / `#errores-cliente` (`role="alert"`, `hidden`) tras cada formulario; verificar abriendo `index.html` que los ids, names, landmarks y botones están intactos y no hay cambios visuales salvo los controles nativos
- [x] 1.2 Documentar en el diff que solo cambió lo anterior; verificar con `git diff --stat` y `git diff index.html` que no hay otros cambios en `index.html` ni en `css/styles.css`

## 2. Poblado de selects y utilidades (normalización + ids)

- [x] 2.1 Implementar `poblarSelectsLibro()` desde `estado` (editoriales, géneros + «Sin clasificar» primera con `value=""`, autores) usando `textContent` y valores = ids, invocada al inicio y tras cada alta; verificar cargando la página que cada `select` lista las opciones de `DATOS_INICIALES` con valores iguales a sus ids
- [x] 2.2 Implementar `normalizarISBN`, `normalizarEmail`, `esEmailValido` y `siguienteId(prefijo, coleccion)` (max+1 por prefijo, ignora sufijos no numéricos); verificar en consola del navegador que `normalizarISBN("978 84-376-0494-7")` iguala al ISBN guardado con guiones, que el email se compara trim + minúsculas, y que con máximo `lib-6`/`cli-3` devuelven `lib-7`/`cli-4`

## 3. Validación y alta de libro

- [x] 3.1 Implementar `validarLibro()` (título/ISBN no vacíos con trim, ISBN único sin espacios ni guiones, precio numérico > 0, editorial existe, ≥1 autor todos existentes, género vacío→null o existente) que no muta `estado` y devuelve errores en español; verificar intentando altas con título vacío, ISBN duplicado con formato distinto, precio `0`, sin autores y editorial/género inexistentes: ninguna muta `estado.libros` y cada una muestra su error en `#errores-libro`
- [x] 3.2 Implementar alta válida de libro (push a `estado.libros` con id `max+1`, `generoId: null` si «Sin clasificar») + `render` de `#cuerpo-tabla-libros`/`#libros-vacio` y de `#lista-catalogo` respetando el filtro actual; verificar dando de alta un libro válido que aparece en tabla y catálogo (incluido el caso «Sin clasificar») con id `lib-7` correlativo

## 4. Validación y alta de cliente

- [x] 4.1 Implementar `validarCliente()` (nombre+apellido no vacíos con trim como nombre completo, email no vacío, formato `^[^\s@]+@[^\s@]+\.[^\s@]+$`, email único trim + case-insensitive) que no muta `estado` y devuelve errores en español, preservando `dni`/`telefono` sin reglas nuevas; verificar intentando altas con nombre vacío, email inválido (`sin-arroba`) y email duplicado con distinta capitalización/espacios: ninguna muta `estado.clientes` y cada una muestra su error en `#errores-cliente`
- [x] 4.2 Implementar alta válida de cliente (push a `estado.clientes` con id `max+1`) + `render` de `#cuerpo-tabla-clientes`/`#clientes-vacio`; verificar dando de alta un cliente válido que aparece en su tabla con id `cli-4` correlativo

## 5. Cableado de envíos y verificación integral

- [x] 5.1 Conectar `submit` de `form#form-libro` y `form#form-cliente` con `preventDefault`, `mostrarErrores()` por formulario (texto seguro, `hidden` si vacío), `form.reset()` y refresco de selects/tablas/catálogo sin recargar y sin editar/eliminar registros; verificar que tras alta válida no hay recarga y los errores se ocultan, y tras alta inválida `estado` queda intacto y los listados no cambian
- [x] 5.2 Verificación integral manual de Fase 4: altas válidas/inválidas de libro y cliente, duplicados con formato distinto, «Sin clasificar», filtro de catálogo conservado, inserción solo como texto (probar `<script>` como título), sin `localStorage`/`fetch`/CDNs/ventas; verificar con doble clic local sin errores en consola y `git status` mostrando solo `index.html` y `js/main.js` modificados

## 6. Fix de formato en alta de cliente (bug: aceptaba letras en teléfono/DNI y números en nombre/apellido)

- [x] 6.1 Implementar `esNombreValido`, `esDniValido`, `esTelefonoValido` en `js/main.js` e integrarlas a `validarCliente()` (nombre/apellido: no vacío + solo letras incl. acentos/ñ/espacios/apóstrofe/guion con al menos una letra; DNI: vacío permitido, con contenido solo dígitos 7-8 normalizando puntos intermedios; teléfono: vacío permitido, con contenido solo dígitos y separadores `+ - espacios paréntesis` con 6-15 dígitos; errores en español por campo en `#errores-cliente`; sin cambiar required-ness del HTML, sin tocar CSS ni localStorage, solo createElement/textContent); verificar con harness Node con DOM falso que los 3 clientes semilla siguen pasando y que «456225»/«Juan123» se rechazan, «María José»/«O'Brien» se aceptan, DNI «adfdsfs»/«12» se rechazan, «30.123.456» se acepta, teléfono «asd8214» se rechaza, «341-555-0101»/«+54 341 555-0101» se aceptan y DNI/teléfono vacíos se permiten
- [x] 6.2 Verificación del fix: `node --check js/main.js` + harness Node completo (46 casos previos en verde + casos nuevos) + `openspec validate "fase-4-altas" --strict` en verde; verificar en navegador que el caso reportado (nombre «ASDASDASDDAFADSs», apellido «456225», DNI «adfdsfs», teléfono «asd8214») ahora se rechaza con errores junto al formulario
