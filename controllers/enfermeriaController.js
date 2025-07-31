const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
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
const Signos_Vitales = require('../models/Signos_Vitales');
const Sintoma = require('../models/Sintoma');
const Tratamiento = require('../models/Tratamiento');
const Chat = require('../models/Chat');
const Enfermero = require('../models/Enfermero');
const Doctor = require('../models/Doctor');
const Especialidad = require('../models/Especialidad');

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
                    include: [
                        {
                            model: Historial_Medico,
                            include: [{model: Sintoma}]
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
        
        for (const recepcion of recepciones) {
            const paciente = recepcion.Paciente;
            if (paciente && !paciente.Historial_Medico) {
                await Historial_Medico.create({ id_paciente: paciente.id });
            }
        }

        recepciones = await Recepcion.findAll({
            where: {
                fecha_salida: null
            },
            include: [
                {
                    model: Paciente,
                    include: [
                        {
                            model: Historial_Medico,
                            include: [{model: Sintoma}]
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
        
        recepciones.forEach(recepcion => {
        let prioridadClase = 'prioridad-sin-cargar'; // valor por defecto

        // Verifica si existe el historial y al menos un síntoma
        const sintomas = recepcion.Paciente?.Historial_Medico?.Sintomas;
        // Si tienes un solo síntoma, puede ser objeto, si son varios, es array
        let prioridad = null;
        if (Array.isArray(sintomas) && sintomas.length > 0) {
            prioridad = sintomas[sintomas.length - 1].prioridad; // último síntoma
        } else if (sintomas && sintomas.prioridad) {
            prioridad = sintomas.prioridad;
        }

        if (prioridad === 'Alta') prioridadClase = 'prioridad-alta';
        else if (prioridad === 'Media') prioridadClase = 'prioridad-media';
        else if (prioridad === 'Baja') prioridadClase = 'prioridad-baja';

        recepcion.prioridadClase = prioridadClase; // agrega la clase a la recepción
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

async function elegirVista(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{model: Paciente}]
        });

        res.status(200).render('enfermeria/elegir', { usuario, cargo, recepcion });
    }catch (error) {
        console.error('Error en Enfermeria en elegir entre pesañas ', error);
        res.status(500).render('error', { mensaje: 'Error al elegir entre las pestañas de enfermeria', error });
    }
}

async function vistaRegistroEnfermeria(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;            

        // Obtener la recepción específica por ID del paciente seleccionado
        let recepcion = await Recepcion.findOne({
            where: {
                id: req.params.id
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
                dni,
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
    
    const mutuales = await Mutual.findAll();
    const motivos = await Motivo.findAll();

    //Actualizamos la recepcion 
    recepcion = await Recepcion.findOne({
            where: {
                id: recepcion.id
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

    const cartel = true;
    
    res.status(200).render('enfermeria/registro' , {usuario,cargo, recepcion, mutuales, motivos, cartel});
    } catch (error) {
        console.error('Error al registrar enfermería:', error);
        res.status(500).render('error', { mensaje: 'Error al registrar la información de enfermería', error });
    }
}

async function cargarAlergia(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

               // Puede venir como string o array
        let { sustancia, reaccion, severidad } = req.body;

        // Normaliza a arrays
        if (!Array.isArray(sustancia)) sustancia = sustancia ? [sustancia] : [];
        if (!Array.isArray(reaccion)) reaccion = reaccion ? [reaccion] : [];
        if (!Array.isArray(severidad)) severidad = severidad ? [severidad] : [];

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Alergia }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Alergia }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        let alergiasActuales = historial.Alergia || [];

        // Si no viene ninguna alergia y hay alergias en BD, borra todas
        if (sustancia.length === 0 && alergiasActuales.length > 0) {
            for (let alergia of alergiasActuales) {
                await alergia.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < sustancia.length; i++) {
                if (alergiasActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        alergiasActuales[i].sustancia !== sustancia[i] ||
                        alergiasActuales[i].reaccion !== reaccion[i] ||
                        alergiasActuales[i].severidad !== severidad[i]
                    ) {
                        await alergiasActuales[i].update({
                            sustancia: sustancia[i],
                            reaccion: reaccion[i],
                            severidad: severidad[i]
                        });
                    }
                } else {
                    // Crea nueva alergia
                    await Alergia.create({
                        id_historial_medico: historial.id,
                        sustancia: sustancia[i],
                        reaccion: reaccion[i],
                        severidad: severidad[i]
                    });
                }
            }
            // Si hay más alergias en BD que las que vinieron, elimina las sobrantes
            if (sustancia.length < alergiasActuales.length) {
                for (let i = sustancia.length; i < alergiasActuales.length; i++) {
                    await alergiasActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Alergia }]
                }]
            }]
        });

        const cartel = true;

        res.status(200).render('enfermeria/historialMedico/Alergia', { usuario, cargo, recepcion, cartel});
    } catch (error) {
            console.error('Error en Enfermeria al cargar los datos de Alergia del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Alergia', error });
    }
}

async function cargarAntecedentesFamiliares(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Puede venir como string o array
        let { enfermedad_familiar, parentesco} = req.body;

        // Transformar a arrays
        if (!Array.isArray(enfermedad_familiar)) enfermedad_familiar = enfermedad_familiar ? [enfermedad_familiar] : [];
        if (!Array.isArray(parentesco)) parentesco = parentesco ? [parentesco] : [];        

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Antecedente_Familiar }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, crealo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Antecedente_Familiar }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        let antecedentesActuales = historial.Antecedente_Familiars || [];

        // Si no viene ningun Antecedente y hay antecedentes en BD, borra todos
        if (enfermedad_familiar.length === 0 && antecedentesActuales.length > 0) {
            for (let antecedentes of antecedentesActuales) {
                await antecedentes.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < enfermedad_familiar.length; i++) {
                if (antecedentesActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        antecedentesActuales[i].enfermedad_familiar !== enfermedad_familiar[i] ||
                        antecedentesActuales[i].parentesco !== parentesco[i] 
                    ) {
                        await antecedentesActuales[i].update({
                            enfermedad_familiar: enfermedad_familiar[i],
                            parentesco: parentesco[i]
                        });
                    }
                } else {
                    // Crea nuevo Antecedente Familiar
                    await Antecedente_Familiar.create({
                        id_historial_medico: historial.id,
                        enfermedad_familiar: enfermedad_familiar[i],
                        parentesco: parentesco[i]
                    });
                }
            }
            // Si hay más alergias en BD que las que vinieron, elimina las sobrantes
            if (enfermedad_familiar.length < antecedentesActuales.length) {
                for (let i = enfermedad_familiar.length; i < antecedentesActuales.length; i++) {
                    await antecedentesActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Antecedente_Familiar }]
                }]
            }]
        });

        const familiares = ['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tio', 'Tia'];
        const cartel = true;

        res.status(200).render('enfermeria/historialMedico/antecedentes', { usuario, cargo, recepcion, cartel, familiares});
    } catch (error) {
            console.error('Error en Enfermeria al cargar los datos de Antecedentes Familiares del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Antecedentes Familiares', error });
    }
}

