const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");


class Especialidad extends Model { }

Especialidad.init(
  {
    tipos: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [1, 70],
        },        
        comment: `Tipos de Especialidades de los medicos y enfermeros`                
    }    
  }, {
  sequelize,
  modelName: "Especialidad",
  tableName: "especialidades",
}
);

module.exports = Especialidad;
