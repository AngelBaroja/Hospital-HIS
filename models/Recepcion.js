const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require(`./Paciente`)
const Cama = require(`./Cama`)
const Motivo = require(`./Motivo`)

class Recepcion extends Model { }

Recepcion.init(
    {
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,        
            validate: {
                isIn: [['Cita Programada', `Derivacion`, `Emergencia`]]   
            },        
            comment: `Tipo de recepcion dentro del Hospital`                
        },
        detalle_motivo: {
            type: DataTypes.STRING,
            allowNull: false,            
            comment: `Motivo detallado del porque de la recepcion del paciente`                
        },
        hora: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            defaultValue: () => new Date().getHours(),          
            comment: `Hora de recepcion (valores válidos: 00 a 23)`                
        },
        fecha_entrada: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: false,
            defaultValue: () => new Date(),    // Siempre genera la fecha actual            
            validate: {
                isDate: true,            
            },
            comment: `Fecha de recepcion`
        },
        fecha_salida: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            unique: false,
            defaultValue: null,               
            validate: {
                isDate: true,            
            },
            comment: `Fecha de salida`
        },
        estado:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            defaultValue:'Internado',        
            validate: {
                isIn: [['Internado', `Retirado`]]   
            },        
            comment: `El estado de la recepcion` 
        }
    }, {
    sequelize,
    modelName: "Recepcion",
    tableName: "recepciones",
}
);


// Un Paciente puede tener muchas Recepciones
Paciente.hasMany(Recepcion, { foreignKey: 'id_paciente' });

// Una Recepción tiene a un Paciente (y lleva la clave foránea)
Recepcion.belongsTo(Paciente, { foreignKey: 'id_paciente' });

// Una Recepción tiene a una Cama (y lleva la clave foránea)
Recepcion.belongsTo(Cama, { foreignKey: 'id_cama' });

// Un Motivo puede estar en muchas Recepciones
Motivo.hasMany(Recepcion, { foreignKey: 'id_motivo' });

// Una Recepción tiene a un Motivo (y lleva la clave foránea)
Recepcion.belongsTo(Motivo, { foreignKey: 'id_motivo' });

module.exports = Recepcion;
