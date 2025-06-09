const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const bcrypt = require('bcrypt');

class Usuario extends Model {
  async validarContraseña(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
  }
}

Usuario.init(
  {    
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,  
        unique: true,
        comment: `Usuario del personal del hospital`                
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,       
        comment: `Contraseña del personal del hospital`
    }         
  }, {
  sequelize,
  modelName: "Usuario",
  tableName: "usuarios",
  hooks: {  
    beforeCreate: async (usuario) => {
      if (usuario.contraseña) {
        const salt = await bcrypt.genSalt(10);
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('contraseña')) {
        const salt = await bcrypt.genSalt(10);
        usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
      }
    }
  }
});

module.exports = Usuario;