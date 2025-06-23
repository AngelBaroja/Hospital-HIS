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
        validate: { isIn: [["Basico", "Completo", "Premium"]]            
         }, 
        comment: "Tipo de cobertura que tiene el paciente en la mutua"
     },
     activa: { 
        type: DataTypes.BOOLEAN, 
        enableNull: false, 
        defaultValue: true,
        set(value) { // Setter personalizado
          if (typeof value === 'string') {
            this.setDataValue('activa', value === "Activa");
          } else {
            this.setDataValue('activa', !!value); // Convierte a booleano
          }
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

Mutual.hasOne(Mutual_Paciente, { foreignKey: "id_mutual", onDelete: 'CASCADE' });
Mutual_Paciente.belongsTo(Mutual, {foreignKey: "id_mutual", onDelete: 'CASCADE'});

Paciente.hasOne(Mutual_Paciente, { foreignKey: 'id_paciente', onDelete: 'CASCADE' });
Mutual_Paciente.belongsTo(Paciente, { foreignKey: 'id_paciente', onDelete: 'CASCADE' });

module.exports = Mutual_Paciente;
