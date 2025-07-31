const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class ResonanciaMagnetica extends Model {}

ResonanciaMagnetica.init(
  {
    tipo: {
      type: DataTypes.STRING(20),
      comment: "Indique el tipo de radiografía que se realizará",
    },    
    informacion: {
      type: DataTypes.STRING(4000),
      comment: "Detalle la información relevante de la radiografia",
    },
    ruta: {
      type: DataTypes.STRING(200),
      comment: "Ruta donde se guardará la radiografía",
    }    
  },
  {
    sequelize,
    modelName: "ResonanciaMagnetica",
    tableName: "ResonanciasMagneticas"    
  }
);

Historial_Medico.hasMany(ResonanciaMagnetica, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
ResonanciaMagnetica.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = ResonanciaMagnetica;

