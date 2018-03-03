const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Iniciamos el servidor
const app = express();

// convertimos el curepo del mensaje
app.use(bodyParser.json());

// Iniciamos los modelos de sequelize
const db = require('./db');

// Sincronizamos la base de datos
db.sequelize.sync().done(() => {
  console.log("\n***Base de datos generada");
  app.listen(4000, () => {
    console.log('La aplicación esta escuchando en el puerto 4000!!!');
  });
});

// Habilitamos los logs
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("***Procesando petición...\n");
  next();
});

app.get("/api-rest", (req, res) => {
  res.end("***Api-rest***\n");
});

app.get("/api-rest/docentes", (req, res) => {
  Promise.resolve()
    .then(() => listarDocentesPaginado(req.query.limite, req.query.intervalo))
    .then((listadoDeDocentes) => {
      res.json(listadoDeDocentes);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.post("/api-rest/docentes", (req, res) => {
  Promise.resolve()
    .then(() => crearDocente(req.body))
    .then((docente) => {
      res.status(201).json(docente);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.patch("/api-rest/docente/:idDocente", (req, res) => {
  Promise.resolve()
    .then(() => modificarDocente(req.body.nombres, req.params.idDocente))
    .then(() => buscarDocente(req.params.idDocente))
    .then((docenteModificado) => {
      res.json(docenteModificado);
    })
    .catch((err) => {
      console.log('+++++++++++++++++++++++++++++++++++++++++++');
      console.log(err);
      console.log('+++++++++++++++++++++++++++++++++++++++++++');
      res.status(500).json('Error grave');
    });
});


app.get("/api-rest/docentes/:idDocente", (req, res) => {
  Promise.resolve()
    .then(() => buscarDocente(req.params.idDocente))
    .then((docente) => {
      res.json(docente);
    })  
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});
app.get("/api-rest/docentes/:idDocente/materias", (req, res) => {
  Promise.resolve()
    .then(() => listarMateriasDeDocente(req.params.idDocente))
    .then((materias) => {
      res.json(materias);
    })
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});


function crearDocente(docente) {
  return db.docente.create(docente)
  .then(respuesta => {
    console.log("\n***creando docente");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => console.log(error));
}


function modificarDocente(nombres, idDocente) {
  return db.docente.update({
    nombres,
  }, {
    where: {
      id_docente: idDocente,
    },
    // returning: true,
  })
  .then(respuesta => {
    console.log("\n***modificando docente");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => console.log(error));

}

function listarDocentes() {
  return db.docente.findAll()
  .then(respuesta => {
    console.log("\n***Listando docente");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}

function listarMateriasDeDocente(idDocente) {
  return db.materia.findAll({where: {fid_docente: idDocente}})
  .then(respuesta => {
    console.log("\n***Listando materias");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}

function listarDocentesPaginado(limite, intervalo) {
  return db.docente.findAll({limit: limite, offset: intervalo})
  .then(respuesta => {
    console.log("\n***Listando docente");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}

function buscarDocente(id) {
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  console.log(id);
  console.log('+++++++++++++++++++++++++++++++++++++++++++');
  return db.docente.findById(id)
  .then(respuesta => {
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}



function listarDocentesYMaterias() {

  return db.docente.findAll({
    include: [{
      model: db.materia,
      as: 'materias',
    }],
  })
  .then(respuesta => {
    console.log("\n***Listando docente y materias");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}

function listarMaterias() {

  db.materia.findAll({
    include: [{
      model: db.docente,
      as: 'docente',
    }],
  })
  .then(respuesta => {
    console.log("\n***Listando materias");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}


function borrarMateria() {

  db.materia.destroy({
    where: {id_materia: 2},
  })
  .then(respuesta => {
    console.log("\n***Eliminando materia");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}


//++++++++++++++++++++++++ AULAS ++++++++++++++++++++++++++++++++++

app.get("/api-rest/aulas", (req, res) => {
  Promise.resolve()
    .then(() => listarAulasPaginado(req.query.limite, req.query.intervalo))
    .then((listadoDeAulas) => {
      res.json(listadoDeAulas);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.post("/api-rest/aulas", (req, res) => {
  Promise.resolve()
    .then(() => crearAula(req.body))
    .then((aula) => {
      res.status(201).json(aula);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.patch("/api-rest/aula/:idAula", (req, res) => {
  Promise.resolve()
    .then(() => modificarAula(req.body.nombres, req.params.idAula))
    .then(() => buscarAula(req.params.idAula))
    .then((aulaModificado) => {
      res.json(aulaModificado);
    })
    .catch((err) => {
      res.status(500).json('Error grave');
    });
});


app.get("/api-rest/aulas/:idAula", (req, res) => {
  Promise.resolve()
    .then(() => buscarAula(req.params.idAula))
    .then((aula) => {
      res.json(aula);
    })  
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});

//++++++++++++++++++++++++++++++++++
app.get("/api-rest/aulas/:idAula/horarios", (req, res) => {
  Promise.resolve()
    .then(() => listarHorariosDeAula(req.params.idAula))
    .then((horarios) => {
      res.json(horarios);
    })
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});


//+++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++HORARIOS+++++++++++++++++++++++++++++++
app.get("/api-rest/horarios", (req, res) => {
  Promise.resolve()
    .then(() => listarHorariosPaginado(req.query.limite, req.query.intervalo))
    .then((listadoDeHorarios) => {
      res.json(listadoDeHorarios);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.post("/api-rest/horarios", (req, res) => {
  Promise.resolve()
    .then(() => crearHorario(req.body))
    .then((horario) => {
      res.status(201).json(horario);
    })
    .catch(() => res.status(500).json('Error grave'));
});


app.patch("/api-rest/horario/:idHorario", (req, res) => {
  Promise.resolve()
    .then(() => modificarHorario(req.body.dia, req.params.idHorario))
    .then(() => buscarHorario(req.params.idHorario))
    .then((horarioModificado) => {
      res.json(horarioModificado);
    })
    .catch((err) => {
      res.status(500).json('Error grave');
    });
});


app.get("/api-rest/horarios/:idHorario", (req, res) => {
  Promise.resolve()
    .then(() => buscarHorario(req.params.idHorario))
    .then((horario) => {
      res.json(horario);
    })  
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});


//funciones aula y horarios




function crearAula(aula) {
  return db.aula.create(aula)
  .then(respuesta => {
    console.log("\n***creando aula");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => console.log(error));
}

function modificarAula(nombre, idAula) {
  return db.aula.update({
    nombre,
  }, {
    where: {
      id_aula: idAula,
    },
    // returning: true,
  })
  .then(respuesta => {
    console.log("\n***modificando aula");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => console.log(error));

}

function listarHorariosDeAula(idAula) {
  return db.horario.findAll({where: {fid_aula: idAula}})
  .then(respuesta => {
    console.log("\n***Listando horarios");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}

function listarAulasPaginado(limite, intervalo) {
  return db.aula.findAll({limit: limite, offset: intervalo})
  .then(respuesta => {
    console.log("\n***Listando aula");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}

function buscarAula(id) {
  return db.aula.findById(id)
  .then(respuesta => {
    return respuesta;
  }).catch(error => {
    // logger
    throw error;
  });
}



function listarAulasYHorarios() {

  return db.aula.findAll({
    include: [{
      model: db.horario,
      as: 'horarios',
    }],
  })
  .then(respuesta => {
    console.log("\n***Listando aula y horarios");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}

function listarHorarios() {

  db.horario.findAll({
    include: [{
      model: db.aula,
      as: 'aula',
    }],
  })
  .then(respuesta => {
    console.log("\n***Listando horarios");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}


function borrarHorario() {

  db.horario.destroy({
    where: {id_horario: 2},
  })
  .then(respuesta => {
    console.log("\n***Eliminando horario");
    console.log(JSON.stringify(respuesta));
  }).catch(error => console.log(error));

}