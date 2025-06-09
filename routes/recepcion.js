const express = require('express');
const recepcionController = require('../controllers/recepcionController');

const router = express.Router();

router.get('/', recepcionController.inicioRecepcion) //Inicio para la recepcion

router.post('/', recepcionController.buscarTurno); //Chequeo en que condicion llega el paciente (Emergencia, Derivacion o Programado)

router.post('/atras', recepcionController.atrasRegistro);//Vuelvo a la ventana /recepcion/recepcion

router.post('/registro', recepcionController.crearPaciente);//Aqui creo al paciente y lo redirijo a la pagina de asignacion de habitacion

router.post('/asignacion', recepcionController.ingresarHabitacion);//Aqui le asigno una habitacion al paciente

router.get(`/lista`, recepcionController.vistaPacientesConRecepcion);//Aqui muestro la tabla de paciente con recepcion

router.post(`/retirar/:id`, recepcionController.retirarRecepcion);//Aqui cambio una recepcion a retirado y le coloco fecha de salida

module.exports = router;