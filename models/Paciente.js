const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");

class Paciente extends Model { }

Paciente.init(
  {
    nombre: {
        type: DataTypes.STRING,     // Definimos el tipo de dato como STRING
        allowNull: false,           // El campo 'nombre' NO es obligatorio
        unique: false,              // No es único, puede haber varios pacientes con el mismo nombre
        defaultValue: 'Sin nombre', // Valor por defecto si no se proporciona un Nombre
        validate: {                 // Validaciones
            len: [3, 20]            // Longitud mínima y máxima del nombre
        },
        comment: 'Nombre del paciente' // Comentario para el campo
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Sin Apellido',
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del paciente'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin DNI`,        
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del paciente'
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
        unique: false,
        defaultValue: null,
        validate: {
            isDate: true  // Validación para asegurarse de que es una fecha
        },
        comment: 'Fecha de nacimiento del paciente'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Otro', 
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']]  // Validación para asegurarse de que el género es uno de los valores permitidos
        },
        comment: 'Género del paciente'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Sin dirección',
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del paciente'
    },
    contacto_emergencia: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin contacto`,
        validate: {
            isNumeric: true,    // Validacion para asegurarse de que es un numero
            len: [7, 15]         // Longitud mínima y máxima del teléfono
        },
        comment: `Contacto de emergencia del paciente`,
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin Provincia`,
        validate: {
            len: [3, 20]         // Longitud mínima y máxima de la provincia
        },
        comment: `Provincia del paciente`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin Localidad`,
        validate: {
            len: [3,60]
        },
        comment: `Localidad del paciente`
    }    
  },{
  sequelize,
  modelName: "Paciente",   // Nombre del modelo
  tableName: "pacientes",  // Nombre de la tabla en la base de datos
}
);

module.exports = Paciente;
