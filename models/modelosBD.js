const sequelize = require('../config/conexion');
const Paciente = require('./Paciente');
const Recepcion = require('./Recepcion');
const Turno = require('./Turno');
const Motivo = require('./Motivo');
const Habitacion = require('./Habitacion');
const Cama = require('./Cama');
const Ala = require('./Ala');
const Mutual = require('./Mutual');
const Especialidad = require('./Especialidad');
const Usuario = require('./Usuario');
const Mutual_Paciente = require('./Mutual_Paciente');
const Doctor = require('./Doctor');
const Enfermero = require('./Enfermero');
const Recepcionista = require('./Recepcionista');


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
    Especialidad,
    Usuario,   
    Mutual_Paciente,    
    Doctor,
    Enfermero,
    Recepcionista,    
}