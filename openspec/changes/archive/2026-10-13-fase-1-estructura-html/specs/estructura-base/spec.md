# Spec Delta

## Purpose

Define el shell HTML5 válido y semántico del TPI Librería como base estática común: landmarks, accesibilidad mínima y cableado de assets para las fases siguientes.

## ADDED Requirements

### Requirement: Documento HTML5 válido en español

El sistema SHALL entregar `index.html` como documento HTML5 con `<!doctype html>`, `html lang="es"`, `meta charset="utf-8"`, `meta viewport` y un `title` no vacío.

#### Scenario: Estructura mínima del documento

- **WHEN** se abre `index.html` en un navegador o validador HTML
- **THEN** el documento declara doctype html, idioma español, charset utf-8, viewport responsive y título visible

### Requirement: Landmarks semánticos header/nav/main/footer

El sistema SHALL estructurar la página con un `header` (título de la librería + `nav` con 5 enlaces a las vistas), un `main` que contiene las 5 `section`, y un `footer`.

#### Scenario: Navegación entre las 5 vistas

- **WHEN** un usuario inspecciona el `nav` del `header`
- **THEN** encuentra 5 enlaces/botones con texto en español que apuntan a `vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas` y `vista-historial`

#### Scenario: Landmarks presentes

- **WHEN** se recorre el documento por landmarks
- **THEN** existen `header`, `nav`, `main` y `footer`, y cada vista es una `section` con encabezado propio dentro de `main`

### Requirement: Accesibilidad base de formularios, tablas y botones

El sistema SHALL asociar cada campo con un `label for`, dar a cada botón un texto-acción en español y dotar a cada tabla de `thead` con `th`.

#### Scenario: Campos etiquetados

- **WHEN** se revisa cualquier `input` o `select` de las vistas Libros, Clientes, Ventas o el buscador del Catálogo
- **THEN** cada campo tiene un `label` asociado mediante atributo `for` y nombre accesible en español

#### Scenario: Tablas y botones comprensibles

- **WHEN** se revisan los listados (catálogo, libros, clientes, historial) y las acciones
- **THEN** cada tabla tiene `thead` con `th` descriptivos y cada botón muestra un texto-acción (por ejemplo "Agregar libro", "Agregar cliente", "Registrar venta")

### Requirement: Contenedores de estado global y cableado de assets

El sistema SHALL incluir contenedores para lista vacía, búsqueda sin resultados y mensajes de éxito/error, y cablear `<link rel="stylesheet" href="css/styles.css">` en `head` más `<script src="js/data.js">` y `<script src="js/main.js">` al cierre de `body` sin implementar CSS ni JS funcional en esta fase.

#### Scenario: Estados y assets cableados

- **WHEN** se inspecciona el HTML sin estilos ni lógica aplicada
- **THEN** existen los contenedores de estado (vacío, sin resultados, éxito, error) y las referencias a `css/styles.css`, `js/data.js` y `js/main.js` están presentes aunque esos archivos aún estén vacíos
