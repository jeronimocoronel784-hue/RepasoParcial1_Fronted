# Design

## Context

Ver `proposal.md` (Why). Estado actual: `index.html` Fase 1 (254 líneas, 5 vistas con `hidden`, `label for`, `thead`/`th`, mensajes `role="status"`/`role="alert"`) implementado; `css/styles.css` no existe aunque `<link rel="stylesheet" href="css/styles.css">` ya está cableado; `js/` fuera de alcance hasta fases 3–5. Restricciones duras: sin librerías/frameworks/CDNs/webfonts, sin JS, sin cambiar ids/names/semántica. Ver specs del change: `specs/presentacion-adaptable/spec.md`; specs base (`estructura-base`, `vistas-libreria`) como contexto intacto.

## Goals / Non-Goals

**Goals:**

- Un solo `css/styles.css` prolijo y mínimo que cubra identidad, layout y a11y del Ejercicio 2.
- Justificar Grid como principal + Flex como apoyo y dejarlo verificable en 320px/1280px.
- Documentar tokens, metodología de clases y el wrapper opcional para que el apply sea mecánico.

**Non-Goals:**

- No implementar JS, validaciones dinámicas, ni vista de detalle interactiva (fases 3–5).
- No agregar imágenes, logos externos ni webfonts (si el apply agrega alguna decorativa futura, rigen las reglas del spec; en este change no se agregan).
- No reescribir ni modificar los specs base.

## Decisions

### 1. Grid como sistema principal, Flex como apoyo

**Decisión:** Grid para la estructura de página (`body` → `header`/`main`/`footer`) y para la grilla de catálogo (`#lista-catalogo` con `repeat(auto-fit, minmax(240px, 1fr))`); Flexbox para `nav ul`, filas de formulario, `#renglones-venta` y `#resumen-venta`.

**Rationale:** Grid resuelve en una línea el requisito "tarjetas + página que se reordena de 1280px a 320px" sin media queries frágiles; Flex es superior para secuencias unidimensionales (nav, label+input). Un solo sistema principal evita mezclar mental models.

**Alternativas consideradas:** Solo Flex (descartado: la grilla de tarjetas exige wrapping manual y anchos calculados, más frágil a 320px); framework/CDN (prohibido por la consigna).

### 2. Tokens mínimos propios (dirección estética consultada, no copiada)

Se consultó el skill `frontend-design` solo para dirección (identidad sobria de librería universitaria, un acento memorable, resto disciplinado). Identidad propia y mínima, sin parecerse a templates:

- Paleta (4 + estados): `--fondo: #faf8f2` (papel), `--tinta: #1f2933` (texto), `--primario: #1e3a5f` (azul biblioteca, header/botones), `--acento: #b45309` (ocre quemado, memorable: enlaces activos, precio, foco); estados `--exito: #166534`, `--error: #b91c1c` siempre acompañados de texto+icono.
- Tipografía: stack del sistema `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; serif solo para `h1/h2` con `Georgia, "Times New Roman", serif` (eco librería, cero descargas). Escala `1rem/1.25/1.5/2rem`, línea ≤70ch en `main`.
- Espaciado: escala `4/8/16/24/32px` vía variables; radio `8px` tarjetas, `6px` controles; sombra única sutil solo en tarjetas.
- Contraste: tinta sobre fondo y blanco sobre primario verificados ≥4.5:1 (se verifica en tasks con inspección, sin herramientas externas obligatorias).

### 3. Metodología de clases simple en español

**Decisión:** Español consistente con los ids existentes + BEM simplificado de un nivel: bloques `.tarjeta`, `.boton`, `.boton--secundario`, `.campo`, `.formulario`, `.tabla-contenedor`, `.mensaje-error`, `.mensaje-exito`, `.resumen`. Sin selectores por `#id` para presentación reutilizable (los ids quedan para el JS futuro); sin estilos inline.

**Alternativa:** Inglés (`.card/.btn`) — descartada por coherencia con ids en español (`vista-catalogo`, `buscador-catalogo`).

### 4. Tablas con scroll interno, página sin scroll global

**Decisión:** Solo CSS preferido: `.tabla-contenedor { overflow-x: auto; }` + `table { min-width: 560px; }` + `html, body { overflow-x: hidden; }` como red de seguridad + `img, table { max-width: 100%; }`. Base: `*, *::before, *::after { box-sizing: border-box; }` y `meta viewport` ya presente.

**Modificación permitida a `index.html` (única):** si el apply confirma que `overflow` sobre `table` directo es inconsistente entre navegadores, envolver cada una de las 4 tablas (`tabla-libros`, `tabla-clientes`, `tabla-historial` + futura si aplica) en `<div class="tabla-contenedor">`. Sin tocar ids, names, `thead`/`th`, `hidden`, landmarks ni textos. Si el envoltorio no fuera necesario, el apply NO toca `index.html`.

### 5. Accesibilidad de presentación

- Foco: `:focus-visible { outline: 3px solid var(--acento); outline-offset: 2px; }` en enlaces, inputs, selects, buttons; nunca `outline: none` sin reemplazo.
- Orden/`hidden`: ninguna regla `display` sobre `section[hidden]`; el layout usa `main > section` sin reordenamientos (`order` prohibido).
- Errores: `.mensaje-error` con borde lateral + prefijo textual "Error: " vía `::before` (no solo color); respeta `role="alert"`/`role="status"` ya existentes.
- Imágenes: en este change no se agregan; regla futura: locales + `alt` descriptivo o `alt=""` + `aria-hidden="true"`.
- Movimiento: `@media (prefers-reduced-motion: reduce)` sin transiciones (solo se permite transición de 150ms en hover de botones).

## Risks / Trade-offs

- [Gris claro + ocre sobre papel] → Mitigación: verificar contraste ≥4.5:1 en texto y foco; oscurecer variables si falla.
- [Wrapper requiere tocar `index.html`] → Mitigación: cambio documentado y mínimo (solo `div`s); el diff del apply debe mostrarlo explícito.
- [`overflow-x: hidden` en `body` puede ocultar un desborde real] → Mitigación: es red de seguridad; la verificación 320px exige detectar qué elemento desborda y corregirlo, no esconderlo.
- [Un solo breakpoint implícito (auto-fit) puede no bastar] → Mitigación: un `@media (max-width: 480px)` de refuerzo para nav apilado y formularios a una columna; nada más.

## Migration Plan

Apply crea `css/styles.css` y, solo si hace falta, agrega los `div.tabla-contenedor` en `index.html`. Rollback: borrar `css/styles.css` (la página vuelve al HTML sin estilos, Fase 1 intacta) y revertir los `div`s. Sin migraciones de datos ni dependencias.

## Open Questions

Ninguna que cambie specs o tareas — la elección Grid/Flex, tokens y wrapper están resueltos arriba. Detalles de tonos exactos se ajustan en apply dentro de los rangos documentados.
