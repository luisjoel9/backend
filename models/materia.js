module.exports = (sequelize, DataType) => {
  
  const materia = sequelize.define('materia', {
    id_materia: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataType.STRING(300),
      allowNull: true,
    },
    sigla: {
      type: DataType.STRING(300),
      allowNull: true,
    },
    fid_docente: {
      type: DataType.INTEGER,
      allowNull: false,
    },
  });

  materia.associate = (models) => {
    materia.belongsTo(models.docente, { 
      as: 'docente', 
      foreignKey: {
        name: 'fid_docente', 
        allowNull: false
      }
    });
  }

  return materia;
};