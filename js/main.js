"use strict";

/* Lógica de catálogo y navegación mínima (Ejercicio 3).
   Depende de js/data.js (DATOS_INICIALES + estado). Sin librerías,
   sin carga remota. Todos los datos se insertan solo como texto
   seguro, nunca como marcado. La persistencia en localStorage
   (Ejercicio 6 / Fase 6) vive solo en guardarLibros/guardarClientes/
   guardarVentas + la carga inicial de js/data.js. */

var GENERO_SIN_CLASIFICAR = "Sin clasificar";

/* Persistencia local (Ejercicio 6 / Fase 6). Guarda el array completo
   de la colección tras cada mutación exitosa. Todo acceso está en
   try/catch: si el navegador bloquea localStorage (cuota excedida,
   modo privado) se degrada a memoria y la sesión sigue funcional. */
function guardarColeccion(clave, valor) {
  try {
    if (typeof localStorage === "undefined" || localStorage === null) {
      return;
    }
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    /* Degradación a memoria: la operación en curso ya se completó. */
  }
}

function guardarLibros() {
  guardarColeccion(
    (typeof CLAVES_STORAGE !== "undefined" && CLAVES_STORAGE.libros) || "libreriaUTN.libros.v1",
    estado.libros
  );
}

function guardarClientes() {
  guardarColeccion(
    (typeof CLAVES_STORAGE !== "undefined" && CLAVES_STORAGE.clientes) || "libreriaUTN.clientes.v1",
    estado.clientes
  );
}

function guardarVentas() {
  guardarColeccion(
    (typeof CLAVES_STORAGE !== "undefined" && CLAVES_STORAGE.ventas) || "libreriaUTN.ventas.v1",
    estado.ventas
  );
}

function crearMapaPorId(registros) {
  var mapa = new Map();
  registros.forEach(function (r) {
    mapa.set(r.id, r);
  });
  return mapa;
}

function obtenerMapaEditoriales() {
  return crearMapaPorId(estado.editoriales);
}

function obtenerMapaGeneros() {
  return crearMapaPorId(estado.generos);
}

function obtenerMapaAutores() {
  return crearMapaPorId(estado.autores);
}

function obtenerNombreEditorial(editorialId) {
  var mapa = obtenerMapaEditoriales();
  var editorial = mapa.get(editorialId);
  return editorial ? editorial.nombre : "Desconocida";
}

function obtenerNombreGenero(generoId) {
  if (generoId === null || generoId === undefined) {
    return GENERO_SIN_CLASIFICAR;
  }
  var mapa = obtenerMapaGeneros();
  var genero = mapa.get(generoId);
  return genero ? genero.nombre : GENERO_SIN_CLASIFICAR;
}

function obtenerNombresAutores(autorIds) {
  if (!Array.isArray(autorIds) || autorIds.length === 0) {
    return "Desconocido";
  }
  var mapa = obtenerMapaAutores();
  var nombres = autorIds
    .map(function (id) {
      var autor = mapa.get(id);
      return autor ? autor.nombre : null;
    })
    .filter(function (nombre) {
      return nombre !== null;
    });
  return nombres.length > 0 ? nombres.join(", ") : "Desconocido";
}

function crearParrafo(etiqueta, valor) {
  var p = document.createElement("p");
  p.textContent = etiqueta + ": " + valor;
  return p;
}

function crearTarjetaLibro(libro) {
  var article = document.createElement("article");

  var titulo = document.createElement("h3");
  titulo.textContent = libro.titulo;
  article.appendChild(titulo);

  article.appendChild(crearParrafo("ISBN", libro.isbn));
  article.appendChild(crearParrafo("Editorial", obtenerNombreEditorial(libro.editorialId)));
  article.appendChild(crearParrafo("Género", obtenerNombreGenero(libro.generoId)));
  article.appendChild(crearParrafo("Autores", obtenerNombresAutores(libro.autorIds)));
  article.appendChild(crearParrafo("Precio", "$" + libro.precio));

  return article;
}

function renderCatalogo(lista) {
  var contenedor = document.getElementById("lista-catalogo");
  var vacio = document.getElementById("catalogo-vacio");
  var sinResultados = document.getElementById("busqueda-sin-resultados");

  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }

  lista.forEach(function (libro) {
    contenedor.appendChild(crearTarjetaLibro(libro));
  });

  if (estado.libros.length === 0) {
    vacio.hidden = false;
    sinResultados.hidden = true;
    return;
  }

  if (lista.length === 0) {
    vacio.hidden = true;
    sinResultados.hidden = false;
    return;
  }

  vacio.hidden = true;
  sinResultados.hidden = true;
}

