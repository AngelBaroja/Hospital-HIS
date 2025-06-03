const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Habitacion = require(`./Habitacion`)

class Ala extends Model { }

Ala.init(
  {
    sector: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            isIn: [['Este', `Oeste`, `Norte`, `Sur`]] 
        },        
        comment: `Sector dentro del Hospital`                
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,        
        validate: {
            len: [0, 200]
        },
        comment: `Descripcion del Ala`                
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si la Sector esta activo o no`
    } 
  }, {
  sequelize,
  modelName: "Ala",
  tableName: "alas",
}
);

Habitacion.belongsTo(Ala, { foreignKey: 'id_ala' });
Ala.hasMany(Habitacion, { foreignKey: 'id_ala' });

module.exports = Ala;
