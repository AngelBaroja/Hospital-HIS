const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require("./Paciente");

class Usuario extends Model { }

Usuario.init(
  {    
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,  
        unique: true,        
        validate: {
            len: [7, 8],  
            is: /^[0-9]+$/i,   // Solo números
            isNumeric: true // Solo números
        },
        comment: `Usuario del personal del hospital relacionado con el DNI del personal`                
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {               
            len: [3,10],     
            isAlphanumeric: true, // Solo alfanumérico
            is: /^[a-zA-Z0-9]+$/i // Solo letras y números    
        },
        comment: `Contraseña del personal del hospital`
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            isIn: [[`Recepcionista`, `Medido`, `Enfermero`, `Administrativo`]]
        },
        comment: `Cargo del personal del hospital`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el usuario del personal del hospital esta activo o no`
    }    
  }, {
  sequelize,
  modelName: "Usuario",
  tableName: "usuarios", 
}
);


module.exports = Usuario;
