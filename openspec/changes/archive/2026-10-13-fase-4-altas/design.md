# Design — fase-4-altas

## Context

Ver `proposal.md` (Why) y `specs/altas-catalogo/spec.md` para el contrato de comportamiento. Estado actual observado: `index.html` tiene `form#form-libro` con `input` de texto en `#libro-editorial`, `#libro-genero`, `#libro-autores` (hoy no son `select`), y `form#form-cliente` con 5 campos (`nombre`, `apellido`, `dni`, `email`, `telefono`); existen `#mensaje-exito` / `#mensaje-error` globales pero no hay contenedores de error por formulario. `js/data.js` expone `DATOS_INICIALES` + `estado` mutable con ids `lib-N`, `cli-N`, `ed-N`, `gen-N`, `aut-N` y `generoId: null` como ausencia. `js/main.js` ya tiene resolución de referencias (`obtenerNombreEditorial/Genero/Autores`), `renderCatalogo`, `filtrarLibros`, `mostrarVista` e inserción solo con `textContent`.

## Goals / Non-Goals

**Goals:**

- Convertir los 3 campos de libro a `select` poblados desde `estado` sin romper ids/names/landmarks ni estilos de Fase 2.
- Validar y agregar libros y clientes en memoria con ids `max+1` por prefijo y actualización de vistas sin recargar.
- Mostrar errores en español junto al formulario que falló, con inserción segura como texto.

**Non-Goals:**

- No ventas, no historial/detalle, no `localStorage`/persistencia, no edición/eliminación, no ABM de editoriales/géneros/autores, no cambios visuales salvo el mínimo aquí documentado.

## Decisions

1. **Conversión mínima en `index.html`: `input` → `select` preservando ids/names.** `#libro-editorial` pasa a `select name="editorial"`, `#libro-genero` a `select name="genero"` (primera opción `value=""` texto «Sin clasificar»), `#libro-autores` a `select multiple name="autores"`. Alternativa (datalist/autocomplete) descartada: el `select` garantiza que el valor enviado sea un id existente y simplifica la validación de existencia. Los `label for` y el botón «Agregar libro» quedan intactos.
   - **Contenedores de error por formulario (agregado mínimo):** agregar `<div id="errores-libro" role="alert" hidden>` dentro de `vista-libros` tras `form#form-libro`, y `<div id="errores-cliente" role="alert" hidden>` dentro de `vista-clientes` tras `form#form-cliente`. Reutilizan clases de error existentes del CSS (sin estilos nuevos). Alternativa (solo `#mensaje-error` global) descartada: la consigna pide errores cerca del formulario.
   - **Formulario de cliente sin recorte de campos:** se conservan los 5 campos de Fase 1 (`nombre`, `apellido`, `dni`, `email`, `telefono`) con ids/names intactos; «nombre completo» = `nombre` + `apellido` (ambos no vacíos tras trim); las reglas nuevas de unicidad/formato aplican solo a `email`; `dni`/`telefono` se guardan tal cual. Alternativa (reducir el form a 2 campos) descartada: rompería ids/names estables de Fase 1 y el spec base `vistas-libreria`.

2. **Nuevas funciones en `js/main.js`, sin tocar `js/data.js` salvo mutar `estado`.** `poblarSelectsLibro()` (reconstruye opciones desde `estado`, preserva «Sin clasificar» primera), `normalizarISBN(isbn)` (quita espacios y guiones + minúsculas para comparar), `normalizarEmail(email)` (trim + minúsculas), `esEmailValido(email)` (regex simple `^[^\s@]+@[^\s@]+\.[^\s@]+$`), `siguienteId(prefijo, coleccion)` (max numérico + 1 por prefijo), `validarLibro(datos) → {errores[], valor}` / `validarCliente(datos) → {errores[], valor}`, `mostrarErrores(contenedor, errores)` (lista como texto, `hidden` si vacío), `agregarFilaLibro(libro)` / `agregarFilaCliente(cliente)` o re-render de `tbody`, handlers `onSubmitLibro` / `onSubmitCliente` con `preventDefault`. Tras alta: `push` a `estado`, re-`renderCatalogo` respetando el filtro actual, actualizar tabla y selects, `form.reset()`, ocultar errores. Todo dato se inserta con `textContent`/`createElement`, nunca `innerHTML`.
   - Precio: `Number(valor)` finito y `> 0`; se guarda como número (acepta decimales por `step="0.01"` del input existente).
   - ISBN unicidad: comparar `normalizarISBN` contra cada libro; título/ISBN con `trim`, vacíos se rechazan.
   - Género: `value=""` → `generoId: null`; otro valor debe existir en `estado.generos`.
    - Autores: `selectedOptions` del `select multiple`; mínimo 1 y cada id debe existir.
    - Fix formato cliente (grupo 6): `esNombreValido(texto)` (trim no vacío, regex de solo letras incl. acentos/ñ/espacios/apóstrofe/guion con al menos una letra), `esDniValido(dni)` (vacío permitido; con contenido, quitar puntos intermedios y exigir 7-8 dígitos), `esTelefonoValido(tel)` (vacío permitido; con contenido, solo dígitos y separadores `+ - espacios paréntesis` con 6-15 dígitos tras normalizar); integradas a `validarCliente()` con un error en español por campo. Sin cambiar required-ness del HTML, sin tocar CSS ni `localStorage`.

3. **Re-render sin recarga y sin romper Fase 3.** `renderCatalogo(filtrarLibros(buscador.value))` tras cada alta de libro para no perder el filtro; tablas de libros/clientes se re-renderizan desde `estado` (o se agrega la fila) actualizando `#libros-vacio` / `#clientes-vacio` con `hidden`. `mostrarVista`/navegación y `hidden` no se alteran desde CSS ni JS nuevo.

## Risks / Trade-offs

- [Riesgo] `select multiple` poco descubrible para elegir varios autores → Mitigación: `size` visible + texto de ayuda en el `label` («Mantenga Ctrl para varios»), sin cambiar estilos base.
- [Riesgo] Colisión de ids si el cálculo max+1 parsea mal un id manual → Mitigación: `siguienteId` ignora sufijos no numéricos y usa `max(0)+1`, estable y determinista.
- [Riesgo] Regex de email demasiado estricta o laxa → Mitigación: validación simple documentada (una `@`, dominio con punto, sin espacios) + unicidad case-insensitive con trim; coincide con el `type="email"` nativo sin depender de él.
- [Trade-off] Re-render completo de tablas/selects en cada alta (O(n) pequeño) a cambio de código simple sin estado derivado; aceptable para catálogo de aula.

## Migration Plan

- Apply directo sobre el working tree: editar `index.html` (3 `select` + 2 contenedores), extender `js/main.js`, sin migraciones ni rollback más allá de `git diff`/`git checkout`. Verificación manual: altas válidas/ inválidas de libro y cliente, ISBN/email duplicados con formato distinto, «Sin clasificar», filtro conservado, doble clic local sin consola con errores.

## Open Questions

- Ninguna que cambie specs, enfoque o tareas; el detalle de mensaje exacto por campo se fija en apply dentro del contrato (texto español junto al formulario).
