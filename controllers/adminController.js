const { Op, where } = require('sequelize');

const sequelize = require("../config/conexion");
const Enfermero = require('../models/Enfermero');
const Doctor = require('../models/Doctor');
const Administrador = require('../models/Administrador');
const Especialidad = require('../models/Especialidad');
const Usuario = require('../models/Usuario');
const Recepcionista = require('../models/Recepcionista');
const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
const Cama = require('../models/Cama');
const Habitacion = require('../models/Habitacion');
const Ala = require('../models/Ala');
const Mutual = require('../models/Mutual');
 
const bcrypt = require('bcrypt');



async function vistaElegir(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 

        res.status(200).render('admin/elegir', { usuario, cargo, });
    }catch (error) {
        console.error('Error en la vista elegir ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista elegir', error });
    }
}

//Doctores
async function vistaDoctores(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let doctores = await Doctor.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });
        let especialidades = await Especialidad.findAll();
        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });        

        res.status(200).render('admin/CrearDoctor', { usuario, 
            cargo, 
            doctores, 
            especialidades,
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
        });
    }catch (error) {
        console.error('Error en la vista para generar Doctores ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista para generar doctores', error });
    }
}

async function cargarDoctores(req, res) {
    try {
        const {
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            genero,
            especialidad,
            telefono,
            direccion,
            provincia,
            localidad,
            activo,
            nombreUsuario,
            contrasena
        } = req.body;

        let activoBoolean=false;
        if(activo=="activo"){
            activoBoolean=true;
        }

        // Buscar doctor por DNI
        let doctor = await Doctor.findOne({ where: { dni } });

        // Hashear contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(contrasena, saltRounds);        
        
        if (doctor) {
            // Actualizar doctor
            await doctor.update({
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                id_especialidad: especialidad,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean
            });

            // Actualizar usuario asociado
            const usuario = await Usuario.findByPk(doctor.id_usuario);
            await usuario.update({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            );            
        } else {
            // Crear nuevo usuario
            const nuevoUsuario = await Usuario.create({
                usuario: nombreUsuario,
                contraseña: passwordHash,                
            });

            // Crear nuevo doctor
            doctor = await Doctor.create({
                dni,
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                id_especialidad: especialidad,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean,
                id_usuario: nuevoUsuario.id
            });
        }

        // Recargar doctor con especialidad y usuario
        doctor = await Doctor.findByPk(doctor.id, {
            include: [
                { model: Especialidad, attributes: ['tipo'] },
                { model: Usuario }
            ]
        });

        // Listados para la vista
        const doctores = await Doctor.findAll({
            include: [
                { model: Especialidad },
                { model: Usuario }
                ]                
        });
        const especialidades = await Especialidad.findAll();

        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        }); 

        res.status(200).render('admin/CrearDoctor', {
            usuario,
            cargo,
            doctores,
            especialidades,
            cartel: true,
            doctor,
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
        });

    } catch (error) {
        console.error('Error al crear o actualizar doctor:', error);
        res.status(500).render('error', {
            mensaje: 'Error al procesar el doctor',
            error
        });
    }
}

async function listarDoctores(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let doctores = await Doctor.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });

        if(doctores){
            doctores.forEach(doctor => {
                if (doctor.fecha_nacimiento) {
                    const fecha = new Date(doctor.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    doctor.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        const cartel = false;
        res.status(200).render('admin/listaDoctor', { usuario, cargo, doctores, cartel});
    }catch (error) {
        console.error('Error en la vista de la lista de Doctores ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Doctores', error });
    }
}

async function listarDoctoresModificarActivo(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let doctor = await Doctor.findByPk(req.params.id)

        if (doctor.activo) {
            await doctor.update({
            activo: false
        })
        } else {
            await doctor.update({
            activo: true
            })        
        }

        let doctores = await Doctor.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });

        if(doctores){
            doctores.forEach(doctor => {
                if (doctor.fecha_nacimiento) {
                    const fecha = new Date(doctor.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    doctor.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        const cartel = true;
        res.status(200).render('admin/listaDoctor', { usuario, cargo, doctores, doctor, cartel});
    }catch (error) {
        console.error('Error al cambiar el estado de activo de los Doctores ', error);
        res.status(500).render('error', { mensaje: 'Error al cambiar el estado de activo de los Doctores', error });
    }
}
//Enfermeros
async function vistaEnfermeros(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let enfermeros = await Enfermero.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });
        const especialidades = await Especialidad.findAll();

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });       

        res.status(200).render('admin/CrearEnfermero', { usuario, 
            cargo, 
            enfermeros, 
            especialidades, 
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
            });
    }catch (error) {
        console.error('Error en la vista para generar Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista para generar Enfermeros', error });
    }
}

