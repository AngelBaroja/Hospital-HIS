const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");

class Mutual extends Model { }

Mutual.init(
  {    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            isIn: [['OSDE', 'Galeno', 'Swiss Medical', 'PAMI', 'Sancor Salud', 'MEOC']] 
        },
        comment: `Nombre de la mutual`                
    }    
  }, {
  sequelize,
  modelName: "Mutual",
  tableName: "mutuales",
}
);

module.exports = Mutual;
