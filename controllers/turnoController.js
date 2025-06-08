const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
const Turno = require('../models/Turno');
const Mutual_Paciente = require('../models/Mutual_Paciente');
const Mutual = require('../models/Mutual');


const Habitacion = require('../models/Habitacion');
const Ala = require('../models/Ala');
const { Op, EagerLoadingError } = require('sequelize');

async function vistaGenerarTurno(req, res) {     
    const usuario = req.session.nombreUsuario
    const mutuales = await Mutual.findAll();
    const pacientes = await Paciente.findAll();
    const mutualPacientes = await Mutual_Paciente.findAll();

    res.status(200).render('turno/generar',{mutuales,pacientes,mutualPacientes,usuario});
}
async function generarTurno(req, res) { 
    const {
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    contacto_emergencia,
    direccion,
    provincia,
    localidad,
    seguro,
    codigo_mutual,
    tipo_cobertura,
    activa,
    doctor,
    fecha_turno,
    hora,
    detalle_motivo
  } = req.body;
  //Busco al paciente
  let paciente = await Paciente.findOne({ where: { dni } });

  if (!paciente) {
    //Paciente no existe creamos uno
    paciente = await Paciente.create({
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      contacto_emergencia,
      direccion,
      provincia,
      localidad
    });

    //Verificamos que al paciente se le asigno una mutual
    const mutual= await Mutual.findOne({where:{nombre:seguro}})
    if (mutual) {
      //Se le genera una mutual Paciente
      await Mutual_Paciente.create({
        id_paciente: paciente.id,
        id_mutual: mutual.id,
        codigo_mutual,
        tipo_cobertura,
        activa
      });
    }
  }
  
  await Turno.create({
    id_paciente: paciente.id,
    doctor,
    fecha_turno,
    hora,
    detalle_motivo,
  });
  console.log(`Turno generado para el paciente DNI: ${paciente.nombre} ${paciente.apellido}`);
 
}

async function elegirVistaTurno(req, res) { 
    const usuario = req.session.nombreUsuario
    res.status(200).render('turno/elegir',{usuario});
}

module.exports = {
  generarTurno,
  vistaGenerarTurno,
  elegirVistaTurno
};