async function cargarCirugiaPrevia(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let { nombre_cirugia, fecha_cirugia, detalle_motivo } = req.body;

        // Normaliza a arrays
        if (!Array.isArray(nombre_cirugia)) nombre_cirugia = nombre_cirugia ? [nombre_cirugia] : [];
        if (!Array.isArray(fecha_cirugia)) fecha_cirugia = fecha_cirugia ? [fecha_cirugia] : [];
        if (!Array.isArray(detalle_motivo)) detalle_motivo = detalle_motivo ? [detalle_motivo] : [];

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Cirugia_Previa }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Cirugia_Previa }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        let cirugiasActuales = historial.Cirugia_Previa || [];

        // Si no viene ninguna cirugía y hay cirugías en BD, borra todas
        if (nombre_cirugia.length === 0 && cirugiasActuales.length > 0) {
            for (let cirugia of cirugiasActuales) {
                await cirugia.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < nombre_cirugia.length; i++) {
                if (cirugiasActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        cirugiasActuales[i].nombre_cirugia !== nombre_cirugia[i] ||
                        String(cirugiasActuales[i].fecha_cirugia) !== String(fecha_cirugia[i]) ||
                        cirugiasActuales[i].detalle_motivo !== detalle_motivo[i]
                    ) {
                        await cirugiasActuales[i].update({
                            nombre_cirugia: nombre_cirugia[i],
                            fecha_cirugia: fecha_cirugia[i],
                            detalle_motivo: detalle_motivo[i]
                        });
                    }
                } else {
                    // Crea nueva cirugía
                    await Cirugia_Previa.create({
                        id_historial_medico: historial.id,
                        nombre_cirugia: nombre_cirugia[i],
                        fecha_cirugia: fecha_cirugia[i],
                        detalle_motivo: detalle_motivo[i]
                    });
                }
            }
            // Si hay más cirugías en BD que las que vinieron, elimina las sobrantes
            if (nombre_cirugia.length < cirugiasActuales.length) {
                for (let i = nombre_cirugia.length; i < cirugiasActuales.length; i++) {
                    await cirugiasActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Cirugia_Previa }]
                }]
            }]
        });

        const cartel = true;

        res.status(200).render('enfermeria/historialMedico/Cirugia', { usuario, cargo, recepcion, cartel });
    } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Cirugías Previas del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Cirugías Previas', error });
    }
}

