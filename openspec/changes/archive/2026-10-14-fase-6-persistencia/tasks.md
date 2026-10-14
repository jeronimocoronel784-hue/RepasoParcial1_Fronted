# Tasks — fase-6-persistencia

## 1. Carga inicial desde localStorage (js/data.js)

- [x] 1.1 Envolver la inicialización de `estado` con lectura de las tres claves (`libreriaUTN.libros.v1`, `libreriaUTN.clientes.v1`, `libreriaUTN.ventas.v1`) en `try/catch`, con fallback por colección a `DATOS_INICIALES` si la clave falta o el JSON es ilegible; verificar abriendo `index.html` con almacenamiento vacío: se ven 6 libros, 3 clientes e historial vacío sin errores de JS.
- [x] 1.2 Dejar `DATOS_INICIALES` intacto como fuente de ejemplos (nunca escribirlo directo en `localStorage`) y validar livianamente lo leído (es array, si no → ejemplos); verificar corrompiendo `libreriaUTN.libros.v1` con texto no-JSON y recargando: el catálogo muestra los ejemplos y el resto usa lo guardado.

## 2. Guardado tras cada mutación (js/main.js)

- [x] 2.1 Guardar el array de libros en `libreriaUTN.libros.v1` tras cada alta de libro exitosa, dentro de `try/catch` con degradación a memoria; verificar dando de alta un libro válido y recargando: el libro sigue en catálogo/tabla y la clave contiene su JSON.
- [x] 2.2 Guardar el array de clientes en `libreriaUTN.clientes.v1` tras cada alta de cliente exitosa, dentro de `try/catch`; verificar dando de alta un cliente válido y recargando: sigue en tabla y `select` de ventas, y la clave contiene su JSON.
- [x] 2.3 Guardar el array de ventas en `libreriaUTN.ventas.v1` tras cada confirmación de venta, dentro de `try/catch`, persistiendo el snapshot con precio/título copiados; verificar confirmando una venta y recargando: sigue en historial con detalle intacto.
- [x] 2.4 Confirmar que no hay cambios en lógica de negocio de fases 1–5 (validaciones, cálculos, IDs deterministas, fusión de renglones) ni estilos nuevos salvo mínimo documentado; verificar por inspección del diff: solo carga/guardado + README.

## 3. README.md de entrega (raíz)

- [x] 3.1 Crear `README.md` con autor (Jerónimo Coronel — Grupo 3 + marca visible si falta otro integrante — preguntar al usuario en el apply), apertura sin npm (doble clic o Live Server), navegación entre las 5 vistas, funcionalidades implementadas y pendientes (ninguna), ubicación de datos iniciales (`js/data.js`, `DATOS_INICIALES`), límites de localStorage (navegador/perfil/origen incl. `127.0.0.1:5500` vs `file://`, no comparte entre usuarios), claves exactas + forma del JSON para la comprobación del docente, e imágenes (ninguna, todo propio); verificar que cada sección existe y los pasos corren como están escritos.
- [x] 3.2 Agregar la tabla de los 8 casos manuales (Caso / Resultado esperado / Resultado observado / Método) con los esperados de la consigna — observados pendientes de la verificación real del grupo 4; verificar que los 8 casos están presentes con sus esperados correctos.

## 4. Verificación manual de los 8 casos (evidencia real, prohibido aprobar sin ejecutar)

- [x] 4.1 Caso 1 (búsqueda parcial en mayúsculas + vacía + inexistente) ejecutado en navegador y observado registrado en el README; verificar `busqueda-sin-resultados` / `catalogo-vacio` se muestran/ocultan según corresponda.
- [x] 4.2 Caso 2 (alta libro ISBN duplicado con distinto formato + libro nuevo) ejecutado y observado registrado; verificar error de duplicado y `lib-N` correlativo para el nuevo.
- [x] 4.3 Caso 3 (alta cliente email inválido + duplicado con mayúsculas/espacios + cliente nuevo) ejecutado y observado registrado; verificar errores por campo y `cli-N` correlativo.
- [x] 4.4 Caso 4 (venta sin cliente + cantidad 0/negativa/decimal + libro repetido fusionado) ejecutado y observado registrado; verificar cada bloqueo y la fusión en un solo renglón.
- [x] 4.5 Caso 5 (venta válida 2×precioA + 1×precioB) ejecutado y observado registrado; verificar subtotales y total con 2 decimales.
- [x] 4.6 Caso 6 (precio histórico: venta confirmada + cambio solo del precio en localStorage + recarga → historial conserva valores) ejecutado y observado registrado; verificar que el detalle muestra los valores snapshot originales.
- [x] 4.7 Caso 7 (recarga tras altas y venta sin duplicar) ejecutado bajo un mismo origen y observado registrado; verificar conteos idénticos antes/después.
- [x] 4.8 Caso 8 (navegación completa por teclado + 320px sin scroll global + 1280px con grilla) ejecutado y observado registrado; verificar foco visible y layouts.
