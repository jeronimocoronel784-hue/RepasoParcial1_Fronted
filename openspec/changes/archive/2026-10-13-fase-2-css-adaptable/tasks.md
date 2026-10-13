# Tasks

## 1. Base y tokens en `css/styles.css`

- [x] 1.1 Crear `css/styles.css` con reset (`box-sizing`), variables de paleta/tipografía/espaciado y estilos base de `body`/`main`/tipografía, y verificar que `index.html` carga el archivo sin errores 404 en la consola del navegador
- [x] 1.2 Definir clases reutilizables `.boton`, `.boton--secundario`, `.campo`, `.formulario` y verificar visualmente que los 3 formularios y sus botones comparten apariencia

## 2. Layout principal (Grid + Flex) y catálogo

- [x] 2.1 Maquetar `header`/`main`/`footer` con Grid y `nav ul`/formularios/`#resumen-venta` con Flex, y verificar que el nav y los formularios se apilan sin roturas a 320px
- [x] 2.2 Estilar `#lista-catalogo` como grilla `auto-fit minmax(240px, 1fr)` con `.tarjeta` para cada `article`, y verificar que a 1280px hay varias tarjetas por fila y a 320px una sola columna legible

## 3. Tablas con scroll interno y mensajes

- [x] 3.1 Agregar `div.tabla-contenedor` alrededor de cada `table` en `index.html` (único cambio HTML permitido) y clase `.tabla-contenedor { overflow-x: auto; }`, y verificar por diff que no cambió ningún id/name/`hidden`/texto
- [x] 3.2 Estilar tablas, estados vacíos y `.mensaje-error`/`.mensaje-exito` (con prefijo textual "Error: "/"Éxito: " vía `::before`), y verificar que los mensajes se entienden sin depender del color

## 4. Accesibilidad y responsive integral

- [x] 4.1 Aplicar `:focus-visible` de alto contraste, preservar `hidden` y orden de tabulación, agregar `prefers-reduced-motion`, y verificar recorriendo toda la página solo con Tab que el foco siempre es visible y el orden es natural
- [x] 4.2 Verificación responsive 320px y 1280px en las 5 vistas (texto/controles legibles, sin scroll horizontal de `body`, tablas con scroll interno), y verificar con captura o inspección que no hay desbordes globales

## 5. Cierre

- [x] 5.1 Revisar que no hay CDNs/webfonts/frameworks/JS/clases en otro idioma/estilos inline y que el contraste de texto es suficiente, y verificar con `openspec validate "fase-2-css-adaptable" --strict` en verde
