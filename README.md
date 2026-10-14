# TPI Frontend — Librería UTN (Grupo 3)

**Integrantes — Grupo 3:**

- Jeronimo Coronel
- Sabrina Gimenez
- Joaquin Godoy
- Ismael Saleme

## Cómo abrir la app (sin npm, sin instalación)

La app es solo HTML + CSS + JavaScript vanilla. No requiere Node, npm ni servidor.

- **Opción A — doble clic:** abrir el archivo `index.html` con el navegador (doble clic desde el explorador de archivos).
- **Opción B — Live Server (VS Code):** instalar la extensión “Live Server”, clic derecho sobre `index.html` → “Open with Live Server” (típicamente abre en `http://127.0.0.1:5500`).

## Navegación (5 vistas)

El `nav` del encabezado conmuta entre las 5 secciones (solo una visible a la vez):

1. **Catálogo** (`vista-catalogo`): tarjetas de libros + buscador por título.
2. **Libros** (`vista-libros`): formulario “Agregar libro” + tabla de libros.
3. **Clientes** (`vista-clientes`): formulario “Agregar cliente” + tabla de clientes.
4. **Ventas** (`vista-ventas`): cliente + renglones (libro/cantidad) + resumen + “Registrar venta”.
5. **Historial** (`vista-historial`): tabla de ventas + detalle de la venta seleccionada.

## Funcionalidades implementadas

- Catálogo dinámico con filtro por título (parcial, insensible a mayúsculas) y estados vacío / sin resultados.
- Alta de libros con validación (título, ISBN único normalizando guiones/espacios, precio > 0, editorial/autores existentes, género opcional) e IDs correlativos `lib-N`.
- Alta de clientes con validación (nombre/apellido con letras, DNI 7–8 dígitos opcional, email válido y único normalizado, teléfono opcional) e IDs correlativos `cli-N`.
- Ventas con borrador editable (agregar/quitar renglones, fusión de libro repetido), validación (cliente obligatorio, cantidades enteras > 0), snapshot histórico (título + precio copiados) y total con 2 decimales.
- Persistencia en `localStorage`: carga inicial por colección, guardado tras cada alta/venta, degradación a memoria si el navegador lo bloquea.

## Pendientes

Ninguna. No se exige editar ni eliminar registros.

## Datos iniciales

Viven en `js/data.js`, objeto `DATOS_INICIALES`: 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes de ejemplo. Es la fuente de ejemplos cuando el `localStorage` está vacío o una clave está corrupta; nunca se escribe directo en `localStorage`.

## Persistencia (localStorage): funcionamiento y límites

- Al iniciar, la app lee las 3 claves (ver abajo). Si una clave falta, no es JSON válido o no es un array, esa colección usa los ejemplos (`ventas` usa `[]`); las demás usan lo guardado. Reabrir nunca duplica.
- Tras cada alta de libro, alta de cliente o venta confirmada se guarda el array completo de esa colección. Todo acceso está en `try/catch`: si falla (cuota/modo privado), la sesión sigue en memoria.
- **Límites:** los datos dependen del navegador, del perfil y de la ubicación de apertura (origen). Abrir con doble clic (`file://`) y con Live Server (`http://127.0.0.1:5500`) son orígenes distintos: **no comparten datos**. Verificar los casos 6–7 bajo un mismo origen. Los datos no se comparten entre usuarios o equipos.

## Comprobación guiada del docente (claves exactas)

En DevTools → Application → Local Storage están:

- `libreriaUTN.libros.v1` → JSON del array de libros. Cada libro: `{"id":"lib-N","titulo":"…","isbn":"…","editorialId":"ed-N","generoId":"gen-N|null","autorIds":["aut-N",…],"precio":15000}`.
- `libreriaUTN.clientes.v1` → JSON del array de clientes. Cada cliente: `{"id":"cli-N","nombre":"…","apellido":"…","dni":"…","email":"…","telefono":"…"}`.
- `libreriaUTN.ventas.v1` → JSON del array de ventas. Cada venta: `{"id":"v-N","fecha":"…","clienteId":"cli-N","clienteNombre":"…","renglones":[{"libroId":"lib-N","titulo":"…","precioUnitario":15000,"cantidad":2,"subtotal":30000}],"total":38000}`.

Para volver a los ejemplos: borrar las tres claves (o `localStorage.clear()`) y recargar. Para probar el fallback: escribir texto no-JSON en `libreriaUTN.libros.v1` y recargar → el catálogo muestra los 6 ejemplos y el resto usa lo guardado.

## Imágenes

Ninguna. Todo el contenido visual es propio (HTML semántico + CSS propio, sin imágenes externas ni CDNs).

## Tabla de los 8 casos manuales

| Caso | Resultado esperado | Resultado observado | Método |
|------|--------------------|---------------------|--------|
| 1. Búsqueda parcial en mayúsculas (“QUIJOTE”), vacía e inexistente | Parcial encuentra 1 (lib-1); vacía devuelve los 6; inexistente devuelve [] mostrando `busqueda-sin-resultados` y ocultando `catalogo-vacio` | Parcial → 1 (lib-1); vacía → 6; inexistente → 0 con `busqueda-sin-resultados` visible y `catalogo-vacio` oculto; con resultados ambos ocultos | harness Node |
| 2. Alta libro con ISBN duplicado en distinto formato + libro nuevo | Duplicado (“978 84 376 0494 7”) bloquea con error de duplicado; el nuevo se guarda con id `lib-7` | Error “El ISBN está duplicado…”; alta “El Aleph (prueba)” con id `lib-7` (7 libros) y la clave `libreriaUTN.libros.v1` lo contiene | harness Node |
| 3. Alta cliente con email inválido, duplicado con mayúsculas/espacios + cliente nuevo | Email inválido y duplicado bloquean con error por campo; el nuevo se guarda con id `cli-N` correlativo | “sin-arroba” → error de formato; “JUAN.PEREZ@EJEMPLO.COM con espacios” → error de duplicado; alta Pedro Gómez con id `cli-4` (4 clientes) y la clave lo contiene | harness Node |
| 4. Venta sin cliente, cantidad 0/negativa/decimal, libro repetido | Cada caso inválido se bloquea; el libro repetido se fusiona en un solo renglón | Sin cliente → “Debe seleccionar un cliente…”; 0/−2/1.5 → “entero mayor a cero”; 1 + 2 del mismo libro → un renglón con cantidad 3 | harness Node |
| 5. Venta válida 2×lib-1 ($15000) + 1×lib-2 ($8000) | Subtotales $30000.00 y $8000.00, total $38000.00 | Venta `v-1`, subtotales 30000/8000, total 38000, formato “38000.00”; clave `libreriaUTN.ventas.v1` con snapshot (título + precioUnitario) | harness Node |
| 6. Precio histórico: venta confirmada + cambio solo del precio en localStorage + recarga | El historial conserva precio unitario, subtotal y total originales | Tras cambiar lib-1 a 99999 en `libreriaUTN.libros.v1` y recargar: detalle con precioUnitario 15000, subtotal 30000, total 38000 | harness Node |
| 7. Recarga tras altas y venta, sin duplicar | Conteos idénticos antes/después bajo el mismo origen | Antes 7 libros / 4 clientes / 1 venta; después 7/4/1 con lib-7, cli-4 y v-1 presentes e historial intacto | harness Node |
| 8. Navegación completa por teclado + 320px sin scroll global + 1280px con grilla | Foco visible en todo el recorrido; 320px sin scroll horizontal global; 1280px con grilla | Verificado en navegador: foco visible, sin scroll global a 320px y grilla a 1280px | navegador (desarrollador, Fase 2) |
