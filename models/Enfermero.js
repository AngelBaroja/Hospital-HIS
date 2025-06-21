const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Usuario = require(`./Usuario`); 
const Especialidad = require(`./Especialidad`);

class Enfermero extends Model { }

Enfermero.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Enfermero' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Enfermero'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Enfermero'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Enfermero'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Enfermero'
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
        comment: `Teléfono del Enfermero`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         
        },
        comment: `Provincia del Enfermero`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Enfermero`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el Enfermero esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Enfermero",   
  tableName: "enfermeros",  
}
);

Usuario.hasOne(Enfermero, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Enfermero.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

Especialidad.hasMany(Enfermero, { foreignKey: 'id_especialidad', onDelete: 'CASCADE' });
Enfermero.belongsTo(Especialidad, { foreignKey: 'id_especialidad', onDelete: 'CASCADE' });

module.exports = Enfermero;
