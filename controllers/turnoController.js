const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
const Turno = require('../models/Turno');
const Mutual_Paciente = require('../models/Mutual_Paciente');
const Mutual = require('../models/Mutual');
const Habitacion = require('../models/Habitacion');
const Cama = require('../models/Cama');
const Ala = require('../models/Ala');
const Contacto_Emergencia = require('../models/Contacto_Emergencia')
const Doctor = require('../models/Doctor')


async function vistaGenerarTurno(req, res) { 
  try{ 
    const usuario = req.session.nombreUsuario
    const cargo = req.session.tipoUsuario;
    const mutuales = await Mutual.findAll();
    const pacientes = await Paciente.findAll();
    const mutualPacientes = await Mutual_Paciente.findAll();
    const doctores = await Doctor.findAll();
    const contactos_emergencia = await Contacto_Emergencia.findAll();

    res.status(200).render('turno/generar',{doctores,mutuales,pacientes,mutualPacientes,usuario,cargo,contactos_emergencia});
  }catch (error) {
    console.error('Error en vistaGenerarTurno:', error);
    res.status(500).render('error', {
      mensaje: 'Error al cargar el formulario de Generar Turno',
      error
    });
  }
}
async function generarTurno(req, res) { 
  try{
    const {
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
    doctor,
    fecha_turno,
    hora,
    detalle_motivo
  } = req.body;
  let contactos_emergencia = req.body.contacto_emergencia;
  const usuario = req.session.nombreUsuario;
  const cargo = req.session.tipoUsuario;
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
      contacto,
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
  }else{
    //El paciente existe hay que revisar si no actualizaron sus datos
    // Compara los campos relevantes de paciente (ignorando id, createdAt, updatedAt)    
    if (paciente.nombre === nombre &&
        paciente.apellido === apellido && 
        String(paciente.fecha_nacimiento) === String(fecha_nacimiento) &&
        paciente.genero === genero &&  
        paciente.direccion === direccion &&
        paciente.contacto === contacto &&
        paciente.provincia === provincia &&
        paciente.localidad === localidad) 
    {
        console.log('El paciente no actualizo sus de datos personales');  
    } else {
        console.log('Actualizar los datos personales del paciente');
            // Actualizar los campos del paciente
            await paciente.update({
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
      }
  }  
    console.log(contactos_emergencia);
    
     // Verificar si se proporcionó un contacto de emergencia
    if (!Array.isArray(contactos_emergencia)) {
        contactos_emergencia = [contactos_emergencia];
    }

   // Eliminar contactos vacíos
    contactos_emergencia = contactos_emergencia.filter(contacto => contacto && contacto.trim() !== "");

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
        }
    }   
  
   //Transformo la variable activa de Mutual a boolean para comparar en la BD
    const activaBoolean = activa === "Activa";    
    
   // Buscamos la mutual por su nombre
    const mutualExistente = await Mutual.findOne({ where: { nombre: seguro } });
    
    //Llamo al paciente de vuelta por si se genero uno
    const Elpaciente = await Paciente.findOne({ where: { dni } });
    
    // Buscamos que mutual tiene el paciente
    const pacienteMutual = await Mutual_Paciente.findOne({
        where: { id_paciente: Elpaciente.id }
    });

    // Verificar si ya existe una mutual para el paciente 
    if (pacienteMutual) {
        if (pacienteMutual.id_mutual != mutualExistente?.id ||
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
        if (codigo_mutual && tipo_cobertura && seguro) {        
            await Mutual_Paciente.create({
                id_paciente: Elpaciente.id,
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

  paciente=Elpaciente;
  let nombreDoctor=await Doctor.findByPk(doctor);
  nombreDoctor=`Dr. ${nombreDoctor.nombre} ${nombreDoctor.apellido}`;
  const turno= await Turno.create({
    id_paciente: paciente.id,
    doctor: nombreDoctor ,
    fecha_turno,
    hora,
    detalle:detalle_motivo,
  });
  console.log(`Turno generado para el paciente DNI: ${paciente.nombre} ${paciente.apellido}`);

  //Redirijo la pestaña al home
  res.render('home', {usuario, cargo, mostrarTurno: true, paciente, turno});

  }catch (error) {
    console.error('Error al generarTurno:', error);
    res.status(500).render('error', {
      mensaje: 'Error al generar un turno a un paciente',
      error
    });
  }
}

async function elegirVistaTurno(req, res) { 
  try{
    const usuario = req.session.nombreUsuario
    const cargo = req.session.tipoUsuario;
    res.status(200).render('turno/elegir',{usuario, cargo});
  }catch (error) {
    console.error('Error al elegirVistaTurno:', error);
    res.status(500).render('error', {
      mensaje: 'Error al mostrar la vista de crear turno | listar turno',
      error
    });
  }
}

async function vistaListarTurno(req, res) { 
  try{
    const usuario = req.session.nombreUsuario;
    const cargo = req.session.tipoUsuario;
    const hoy=new Date();
    //Buscamos todos los turnos para listarlos
    const turnos = await Turno.findAll({
        where:{fecha_turno:hoy},
        include: [{
            model: Paciente,
            attributes: ['nombre', 'apellido'] // solo necesito estos campos del paciente
        }]
    });

    res.status(200).render('turno/lista', {usuario, cargo, turnos});
  }catch (error) {
    console.error('Error en vistaListarTurno:', error);
    res.status(500).render('error', {
      mensaje: 'Error al cargar la tabla con todos los turnos',
      error
    });
  }
}

module.exports = {
  generarTurno,
  vistaGenerarTurno,
  elegirVistaTurno,
  vistaListarTurno
};