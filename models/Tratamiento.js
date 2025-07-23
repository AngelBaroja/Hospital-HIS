const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Tratamiento extends Model {}

Tratamiento.init(
  {
    tratamiento: {
      type: DataTypes.STRING(50),
        validate: {
            isIn: [["Farmacológico estándar",
                    "Farmacológico intensivo",
                    "No farmacológico: frío/calor",
                    "No farmacológico: relajación",
                    "Mixto personalizado",
                    "Evaluación y ajuste diario",
                    "Otro",
                    ]]                     
        },
      comment: "Indica la el plan de tratamientos a tomar para alivar el malestar en el paciente",
    },
    detalle_tratamiento: {
      type: DataTypes.STRING(200),
      comment: "Detalle del plan de tratamientos a realizarle al paciente",
    },
  },
  {
    sequelize,
    modelName: "Tratamiento",
    tableName: "tratamientos"    
  }
);

Historial_Medico.hasMany(Tratamiento, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Tratamiento.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Tratamiento;

