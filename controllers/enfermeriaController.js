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
const Historial_Medico = require('../models/Historial_Medico');
const Enfermedad_Previa = require('../models/Enfermedad_Previa');
const Cirugia_Previa = require('../models/Cirugia_Previa');
const Medicamento_Paciente = require('../models/Medicamento_Paciente');
const Alergia = require('../models/Alergia');
const Antecedente_Familiar = require('../models/Antecedente_Familiar');

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
        let recepcion = await Recepcion.findOne({
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

        // Extrae los contactos de emergencia del paciente (puede ser undefined)
       // const contactosEmergencia = recepciones.Paciente.Contacto_Emergencia || [];
        res.status(200).render('enfermeria/registro', { usuario, cargo, recepcion, mutuales, motivos });
    } catch (error) {
        console.error('Error en Enfermeria al cargar el registro:', error);
        res.status(500).render('error', { mensaje: 'Error al cargar el registro de enfermería', error });
    }
}

async function registrarEnfermeria(req, res) {
    try {        
        const cargo = req.session.tipoUsuario;
        const usuario = req.session.nombreUsuario;

    const {
        recepcionId,
        dni,
        tipo, 
        nombre,
        apellido,
        fecha_nacimiento, 
        genero,    
        contacto,
        direccion,
        provincia,
        localidad,
        seguro,
        codigo_mutual,
        tipo_cobertura,
        activa,
        motivo,
        detalle_motivo
    } = req.body;
    let contactos_emergencia = req.body.contacto_emergencia;

    // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
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
                        },
                        {
                            model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]
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
    
    let paciente = recepcion.Paciente; // Obtener el paciente del registro de enfermería 
    console.log(paciente);
       
    // Compara los campos relevantes de paciente (ignorando id, createdAt, updatedAt)
    if (paciente.dni === dni &&
        paciente.nombre === nombre &&
        paciente.apellido === apellido && 
        String(paciente.fecha_nacimiento) === String(fecha_nacimiento) &&
        paciente.genero === genero &&  
        paciente.direccion === direccion &&
        paciente.contacto === contacto &&
        paciente.provincia === provincia &&
        paciente.localidad === localidad) 
    {
        console.log('El paciente no sufrió cambios');  
    } else {
        console.log('Se actualizará el paciente por cambios en sus datos');
            // Actualizar los campos del paciente
            paciente = await paciente.update({
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                direccion,
                contacto,
                provincia,
                localidad
            });
            console.log('Paciente actualizado correctamente');       
    };     

    // Verificar si se proporcionó un contacto de emergencia
    if (!Array.isArray(contactos_emergencia)) {
        contactos_emergencia = [contactos_emergencia];
    }

    if (contactos_emergencia.length > 0 && (!contactos_emergencia[contactos_emergencia.length - 1] || contactos_emergencia[contactos_emergencia.length - 1].trim() === "")) {
        contactos_emergencia.pop();
    }

    // Trae todos los contactos actuales del paciente, ordenados por id 
    let contactosActuales = await Contacto_Emergencia.findAll({
        where: { id_paciente: paciente.id },
        order: [['id', 'ASC']]
    });

    // Actualiza o crea según corresponda
    for (let i = 0; i < contactos_emergencia.length; i++) {
        const numero = contactos_emergencia[i];
        if (contactosActuales[i]) {
            // Si el número es diferente, actualiza
            if (contactosActuales[i].numero !== numero) {
                await contactosActuales[i].update({ numero });
                console.log(`Contacto de emergencia actualizado a ${numero} para el paciente ${paciente.nombre} ${paciente.apellido}`);
            }
        } else {
            // Si no hay contacto en esa posición, crea uno nuevo
            await Contacto_Emergencia.create({
                id_paciente: paciente.id,
                numero
            });
            console.log('Contacto de emergencia creado correctamente');
        }
    }
    // Eliminar los contactos sobrantes 
    if (contactos_emergencia.length < contactosActuales.length) {
        for (let i = contactos_emergencia.length; i < contactosActuales.length; i++) {
            await contactosActuales[i].destroy();
            console.log(`Contacto de emergencia eliminado para el paciente ${paciente.nombre} ${paciente.apellido}`);
        }
    }   

    // Buscamos la mutual por su nombre
    const mutualExistente = await Mutual.findOne({ where: { nombre: seguro } });    
    
    // Buscamos que mutual tiene el paciente
    const pacienteMutual = recepcion.Paciente.Mutual_Paciente;

    //Transformo la variable activa a boolean para comparar en la BD
    const activaBoolean = activa === "Activa" ? true : false;  

    // Verificar si ya existe una mutual para el paciente 
    if (pacienteMutual) {
        if(mutualExistente === null || codigo_mutual === null || tipo_cobertura === null) {
            console.log('No existe la mutual seleccionada, no se actualiza la mutual del paciente');
        }else if (pacienteMutual.id_mutual != mutualExistente?.id ||
            pacienteMutual.codigo_mutual != codigo_mutual ||
            pacienteMutual.tipo_cobertura != tipo_cobertura ||
            pacienteMutual.activa != activaBoolean) {
                await pacienteMutual.update({
                    id_mutual: mutualExistente?.id,
                    codigo_mutual,
                    tipo_cobertura,
                    activa: activaBoolean
                });
                console.log('Mutual del paciente actualizada correctamente');
        } else {
            console.log("El Paciente no modifico su Mutual");                
        } 
    } else {
        // Si no se cargaron datos de la mutual, no se crea una mutual al paciente
        // Si se cargaron datos de la mutual y no existe una Mutual_Paciente, se crea una al paciente
        if (mutualExistente && codigo_mutual && tipo_cobertura && seguro) {        
            await Mutual_Paciente.create({
                id_paciente: paciente.id,
                id_mutual: mutualExistente?.id,
                codigo_mutual,
                tipo_cobertura,
                activa: activaBoolean
            });
            console.log('Nueva mutual creada para el paciente');
        } else {
            console.log('Este paciente no tiene mutual, no se crea una nueva');
        }
    }

    // Verificar si hubo cambios en la recepcion
     // Obtener el objeto Motivo 
    const objMotivo = await Motivo.findOne({
        where: { tipos: motivo }
    });

    if (recepcion.id_motivo !== objMotivo.id || recepcion.detalle_motivo !== detalle_motivo) { 
        // Actualizar la recepción con los nuevos datos
        await recepcion.update({
            id_motivo: objMotivo.id,
            detalle_motivo: detalle_motivo
        });
        console.log('Recepción actualizada correctamente');        
    } 
    
    
    res.status(200).render('enfermeria/historialMedico/Alergia' , {usuario,cargo, paciente, recepcion});
    } catch (error) {
        console.error('Error al registrar enfermería:', error);
        res.status(500).render('error', { mensaje: 'Error al registrar la información de enfermería', error });
    }
}