function normalizar(texto) {
  return String(texto === undefined || texto === null ? "" : texto)
    .trim()
    .toLowerCase();
}

function filtrarLibros(termino) {
  var busqueda = normalizar(termino);
  if (busqueda === "") {
    return estado.libros.slice();
  }
  return estado.libros.filter(function (libro) {
    return normalizar(libro.titulo).indexOf(busqueda) !== -1;
  });
}

function mostrarVista(vistaId) {
  var secciones = document.querySelectorAll('main section[id^="vista-"]');
  var destino = document.getElementById(vistaId);
  if (!destino) {
    return;
  }
  secciones.forEach(function (seccion) {
    seccion.hidden = seccion.id !== vistaId;
  });
  if (vistaId === "vista-ventas" && typeof refrescarVistaVentas === "function") {
    refrescarVistaVentas();
  }
  if (vistaId === "vista-historial" && typeof renderHistorial === "function") {
    renderHistorial();
  }
}

function inicializarCatalogo() {
  var buscador = document.getElementById("buscador-catalogo");
  buscador.addEventListener("input", function (evento) {
    renderCatalogo(filtrarLibros(evento.target.value));
  });
  renderCatalogo(estado.libros);
}

function inicializarNavegacion() {
  var nav = document.querySelector("nav");
  nav.addEventListener("click", function (evento) {
    var enlace = evento.target.closest("a[data-view]");
    if (!enlace) {
      return;
    }
    evento.preventDefault();
    mostrarVista(enlace.getAttribute("data-view"));
  });
  mostrarVista("vista-catalogo");
}

/* Alta de libros y clientes (Ejercicio 4 / Fase 4).
   Todo dato se inserta solo como texto seguro (textContent /
   createElement), nunca con innerHTML. Sin ventas. El guardado en
   localStorage (Fase 6) se hace tras cada alta exitosa. */

function normalizarISBN(isbn) {
  return String(isbn === undefined || isbn === null ? "" : isbn).replace(/[\s-]/g, "").toLowerCase();
}

function normalizarEmail(email) {
  return String(email === undefined || email === null ? "" : email).trim().toLowerCase();
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email === undefined || email === null ? "" : email).trim());
}

