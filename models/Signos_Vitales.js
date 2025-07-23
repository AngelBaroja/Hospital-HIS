const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Historial_Medico = require("./Historial_Medico");

class Signos_Vitales extends Model {}

Signos_Vitales.init(
    {
        presion_arterial: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Presión arterial del paciente (mmHg)",
        },
        frecuencia_cardiaca: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Frecuencia cardíaca del paciente (latidos por minuto)",
        },
        frecuencia_respiratoria: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Frecuencia respiratoria del paciente (respiracion por minuto) ",
        },
        temperatura_corporal: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Temperatura corporal del paciente (°C)",
        },
        tonalidad_piel: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: {
                    args: [[
                        "Normal",
                        "Pálida",
                        "Rosada",
                        "Rojiza",
                        "Cianótica (azulada)",
                        "Amarillenta",
                        "Morena clara",
                        "Morena Oscura",
                        "Otra tonalidad"
                    ]]                    
                }
            },
            comment: "Tonalidad de la piel del paciente"
        },
        detalle_piel: {
            type: DataTypes.STRING(150),
            allowNull: true,
            comment: "Detalles observados en la piel del paciente",
        },
        estimulo: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: {
                    args: [[
                        "Alerta (responde normalmente)",
                        "Responde a estímulos verbales",
                        "No responde a estímulos",
                        "Responde solo al dolor",
                        "Respuesta confusa/desorientada",
                        "Respuesta verbal incoherente"
                    ]]                    
                }
            },
            comment: "Nivel de respuesta al estímulo (solo opciones permitidas)",
        }
    },
    {
        sequelize,
        modelName: "Signos_Vitales",
        tableName: "signos_vitales",
    }
);

Historial_Medico.hasMany(Signos_Vitales, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });
Signos_Vitales.belongsTo(Historial_Medico, { foreignKey: "id_historial_medico", onDelete: "CASCADE" });

module.exports = Signos_Vitales;