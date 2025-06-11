const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");

class Paciente extends Model { }

Paciente.init(
  {
    nombre: {
        type: DataTypes.STRING,     // Definimos el tipo de dato como STRING
        allowNull: false,           // El campo 'nombre' NO es obligatorio
        unique: false,              // No es único, puede haber varios pacientes con el mismo nombre
        defaultValue: 'Sin Nombre', // Valor por defecto si no se proporciona un Nombre
        comment: 'Nombre del paciente' // Comentario para el campo
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Sin Apellido',        
        comment: 'Apellido del paciente'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin DNI`,
        comment: 'DNI del paciente'
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        unique: false,
        defaultValue: null,       
        comment: 'Fecha de nacimiento del paciente'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'No especificado', 
        validate: {
           isIn: [['Masculino', 'Femenino', 'No especificado']]  // Validación para asegurarse de que el género es uno de los valores permitidos
        },
        comment: 'Género del paciente'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Sin dirección',       
        comment: 'Dirección del paciente'
    },
    contacto_emergencia: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin contacto`,       
        comment: `Contacto de emergencia del paciente`,
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin Provincia`,       
        comment: `Provincia del paciente`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Sin Localidad`,        
        comment: `Localidad del paciente`
    }    
  },{
  sequelize,
  modelName: "Paciente",   // Nombre del modelo
  tableName: "pacientes",  // Nombre de la tabla en la base de datos
}
);

module.exports = Paciente;