function esNombreValido(texto) {
  var valor = String(texto === undefined || texto === null ? "" : texto).trim();
  if (valor === "") {
    return false;
  }
  var soloFormato = /^[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1'’\-\s]+$/.test(valor);
  var tieneLetra = /[A-Za-z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1]/.test(valor);
  return soloFormato && tieneLetra;
}

function esDniValido(dni) {
  var valor = String(dni === undefined || dni === null ? "" : dni).trim();
  if (valor === "") {
    return true;
  }
  if (!/^[0-9.]+$/.test(valor)) {
    return false;
  }
  if (valor.charAt(0) === "." || valor.charAt(valor.length - 1) === "." || valor.indexOf("..") !== -1) {
    return false;
  }
  var digitos = valor.replace(/\./g, "");
  return /^[0-9]{7,8}$/.test(digitos);
}

function esTelefonoValido(telefono) {
  var valor = String(telefono === undefined || telefono === null ? "" : telefono).trim();
  if (valor === "") {
    return true;
  }
  if (!/^[0-9+\-\s()]+$/.test(valor)) {
    return false;
  }
  var digitos = valor.replace(/[^0-9]/g, "");
  return digitos.length >= 6 && digitos.length <= 15;
}

function siguienteId(prefijo, coleccion) {
  var maximo = 0;
  (coleccion || []).forEach(function (item) {
    if (!item || typeof item.id !== "string") {
      return;
    }
    if (item.id.indexOf(prefijo) !== 0) {
      return;
    }
    var numero = parseInt(item.id.slice(prefijo.length), 10);
    if (!isNaN(numero) && numero > maximo) {
      maximo = numero;
    }
  });
  return prefijo + (maximo + 1);
}

function crearOpcion(valor, texto) {
  var opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  return opcion;
}

function poblarSelectsLibro() {
  var selectEditorial = document.getElementById("libro-editorial");
  var selectGenero = document.getElementById("libro-genero");
  var selectAutores = document.getElementById("libro-autores");
  if (!selectEditorial || !selectGenero || !selectAutores) {
    return;
  }
  while (selectEditorial.firstChild) {
    selectEditorial.removeChild(selectEditorial.firstChild);
  }
  while (selectGenero.firstChild) {
    selectGenero.removeChild(selectGenero.firstChild);
  }
  while (selectAutores.firstChild) {
    selectAutores.removeChild(selectAutores.firstChild);
  }
  estado.editoriales.forEach(function (editorial) {
    selectEditorial.appendChild(crearOpcion(editorial.id, editorial.nombre));
  });
  selectGenero.appendChild(crearOpcion("", GENERO_SIN_CLASIFICAR));
  estado.generos.forEach(function (genero) {
    selectGenero.appendChild(crearOpcion(genero.id, genero.nombre));
  });
  estado.autores.forEach(function (autor) {
    selectAutores.appendChild(crearOpcion(autor.id, autor.nombre));
  });
}

function validarLibro(datos) {
  var errores = [];
  var titulo = String(datos.titulo === undefined || datos.titulo === null ? "" : datos.titulo).trim();
  var isbn = String(datos.isbn === undefined || datos.isbn === null ? "" : datos.isbn).trim();
  var editorialId = String(datos.editorialId === undefined || datos.editorialId === null ? "" : datos.editorialId);
  var generoId = String(datos.generoId === undefined || datos.generoId === null ? "" : datos.generoId);
  var autorIds = Array.isArray(datos.autorIds) ? datos.autorIds.slice() : [];
  var precio = Number(datos.precio);

  if (titulo === "") {
    errores.push("El título es obligatorio.");
  }
  if (isbn === "") {
    errores.push("El ISBN es obligatorio.");
  } else {
    var isbnNormalizado = normalizarISBN(isbn);
    var duplicado = estado.libros.some(function (libro) {
      return normalizarISBN(libro.isbn) === isbnNormalizado;
    });
    if (duplicado) {
      errores.push("El ISBN está duplicado: ya existe otro libro con ese ISBN.");
    }
  }
  if (!isFinite(precio) || precio <= 0) {
    errores.push("El precio debe ser un número mayor a cero.");
  }
  var editorialExiste = estado.editoriales.some(function (editorial) {
    return editorial.id === editorialId;
  });
  if (!editorialExiste) {
    errores.push("La editorial elegida no existe.");
  }
  if (autorIds.length === 0) {
    errores.push("Debe elegir al menos un autor.");
  } else {
    var mapaAutores = obtenerMapaAutores();
    var algunoFalta = autorIds.some(function (id) {
      return !mapaAutores.has(id);
    });
    if (algunoFalta) {
      errores.push("Uno o más autores elegidos no existen.");
    }
  }
  var generoNormalizado = null;
  if (generoId !== "") {
    var generoExiste = estado.generos.some(function (genero) {
      return genero.id === generoId;
    });
    if (!generoExiste) {
      errores.push("El género elegido no existe.");
    } else {
      generoNormalizado = generoId;
    }
  }

  return {
    errores: errores,
    valor: {
      titulo: titulo,
      isbn: isbn,
      editorialId: editorialId,
      generoId: generoNormalizado,
      autorIds: autorIds,
      precio: precio
    }
  };
}

function validarCliente(datos) {
  var errores = [];
  var nombre = String(datos.nombre === undefined || datos.nombre === null ? "" : datos.nombre).trim();
  var apellido = String(datos.apellido === undefined || datos.apellido === null ? "" : datos.apellido).trim();
  var email = String(datos.email === undefined || datos.email === null ? "" : datos.email).trim();
  var dni = String(datos.dni === undefined || datos.dni === null ? "" : datos.dni);
  var telefono = String(datos.telefono === undefined || datos.telefono === null ? "" : datos.telefono);

  if (nombre === "" || apellido === "") {
    errores.push("El nombre y el apellido son obligatorios.");
  } else {
    if (!esNombreValido(nombre)) {
      errores.push("El nombre solo admite letras, espacios, apóstrofe y guion.");
    }
    if (!esNombreValido(apellido)) {
      errores.push("El apellido solo admite letras, espacios, apóstrofe y guion.");
    }
  }
  if (!esDniValido(dni)) {
    errores.push("El DNI debe tener 7 u 8 dígitos (se permiten puntos intermedios, ej. 30.123.456).");
  }
  if (!esTelefonoValido(telefono)) {
    errores.push("El teléfono solo admite dígitos y separadores (+, -, espacios, paréntesis), con 6 a 15 dígitos.");
  }
  if (email === "") {
    errores.push("El email es obligatorio.");
  } else if (!esEmailValido(email)) {
    errores.push("El email no tiene un formato válido.");
  } else {
    var emailNormalizado = normalizarEmail(email);
    var duplicado = estado.clientes.some(function (cliente) {
      return normalizarEmail(cliente.email) === emailNormalizado;
    });
    if (duplicado) {
      errores.push("El email está duplicado: ya existe otro cliente con ese email.");
    }
  }

  return {
    errores: errores,
    valor: {
      nombre: nombre,
      apellido: apellido,
      dni: dni,
      email: email,
      telefono: telefono
    }
  };
}

function mostrarErrores(contenedor, errores) {
  if (!contenedor) {
    return;
  }
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  if (!errores || errores.length === 0) {
    contenedor.hidden = true;
    return;
  }
  var lista = document.createElement("ul");
  errores.forEach(function (mensaje) {
    var item = document.createElement("li");
    item.textContent = mensaje;
    lista.appendChild(item);
  });
  contenedor.appendChild(lista);
  contenedor.hidden = false;
}

function renderTablaLibros() {
  var cuerpo = document.getElementById("cuerpo-tabla-libros");
  var vacio = document.getElementById("libros-vacio");
  if (!cuerpo) {
    return;
  }
  while (cuerpo.firstChild) {
    cuerpo.removeChild(cuerpo.firstChild);
  }
  estado.libros.forEach(function (libro) {
    var fila = document.createElement("tr");
    var titulo = document.createElement("td");
    titulo.textContent = libro.titulo;
    fila.appendChild(titulo);
    var isbn = document.createElement("td");
    isbn.textContent = libro.isbn;
    fila.appendChild(isbn);
    var editorial = document.createElement("td");
    editorial.textContent = obtenerNombreEditorial(libro.editorialId);
    fila.appendChild(editorial);
    var genero = document.createElement("td");
    genero.textContent = obtenerNombreGenero(libro.generoId);
    fila.appendChild(genero);
    var autores = document.createElement("td");
    autores.textContent = obtenerNombresAutores(libro.autorIds);
    fila.appendChild(autores);
    var precio = document.createElement("td");
    precio.textContent = "$" + libro.precio;
    fila.appendChild(precio);
    cuerpo.appendChild(fila);
  });
  if (vacio) {
    vacio.hidden = estado.libros.length !== 0;
  }
}

function renderTablaClientes() {
  var cuerpo = document.getElementById("cuerpo-tabla-clientes");
  var vacio = document.getElementById("clientes-vacio");
  if (!cuerpo) {
    return;
  }
  while (cuerpo.firstChild) {
    cuerpo.removeChild(cuerpo.firstChild);
  }
  estado.clientes.forEach(function (cliente) {
    var fila = document.createElement("tr");
    var nombre = document.createElement("td");
    nombre.textContent = cliente.nombre;
    fila.appendChild(nombre);
    var apellido = document.createElement("td");
    apellido.textContent = cliente.apellido;
    fila.appendChild(apellido);
    var dni = document.createElement("td");
    dni.textContent = cliente.dni;
    fila.appendChild(dni);
    var email = document.createElement("td");
    email.textContent = cliente.email;
    fila.appendChild(email);
    var telefono = document.createElement("td");
    telefono.textContent = cliente.telefono;
    fila.appendChild(telefono);
    cuerpo.appendChild(fila);
  });
  if (vacio) {
    vacio.hidden = estado.clientes.length !== 0;
  }
}

function refrescarCatalogoRespetandoFiltro() {
  var buscador = document.getElementById("buscador-catalogo");
  var termino = buscador && typeof buscador.value === "string" ? buscador.value : "";
  renderCatalogo(filtrarLibros(termino));
}

function onSubmitLibro(evento) {
  evento.preventDefault();
  var contenedor = document.getElementById("errores-libro");
  var titulo = document.getElementById("libro-titulo").value;
  var isbn = document.getElementById("libro-isbn").value;
  var editorialId = document.getElementById("libro-editorial").value;
  var generoId = document.getElementById("libro-genero").value;
  var selectAutores = document.getElementById("libro-autores");
  var autorIds = [];
  for (var i = 0; i < selectAutores.selectedOptions.length; i++) {
    autorIds.push(selectAutores.selectedOptions[i].value);
  }
  var precio = document.getElementById("libro-precio").value;
  var resultado = validarLibro({
    titulo: titulo,
    isbn: isbn,
    editorialId: editorialId,
    generoId: generoId,
    autorIds: autorIds,
    precio: precio
  });
  if (resultado.errores.length > 0) {
    mostrarErrores(contenedor, resultado.errores);
    return;
  }
  estado.libros.push({
    id: siguienteId("lib-", estado.libros),
    titulo: resultado.valor.titulo,
    isbn: resultado.valor.isbn,
    editorialId: resultado.valor.editorialId,
    generoId: resultado.valor.generoId,
    autorIds: resultado.valor.autorIds,
    precio: resultado.valor.precio
  });
  guardarLibros();
  mostrarErrores(contenedor, []);
  document.getElementById("form-libro").reset();
  poblarSelectsLibro();
  renderTablaLibros();
  refrescarCatalogoRespetandoFiltro();
}

function onSubmitCliente(evento) {
  evento.preventDefault();
  var contenedor = document.getElementById("errores-cliente");
  var resultado = validarCliente({
    nombre: document.getElementById("cliente-nombre").value,
    apellido: document.getElementById("cliente-apellido").value,
    dni: document.getElementById("cliente-dni").value,
    email: document.getElementById("cliente-email").value,
    telefono: document.getElementById("cliente-telefono").value
  });
  if (resultado.errores.length > 0) {
    mostrarErrores(contenedor, resultado.errores);
    return;
  }
  estado.clientes.push({
    id: siguienteId("cli-", estado.clientes),
    nombre: resultado.valor.nombre,
    apellido: resultado.valor.apellido,
    dni: resultado.valor.dni,
    email: resultado.valor.email,
    telefono: resultado.valor.telefono
  });
  guardarClientes();
  mostrarErrores(contenedor, []);
  document.getElementById("form-cliente").reset();
  renderTablaClientes();
  if (typeof poblarSelectVentaCliente === "function") {
    poblarSelectVentaCliente();
  }
}

function inicializarAltas() {
  poblarSelectsLibro();
  renderTablaLibros();
  renderTablaClientes();
  document.getElementById("form-libro").addEventListener("submit", onSubmitLibro);
  document.getElementById("form-cliente").addEventListener("submit", onSubmitCliente);
}

/* Ventas e historial (Ejercicio 5 / Fase 5).
   Borrador editable en memoria + confirmación con snapshot histórico.
   Cálculos siempre en números; `toFixed(2)` solo al mostrar.
   Sin `fetch`, sin librerías. Todo dato se inserta
   solo como texto seguro (createElement / textContent), nunca innerHTML.
   El guardado en localStorage (Fase 6) se hace al confirmar la venta. */

var ventaBorrador = { clienteId: "", renglones: [] };
var ventaSeleccionadaId = null;

function obtenerMapaLibros() {
  return crearMapaPorId(estado.libros);
}

function obtenerMapaClientes() {
  return crearMapaPorId(estado.clientes);
}

function nombreCliente(cliente) {
  if (!cliente) {
    return "Desconocido";
  }
  var nombre = String(cliente.nombre === undefined || cliente.nombre === null ? "" : cliente.nombre).trim();
  var apellido = String(cliente.apellido === undefined || cliente.apellido === null ? "" : cliente.apellido).trim();
  var completo = (nombre + " " + apellido).trim();
  return completo === "" ? "Desconocido" : completo;
}

function esCantidadValida(cantidad) {
  var n = Number(cantidad);
  return Number.isInteger(n) && n > 0;
}

function calcularSubtotal(cantidad, precio) {
  return Number(cantidad) * Number(precio);
}

function calcularTotalRenglones(renglones) {
  var total = 0;
  (renglones || []).forEach(function (renglon) {
    total += Number(renglon.subtotal);
  });
  return total;
}

function formatearImporte(valor) {
  return Number(valor).toFixed(2);
}

function fechaHoy() {
  return new Date().toLocaleDateString("es-AR");
}

function subtotalBorrador(renglon) {
  var mapa = obtenerMapaLibros();
  var libro = mapa.get(renglon.libroId);
  if (!libro || !esCantidadValida(renglon.cantidad)) {
    return 0;
  }
  return calcularSubtotal(Number(renglon.cantidad), Number(libro.precio));
}

function totalBorrador() {
  var total = 0;
  ventaBorrador.renglones.forEach(function (renglon) {
    total += subtotalBorrador(renglon);
  });
  return total;
}

function agregarRenglonBorrador(libroId, cantidad) {
  var id = String(libroId === undefined || libroId === null ? "" : libroId);
  if (id === "") {
    return { ok: false, errores: ["Debe elegir un libro para el renglón."] };
  }
  if (!esCantidadValida(cantidad)) {
    return { ok: false, errores: ["La cantidad del renglón debe ser un número entero mayor a cero."] };
  }
  var mapa = obtenerMapaLibros();
  if (!mapa.has(id)) {
    return { ok: false, errores: ["El libro elegido no existe."] };
  }
  var existente = null;
  ventaBorrador.renglones.forEach(function (renglon) {
    if (renglon.libroId === id) {
      existente = renglon;
    }
  });
  if (existente) {
    existente.cantidad = Number(existente.cantidad) + Number(cantidad);
  } else {
    ventaBorrador.renglones.push({ libroId: id, cantidad: Number(cantidad) });
  }
  return { ok: true, errores: [] };
}

function cambiarCantidadRenglon(indice, cantidad) {
  if (indice < 0 || indice >= ventaBorrador.renglones.length) {
    return;
  }
  ventaBorrador.renglones[indice].cantidad = cantidad;
}

function cambiarLibroRenglon(indice, libroId) {
  if (indice < 0 || indice >= ventaBorrador.renglones.length) {
    return;
  }
  var id = String(libroId === undefined || libroId === null ? "" : libroId);
  var duplicado = -1;
  ventaBorrador.renglones.forEach(function (renglon, i) {
    if (i !== indice && renglon.libroId === id && id !== "") {
      duplicado = i;
    }
  });
  if (duplicado !== -1) {
    var actual = ventaBorrador.renglones[indice];
    var destino = ventaBorrador.renglones[duplicado];
    var suma = Number(actual.cantidad);
    if (!esCantidadValida(suma)) {
      suma = 1;
    }
    destino.cantidad = Number(destino.cantidad) + suma;
    ventaBorrador.renglones.splice(indice, 1);
    return;
  }
  ventaBorrador.renglones[indice].libroId = id;
}

function quitarRenglonBorrador(indice) {
  if (indice < 0 || indice >= ventaBorrador.renglones.length) {
    return;
  }
  ventaBorrador.renglones.splice(indice, 1);
}

function validarVenta(clienteId, renglones) {
  var errores = [];
  var idCliente = String(clienteId === undefined || clienteId === null ? "" : clienteId);
  if (idCliente === "") {
    errores.push("Debe seleccionar un cliente para la venta.");
  } else {
    var clienteExiste = estado.clientes.some(function (cliente) {
      return cliente.id === idCliente;
    });
    if (!clienteExiste) {
      errores.push("El cliente seleccionado no existe.");
    }
  }
  var lista = Array.isArray(renglones) ? renglones : [];
  if (lista.length === 0) {
    errores.push("La venta debe tener al menos un renglón.");
    return errores;
  }
  var mapa = obtenerMapaLibros();
  lista.forEach(function (renglon, i) {
    var nro = i + 1;
    var libroId = renglon ? renglon.libroId : "";
    if (!mapa.has(libroId)) {
      errores.push("El libro del renglón " + nro + " no existe.");
    }
    if (!renglon || !esCantidadValida(renglon.cantidad)) {
      errores.push("La cantidad del renglón " + nro + " debe ser un número entero mayor a cero.");
    }
  });
  return errores;
}

function confirmarVentaBorrador() {
  var errores = validarVenta(ventaBorrador.clienteId, ventaBorrador.renglones);
  if (errores.length > 0) {
    return { ok: false, errores: errores, venta: null };
  }
  var mapaClientes = obtenerMapaClientes();
  var mapaLibros = obtenerMapaLibros();
  var cliente = mapaClientes.get(ventaBorrador.clienteId);
  var renglones = ventaBorrador.renglones.map(function (renglon) {
    var libro = mapaLibros.get(renglon.libroId);
    var cantidad = Number(renglon.cantidad);
    var precioUnitario = Number(libro.precio);
    return {
      libroId: libro.id,
      titulo: libro.titulo,
      precioUnitario: precioUnitario,
      cantidad: cantidad,
      subtotal: calcularSubtotal(cantidad, precioUnitario)
    };
  });
  var venta = {
    id: siguienteId("v-", estado.ventas),
    fecha: fechaHoy(),
    clienteId: cliente.id,
    clienteNombre: nombreCliente(cliente),
    renglones: renglones,
    total: calcularTotalRenglones(renglones)
  };
  estado.ventas.push(venta);
  guardarVentas();
  ventaSeleccionadaId = venta.id;
  return { ok: true, errores: [], venta: venta };
}

function poblarSelectVentaCliente() {
  var select = document.getElementById("venta-cliente");
  if (!select) {
    return;
  }
  var previo = ventaBorrador.clienteId || select.value || "";
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
  select.appendChild(crearOpcion("", "Seleccione un cliente"));
  estado.clientes.forEach(function (cliente) {
    select.appendChild(crearOpcion(cliente.id, nombreCliente(cliente)));
  });
  var sigue = estado.clientes.some(function (cliente) {
    return cliente.id === previo;
  });
  var vigente = sigue ? previo : "";
  select.value = vigente;
  ventaBorrador.clienteId = vigente;
}

function crearSelectLibroRenglon(seleccionado) {
  var select = document.createElement("select");
  select.setAttribute("name", "libro");
  select.setAttribute("required", "required");
  select.appendChild(crearOpcion("", "Seleccione un libro"));
  estado.libros.forEach(function (libro) {
    var opcion = crearOpcion(libro.id, libro.titulo);
    if (libro.id === seleccionado) {
      opcion.selected = true;
    }
    select.appendChild(opcion);
  });
  select.value = seleccionado || "";
  return select;
}

function renderRenglonesVenta() {
  var contenedor = document.getElementById("renglones-venta");
  if (!contenedor) {
    return;
  }
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  ventaBorrador.renglones.forEach(function (renglon, indice) {
    var fila = document.createElement("div");

    var etiquetaLibro = document.createElement("label");
    etiquetaLibro.textContent = "Libro ";
    var select = crearSelectLibroRenglon(renglon.libroId);
    select.setAttribute("data-indice", String(indice));
    select.addEventListener("change", function (evento) {
      cambiarLibroRenglon(indice, evento.target.value);
      renderRenglonesVenta();
      renderResumenVenta();
    });
    etiquetaLibro.appendChild(select);
    fila.appendChild(etiquetaLibro);

    var etiquetaCantidad = document.createElement("label");
    etiquetaCantidad.textContent = "Cantidad ";
    var cantidad = document.createElement("input");
    cantidad.setAttribute("type", "number");
    cantidad.setAttribute("name", "cantidad");
    cantidad.setAttribute("min", "1");
    cantidad.setAttribute("required", "required");
    cantidad.value = String(renglon.cantidad);
    cantidad.setAttribute("data-indice", String(indice));
    cantidad.addEventListener("input", function (evento) {
      cambiarCantidadRenglon(indice, evento.target.value);
      renderResumenVenta();
    });
    cantidad.addEventListener("change", function (evento) {
      cambiarCantidadRenglon(indice, evento.target.value);
      renderResumenVenta();
    });
    etiquetaCantidad.appendChild(cantidad);
    fila.appendChild(etiquetaCantidad);

    var subtotal = document.createElement("span");
    subtotal.textContent = "Subtotal: $" + formatearImporte(subtotalBorrador(renglon));
    fila.appendChild(subtotal);

    var quitar = document.createElement("button");
    quitar.setAttribute("type", "button");
    quitar.setAttribute("data-indice", String(indice));
    quitar.textContent = "Quitar";
    quitar.addEventListener("click", function (evento) {
      evento.preventDefault();
      quitarRenglonBorrador(indice);
      renderRenglonesVenta();
      renderResumenVenta();
    });
    fila.appendChild(quitar);

    contenedor.appendChild(fila);
  });
}

function renderResumenVenta() {
  var subtotal = document.getElementById("resumen-subtotal");
  var total = document.getElementById("resumen-total");
  var importe = totalBorrador();
  if (subtotal) {
    subtotal.textContent = "$" + formatearImporte(importe);
  }
  if (total) {
    total.textContent = "$" + formatearImporte(importe);
  }
}

function renderHistorial() {
  var cuerpo = document.getElementById("cuerpo-tabla-historial");
  var vacio = document.getElementById("historial-vacio");
  if (!cuerpo) {
    return;
  }
  while (cuerpo.firstChild) {
    cuerpo.removeChild(cuerpo.firstChild);
  }
  estado.ventas.forEach(function (venta) {
    var fila = document.createElement("tr");
    fila.setAttribute("data-venta-id", venta.id);
    var idFecha = document.createElement("td");
    idFecha.textContent = venta.id + " — " + venta.fecha;
    fila.appendChild(idFecha);
    var cliente = document.createElement("td");
    cliente.textContent = venta.clienteNombre;
    fila.appendChild(cliente);
    var items = document.createElement("td");
    var cantidadTotal = 0;
    venta.renglones.forEach(function (renglon) {
      cantidadTotal += Number(renglon.cantidad);
    });
    items.textContent = String(cantidadTotal);
    fila.appendChild(items);
    var total = document.createElement("td");
    total.textContent = "$" + formatearImporte(venta.total);
    fila.appendChild(total);
    fila.addEventListener("click", function () {
      ventaSeleccionadaId = venta.id;
      renderDetalleVenta();
    });
    cuerpo.appendChild(fila);
  });
  if (vacio) {
    vacio.hidden = estado.ventas.length !== 0;
  }
  renderDetalleVenta();
}

function renderDetalleVenta() {
  var detalle = document.getElementById("detalle-venta");
  if (!detalle) {
    return;
  }
  while (detalle.firstChild) {
    detalle.removeChild(detalle.firstChild);
  }
  var titulo = document.createElement("h3");
  var venta = null;
  estado.ventas.forEach(function (v) {
    if (v.id === ventaSeleccionadaId) {
      venta = v;
    }
  });
  if (!venta) {
    if (estado.ventas.length > 0) {
      venta = estado.ventas[estado.ventas.length - 1];
      ventaSeleccionadaId = venta.id;
    } else {
      titulo.textContent = "Detalle de venta";
      detalle.appendChild(titulo);
      var vacio = document.createElement("p");
      vacio.textContent = "Seleccione una venta del historial para ver el detalle.";
      detalle.appendChild(vacio);
      return;
    }
  }
  titulo.textContent = "Detalle de venta " + venta.id + " — " + venta.fecha;
  detalle.appendChild(titulo);
  var cliente = document.createElement("p");
  cliente.textContent = "Cliente: " + venta.clienteNombre;
  detalle.appendChild(cliente);
  var lista = document.createElement("ul");
  venta.renglones.forEach(function (renglon) {
    var item = document.createElement("li");
    item.textContent = renglon.titulo + " — Cantidad: " + renglon.cantidad +
      " — Precio: $" + formatearImporte(renglon.precioUnitario) +
      " — Subtotal: $" + formatearImporte(renglon.subtotal);
    lista.appendChild(item);
  });
  detalle.appendChild(lista);
  var total = document.createElement("p");
  total.textContent = "Total: $" + formatearImporte(venta.total);
  detalle.appendChild(total);
}

function refrescarVistaVentas() {
  poblarSelectVentaCliente();
  renderRenglonesVenta();
  renderResumenVenta();
}

function onAgregarRenglon(evento) {
  if (evento && typeof evento.preventDefault === "function") {
    evento.preventDefault();
  }
  ventaBorrador.renglones.push({ libroId: "", cantidad: 1 });
  mostrarErrores(document.getElementById("mensaje-venta-error"), []);
  renderRenglonesVenta();
  renderResumenVenta();
}

function onSubmitVenta(evento) {
  evento.preventDefault();
  var select = document.getElementById("venta-cliente");
  ventaBorrador.clienteId = select ? select.value : "";
  var error = document.getElementById("mensaje-venta-error");
  var exito = document.getElementById("mensaje-venta-exito");
  var resultado = confirmarVentaBorrador();
  if (!resultado.ok) {
    mostrarErrores(error, resultado.errores);
    if (exito) {
      exito.hidden = true;
    }
    return;
  }
  mostrarErrores(error, []);
  ventaBorrador = { clienteId: "", renglones: [] };
  if (select) {
    select.value = "";
  }
  refrescarVistaVentas();
  renderHistorial();
  if (exito) {
    while (exito.firstChild) {
      exito.removeChild(exito.firstChild);
    }
    exito.textContent = "Venta " + resultado.venta.id + " registrada con éxito por $" +
      formatearImporte(resultado.venta.total) + ".";
    exito.hidden = false;
  }
}

function inicializarVentas() {
  var form = document.getElementById("form-venta");
  if (!form) {
    return;
  }
  var select = document.getElementById("venta-cliente");
  if (select) {
    select.addEventListener("change", function (evento) {
      ventaBorrador.clienteId = evento.target.value;
      mostrarErrores(document.getElementById("mensaje-venta-error"), []);
    });
  }
  var agregar = form.querySelector('button[type="button"]');
  if (agregar) {
    agregar.addEventListener("click", onAgregarRenglon);
  }
  form.addEventListener("submit", onSubmitVenta);
  mostrarErrores(document.getElementById("mensaje-venta-error"), []);
  var exito = document.getElementById("mensaje-venta-exito");
  if (exito) {
    exito.hidden = true;
  }
  refrescarVistaVentas();
  renderHistorial();
}

inicializarCatalogo();
inicializarNavegacion();
inicializarAltas();
inicializarVentas();
