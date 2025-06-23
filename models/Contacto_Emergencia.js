const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require(`./Paciente`)

class Contacto_Emergencia extends Model { }

Contacto_Emergencia.init(
  {
    numero: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,        
        comment: `Numero de contacto de emergencia del Paciente`                
    }
  }, {
  sequelize,
  modelName: "Contacto_Emergencia",
  tableName: "contactos_emergencia",
}
);

Contacto_Emergencia.belongsTo(Paciente, { foreignKey: 'id_paciente' });
Paciente.hasMany(Contacto_Emergencia, { foreignKey: 'id_paciente' });

module.exports = Contacto_Emergencia;
