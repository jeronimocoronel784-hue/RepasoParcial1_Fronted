"use strict";

/* Datos iniciales inmutables del TPI Librería UTN (Ejercicio 3).
   Estructura preparada para que Fase 6 envuelva persistencia sin refactorizar:
   DATOS_INICIALES (constantes) + estado (copias mutables de trabajo). */

var DATOS_INICIALES = {
  editoriales: [
    { id: "ed-1", nombre: "Cátedra" },
    { id: "ed-2", nombre: "Ejemplo Sur" }
  ],
  generos: [
    { id: "gen-1", nombre: "Novela" },
    { id: "gen-2", nombre: "Poesía" }
  ],
  autores: [
    { id: "aut-1", nombre: "Miguel de Cervantes" },
    { id: "aut-2", nombre: "Autora Ejemplo" },
    { id: "aut-3", nombre: "Autor Ejemplo" }
  ],
  libros: [
    {
      id: "lib-1",
      titulo: "Don Quijote de la Mancha",
      isbn: "978-84-376-0494-7",
      editorialId: "ed-1",
      generoId: "gen-1",
      autorIds: ["aut-1"],
      precio: 15000
    },
    {
      id: "lib-2",
      titulo: "Poesías completas",
      isbn: "978-950-03-0000-1",
      editorialId: "ed-2",
      generoId: null,
      autorIds: ["aut-2", "aut-3"],
      precio: 8000
    },
    {
      id: "lib-3",
      titulo: "Novelas ejemplares",
      isbn: "978-84-376-0500-5",
      editorialId: "ed-1",
      generoId: "gen-1",
      autorIds: ["aut-1"],
      precio: 12000
    },
    {
      id: "lib-4",
      titulo: "Antología poética",
      isbn: "978-950-03-0000-2",
      editorialId: "ed-2",
      generoId: "gen-2",
      autorIds: ["aut-2"],
      precio: 9500
    },
    {
      id: "lib-5",
      titulo: "Cuentos reunidos",
      isbn: "978-950-03-0000-3",
      editorialId: "ed-2",
      generoId: "gen-1",
      autorIds: ["aut-3"],
      precio: 11000
    },
    {
      id: "lib-6",
      titulo: "Ensayos literarios",
      isbn: "978-84-376-0501-2",
      editorialId: "ed-1",
      generoId: null,
      autorIds: ["aut-1", "aut-3"],
      precio: 7000
    }
  ],
  clientes: [
    {
      id: "cli-1",
      nombre: "María",
      apellido: "González",
      dni: "30123456",
      email: "maria.gonzalez@ejemplo.com",
      telefono: "341-555-0101"
    },
    {
      id: "cli-2",
      nombre: "Juan",
      apellido: "Pérez",
      dni: "28987654",
      email: "juan.perez@ejemplo.com",
      telefono: "341-555-0102"
    },
    {
      id: "cli-3",
      nombre: "Ana",
      apellido: "López",
      dni: "33567891",
      email: "ana.lopez@ejemplo.com",
      telefono: "341-555-0103"
    }
  ]
};

/* Claves versionadas de persistencia (Ejercicio 6 / Fase 6).
   Una clave por colección para poder inspeccionar/borrar por separado
   en DevTools; el sufijo .v1 reserva el formato ante cambios futuros. */
var CLAVES_STORAGE = {
  libros: "libreriaUTN.libros.v1",
  clientes: "libreriaUTN.clientes.v1",
  ventas: "libreriaUTN.ventas.v1"
};

/* Lee una colección desde localStorage. Devuelve el array guardado
   (incluso vacío, que es un valor válido) o null si la clave falta,
   el JSON es ilegible o no es un array. Nunca lanza: ante cualquier
   fallo degrada a memoria y deja que el llamador use los ejemplos. */
function leerColeccionGuardada(clave) {
  try {
    if (typeof localStorage === "undefined" || localStorage === null) {
      return null;
    }
    var crudo = localStorage.getItem(clave);
    if (crudo === null || crudo === undefined) {
      return null;
    }
    var parsed = JSON.parse(crudo);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

/* Estado mutable en memoria. Fase 6: cada colección persistida se carga
   desde localStorage si existe y es válida; si falta o está corrupta se
   usan los ejemplos de DATOS_INICIALES solo para esa colección
   (DATOS_INICIALES queda intacto y nunca se escribe directo en
   localStorage). `ventas` no tiene ejemplos: su fallback es []. */
var librosGuardados = leerColeccionGuardada(CLAVES_STORAGE.libros);
var clientesGuardados = leerColeccionGuardada(CLAVES_STORAGE.clientes);
var ventasGuardadas = leerColeccionGuardada(CLAVES_STORAGE.ventas);

var estado = {
  editoriales: DATOS_INICIALES.editoriales.map(function (e) {
    return { id: e.id, nombre: e.nombre };
  }),
  generos: DATOS_INICIALES.generos.map(function (g) {
    return { id: g.id, nombre: g.nombre };
  }),
  autores: DATOS_INICIALES.autores.map(function (a) {
    return { id: a.id, nombre: a.nombre };
  }),
  libros: librosGuardados !== null ? librosGuardados : DATOS_INICIALES.libros.map(function (l) {
    return {
      id: l.id,
      titulo: l.titulo,
      isbn: l.isbn,
      editorialId: l.editorialId,
      generoId: l.generoId,
      autorIds: l.autorIds.slice(),
      precio: l.precio
    };
  }),
  clientes: clientesGuardados !== null ? clientesGuardados : DATOS_INICIALES.clientes.map(function (c) {
    return {
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      email: c.email,
      telefono: c.telefono
    };
  }),
  ventas: ventasGuardadas !== null ? ventasGuardadas : []
};
