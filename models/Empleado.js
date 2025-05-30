const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Usuario = require(`./Usuario`); 

class Empleado extends Model { }

Empleado.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Empleado' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Empleado'
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            isIn: [['Médico', 'Enfermero', 'Recepcionista']] 
        },
        comment: `Cargo del Empleado`                
    }
    ,
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           isIn: [['Cardiología', 'Pediatría', 'Neurología', 'Ginecología', 'Traumatología', 'Oftalmología', 'Otorrinolaringología', 'Dermatología', 'Psiquiatría', 'Medicina General', `Ninguna`]]             
        },
            comment: 'Especialidad del Medico o Enfermero'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Empleado'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Empleado'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Empleado'
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
        comment: `Teléfono del Empleado`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         
        },
        comment: `Provincia del Empleado`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Empleado`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el Empleado esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Empleado",   // Nombre del modelo
  tableName: "empleados",  // Nombre de la tabla en la base de datos
}
);

Empleado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Empleado;
