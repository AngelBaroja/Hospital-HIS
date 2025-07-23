const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require("./Paciente");
const Doctor = require("./Doctor");
const Enfermero = require("./Enfermero");

class Chat extends Model {}

Chat.init(
  {
    autor: {
      type: DataTypes.STRING(50),
      comment: "Nombre y Apellido del autor del mensaje",
    },
    cargo: {
      type: DataTypes.STRING(15),
      comment: "Cargo del autor del mensaje (Doctor, Enfermero)",
    },
    mensaje: {
      type: DataTypes.STRING(500),
      comment: "Mensajes que se pueden enviar entre los distintos profesionales de la salud",
    },
    id_autor: {
      type: DataTypes.INTEGER,
      comment: "ID del usuario que envía el mensaje"
    }   
  },
  {
    sequelize,
    modelName: "Chat",
    tableName: "chats"    
  }
);

Paciente.hasMany(Chat, { foreignKey: "id_paciente", onDelete: "CASCADE" });
Chat.belongsTo(Paciente, { foreignKey: "id_paciente", onDelete: "CASCADE" });

Doctor.hasMany(Chat, { foreignKey: "id_doctor", onDelete: "CASCADE" });
Chat.belongsTo(Doctor, { foreignKey: "id_doctor", onDelete: "CASCADE" });

Enfermero.hasMany(Chat, { foreignKey: "id_enfermero", onDelete: "CASCADE" });
Chat.belongsTo(Enfermero, { foreignKey: "id_enfermero", onDelete: "CASCADE" });

module.exports = Chat;