async function cargarEnfermeros(req, res) {
    try {
        const {
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            genero,
            especialidad,
            telefono,
            direccion,
            provincia,
            localidad,
            activo,
            nombreUsuario,
            contrasena
        } = req.body;
      

        let activoBoolean=false;
        if(activo=="activo"){
            activoBoolean=true;
        }

        // Buscar enfermero por DNI
        let enfermero = await Enfermero.findOne({ where: { dni } });

        // Hashear contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(contrasena, saltRounds);        
        
        if (enfermero) {
            // Actualizar enfermero
            await enfermero.update({
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                id_especialidad: especialidad,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean
            });

            // Actualizar usuario asociado
            const usuario = await Usuario.findByPk(enfermero.id_usuario);
            await usuario.update({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            );            
        } else {
            // Crear nuevo usuario
            const nuevoUsuario = await Usuario.create({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            ); 

            // Crear nuevo enfermero
            enfermero = await Enfermero.create({
                dni,
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                id_especialidad: especialidad,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean,
                id_usuario: nuevoUsuario.id
            });
        }

        // Recargar doctor con especialidad y usuario
        enfermero = await Enfermero.findByPk(enfermero.id, {
            include: [
                { model: Especialidad, attributes: ['tipo'] },
                { model: Usuario }
            ]
        });

        // Listados para la vista
        const enfermeros = await Enfermero.findAll({
            include: [
                { model: Especialidad },
                { model: Usuario }
                ]                
        });
        const especialidades = await Especialidad.findAll();

        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });  

        res.status(200).render('admin/CrearEnfermero', {
            usuario,
            cargo,
            enfermeros,
            especialidades,
            cartel: true,
            enfermero,
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
        });

    } catch (error) {
        console.error('Error al crear o actualizar enfermero:', error);
        res.status(500).render('error', {
            mensaje: 'Error al procesar el enfermero',
            error
        });
    }
}

