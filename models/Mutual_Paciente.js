// models/Mutual_Paciente.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Mutual = require("./Mutual");
const Paciente = require("./Paciente");

class Mutual_Paciente extends Model {}

Mutual_Paciente.init(
  {
   
    numero_mutual: { 
        type: DataTypes.INTEGER, 
        enableNull: false, 
        unique: true, 
        validar: { len: [5, 5] }, 
        comment: "Numero de la mutual del paciente, debe tener 5 digitos"
     }, 
     tipo_cobertura: { 
        type: DataTypes.STRING, 
        enableNull: false, 
        defaultValue: "Basico", 
        validar: { isIn: [["Basico", "Completo", "Premium"]]            
         }, 
        comment: "Tipo de cobertura que tiene el paciente en la mutua"
     },
     activa: { 
        type: DataTypes.BOOLEAN, 
        enableNull: false, 
        defaultValue: true, 
        validar: { 
            isIn: [[true, false]] 
        }, 
        comment: "Indica si la mutua del paciente esta activa o no"
     },
  
  },
  {
    sequelize,
    modelName: "Mutual_Paciente",
    tableName: "mutuales_pacientes",
  }
);

Mutual_Paciente.belongsTo(Mutual, {
  foreignKey: "id_mutual",
});

Mutual_Paciente.belongsTo(Paciente, {
  foreignKey: "id_paciente",
});

module.exports = Mutual_Paciente;