async function cargarEnfermedadPrevia(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let { nombre_enfermedad, fecha_diagnostico } = req.body;

        // Normaliza a arrays
        if (!Array.isArray(nombre_enfermedad)) nombre_enfermedad = nombre_enfermedad ? [nombre_enfermedad] : [];
        if (!Array.isArray(fecha_diagnostico)) fecha_diagnostico = fecha_diagnostico ? [fecha_diagnostico] : [];

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Enfermedad_Previa }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Enfermedad_Previa }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        let enfermedadesActuales = historial.Enfermedad_Previa || [];

        // Si no viene ninguna enfermedad y hay enfermedades en BD, borra todas
        if (nombre_enfermedad.length === 0 && enfermedadesActuales.length > 0) {
            for (let enfermedad of enfermedadesActuales) {
                await enfermedad.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < nombre_enfermedad.length; i++) {
                if (enfermedadesActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        enfermedadesActuales[i].nombre_enfermedad !== nombre_enfermedad[i] ||
                        String(enfermedadesActuales[i].fecha_diagnostico) !== String(fecha_diagnostico[i])
                    ) {
                        await enfermedadesActuales[i].update({
                            nombre_enfermedad: nombre_enfermedad[i],
                            fecha_diagnostico: fecha_diagnostico[i]
                        });
                    }
                } else {
                    // Crea nueva enfermedad
                    await Enfermedad_Previa.create({
                        id_historial_medico: historial.id,
                        nombre_enfermedad: nombre_enfermedad[i],
                        fecha_diagnostico: fecha_diagnostico[i]
                    });
                }
            }
            // Si hay más enfermedades en BD que las que vinieron, elimina las sobrantes
            if (nombre_enfermedad.length < enfermedadesActuales.length) {
                for (let i = nombre_enfermedad.length; i < enfermedadesActuales.length; i++) {
                    await enfermedadesActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Enfermedad_Previa }]
                }]
            }]
        });

        
        const cartel = true;

        res.status(200).render('enfermeria/historialMedico/enfermedad', { usuario, cargo, recepcion, cartel });
    } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Enfermedades Previas del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Enfermedades Previas', error });
    }
}

