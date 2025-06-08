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
        type: DataTypes.DATEONLY, // Solo fecha, sin hora        
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
        comment: `Horario del turno`                
    }, 
    detalle: {
        type: DataTypes.STRING,
        allowNull: true,        
        comment: `Detalle del turno`                
    } 
  }, {
  sequelize,
  modelName: "Turno",
  tableName: "turnos",
}
);

Turno.belongsTo(Paciente, { foreignKey: 'id_paciente' }); 
Paciente.hasMany(Turno, { foreignKey: 'id_paciente' });

module.exports = Turno;
