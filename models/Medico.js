const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Usuario = require(`./Usuario`); 

class Medico extends Model { }

Medico.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Medico' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Medico'
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           isIn: [['Cardiología', 'Pediatría', 'Neurología', 'Ginecología', 'Traumatología', 'Oftalmología', 'Otorrinolaringología', 'Dermatología', 'Psiquiatría', 'Medicina General']]             
        },
        comment: 'Especialidad del Medico'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Medico'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Medico'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Medico'
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
        comment: `Teléfono del Medico`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         
        },
        comment: `Provincia del Medico`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Medico`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el Medico esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Medico",   // Nombre del modelo
  tableName: "medicos",  // Nombre de la tabla en la base de datos
}
);


module.exports = Medico;
