const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require('./Paciente');

class Turno extends Model { }

Turno.init(
  {
    doctor: {
        type: DataTypes.STRING,
        allowNull: false,        
        comment: `Nombre del doctor`                
    },
    fecha_turno: {
        type: DataTypes.DATE,
        allowNull: false,        
        defaultValue: DataTypes.NOW,  
        validate: {
            isDate: true
        },
        comment: `Fecha del turno`
    },
    hora : {
        type: DataTypes.INTEGER,
        allowNull: false,              
        validate: {
            isNumeric: true,
            isIn: [[7,8,9,10,11,12,13,14,15,16,17,18,19]]            
        },
        comment: `Horario del turno`                
    }, 
  }, {
  sequelize,
  modelName: "Turno",
  tableName: "turnos",
}
);

Turno.belongsTo(Paciente, { foreignKey: 'id_paciente' }); 


module.exports = Turno;
