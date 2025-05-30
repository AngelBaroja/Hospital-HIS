const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");

class Cama extends Model { }

Cama.init(
    {
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            validate: {
                isNumeric: true,
                isIn: [[1,2]] 
            },
            comment: `Numero de la cama dentro de la habitacion`
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            defaultValue: `Normal`,
            validate: {
                isIn: [['Normal', `UCI`, `Reanimacion`, 'Pediátrica']]
            },
            comment: `Tipo de cama`
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            defaultValue: `Libre`,
            validate: {
                    isIn: [[`Libre`, `Ocupada`, `En Desinfeccion`,`En Mantenimiento`]] 
            },
            comment: `Estado de la cama`
        },
        electrica: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false,
            defaultValue: false,
            validate: {
                isIn: [[true, false]]
            },
            comment: `Indica si la cama es electrica o no`
        },
        oxigeno: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false,
            defaultValue: false,
            validate: {
                isIn: [[true, false]]
            },
            comment: `Indica si la cama tiene oxigeno o no`
        }
    }, {
        sequelize,
        modelName: "Cama",
        tableName: "camas",
    }
);

module.exports = Cama;
