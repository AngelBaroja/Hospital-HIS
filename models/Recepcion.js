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
                isIn: [['Cita Programada', `Emergencia`]]   
            },        
            comment: `Tipo de recepcion dentro del Hospital`                
        },
        detalle_motivo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [1, 200]
            },
            comment: `Motivo detallado del porque de la recepcion del paciente`                
        },
        hora: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,        
            validate: {
                isNumeric: true,
                isIn: [[7,8,9,10,11,12,13,14,15,16,17,18,19]]            
            },
            comment: `Hora de recepcion`                
        },
        fecha_entrada: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: false,
            defaultValue: () => new Date(),    // Siempre genera la fecha actual            
            validate: {
                isDate: true,            
            },
            comment: `Fecha de recepcion`
        },
        fecha_salida: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: false,
            defaultValue: null,               
            validate: {
                isDate: true,            
            },
            comment: `Fecha de salida`
        },
    }, {
    sequelize,
    modelName: "Recepcion",
    tableName: "recepciones",
}
);


// Un Paciente puede tener muchas Recepciones
Paciente.hasMany(Recepcion, { foreignKey: 'id_paciente' });

// Una Recepción pertenece a un Paciente (y lleva la clave foránea)
Recepcion.belongsTo(Paciente, { foreignKey: 'id_paciente' });

// Una Recepción pertenece a una Cama (y lleva la clave foránea)
Recepcion.belongsTo(Cama, { foreignKey: 'id_cama' });

// Un Motivo puede estar en muchas Recepciones
Motivo.hasMany(Recepcion, { foreignKey: 'id_motivo' });

// Una Recepción pertenece a un Motivo (y lleva la clave foránea)
Recepcion.belongsTo(Motivo, { foreignKey: 'id_motivo' });

module.exports = Recepcion;
