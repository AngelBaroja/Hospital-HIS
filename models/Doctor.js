const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Usuario = require(`./Usuario`);
const Especialidad = require(`./Especialidad`);  

class Doctor extends Model { }

Doctor.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Doctor' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Doctor'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Doctor'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Doctor'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Doctor'
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
        comment: `Teléfono del Doctor`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         
        },
        comment: `Provincia del Doctor`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Doctor`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el Doctor esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Doctor",   
  tableName: "doctores",  
}
);

Usuario.hasOne(Doctor, { foreignKey: 'id_usuario', onDelete: 'CASCADE'});
Doctor.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

Especialidad.hasMany(Doctor, { foreignKey: 'id_especialidad', onDelete: 'CASCADE' });
Doctor.belongsTo(Especialidad, { foreignKey: 'id_especialidad', onDelete: 'CASCADE' });

module.exports = Doctor;
