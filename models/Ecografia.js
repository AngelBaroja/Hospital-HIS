const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Ecografia extends Model {}

Ecografia.init(
  {
    tipo: {
      type: DataTypes.STRING(20),
      comment: "Indique el tipo de ecografia que se realizará",
    },    
    informacion: {
      type: DataTypes.STRING(4000),
      comment: "Detalle la información relevante de la ecografia",
    },
    ruta: {
      type: DataTypes.STRING(200),
      comment: "Ruta donde se guardará la ecografia",
    }    
  },
  {
    sequelize,
    modelName: "Ecografia",
    tableName: "ecografias"    
  }
);

Historial_Medico.hasMany(Ecografia, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Ecografia.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Ecografia;

