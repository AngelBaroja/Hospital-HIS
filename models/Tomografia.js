const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Tomografia extends Model {}

Tomografia.init(
  {
    tipo: {
      type: DataTypes.STRING(20),
      comment: "Indique el tipo de Tomografia que se realizará",
    },    
    informacion: {
      type: DataTypes.STRING(4000),
      comment: "Detalle la información relevante de la Tomografia",
    },
    ruta: {
      type: DataTypes.STRING(200),
      comment: "Ruta donde se guardará la Tomografia",
    }    
  },
  {
    sequelize,
    modelName: "Tomografia",
    tableName: "tomografias"    
  }
);

Historial_Medico.hasMany(Tomografia, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Tomografia.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Tomografia;

