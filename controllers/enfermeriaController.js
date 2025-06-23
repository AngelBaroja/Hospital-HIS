const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
const Turno = require('../models/Turno');
const Mutual_Paciente = require('../models/Mutual_Paciente');
const Mutual = require('../models/Mutual');
const Motivo = require('../models/Motivo');
const Cama = require('../models/Cama');
const Habitacion = require('../models/Habitacion');
const Ala = require('../models/Ala');
const Contacto_Emergencia = require('../models/Contacto_Emergencia');

const { Op } = require('sequelize');

async function pacientesInternados(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;


        // Obtener todas las recepciones activas (sin fecha de salida)
        let recepciones = await Recepcion.findAll({
            where: {
                fecha_salida: null
            },
            include: [
                {
                    model: Paciente,
                    as: 'Paciente',                    
                },
                {
                    model: Cama,
                    as: 'Cama',                   
                    include: [
                        {
                            model: Habitacion,
                            as: 'Habitacion',
                            include: [
                                {
                                    model: Ala,
                                    as: 'Ala'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Motivo,
                    as: 'Motivo'
                }
            ]
        });       
        recepciones.forEach(recepcion => {
            if (recepcion.fecha_entrada) {
                const fecha = new Date(recepcion.fecha_entrada);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                recepcion.fecha_entrada_formateada = `${dia}/${mes}/${anio}`;
            }
        });
        res.status(200).render('enfermeria/pacientesInternados', { usuario, cargo, recepciones });
    } catch (error) {
        console.error('Error en Enfermeria al obtener pacientes internados:', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los pacientes internados de enfermeria', error });
    }
}

async function vistaRegistroEnfermeria(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        const recepcionId = req.params.id;
        console.log(`ID: `,recepcionId);
        

        // Obtener la recepción específica por ID del paciente seleccionado
        let recepciones = await Recepcion.findOne({
            where: {
                id: recepcionId
            },
            include: [
                {
                    model: Paciente,                    
                    include: [
                        {
                            model: Mutual_Paciente,
                            include: [{model: Mutual}]
                        },
                        {
                            model: Contacto_Emergencia                            
                        }
                    ]
                },
                {
                    model: Cama,
                    include: [
                        {
                            model: Habitacion,
                            include: [
                                {
                                    model: Ala,
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Motivo,
                }
            ]
        });

        const mutuales = await Mutual.findAll();
        const motivos = await Motivo.findAll();

        console.log('recepciones:', recepciones);

        // Extrae los contactos de emergencia del paciente (puede ser undefined)
       // const contactosEmergencia = recepciones.Paciente.Contacto_Emergencia || [];
        res.status(200).render('enfermeria/registro', { usuario, cargo, recepciones, mutuales, motivos });
    } catch (error) {
        console.error('Error en Enfermeria al cargar el registro:', error);
        res.status(500).render('error', { mensaje: 'Error al cargar el registro de enfermería', error });
    }
}

async function registrarEnfermeria(req, res) {
    try {
        //const { recepcionId, motivo, observaciones } = req.body;
        const cargo = req.session.tipoUsuario;
        const usuario = req.session.nombreUsuario;
        /*
        // Actualizar la recepción con los datos del registro de enfermería
        await Recepcion.update(
            {
                motivo,
                observaciones,
                fecha_registro: new Date()
            },
            {
                where: {
                    id: recepcionId
                }
            }
        );
        */
        res.status(200).render('enfermeria/historialMedico' , {usuario,cargo});
    } catch (error) {
        console.error('Error al registrar enfermería:', error);
        res.status(500).render('error', { mensaje: 'Error al registrar la información de enfermería', error });
    }
}


module.exports = {  
  pacientesInternados,
  vistaRegistroEnfermeria,
  registrarEnfermeria
};