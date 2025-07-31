const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Usuario = require(`./Usuario`); 

class Administrador extends Model { }

Administrador.init(
  {
    nombre: {
        type: DataTypes.STRING,     
        allowNull: false,           
        unique: false,       
        validate: {                 
            len: [3, 20]            
        },
        comment: 'Nombre del Administrador' 
    },
    apellido: {
       type: DataTypes.STRING,
        allowNull: false,
        unique: false,       
        validate: {
            len: [3, 20]
        },
        comment: 'Apellido del Administrador'
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,             
        validate: {
           len: [7, 8],              
        },
        comment: 'DNI del Administrador'
    },
    fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            unique: false,
            defaultValue: null,       
            comment: 'Fecha de nacimiento del Administrador'
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
           isIn: [['Masculino', 'Femenino', 'Otro']] 
        },
        comment: 'Género del Administrador'
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [5, 50]  
        },
        comment: 'Dirección del Administrador'
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
        comment: `Teléfono del Administrador`
    },
    provincia:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3, 20]         
        },
        comment: `Provincia del Administrador`
    },
    localidad:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            len: [3,60]
        },
        comment: `Localidad del Administrador`
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si el Administrador esta activo o no`
    }    
  },{
  sequelize,
  modelName: "Administrador",   
  tableName: "administradores",  
}
);

Usuario.hasMany(Administrador, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Administrador.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });


module.exports = Administrador;
