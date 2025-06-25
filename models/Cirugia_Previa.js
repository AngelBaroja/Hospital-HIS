const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Cirugia_Previa extends Model {}

Cirugia_Previa.init(
  {
    nombre_cirugia: {
      type: DataTypes.STRING(100),
      comment: "Nombre de la cirugía previa realizada al Paciente",
    },
    fecha_cirugia: {
      type: DataTypes.DATEONLY,
      comment: "Fecha en que se realizó la cirugía previa al Paciente",
    },
    detalle_motivo: {
      type: DataTypes.STRING(255),
      comment: "Descripción del motivo de la cirugía previa realizada al Paciente",
    }    
  },
  {
    sequelize,
    modelName: "Cirugia_Previa",
    tableName: "cirugias_previas"
  }
);

Historial_Medico.hasMany(Cirugia_Previa, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Cirugia_Previa.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Cirugia_Previa