const express = require('express');
const adminController = require('../controllers/adminController.js');
const {requiereSesion} = require('../middlewares/auth');

const router = express.Router();
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




module.exports = router;