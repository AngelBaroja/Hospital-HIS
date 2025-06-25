const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require("./Paciente");

class Historial_Medico extends Model {}

Historial_Medico.init(
  {},
  {
    sequelize,
    modelName: "Historial_Medico",
    tableName: "historiales_medicos",    
  }
);

Paciente.hasOne(Historial_Medico, {foreignKey: "id_paciente", onDelete: "CASCADE"});
Historial_Medico.belongsTo(Paciente, {foreignKey: "id_paciente", onDelete: "CASCADE"});

module.exports = Historial_Medico;