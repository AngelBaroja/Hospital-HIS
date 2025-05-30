const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");


class Motivo extends Model { }

Motivo.init(
  {
    tipos: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [1, 70],
        },        
        comment: `Tipos de motivos generales`                
    }    
  }, {
  sequelize,
  modelName: "Motivo",
  tableName: "motivos",
}
);

module.exports = Motivo;