async function cargarMedicamentosPaciente(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let { nombre_medicamento, dosis, frecuencia } = req.body;

        // Normaliza a arrays
        if (!Array.isArray(nombre_medicamento)) nombre_medicamento = nombre_medicamento ? [nombre_medicamento] : [];
        if (!Array.isArray(dosis)) dosis = dosis ? [dosis] : [];
        if (!Array.isArray(frecuencia)) frecuencia = frecuencia ? [frecuencia] : [];

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Medicamento_Paciente }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Medicamento_Paciente }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        let medicamentosActuales = historial.Medicamento_Pacientes || [];

        // Si no viene ningún medicamento y hay medicamentos en BD, borra todos
        if (nombre_medicamento.length === 0 && medicamentosActuales.length > 0) {
            for (let medicamento of medicamentosActuales) {
                await medicamento.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < nombre_medicamento.length; i++) {
                if (medicamentosActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        medicamentosActuales[i].nombre_medicamento !== nombre_medicamento[i] ||
                        medicamentosActuales[i].dosis !== dosis[i] ||
                        medicamentosActuales[i].frecuencia !== frecuencia[i]
                    ) {
                        await medicamentosActuales[i].update({
                            nombre_medicamento: nombre_medicamento[i],
                            dosis: dosis[i],
                            frecuencia: frecuencia[i]
                        });
                    }
                } else {
                    // Crea nuevo medicamento
                    await Medicamento_Paciente.create({
                        id_historial_medico: historial.id,
                        nombre_medicamento: nombre_medicamento[i],
                        dosis: dosis[i],
                        frecuencia: frecuencia[i]
                    });
                }
            }
            // Si hay más medicamentos en BD que los que vinieron, elimina los sobrantes
            if (nombre_medicamento.length < medicamentosActuales.length) {
                for (let i = nombre_medicamento.length; i < medicamentosActuales.length; i++) {
                    await medicamentosActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Medicamento_Paciente }]
                }]
            }]
        });

        const cartel = true;

        res.status(200).render('enfermeria/historialMedico/Medicamentos', { usuario, cargo, recepcion, cartel });
    } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Medicamentos del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Medicamentos', error });
    }
}

async function vistaAlergia(req, res) {
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
        const familiares = ['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tio', 'Tia'];  
        
        res.status(200).render('enfermeria/historialMedico/Alergia', { usuario, cargo, recepcion,familiares });
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
        const familiares = ["Padre", "Madre", "Hermano", "Hermana", "Abuelo", "Abuela", "Tío", "Tía"]; 
        
        res.status(200).render('enfermeria/historialMedico/Antecedentes', { usuario, cargo, recepcion,familiares });
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
        const familiares = ['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tio', 'Tia'];
        
        res.status(200).render('enfermeria/historialMedico/Cirugia', { usuario, cargo, recepcion,familiares });
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

        const familiares = ['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tio', 'Tia'];
        res.status(200).render('enfermeria/historialMedico/Enfermedad', { usuario, cargo, recepcion, familiares });
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
        
        const familiares = ['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tio', 'Tia'];
        
        res.status(200).render('enfermeria/historialMedico/Medicamentos', { usuario, cargo, recepcion, familiares });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista del formulario de Medicamentos Previos  del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista del formulario de Medicamentos Previos  del paciente', error });
    }
}

