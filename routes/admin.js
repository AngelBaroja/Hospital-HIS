const express = require('express');
const adminController = require('../controllers/adminController.js');
const {requiereSesion, requiereAdministrador } = require('../middlewares/auth');

const router = express.Router();
/*
//Personal
router.get('/elegir', requiereSesion, adminController.vistaElegir);
//Doctores
router.get('/doctores', requiereSesion, adminController.vistaDoctores);
router.post('/doctores', requiereSesion, adminController.cargarDoctores);
router.get('/listar/doctores', requiereSesion, adminController.listarDoctores);
router.post('/listar/doctores/:id', requiereSesion, adminController.listarDoctoresModificarActivo);
//Enfermeros
router.get('/enfermeros', requiereSesion, adminController.vistaEnfermeros);
router.post('/enfermeros', requiereSesion, adminController.cargarEnfermeros);
router.get('/listar/enfermeros', requiereSesion, adminController.listarEnfermeros);
router.post('/listar/enfermeros/:id', requiereSesion, adminController.listarEnfermerosModificarActivo);
//Administradores
router.get('/administradores', requiereSesion, adminController.vistaAdministradores);
router.post('/administradores', requiereSesion, adminController.cargarAdministradores);
router.get('/listar/administradores', requiereSesion, adminController.listarAdministradores);
router.post('/listar/administradores/:id', requiereSesion, adminController.listarAdministradoresModificarActivo);
//Recepcionistas
router.get('/recepcionistas', requiereSesion, adminController.vistaRecepcionistas);
router.post('/recepcionistas', requiereSesion, adminController.cargarRecepcionistas);
router.get('/listar/recepcionistas', requiereSesion, adminController.listarRecepcionistas);
router.post('/listar/recepcionistas/:id', requiereSesion, adminController.listarRecepcionistasModificarActivo);
//Sectores
router.get('/elegirSector', requiereSesion, adminController.vistaElegirSector);
//Camas
router.get('/camas', requiereSesion, adminController.vistaCamas);
router.post('/camas', requiereSesion, adminController.cargarCamas);
router.get('/listar/camas', requiereSesion, adminController.listaCamas);
router.post('/listar/camas/:id', requiereSesion, adminController.mostrarCama);
router.post('/listar/camas/eliminar/:id', requiereSesion, adminController.eliminarCama);
//Habitacion
router.get('/habitaciones', requiereSesion, adminController.vistaHabitaciones);
router.post('/habitaciones', requiereSesion, adminController.cargarHabitaciones);
router.get('/listar/habitaciones', requiereSesion, adminController.listaHabitaciones);
router.post('/listar/habitaciones/:id', requiereSesion, adminController.listaHabitacionesAgregarCama);
router.post('/listar/habitaciones/eliminar/:id', requiereSesion, adminController.listaEliminarHabitacion);
router.post('/listar/habitaciones/activa/:id', requiereSesion, adminController.listaActivaHabitacion);
router.get('/insertar/cama', requiereSesion, adminController.vistaInsertarCama);
router.post('/insertar/cama', requiereSesion, adminController.cargarInsertarCama);
router.get('/mover/cama', requiereSesion, adminController.vistaMoverCama);
router.post('/mover/cama', requiereSesion, adminController.cargarMoverCama);
//Mutual
router.get('/mutual', requiereSesion, adminController.vistaMutual);
router.post('/mutual', requiereSesion, adminController.cargarMutual);
router.post('/mutual/eliminar/:id', requiereSesion, adminController.eliminarMutual);
*/

//=================================================

//Personal
router.get('/elegir', requiereSesion, requiereAdministrador, adminController.vistaElegir);

//Doctores
router.get('/doctores', requiereSesion, requiereAdministrador, adminController.vistaDoctores);
router.post('/doctores', requiereSesion, requiereAdministrador, adminController.cargarDoctores);
router.get('/listar/doctores', requiereSesion, requiereAdministrador, adminController.listarDoctores);
router.post('/listar/doctores/:id', requiereSesion, requiereAdministrador, adminController.listarDoctoresModificarActivo);

//Enfermeros
router.get('/enfermeros', requiereSesion, requiereAdministrador, adminController.vistaEnfermeros);
router.post('/enfermeros', requiereSesion, requiereAdministrador, adminController.cargarEnfermeros);
router.get('/listar/enfermeros', requiereSesion, requiereAdministrador, adminController.listarEnfermeros);
router.post('/listar/enfermeros/:id', requiereSesion, requiereAdministrador, adminController.listarEnfermerosModificarActivo);

//Administradores
router.get('/administradores', requiereSesion, requiereAdministrador, adminController.vistaAdministradores);
router.post('/administradores', requiereSesion, requiereAdministrador, adminController.cargarAdministradores);
router.get('/listar/administradores', requiereSesion, requiereAdministrador, adminController.listarAdministradores);
router.post('/listar/administradores/:id', requiereSesion, requiereAdministrador, adminController.listarAdministradoresModificarActivo);

//Recepcionistas
router.get('/recepcionistas', requiereSesion, requiereAdministrador, adminController.vistaRecepcionistas);
router.post('/recepcionistas', requiereSesion, requiereAdministrador, adminController.cargarRecepcionistas);
router.get('/listar/recepcionistas', requiereSesion, requiereAdministrador, adminController.listarRecepcionistas);
router.post('/listar/recepcionistas/:id', requiereSesion, requiereAdministrador, adminController.listarRecepcionistasModificarActivo);

//Sectores
router.get('/elegirSector', requiereSesion, requiereAdministrador, adminController.vistaElegirSector);

//Camas
router.get('/camas', requiereSesion, requiereAdministrador, adminController.vistaCamas);
router.post('/camas', requiereSesion, requiereAdministrador, adminController.cargarCamas);
router.get('/listar/camas', requiereSesion, requiereAdministrador, adminController.listaCamas);
router.post('/listar/camas/:id', requiereSesion, requiereAdministrador, adminController.mostrarCama);
router.post('/listar/camas/eliminar/:id', requiereSesion, requiereAdministrador, adminController.eliminarCama);

//Habitaciones
router.get('/habitaciones', requiereSesion, requiereAdministrador, adminController.vistaHabitaciones);
router.post('/habitaciones', requiereSesion, requiereAdministrador, adminController.cargarHabitaciones);
router.get('/listar/habitaciones', requiereSesion, requiereAdministrador, adminController.listaHabitaciones);
router.post('/listar/habitaciones/:id', requiereSesion, requiereAdministrador, adminController.listaHabitacionesAgregarCama);
router.post('/listar/habitaciones/eliminar/:id', requiereSesion, requiereAdministrador, adminController.listaEliminarHabitacion);
router.post('/listar/habitaciones/activa/:id', requiereSesion, requiereAdministrador, adminController.listaActivaHabitacion);
router.get('/insertar/cama', requiereSesion, requiereAdministrador, adminController.vistaInsertarCama);
router.post('/insertar/cama', requiereSesion, requiereAdministrador, adminController.cargarInsertarCama);
router.get('/mover/cama', requiereSesion, requiereAdministrador, adminController.vistaMoverCama);
router.post('/mover/cama', requiereSesion, requiereAdministrador, adminController.cargarMoverCama);

//Mutual
router.get('/mutual', requiereSesion, requiereAdministrador, adminController.vistaMutual);
router.post('/mutual', requiereSesion, requiereAdministrador, adminController.cargarMutual);
router.post('/mutual/eliminar/:id', requiereSesion, requiereAdministrador, adminController.eliminarMutual);


module.exports = router;