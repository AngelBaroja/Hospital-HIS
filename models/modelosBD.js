const sequelize = require('../config/conexion');
const Paciente = require('./Paciente');
const Recepcion = require('./Recepcion');
const Turno = require('./Turno');
const Motivo = require('./Motivo');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const Ala = require('./Ala');
const Mutual = require('./Mutual');
const Empleado = require('./Empleado');
const Usuario = require('./Usuario');
const Mutual_Paciente = require('./Mutual_Paciente');


Cama.hasMany(Recepcion, { foreignKey: 'id_cama' });
Recepcion.belongsTo(Cama, { foreignKey: 'id_cama' });

Usuario.hasOne(Empleado, { foreignKey: 'id_usuario' });
Empleado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = {
    sequelize,
    Paciente,
    Cama,
    Turno,
    Motivo,
    Habitacion,    
    Ala,     
    Mutual,
    Recepcion,
    Usuario,
    Empleado,
    Mutual_Paciente
}