async function listarEnfermeros(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let enfermeros = await Enfermero.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });

        if(enfermeros){
            enfermeros.forEach(enfermero => {
                if (enfermero.fecha_nacimiento) {
                    const fecha = new Date(enfermero.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    enfermero.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        const cartel = false;
        res.status(200).render('admin/listaEnfermero', { usuario, cargo, enfermeros, cartel});
    }catch (error) {
        console.error('Error en la vista de la lista de Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Enfermeros', error });
    }
}

async function listarEnfermerosModificarActivo(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let enfermero = await Enfermero.findByPk(req.params.id)

        if (enfermero.activo) {
            await enfermero.update({
            activo: false
        })
        } else {
            await enfermero.update({
            activo: true
            })        
        }

        let enfermeros = await Enfermero.findAll({
            include: [
                {model: Especialidad},
                {model: Usuario} 
            ]
        });

        if(enfermeros){
            enfermeros.forEach(enfermero => {
                if (enfermero.fecha_nacimiento) {
                    const fecha = new Date(enfermero.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    enfermero.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        const cartel= true;
        
        res.status(200).render('admin/listaEnfermero', { usuario, cargo, enfermeros, enfermero, cartel});
    }catch (error) {
        console.error('Error en la vista de la lista de Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Enfermeros', error });
    }
}
//Administradores
async function vistaAdministradores(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let administradores = await Administrador.findAll({
            include: [
                {model: Usuario} 
            ]
        });  

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });       

        res.status(200).render('admin/CrearAdministradores', { 
            usuario, 
            cargo, 
            administradores, 
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
            });
    }catch (error) {
        console.error('Error en la vista para generar Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista para generar Enfermeros', error });
    }
}

async function cargarAdministradores(req, res) {
    try {
        const {
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            genero,
            telefono,
            direccion,
            provincia,
            localidad,
            activo,
            nombreUsuario,
            contrasena
        } = req.body;
      

        let activoBoolean=false;
        if(activo=="activo"){
            activoBoolean=true;
        }

        // Buscar enfermero por DNI
        let administrador = await Administrador.findOne({ where: { dni } });

        // Hashear contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(contrasena, saltRounds);        
        
        if (administrador) {
            // Actualizar enfermero
            await administrador.update({
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean
            });
            console.log("ENTRO");
            
            // Actualizar usuario asociado
            const usuario = await Usuario.findByPk(administrador.id_usuario);
            await usuario.update({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            );            
        } else {
            console.log("NO ENTRO-----------------------------------------------------------------------------------------------------------------------");
            // Crear nuevo usuario
            const nuevoUsuario = await Usuario.create({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            ); 

            // Crear nuevo enfermero
            administrador = await Administrador.create({
                dni,
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean,
                id_usuario: nuevoUsuario.id
            });
        }

        // Recargar doctor con especialidad y usuario
        administrador = await Administrador.findByPk(administrador.id, {
            include: [
                { model: Usuario }
            ]
        });

        // Listados para la vista
        const administradores = await Administrador.findAll({
            include: [
                { model: Usuario }
                ]                
        });
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });  

        res.status(200).render('admin/CrearAdministradores', {
            usuario,
            cargo,
            administradores,
            cartel: true,
            administrador,
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
        });

    } catch (error) {
        console.error('Error al crear o actualizar enfermero:', error);
        res.status(500).render('error', {
            mensaje: 'Error al procesar el enfermero',
            error
        });
    }
}

async function listarAdministradores(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let administradores = await Administrador.findAll({
            include: [
                {model: Usuario} 
            ]
        });

        if(administradores){
            administradores.forEach(administrador => {
                if (administrador.fecha_nacimiento) {
                    const fecha = new Date(administrador.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    administrador.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 

        const cartel= false;

        res.status(200).render('admin/listaAdministradores', { usuario, cargo, administradores, cartel});
    }catch (error) {
        console.error('Error en la vista de la lista de Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Enfermeros', error });
    }
}

async function listarAdministradoresModificarActivo(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let administrador = await Administrador.findByPk(req.params.id)

        if (administrador.activo) {
            await administrador.update({
            activo: false
        })
        } else {
            await administrador.update({
            activo: true
            })        
        }

        let administradores = await Administrador.findAll({
            include: [
                {model: Usuario} 
            ]
        });

        if(administradores){
            administradores.forEach(administrador => {
                if (administrador.fecha_nacimiento) {
                    const fecha = new Date(administrador.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    administrador.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        const cartel=true;

        res.status(200).render('admin/listaAdministradores', { usuario, cargo, administrador, administradores, cartel});
    }catch (error) {
        console.error('Error en la vista de la lista de Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Enfermeros', error });
    }
}
//Recepcionistas
async function vistaRecepcionistas(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcionistas = await Recepcionista.findAll({
            include: [
                {model: Usuario} 
            ]
        });  

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });       

        res.status(200).render('admin/CrearRecepcionistas', { 
            usuario, 
            cargo, 
            recepcionistas, 
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
            });
    }catch (error) {
        console.error('Error en la vista para generar Enfermeros ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista para generar Enfermeros', error });
    }
}

async function cargarRecepcionistas(req, res) {
    try {
        const {
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            genero,
            telefono,
            direccion,
            provincia,
            localidad,
            activo,
            nombreUsuario,
            contrasena
        } = req.body;
      

        let activoBoolean=false;
        if(activo=="activo"){
            activoBoolean=true;
        }

        // Buscar enfermero por DNI
        let recepcionista = await Recepcionista.findOne({ where: { dni } });

        // Hashear contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(contrasena, saltRounds);        
        
        if (recepcionista) {
            // Actualizar enfermero
            await recepcionista.update({
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean
            });
            
            // Actualizar usuario asociado
            const usuario = await Usuario.findByPk(recepcionista.id_usuario);
            await usuario.update({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            );            
        } else {
            // Crear nuevo usuario
            const nuevoUsuario = await Usuario.create({
                usuario: nombreUsuario,
                contraseña: passwordHash
            },
                { hooks: false }
            ); 

            // Crear nuevo enfermero
            recepcionista = await Recepcionista.create({
                dni,
                nombre,
                apellido,
                fecha_nacimiento,
                genero,
                telefono,
                direccion,
                provincia,
                localidad,
                activo: activoBoolean,
                id_usuario: nuevoUsuario.id
            });
        }

        // Recargar doctor con especialidad y usuario
        recepcionista = await Recepcionista.findByPk(recepcionista.id, {
            include: [
                { model: Usuario }
            ]
        });

        // Listados para la vista
        const recepcionistas = await Recepcionista.findAll({
            include: [
                { model: Usuario }
                ]                
        });
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const usuariosExistentes = await Usuario.findAll({
            attributes: ['usuario']
        });  

        res.status(200).render('admin/CrearRecepcionistas', {
            usuario,
            cargo,
            recepcionistas,
            cartel: true,
            recepcionista,
            usuariosExistentes: usuariosExistentes.map(u => u.usuario),
        });

    } catch (error) {
        console.error('Error al crear o actualizar recepcionista:', error);
        res.status(500).render('error', {
            mensaje: 'Error al procesar el recepcionista',
            error
        });
    }
}

async function listarRecepcionistas(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcionistas = await Recepcionista.findAll({
            include: [
                {model: Usuario} 
            ]
        });

        if(recepcionistas){
            recepcionistas.forEach(recepcionista => {
                if (recepcionista.fecha_nacimiento) {
                    const fecha = new Date(recepcionista.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    recepcionista.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 

        const cartel=false;

        res.status(200).render('admin/listaRecepcionistas', { usuario, cargo, cartel, recepcionistas});
    }catch (error) {
        console.error('Error en la vista de la lista de Recepcionistas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Recepcionistas', error });
    }
}

async function listarRecepcionistasModificarActivo(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

         let recepcionista = await Recepcionista.findByPk(req.params.id)

        if (recepcionista.activo) {
            await recepcionista.update({
            activo: false
        })
        } else {
            await recepcionista.update({
            activo: true
            })        
        }

        let recepcionistas = await Recepcionista.findAll({
            include: [
                {model: Usuario} 
            ]
        });

        if(recepcionistas){
            recepcionistas.forEach(recepcionista => {
                if (recepcionista.fecha_nacimiento) {
                    const fecha = new Date(recepcionista.fecha_nacimiento);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    recepcionista.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        const cartel=true;

        res.status(200).render('admin/listaRecepcionistas', { usuario, cargo, cartel, recepcionista, recepcionistas});
    }catch (error) {
        console.error('Error en la vista de la lista de Recepcionistas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la lista de Recepcionistas', error });
    }
}
//Sectores
async function vistaElegirSector(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 

        res.status(200).render('admin/elegirSector', { usuario, cargo, });
    }catch (error) {
        console.error('Error en la vista elegir ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista elegir', error });
    }
}
//Camas
async function vistaCamas(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 
        
        const cartel = false;

        res.status(200).render('admin/crearCama', { usuario, cargo, cartel,});
    }catch (error) {
        console.error('Error en la vista camas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista camas', error });
    }
}

async function cargarCamas(req, res) {
     try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 

        const {
            numero,
            tipo,
            estado,
            electrica,
            oxigeno
        } = req.body;
        const electricaBoolean = electrica == 1 ? true : false;
        const oxigenoBoolean = oxigeno == 1 ? true : false;


        let cama = await Cama.findByPk(req.body.id); 

        if (!cama) {
            cama = await Cama.create({
                numero,
                tipo,
                estado,
                electrica:electricaBoolean,
                oxigeno:oxigenoBoolean
            });
        } else {
            await cama.update({
                numero,
                tipo,
                estado,
                electrica:electricaBoolean,
                oxigeno:oxigenoBoolean
            });
        }
        
        const tipos = ["Normal","UCI","Reanimacion","Pediátrica"]
        const estados = ["Libre","Ocupada","En Desinfeccion","En Mantenimiento"]
        const cartel = true;
        res.status(200).render('admin/crearCama', { usuario, cargo, camaCartel: cama , cartel, tipos, estados});
    } catch (error) {
        console.error('Error al guardar la cama:', error);
        res.status(500).render('error', { mensaje: 'Error al guardar la cama', error });
    }
}

async function listaCamas(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 

        let camas = await Cama.findAll({
            include:[
                {model: Habitacion}
            ]
        })

        const cartel=false;
        
        res.status(200).render('admin/listaCama', { usuario, cargo, camas, cartel});
    }catch (error) {
        console.error('Error en la vista camas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista camas', error });
    }
}

async function mostrarCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let cama = await Cama.findByPk(req.params.id)
        
        const tipos = ["Normal","UCI","Reanimacion","Pediátrica"]
        const estados = ["Libre","Ocupada","En Desinfeccion","En Mantenimiento"]
        const cartel = false;

        res.status(200).render('admin/crearCama', { usuario, cargo, cartel, tipos, estados, cama });
    }catch (error) {
        console.error('Error en la vista camas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista camas', error });
    }
}

