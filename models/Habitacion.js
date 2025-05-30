const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Cama = require(`./Cama`)

class Habitacion extends Model { }

Habitacion.init(
  {
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue:`Individual`,
        validate: {
            isIn: [['Individual', `Doble`]] 
        },        
        comment: `Tipo de habitacion`                
    },
    activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si la habitacion esta activa o no`
    } 
  }, {
  sequelize,
  modelName: "Habitacion",
  tableName: "habitaciones",
}
);

Habitacion.hasMany(Cama, { foreignKey: 'id_habitacion' });
Cama.belongsTo(Habitacion, { foreignKey: 'id_habitacion' });

module.exports = Habitacion;
