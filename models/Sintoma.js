const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Sintoma extends Model {}

Sintoma.init(
  {
    sintomas: {
      type: DataTypes.STRING(200),
      comment: "Detalle los sintomas que posee el paciente",
    },
    prioridad: {
      type: DataTypes.STRING(50),
        validate: {
            isIn: [["Baja", "Media", "Alta"]]
        },
      comment: "Indica la prioridad de atencion del paciente",
    }
  },
  {
    sequelize,
    modelName: "Sintoma",
    tableName: "sintomas"    
  }
);

Historial_Medico.hasMany(Sintoma, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Sintoma.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Sintoma;