async function vistaSignosVitales (req, res){
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
                                { model: Signos_Vitales}
                            ]
                        }
                    ]
                }
            ]
        });

        const tonalidades=["Normal","Pálida","Rosada","Rojiza","Cianótica (azulada)","Amarillenta","Morena clara","Morena Oscura","Otra tonalidad"];
        const colores = [
            "background-color: white;", // Normal
            "background-color: #f5f5dc;", // Pálida
            "background-color: #ffdbac;", // Rosada
            "background-color: #ff9999;", // Rojiza
            "background-color: #99ccff;", // Cianótica (azulada)
            "background-color: #ffff99;", // Amarillenta
            "background-color: #e0ac69;", // Morena clara
            "color: white;background-color: #8d5524;", // Morena Oscura
            "background-color: #cccccc;" // Otra tonalidad
        ];

        const resEstimulos = [
            "Alerta (responde normalmente)",
            "Responde a estímulos verbales",
            "Responde solo al dolor",
            "No responde a estímulos",
            "Respuesta confusa/desorientada",
            "Respuesta verbal incoherente"
        ];

        const signosVitales = recepcion.Paciente.Historial_Medico?.Signos_Vitale || null;
                

        res.status(200).render('enfermeria/signosVitales', { usuario, cargo, recepcion, signosVitales, resEstimulos, tonalidades, colores });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista de Sintomas', error });
    }
}

async function cargarSignosVitales(req, res) {
    try {        
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        // Obtener datos del formulario
        const {
            presion_arterial,
            frecuencia_cardiaca,
            frecuencia_respiratoria,
            temperatura_corporal,
            tonalidad_piel,
            detalle_piel,
            estimulo
        } = req.body;

        // Obtener la recepción y el historial médico
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Signos_Vitales }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
        }

        // Crear y guarda los signos vitales       
            
        await Signos_Vitales.create({
            id_historial_medico: historial.id,
            presion_arterial,
            frecuencia_cardiaca,
            frecuencia_respiratoria,
            temperatura_corporal,
            tonalidad_piel,
            detalle_piel,
            estimulo
        });
      

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Signos_Vitales }]
                }]
            }]
        });

        const tonalidades = ["Palida","Rosada","Rojiza","Cianotica (azulada)","Amarillenta","Morena clara","Morena Oscura","Otra tonalidad"];
        const colores = [
            "background-color: white;", // Normal
            "background-color: #f5f5dc;", // Pálida
            "background-color: #ffdbac;", // Rosada
            "background-color: #ff9999;", // Rojiza
            "background-color: #99ccff;", // Cianótica (azulada)
            "background-color: #ffff99;", // Amarillenta
            "background-color: #e0ac69;", // Morena clara
            "color: white;background-color: #8d5524;", // Morena Oscura
            "background-color: #cccccc;" // Otra tonalidad
        ];

        const cartel = true;

        res.status(200).render('enfermeria/signosVitales', { usuario, cargo, recepcion, tonalidades, colores, cartel });
    } catch (error) {
        console.error('Error en Enfermeria al cargar el formulario de Signos Vitales :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al cargar el formulario de Signos Vitales ', error });
    }
}

async function tablaHistorialSignosVitales(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Signos_Vitales }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        const cartel=false;

        // Si el paciente NO tiene historial médico, crearlo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Sintoma }]
                    }]
                }]
            });

            res.status(200).render('enfermeria/historialSintomas', { usuario, cargo, recepcion, cartel }); 
        }

        //Si el paciente tiene Signos Vitales les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.Signos_Vitales){
            recepcion.Paciente.Historial_Medico.Signos_Vitales.forEach(signo => {
                if (signo.createdAt) {
                    const fecha = new Date(signo.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    signo.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        }       

        res.status(200).render('enfermeria/historialSignosVitales', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al cargar la tabla de Signos Vitales :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al cargar la tabla de Signos Vitales ', error });
    }
}

async function eliminarFilaHistorialSignosVitales(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        await Signos_Vitales.destroy({
            where: {id: req.params.signo}
        });

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Signos_Vitales }]
                }]
            }]
        });

        const cartel=true;

      res.status(200).render('enfermeria/historialSignosVitales', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al borrar de la tabla de Signos Vitales :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al borrar de la tabla de Signos Vitales ', error });
    }
}

async function vistaSintomas (req, res){
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
                                { model: Sintoma},                        
                                { model: Medicamento_Paciente }
                            ]
                        }
                    ]
                }
            ]
        });

        res.status(200).render('enfermeria/sintomas', { usuario, cargo, recepcion });
    } catch (error) {
        console.error('Error en Enfermeria al obtener la vista Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al obtener la vista de Sintomas', error });
    }
} 

