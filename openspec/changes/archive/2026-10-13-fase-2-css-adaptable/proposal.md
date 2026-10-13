# Proposal

## Why

Fase 1 entregó `index.html` semántico con 5 vistas pero sin presentación: `css/styles.css` no existe aunque ya está cableado en `<head>`. El Ejercicio 2 (20 pts) exige identidad visual propia, layout adaptable 320px–1280px y accesibilidad básica usando solo HTML+CSS propio, sin JS ni frameworks.

## What Changes

- Crear `css/styles.css` como único archivo de estilos (sin CDNs, sin webfonts externas, sin librerías).
- Definir identidad visual propia y mínima: paleta, tipografía del sistema, espaciado, tarjetas de catálogo, formularios y botones con clases reutilizables.
- Implementar layout adaptable con un sistema principal elegido y justificado (Grid) + Flex como apoyo; sin scroll horizontal global; tablas con desplazamiento interno en su contenedor.
- Cubrir accesibilidad básica de presentación: foco visible, orden natural de teclado intacto, errores con texto+icono (no solo color), reglas para imágenes futuras (locales + `alt` apropiado).
- Permitir como única excepción un ajuste mínimo a `index.html`: envolver cada `table` en un `div.tabla-contenedor` si es imprescindible para el scroll interno; documentado en `design.md`. Sin cambiar ids/names/estructura semántica ni implementar JS.

## Capabilities

### New Capabilities

- `presentacion-adaptable`: identidad visual, layout adaptable y accesibilidad de presentación solo con `css/styles.css` (más el wrapper opcional documentado).

### Modified Capabilities

Ninguna — los specs base `estructura-base` y `vistas-libreria` no cambian; los deltas de este change son puramente aditivos sobre presentación.

## Impact

- Nuevo archivo: `css/styles.css` (único archivo tocado en apply, salvo wrapper).
- Posible edición mínima: `index.html` (solo agregar `div.tabla-contenedor` alrededor de las 3–4 tablas; sin tocar ids/names/semántica ni `hidden` de vistas).
- Sin impacto en `js/` (sigue vacío hasta fases 3–5). Sin nuevas dependencias.