async function vistaAlegia(req, res) {
    try {
         
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Paciente,                    
                    include: [                       
                        {
                            model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]
                        }
                    ]
                }
            ]
        });  
        
        res.status(200).render('enfermeria/historialMedico/Alergia', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Alergia  del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar las vista Alergias', error });
    }
}

async function vistaAntecedentesFamiliares(req, res) {
        try {
       
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Paciente,                    
                    include: [                       
                        {
                            model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]
                        }
                    ]
                }
            ]
        });  
        
        res.status(200).render('enfermeria/historialMedico/Antecedentes', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Antecedentes Familiares del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista del formulario de Antecedentes Familiares del paciente', error });
    }
}

async function vistaCirugiaPrevia (req, res) {
        try {
         
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Paciente,                    
                    include: [                       
                        {
                           model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]       
                        }
                    ]
                }
            ]
        });  
        
        res.status(200).render('enfermeria/historialMedico/Cirugia', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Cirugias Previas del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista del formulario de Cirugias Previas del paciente', error });
    }
}

async function vistaEnfermedadPrevia (req, res) {
        try {
        
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Paciente,                    
                    include: [                       
                        {
                            model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]
                        }
                    ]
                }
            ]
        });  
        
        res.status(200).render('enfermeria/historialMedico/Enfermedad', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Enfermedades Previas del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista del formulario de Enfermedades Previas del paciente', error });
    }
}

async function vistaMedicamentosPaciente (req, res) {
        try {        
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener la recepción 
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Paciente,                    
                    include: [                       
                        {
                            model: Historial_Medico,
                            include: [
                                { model: Alergia },
                                { model: Antecedente_Familiar },
                                { model: Cirugia_Previa },
                                { model: Enfermedad_Previa },
                                { model: Medicamento_Paciente }
                            ]
                        }
                    ]
                }
            ]
        });  
        
        res.status(200).render('enfermeria/historialMedico/Medicamentos', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Medicamentos Previos  del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista del formulario de Medicamentos Previos  del paciente', error });
    }
}

module.exports = {  
  pacientesInternados,
  vistaRegistroEnfermeria,
  registrarEnfermeria,
  vistaAlegia,
  vistaAntecedentesFamiliares,
  vistaCirugiaPrevia,
  vistaEnfermedadPrevia,
  vistaMedicamentosPaciente
};