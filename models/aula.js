module.exports = (sequelize, DataType) => {
  
  const aula = sequelize.define('aula', {
    id_aula: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataType.STRING(10),
      allowNull: false,
    },
    capacidad: {
      type: DataType.INTEGER,
      allowNull: true,
    }
  });



  return aula;
};