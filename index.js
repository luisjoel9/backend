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
app.get("/docentes/:idDocente/materias", (req, res) => {
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
  docente.fecha_nacimiento = docente.fechaNacimiento;
  return db.docente.create(docente)
  .then(respuesta => {
    console.log("\n***creando docente");
    console.log(JSON.stringify(respuesta));
    return respuesta;
  }).catch(error => console.log(error));
}

function crearDocenteYMateria() {
  const docente = {
    nombres: 'MARIA',
    apellidos: 'SUAREZ SUAREZ',
    fecha_nacimiento: new Date(1990, 11, 31),
    titulo: 'Lic.',
    tipo: 'titular'
  };

  db.docente.create(docente)
  .then(respuesta => {
    console.log("\n***creando docente para materia");
    console.log(JSON.stringify(respuesta));

    const materia = {
      descripcion: 'Intr. a la programacion',
      sigla: 'INF-111',
      fid_docente: respuesta.id_docente
    } 

    return db.materia.create(materia);
  }).then(respuesta => {
    console.log("\n***creando materia");
    console.log(JSON.stringify(respuesta));
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


function modificarDocenteObjeto() {
  return db.docente.findById(2)
  .then(respuesta => {
    return respuesta.updateAttributes({ nombres: 'MARIA ISABLE' });
  }).then(respuesta => {
    console.log("\n***modificando docente|");
    console.log(JSON.stringify(respuesta));
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
app.get("/aulas/:idAula/materias", (req, res) => {
  Promise.resolve()
    .then(() => listarMateriasDeAula(req.params.idAula))
    .then((materias) => {
      res.json(materias);
    })
    .catch((err) => {
      res.status(500).json('Error grave')
    });
});