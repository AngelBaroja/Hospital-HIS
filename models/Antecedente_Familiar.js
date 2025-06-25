const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Antecedente_Familiar extends Model {}

Antecedente_Familiar.init(
  {
    enfermedad_familiar: {
      type: DataTypes.STRING(100),
      comment: "Nombre de la enfermedad familiar",
    },
    parentesco: {
      type: DataTypes.STRING(50),
        validate: {
            isIn: [["Padre", "Madre", "Hermano", "Hermana", "Abuelo", "Abuela", "Tío", "Tía"]]
        },
      comment: "Parentesco del familiar con el paciente (ej. padre, madre, hermano, etc.)",
    }
  },
  {
    sequelize,
    modelName: "Antecedente_Familiar",
    tableName: "antecedentes_familiares"    
  }
);

Historial_Medico.hasMany(Antecedente_Familiar, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Antecedente_Familiar.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Antecedente_Familiar;

