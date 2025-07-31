const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class AnalisisSangre extends Model {}

AnalisisSangre.init(
  {
    tipo: {
      type: DataTypes.STRING(20),
      comment: "Indique el tipo de Analisis de Sangre que se realizará",
    },    
    informacion: {
      type: DataTypes.STRING(4000),
      comment: "Detalle la información relevante del Analisis de Sangre",
    },      
  },
  {
    sequelize,
    modelName: "AnalisisSangre",
    tableName: "analisisSangres"    
  }
);

Historial_Medico.hasMany(AnalisisSangre, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
AnalisisSangre.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = AnalisisSangre;

