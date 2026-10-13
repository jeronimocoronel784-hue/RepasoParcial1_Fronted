# datos-catalogo Specification

## Purpose
Provee la primera capa de datos y comportamiento del TPI: un modelo JS en memoria con catálogo generado dinámicamente, filtro por título y navegación mínima entre vistas, sin dependencias externas.

## Requirements

### Requirement: Modelo de datos en memoria con identificadores estables y relaciones

El sistema SHALL exponer en `js/data.js` colecciones de libros, editoriales, géneros, autores y clientes con identificadores estables, un conjunto inicial de al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios, donde cada libro referencia una editorial existente y uno o más autores existentes, y su género es opcional pero cuando existe referencia un género existente; al menos un libro SHALL no tener género. El archivo SHALL separar constantes `DATOS_INICIALES` del estado mutable en memoria y SHALL NOT usar `localStorage` ni `fetch`.

#### Scenario: Conjunto inicial completo y relacionado

- **WHEN** se inspecciona `js/data.js` cargado en la página
- **THEN** existen al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, cada libro resuelve su editorial y sus autores a registros existentes, y al menos un libro no tiene género asignado

#### Scenario: Género opcional válido o ausente

- **WHEN** un libro declara género
- **THEN** ese género corresponde a un género existente; y WHEN un libro no declara género THEN el catálogo lo presenta como «Sin clasificar» sin romper el render

#### Scenario: Datos en memoria listos para Fase 6 sin persistencia

- **WHEN** se revisa `js/data.js`
- **THEN** los datos iniciales viven en constantes `DATOS_INICIALES` separadas del estado mutable, no hay llamadas a `localStorage` ni a `fetch`, y la estructura permite envolverla con persistencia en Fase 6 sin refactorizar el modelo

### Requirement: Catálogo generado dinámicamente desde los datos

El sistema SHALL generar en `js/main.js` el contenido de `#lista-catalogo` a partir del array de libros, reemplazando las tarjetas estáticas de ejemplo de Fase 1, donde cada `article` muestra título, ISBN, editorial (nombre resuelto), género (nombre resuelto o «Sin clasificar»), autores (nombres resueltos) y precio.

#### Scenario: Render completo del catálogo

- **WHEN** la página carga con el conjunto inicial
- **THEN** `#lista-catalogo` contiene una tarjeta por libro con título, ISBN, editorial, género o «Sin clasificar», autores y precio, y no quedan tarjetas estáticas de ejemplo de Fase 1

#### Scenario: Libro sin género muestra «Sin clasificar»

- **WHEN** el catálogo incluye el libro sin género del conjunto inicial
- **THEN** su tarjeta muestra el texto «Sin clasificar» en el campo de género

#### Scenario: Catálogo sin libros muestra estado vacío

- **WHEN** el array de libros está vacío
- **THEN** `#lista-catalogo` queda sin tarjetas y `#catalogo-vacio` se muestra con mensaje en español mientras `#busqueda-sin-resultados` permanece oculto

### Requirement: Filtro de catálogo por título

El sistema SHALL filtrar el catálogo desde `#buscador-catalogo` por título de forma case-insensitive, con coincidencia parcial y trim de espacios en extremos; la búsqueda vacía SHALL mostrar todos los libros y una búsqueda sin coincidencias SHALL mostrar `#busqueda-sin-resultados` con mensaje claro en español y ocultar `#catalogo-vacio`.

#### Scenario: Coincidencia parcial ignorando mayúsculas y espacios

- **WHEN** el usuario escribe «  quij  » en el buscador
- **THEN** el catálogo muestra los libros cuyo título contiene «quij» sin distinguir mayúsculas/minúsculas y oculta los contenedores de estado

#### Scenario: Búsqueda vacía restaura todo el catálogo

- **WHEN** el usuario vacía el buscador o solo deja espacios
- **THEN** se muestran todos los libros y ambos contenedores de estado quedan ocultos

#### Scenario: Sin coincidencias muestra mensaje claro

- **WHEN** el usuario busca un título que no existe (por ejemplo «zzz-sin-coincidencia»)
- **THEN** `#lista-catalogo` queda sin tarjetas visibles y `#busqueda-sin-resultados` se muestra con texto en español

### Requirement: Conmutación mínima de las 5 vistas desde la navegación

El sistema SHALL conmutar en `js/main.js` las 5 secciones (`vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas`, `vista-historial`) desde los enlaces del `nav` mostrando la vista elegida y ocultando las demás con el atributo `hidden`, preservando ids, estructura semántica y accesibilidad de Fase 1; SHALL NOT implementar lógica de altas, ventas ni persistencia.

#### Scenario: Navegar entre vistas

- **WHEN** el usuario activa el enlace «Clientes» del `nav`
- **THEN** `vista-clientes` queda visible y las otras cuatro secciones quedan con `hidden`, sin errores de JS

#### Scenario: Estado inicial con catálogo visible

- **WHEN** la página carga
- **THEN** `vista-catalogo` es la vista visible y la navegación posterior conserva landmarks, `label for` y contenedores de estado intactos

### Requirement: Higiene JS, eventos y restricciones técnicas

El sistema SHALL organizar `js/main.js` en funciones con responsabilidades reconocibles (por ejemplo resolución de referencias, render de tarjeta/catálogo, filtrado, navegación) conectadas por eventos, insertar todo dato de usuario o del modelo solo como texto (`textContent` o equivalente seguro, nunca `innerHTML` con datos), y SHALL NOT usar librerías, frameworks, CDNs, `fetch`, `localStorage`, ni administrar altas/bajas/modificaciones de editoriales, géneros o autores.

#### Scenario: Datos insertados como texto seguro

- **WHEN** un título, autor o editorial contiene caracteres tipo `<b>` o `<script>`
- **THEN** se muestran como texto literal en la tarjeta y no se interpretan como HTML

#### Scenario: Sin dependencias ni persistencia ni ABM auxiliar

- **WHEN** se inspeccionan `js/data.js`, `js/main.js` e `index.html`
- **THEN** no hay `<script>` a CDNs, ni `fetch`, ni accesos a `localStorage`, ni formularios/lógica de altas/bajas/modificaciones de editoriales, géneros o autores, y la página funciona con doble clic local
