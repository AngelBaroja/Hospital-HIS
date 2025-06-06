const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");

class Recepcionista extends Model { }

Recepcionista.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Recepcionista' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Recepcionista'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Recepcionista'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Recepcionista'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Recepcionista'
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        defaultValue: `Sin contacto`,
        validate: {
            isNumeric: true,   
            len: [7, 15]         
        },
        comment: `Teléfono del Recepcionista`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         // Longitud mínima y máxima de la provincia
        },
        comment: `Provincia del Recepcionista`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Recepcionista`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,       
        comment: `Indica si el Recepcionista esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Recepcionista",   // Nombre del modelo
  tableName: "recepcionistas",  // Nombre de la tabla en la base de datos
}
);

module.exports = Recepcionista;