async function cargarSintomas(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const {sintomas, prioridad} = req.body;

        // Obtener la recepción y el historial médico
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Sintoma }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });            
        }

        await Sintoma.create({
            id_historial_medico: historial.id,
            sintomas,
            prioridad
        });
      

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [
                            { model: Sintoma },
                            {model: Medicamento_Paciente}
                    ]
                }]
            }]
        });

        const cartel=true;
        const cartel2=false;


        res.status(200).render('enfermeria/sintomas', { usuario, cargo, recepcion, cartel, cartel2 });  
        } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al cargar los datos de Sintomas', error });
    }
}

async function tablaHistorialSintomas(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [
                        { model: Sintoma }
                    ]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        const cartel=false;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [
                            { model: Sintoma }
                        ]
                    }]
                }]
            });

            res.status(200).render('enfermeria/historialSintomas', { usuario, cargo, recepcion, cartel }); 
        }

        //Si el paciente tiene Sintomas les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.Sintomas){
            recepcion.Paciente.Historial_Medico.Sintomas.forEach(sintoma => {
                if (sintoma.createdAt) {
                    const fecha = new Date(sintoma.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    sintoma.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        }
        
        res.status(200).render('enfermeria/historialSintomas', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al cargar la tabla de Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al cargar la tabla de Sintomas ', error });
    }
}

async function eliminarFilaHistorialSintomas(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        await Sintoma.destroy({
            where: {id: req.params.sintoma}
        });

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Sintoma }]
                }]
            }]
        });

        const cartel=true;

      res.status(200).render('enfermeria/historialSintomas', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al borrar de la tabla de Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al borrar de la tabla de Sintomas ', error });
    }
}

async function cargarTratamiento(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let { plan_tratamiento, 
            detalle_tratamiento, 
            nombre_medicamento, 
            dosis, 
            frecuencia } = req.body;
        

        // Normaliza a arrays
        if (!Array.isArray(nombre_medicamento)) nombre_medicamento = nombre_medicamento ? [nombre_medicamento] : [];
        if (!Array.isArray(dosis)) dosis = dosis ? [dosis] : [];
        if (!Array.isArray(frecuencia)) frecuencia = frecuencia ? [frecuencia] : [];

        // Trae la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Medicamento_Paciente }]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [{ model: Medicamento_Paciente }]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        //Con el id del historial creado, creamos el tratamiento para esa historial medico
        const plan = await Tratamiento.create({
        id_historial_medico: historial.id,
        tratamiento: plan_tratamiento,
        detalle_tratamiento: detalle_tratamiento});



        let medicamentosActuales = historial.Medicamento_Pacientes || [];

        // Si no viene ningún medicamento y hay medicamentos en BD, borra todos
        if (nombre_medicamento.length === 0 && medicamentosActuales.length > 0) {
            for (let medicamento of medicamentosActuales) {
                await medicamento.destroy();
            }
        } else {
            // Actualiza o crea según corresponda
            for (let i = 0; i < nombre_medicamento.length; i++) {
                if (medicamentosActuales[i]) {
                    // Actualiza si cambió algún campo
                    if (
                        medicamentosActuales[i].nombre_medicamento !== nombre_medicamento[i] ||
                        medicamentosActuales[i].dosis !== dosis[i] ||
                        medicamentosActuales[i].frecuencia !== frecuencia[i]
                    ) {
                        await medicamentosActuales[i].update({
                            nombre_medicamento: nombre_medicamento[i],
                            dosis: dosis[i],
                            frecuencia: frecuencia[i]
                        });
                    }
                } else {
                    // Crea nuevo medicamento
                    await Medicamento_Paciente.create({
                        id_historial_medico: historial.id,
                        nombre_medicamento: nombre_medicamento[i],
                        dosis: dosis[i],
                        frecuencia: frecuencia[i]
                    });
                }
            }
            // Si hay más medicamentos en BD que los que vinieron, elimina los sobrantes
            if (nombre_medicamento.length < medicamentosActuales.length) {
                for (let i = nombre_medicamento.length; i < medicamentosActuales.length; i++) {
                    await medicamentosActuales[i].destroy();
                }
            }
        }

        // Recarga los datos actualizados
        recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Medicamento_Paciente }]
                }]
            }]
        });

        const cartel = false;
        const cartel2 = true;

        res.status(200).render('enfermeria/sintomas', { usuario, cargo, recepcion, plan, cartel, cartel2 });
    } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Medicamentos del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Medicamentos', error });
    }
} 

