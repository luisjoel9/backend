module.exports = (sequelize, DataType) => { 
  
  const horario = sequelize.define('horario', {
    id_horario: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    diaSemana: {
      type: DataType.STRING(100), 
      allowNulll: false,
    },
    horaInicio: {
      type: DataType.DATE,
      allowNulll: false,
    },
    horaFin: {
      type: DataType.DATE,
      allowNulll: false,
    }
  });

  horario.associate = (models) => {
    horario.belongsTo(models.materia, { 
      as: 'materia', 
      foreignKey: {
        name: 'fid_materia', 
        allowNull: false
      }
    });
  };

  horario.associate = (models) => {
    horario.belongsTo(models.aula, { 
      as: 'aula', 
      foreignKey: {
        name: 'fid_aula', 
        allowNull: false
      }
    });
  };

  return horario;
};