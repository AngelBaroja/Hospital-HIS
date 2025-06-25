const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Medicamento_Paciente extends Model {}

Medicamento_Paciente.init(
  {
    nombre_medicamento: {
      type: DataTypes.STRING(100),
      comment: "Nombre del medicamento que consume el Paciente",
    },
    dosis: {
      type: DataTypes.INTEGER,
      comment: "Dosis del medicamento que consume el Paciente",
    },
    frecuencia: {
      type: DataTypes.STRING(50),
      comment: "Frecuencia con la que el Paciente consume el medicamento (ej. diaria, semanal, mensual)"
    }
  },
  {
    sequelize,
    modelName: "Medicamento_Paciente",
    tableName: "medicamentos",
  }
);

Historial_Medico.hasMany(Medicamento_Paciente, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Medicamento_Paciente.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Medicamento_Paciente;