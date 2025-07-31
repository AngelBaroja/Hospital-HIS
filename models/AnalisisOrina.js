const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class AnalisisOrina extends Model {}

AnalisisOrina.init(
  {
    tipo: {
      type: DataTypes.STRING(20),
      comment: "Indique el tipo de Analisis de Orina que se realizará",
    },    
    informacion: {
      type: DataTypes.STRING(4000),
      comment: "Detalle la información relevante del Analisis de Orina",
    },      
  },
  {
    sequelize,
    modelName: "AnalisisOrina",
    tableName: "analisisOrinas"    
  }
);

Historial_Medico.hasMany(AnalisisOrina, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
AnalisisOrina.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = AnalisisOrina;

