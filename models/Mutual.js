const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Paciente = require("./Paciente");

class Mutual extends Model { }

Mutual.init(
  {    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,        
        validate: {
            isIn: [['OSDE', 'Galeno', 'Swiss Medical', 'PAMI', 'Sancor Salud', 'MEOC']] 
        },
        comment: `Nombre de la mutual`                
    },
    numero_mutual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,        
        validate: {
            isNumeric: true,    
            len: [10,10]         
        },
        comment: `Numero de la mutual`
    },
    tipo_cobertura: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: `Basico`,
        validate: {
            isIn: [[`Basico`, `Completo`, `Premium`]]
        },
        comment: `Tipo de cobertura`
    },
    activa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: true,
        validate: {
            isIn: [[true, false]]
        },
        comment: `Indica si la mutual del paciente esta activa o no para el paciente`
    }    
  }, {
  sequelize,
  modelName: "Mutual",
  tableName: "mutuales",
}
);

Paciente.belongsTo(Mutual, { foreignKey: 'id_mutual' });
Mutual.hasMany(Paciente, { foreignKey: 'id_mutual' });

module.exports = Mutual;
