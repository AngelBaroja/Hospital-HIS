const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Enfermedad_Previa extends Model {}

Enfermedad_Previa.init(
  {
    nombre_enfermedad: {
      type: DataTypes.STRING(100),
      comment: "Nombre de la enfermedad previa"
    },
    fecha_diagnostico: {
      type: DataTypes.DATEONLY,
      comment: "Fecha en que se diagnosticó la enfermedad previa"
    }   
  },
  {
    sequelize,
    modelName: "Enfermedad_Previa",
    tableName: "enfermedades_previas",    
  }
);

Historial_Medico.hasMany(Enfermedad_Previa, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Enfermedad_Previa.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Enfermedad_Previa;