"use strict";

/* Lógica de catálogo y navegación mínima (Ejercicio 3).
   Depende de js/data.js (DATOS_INICIALES + estado). Sin librerías,
   sin carga remota, sin persistencia en navegador. Todos los datos
   se insertan solo como texto seguro, nunca como marcado. */

var GENERO_SIN_CLASIFICAR = "Sin clasificar";

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
   createElement), nunca con innerHTML. Sin persistencia, sin ventas. */

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
  mostrarErrores(contenedor, []);
  document.getElementById("form-cliente").reset();
  renderTablaClientes();
}

function inicializarAltas() {
  poblarSelectsLibro();
  renderTablaLibros();
  renderTablaClientes();
  document.getElementById("form-libro").addEventListener("submit", onSubmitLibro);
  document.getElementById("form-cliente").addEventListener("submit", onSubmitCliente);
}

inicializarCatalogo();
inicializarNavegacion();
inicializarAltas();
