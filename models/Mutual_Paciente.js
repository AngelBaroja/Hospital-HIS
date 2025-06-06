const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/conexion");
const Mutual = require("./Mutual");
const Paciente = require("./Paciente");

class Mutual_Paciente extends Model {}

Mutual_Paciente.init(
  {   
    codigo_mutual: { 
        type: DataTypes.STRING, 
        enableNull: false, 
        unique: false,        
        comment: "Codigo de la mutual del paciente, debe tener 5 digitos"
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
