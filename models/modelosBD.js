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
const Contacto_Emergencia = require('./Contacto_Emergencia');
const Historial_Medico = require('./Historial_Medico');
const Enfermedad_Previa = require('./Enfermedad_Previa');
const Cirugia_Previa = require('./Cirugia_Previa');
const Medicamento_Paciente = require('./Medicamento_Paciente');
const Antecedente_Familiar = require('./Antecedente_Familiar');
const Alergia = require('./Alergia');



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
    Contacto_Emergencia,
    Historial_Medico,
    Enfermedad_Previa,
    Cirugia_Previa,
    Medicamento_Paciente,
    Antecedente_Familiar,
    Alergia 
}