async function tablaHistorialTratamiento(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [
                        { model: Tratamiento }
                    ]
                }]
            }]
        });

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        const cartel=false;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [
                            { model: Tratamiento }
                        ]
                    }]
                }]
            });
            res.status(200).render('enfermeria/historialTratamientos', { usuario, cargo, recepcion, cartel }); 
        }          

        //Si el paciente tiene Tratamientos les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.Tratamientos){
            recepcion.Paciente.Historial_Medico.Tratamientos.forEach(tratamiento => {
                if (tratamiento.createdAt) {
                    const fecha = new Date(tratamiento.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    tratamiento.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        }       
        
        
        res.status(200).render('enfermeria/historialTratamientos', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al cargar la tabla de Tratamientos :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al cargar la tabla de Tratamientos ', error });
    }
}

async function eliminarFilaHistorialTratamiento(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        await Tratamiento.destroy({
            where: {id: req.params.plan}
        });

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Tratamiento }]
                }]
            }]
        });

        const cartel=true;

      res.status(200).render('enfermeria/historialTratamientos', { usuario, cargo, recepcion, cartel });  
        } catch (error) {
        console.error('Error en Enfermeria al borrar de la tabla de Sintomas :', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria al borrar de la tabla de Sintomas ', error });
    }
}

async function cargarAlerta(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        const usuarioCompleto = req.session.usuarioCompleto;

        // Obtener el motivo de la alerta
        const { motivo_alerta } = req.body;

        // Obtener la recepción y el paciente
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{                    
                    model: Historial_Medico,
                            include: [                              
                                { model: Medicamento_Paciente }
                            ]
                }]
            }]
        });

        let paciente = recepcion.Paciente;       
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });
            // Vuelve a cargar la recepción con el nuevo historial
            recepcion = await Recepcion.findOne({
                where: { id: req.params.id },
                include: [{
                    model: Paciente,
                    include: [{
                        model: Historial_Medico,
                        include: [                              
                            { model: Medicamento_Paciente }
                        ]
                    }]
                }]
            });
            paciente = recepcion.Paciente;
            historial = paciente.Historial_Medico;
        }

        // Crear el Chat de alerta
        await Chat.create({
            id_paciente: paciente.id,
            mensaje: motivo_alerta,
            autor: usuario,
            cargo: cargo,
            id_autor: usuarioCompleto.id,
        });       

        const cartel=false;
        const cartel2=false;
        const cartel3=true;

        res.status(200).render('enfermeria/sintomas', { usuario, cargo, recepcion, cartel, cartel2, cartel3 });
    } catch (error) {
        console.error('Error en Enfermeria al cargar los datos de Alerta del paciente :', error);
        res.status(500).render('error', { mensaje: 'Error al cargar los datos de Alerta', error });
    }
}

