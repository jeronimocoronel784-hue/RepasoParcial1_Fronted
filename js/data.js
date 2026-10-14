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

/* Estado mutable en memoria, inicializado como copia profunda de
   DATOS_INICIALES. Las fases 4-5 mutan `estado`; Fase 6 lo persistirá
   (incluida la colección `ventas`, que vive solo en memoria y nunca
   toca `localStorage`). */
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
  libros: DATOS_INICIALES.libros.map(function (l) {
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
  clientes: DATOS_INICIALES.clientes.map(function (c) {
    return {
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      email: c.email,
      telefono: c.telefono
    };
  }),
  ventas: []
};
