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

inicializarCatalogo();
inicializarNavegacion();