async function vistaChats(req, res) {
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        const usuarioCompleto = req.session.usuarioCompleto;

        // Obtener todas las recepciones activas (sin fecha de salida)
        let recepciones = await Recepcion.findAll({
            where: {
                fecha_salida: null
            },
            include: [
                {
                    model: Paciente,
                    include: [
                        {
                            model: Historial_Medico,
                            include: [{model: Sintoma}]
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
        
        for (const recepcion of recepciones) {
            const paciente = recepcion.Paciente;
            if (paciente && !paciente.Historial_Medico) {
                await Historial_Medico.create({ id_paciente: paciente.id });
            }
        }

        recepciones = await Recepcion.findAll({
            where: {
                fecha_salida: null
            },
            include: [
                {
                    model: Paciente,
                    include: [
                        {
                            model: Historial_Medico,
                            include: [{model: Sintoma}]
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
        
        recepciones.forEach(recepcion => {
        let prioridadClase = 'prioridad-sin-cargar'; // valor por defecto

        // Verifica si existe el historial y al menos un síntoma
        const sintomas = recepcion.Paciente?.Historial_Medico?.Sintomas;
        // Si tienes un solo síntoma, puede ser objeto, si son varios, es array
        let prioridad = null;
        if (Array.isArray(sintomas) && sintomas.length > 0) {
            prioridad = sintomas[sintomas.length - 1].prioridad; // último síntoma
        } else if (sintomas && sintomas.prioridad) {
            prioridad = sintomas.prioridad;
        }

        if (prioridad === 'Alta') prioridadClase = 'prioridad-alta';
        else if (prioridad === 'Media') prioridadClase = 'prioridad-media';
        else if (prioridad === 'Baja') prioridadClase = 'prioridad-baja';

        recepcion.prioridadClase = prioridadClase; // agrega la clase a la recepción
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

        const doctores = await Doctor.findAll({
            where: { activo: true },
            include: [
                {
                    model: Especialidad,                    
                },                
                ]
            });
        const enfermeros = await Enfermero.findAll({ where: { activo: true },
        include: [
            {
                model: Especialidad,                
            },                
            ]
         });

        const chats = await Chat.findAll({
            include: [{model: Doctor},{model: Enfermero},{model: Paciente}]
        });

      
        res.status(200).render('enfermeria/chats/chat', { usuarioCompleto ,usuario, cargo, recepciones, doctores, enfermeros, chats });
    } catch (error) {
        console.error('Error en Enfermeria en la vista de los chats:', error);
        res.status(500).render('error', { mensaje: 'Error en Enfermeria en la vista de los chats', error });
    }
}

async function enviarMensaje(req, res) {
    try {
        const { mensaje, id_paciente, id_doctor, id_enfermero } = req.body;
        const usuario = req.session.usuarioCompleto;
        
        const nuevoMensaje = await Chat.create({
            mensaje,
            autor: `${usuario.nombre} ${usuario.apellido}`,
            cargo: req.session.tipoUsuario,
            id_autor: usuario.id,
            id_paciente: id_paciente || null,
            id_doctor: id_doctor || null,
            id_enfermero: id_enfermero || null
        });

        const mensajeConRelaciones = await Chat.findByPk(nuevoMensaje.id, {
            include: [
                {model: Doctor}, 
                {model: Enfermero}, 
                {model: Paciente}
            ]
        });

        res.status(200).json(mensajeConRelaciones);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
}

module.exports = {  
  pacientesInternados,
  elegirVista,
  vistaRegistroEnfermeria,
  registrarEnfermeria,  
  vistaAlergia,
  vistaAntecedentesFamiliares,
  vistaCirugiaPrevia,
  vistaEnfermedadPrevia,
  vistaMedicamentosPaciente,
  cargarAlergia,
  cargarAntecedentesFamiliares,
  cargarCirugiaPrevia,
  cargarEnfermedadPrevia,
  cargarMedicamentosPaciente, 
  vistaSintomas,
  vistaSignosVitales,
  cargarSignosVitales,
  tablaHistorialSignosVitales,
  eliminarFilaHistorialSignosVitales,
  cargarSintomas,
  tablaHistorialSintomas,
  eliminarFilaHistorialSintomas,
  cargarTratamiento,
  tablaHistorialTratamiento,
  eliminarFilaHistorialTratamiento,
  cargarAlerta,
  vistaChats,
  enviarMensaje
};