async function eliminarCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let cama = await Cama.findByPk(req.params.id);
        
        // Eliminar la cama por ID
        await Cama.destroy({
            where: { id: req.params.id }
        });

        let camas = await Cama.findAll({
            include:[
                {model: Habitacion}
            ]
        })
        const cartel=true;
        res.status(200).render('admin/listaCama', { usuario, cargo, camas, cama, cartel});
    }catch (error) {
        console.error('Error en la vista camas ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista camas', error });
    }
}

async function vistaHabitaciones(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario; 

        const cartel=false;

        const alas = await Ala.findAll();

        res.status(200).render('admin/crearHabitacion', { usuario, cargo, cartel, alas});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function cargarHabitaciones(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const {
            tipo,
            activa,
            ala
        } = req.body;

        const activoBoolean = activa == 1 ? true:false;

        const nuevaHabitacion = await Habitacion.create({
            tipo,
            activa: activoBoolean,
            id_ala: ala
        });

        const sector = await Ala.findByPk(ala);
        const alas = await Ala.findAll();

        const cartel=true;

        res.status(200).render('admin/crearHabitacion', { usuario, cargo, cartel, nuevaHabitacion, sector, alas });
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function listaHabitaciones(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let habitaciones = await Habitacion.findAll({
            include: [
                    {model: Cama},
                    {model: Ala},
                    ]
        })        
        
        const habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`
        );        
        
        const cartel=false;
        const cartel2=false;

        res.status(200).render('admin/listaHabitacion', { usuario, cargo, cartel, habitaciones, habitacionesDisponibles, cartel2});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function listaActivaHabitacion(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const habitacion = await Habitacion.findByPk(req.params.id);
        if (habitacion.activa) {
            await habitacion.update({
                activa:false
            })
        }else{
            await habitacion.update({
                activa:true
            })
        }
        
        
        let habitaciones = await Habitacion.findAll({
            include: [
                    {model: Cama},
                    {model: Ala},
                    ]
        })        
        
        const habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`
        );        
        
        const cartel=false;
        const cartel2=true;

        res.status(200).render('admin/listaHabitacion', { usuario, cargo, cartel, habitaciones, habitacionesDisponibles, habitacion, cartel2});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function listaHabitacionesAgregarCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let habitacion = await Habitacion.findByPk(req.params.id)        
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`
        );
        
        const cartel=false;
        const camasDisponibles = await Cama.findAll({
            where:{id_habitacion: null}
        })

        camasDisponibles.map(cama => {            
            cama.electrica_respuesta = cama.electrica ? "Si" : "No";
            cama.oxigeno_respuesta = cama.oxigeno ? "Si" : "No";
        });

        res.status(200).render('admin/insertarCama', { usuario, cargo, cartel, habitacion, habitacionesDisponibles, camasDisponibles});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function listaEliminarHabitacion(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        let habitacion = await Habitacion.findByPk(req.params.id);
        
        let camasAsociadas = await Cama.findAll({
            where: { id_habitacion: req.params.id }
        });

        // Si hay camas asociadas, actualizar su id_habitacion a null
        if (camasAsociadas.length > 0) {
            await Promise.all(camasAsociadas.map(async (cama) => {
                await cama.update({ id_habitacion: null });
            }));
        }

        await habitacion.destroy();        
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`
        );

        let habitaciones = await Habitacion.findAll({
            include: [
                    {model: Cama},
                    {model: Ala},
                    ]
        }) 
        
        const cartel=true;  
        const cartel2=false;        
       
        res.status(200).render('admin/listaHabitacion', { usuario, cargo, cartel, habitacion, habitacionesDisponibles, habitaciones, cartel2});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function vistaInsertarCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;   
               
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`,
            { type: sequelize.QueryTypes.SELECT }
        );
        habitacionesDisponibles = habitacionesDisponibles.flat();
        
        
        const cartel=false;
        const camasDisponibles = await Cama.findAll({
            where:{id_habitacion: null}
        })

        camasDisponibles.map(cama => {            
            cama.electrica_respuesta = cama.electrica ? "Si" : "No";
            cama.oxigeno_respuesta = cama.oxigeno ? "Si" : "No";
        });

        res.status(200).render('admin/insertarCama', { usuario, cargo, cartel, habitacionesDisponibles, camasDisponibles});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function cargarInsertarCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const {camaSeleccionada, habitacionSeleccionada} = req.body;       

        let camaEncontrada= await Cama.findByPk(camaSeleccionada);
        await camaEncontrada.update({
            id_habitacion: habitacionSeleccionada
        })
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2)`,
            { type: sequelize.QueryTypes.SELECT }
        );
        habitacionesDisponibles = habitacionesDisponibles.flat();
        
        const cartel=true;

        const camasDisponibles = await Cama.findAll({
            where:{id_habitacion: null}
        })

        camasDisponibles.map(cama => {            
            cama.electrica_respuesta = cama.electrica ? "Si" : "No";
            cama.oxigeno_respuesta = cama.oxigeno ? "Si" : "No";
        });        

        res.status(200).render('admin/insertarCama', { usuario, cargo, cartel,  habitacionesDisponibles, camasDisponibles, camaEncontrada});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function vistaMoverCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;   
               
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE h.activa = true AND (c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2))`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Aplanar el array de arrays
        habitacionesDisponibles = habitacionesDisponibles.flat();
        
        
        const cartel=false;
        const camasDisponibles = await Cama.findAll({            
            include:[
                {model: Habitacion},
            ]
        })

        camasDisponibles.map(cama => {            
            cama.electrica_respuesta = cama.electrica ? "Si" : "No";
            cama.oxigeno_respuesta = cama.oxigeno ? "Si" : "No";
        });

        res.status(200).render('admin/moverCama', { usuario, cargo, cartel, habitacionesDisponibles, camasDisponibles});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function cargarMoverCama(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;  
        
        const {camaSeleccionada, habitacionSeleccionada} = req.body;       

        let camaEncontrada= await Cama.findByPk(camaSeleccionada);
        await camaEncontrada.update({
            id_habitacion: habitacionSeleccionada
        })
        
        let habitacionesDisponibles = await sequelize.query(
            `SELECT h.id AS id, h.tipo
            FROM habitaciones h
            LEFT JOIN camas c ON c.id_habitacion = h.id
            WHERE h.activa = true AND (c.id IS NULL OR (h.tipo = 'Compartida' AND (SELECT COUNT(*) FROM camas WHERE id_habitacion = h.id) < 2))`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Aplanar el array de arrays
        habitacionesDisponibles = habitacionesDisponibles.flat();
        
        const cartel=true;
        const camasDisponibles = await Cama.findAll({            
            include:[
                {model: Habitacion},
            ]
        })

        camasDisponibles.map(cama => {            
            cama.electrica_respuesta = cama.electrica ? "Si" : "No";
            cama.oxigeno_respuesta = cama.oxigeno ? "Si" : "No";
        });

        res.status(200).render('admin/moverCama', { usuario, cargo, cartel, habitacionesDisponibles, camasDisponibles, camaEncontrada});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function vistaMutual(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;   
        const mutuales = await Mutual.findAll();      
                
        const cartel=false;


        res.status(200).render('admin/crearMutual', { usuario, cargo, cartel, mutuales,});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

async function cargarMutual(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;   

        const nombreMutual = req.body.nombreMutual;
        
        const mutual = await Mutual.create({
            nombre: nombreMutual
        })
        
        const mutuales = await Mutual.findAll();
                
        const cartel=true;


        res.status(200).render('admin/crearMutual', { usuario, cargo, cartel, mutuales, mutual});
    }catch (error) {
        console.error('Error en la vista habitaciones ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista habitaciones', error });
    }
}

module.exports = {
    vistaElegir,
    vistaDoctores,
    cargarDoctores,
    listarDoctores,
    listarDoctoresModificarActivo,
    vistaEnfermeros,
    cargarEnfermeros,
    listarEnfermeros,
    listarEnfermerosModificarActivo,
    vistaAdministradores,
    cargarAdministradores,
    listarAdministradores,
    listarAdministradoresModificarActivo,
    vistaRecepcionistas,
    cargarRecepcionistas,
    listarRecepcionistas,
    listarRecepcionistasModificarActivo,
    vistaElegirSector,
    vistaCamas,
    cargarCamas,
    listaCamas,
    mostrarCama,
    eliminarCama,
    vistaHabitaciones,
    cargarHabitaciones,
    listaHabitaciones,
    listaHabitacionesAgregarCama,
    listaActivaHabitacion,
    listaEliminarHabitacion,
    vistaInsertarCama,
    cargarInsertarCama,
    vistaMoverCama,
    cargarMoverCama,
    vistaMutual,
    cargarMutual 
};
