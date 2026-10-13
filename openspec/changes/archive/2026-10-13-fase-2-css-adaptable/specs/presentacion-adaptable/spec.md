# Spec Delta

## Purpose

Define la presentación adaptable de la librería solo con CSS propio: identidad visual coherente, layout legible de 320px a 1280px sin scroll global, y accesibilidad básica sin JS ni dependencias externas.

## ADDED Requirements

### Requirement: Identidad visual propia con clases reutilizables

El sistema SHALL presentar una identidad visual propia y coherente definida solo en `css/styles.css`: paleta limitada, tipografía del sistema (stack nativo, sin CDNs ni webfonts), escala de espaciado, tarjetas (`article` de catálogo), formularios y botones con clases reutilizables para elementos equivalentes.

#### Scenario: Elementos equivalentes comparten apariencia

- **WHEN** se comparan dos tarjetas de catálogo, dos formularios o dos botones equivalentes en distintas vistas
- **THEN** comparten la misma paleta, tipografía, espaciado y clases reutilizables sin estilos inline ni archivos CSS adicionales

#### Scenario: Sin dependencias externas de presentación

- **WHEN** se inspecciona `css/styles.css` y `index.html`
- **THEN** no hay `<link>` a CDNs, ni `@import` remoto, ni webfonts externas, ni frameworks; la tipografía resuelve con el stack del sistema

### Requirement: Layout adaptable sin desplazamiento horizontal global

El sistema SHALL disponer el contenido con Grid como sistema principal de layout (página y grilla de catálogo) y Flexbox como apoyo (nav, formularios, resumen), legible en 320px y 1280px, SIN desplazamiento horizontal de toda la página; si una tabla necesita más ancho, SHALL desplazarse dentro de su propio contenedor (`overflow-x: auto` en wrapper o técnica CSS equivalente).

#### Scenario: Móvil 320px sin scroll global

- **WHEN** se abre la página a 320px de ancho y se recorre cada una de las 5 vistas
- **THEN** textos y controles son legibles, el contenido se reordena/apila y no aparece barra de scroll horizontal en `body`/`html`

#### Scenario: Escritorio 1280px aprovecha el ancho

- **WHEN** se abre la página a 1280px de ancho
- **THEN** el catálogo muestra varias tarjetas por fila, los formularios y tablas usan el ancho disponible con un `max-width` y centrado coherentes, sin columnas desbordadas fuera del viewport

#### Scenario: Tabla ancha con scroll interno

- **WHEN** una tabla (libros, clientes, historial) supera el ancho de su vista a 320px
- **THEN** solo el contenedor de esa tabla muestra scroll horizontal interno y el resto de la página permanece fija sin scroll global

### Requirement: Accesibilidad básica de presentación

El sistema SHALL garantizar foco visible en todos los controles interactivos, preservar el orden natural de tabulación y el atributo `hidden` de vistas sin alterarlos desde CSS, mostrar mensajes de error con texto descriptivo (icono/texto, nunca solo color), y exigir que toda imagen futura sea local con `alt` apropiado (informativa con `alt` descriptivo, decorativa con `alt=""` y `aria-hidden="true"`).

#### Scenario: Foco visible recorrible por teclado

- **WHEN** se navega con Tab por nav, buscador, formularios, selects y botones
- **THEN** cada control enfocado muestra un indicador de foco visible de alto contraste y el orden sigue el orden del DOM sin trampas ni `display` que rompa `hidden`

#### Scenario: Error comprensible sin depender del color

- **WHEN** aparece un mensaje de error (por ejemplo `mensaje-venta-error` o validación nativa estilizada)
- **THEN** el mensaje incluye texto descriptivo en español y un icono o prefijo textual (p. ej. "Error: …"), manteniendo contraste suficiente aunque se desactive el color

### Requirement: Restricciones técnicas CSS-only y nomenclatura consistente

El sistema SHALL resolver toda la presentación solo con `css/styles.css`, sin implementar JS (fases 3–5), sin cambiar ids/names/estructura semántica de Fase 1, y con nombres de clase en un solo idioma y una metodología simple documentada en `design.md`; el único cambio permitido en `index.html` es agregar el wrapper de tablas documentado.

#### Scenario: HTML de Fase 1 intacto salvo wrapper

- **WHEN** se compara `index.html` antes y después del apply
- **THEN** todos los ids, names, landmarks, `label for`, `thead`/`th` y `hidden` están intactos; la única diferencia permitida es un `div` contenedor alrededor de cada `table`

#### Scenario: Clases consistentes y documentadas

- **WHEN** se revisan las clases usadas en `index.html` y `css/styles.css`
- **THEN** están en un solo idioma, siguen la metodología declarada en `design.md` y no hay estilos inline ni selectores por id para presentación reutilizable
