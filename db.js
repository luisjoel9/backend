// Importando sequelize
const Sequelize = require("sequelize");

// Librerías
const fs = require('fs');
const path = require('path');


const db = {};

// Nombre de la base de datos (se puede configurar en un archivo de configuración)
const basename = 'hackday';

// Iniciando sequelize y la respectiva conexión a la base de datos creada
const sequelize = new Sequelize(basename, 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  sync: { force: false },
});


// Ejemplo de autenticación a la base de datos 
sequelize
  .authenticate()
  .then(() => {
    console.log('Probando la Conexión a la base de datos: correcta');
  })
  .catch(err => {
    console.error('No es posible conectarse a la base de datos', err);
  });


// Directorio de los modelos
const directorioModelos = __dirname + '/models';


// Leyendo todos los archivos en el directorio models
fs
  .readdirSync(directorioModelos)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(directorioModelos, file));
    // Cargandolos en la variable db
    db[model.name] = model;
  });

// Cargando las asociaciones de los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Cargando la variable db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exportando
module.exports = db;