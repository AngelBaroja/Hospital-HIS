const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Alergia extends Model {}

Alergia.init(
  {
    sustancia: {
      type: DataTypes.STRING(100),
      comment: "Sustancia a la que el paciente es alérgico",
    },
    reaccion: {
      type: DataTypes.STRING(255),
      comment: "Descripción de la reacción alérgica",
    },
    severidad: {
      type: DataTypes.STRING(50),
      validate: {
        isIn: {
          args: [["Leve", "Moderada", "Severa"]]          
        }
      },
      comment: "Gravedad de la alergia (Leve, Moderada, Severa)"
    }    
  },
  {
    sequelize,
    modelName: "Alergia",
    tableName: "alergias",    
  }
);

Historial_Medico.hasMany(Alergia, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Alergia.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Alergia;