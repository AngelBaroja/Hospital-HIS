const express = require('express');
const recepcionController = require('../controllers/recepcionController.js');
const {requiereSesion} = require('../middlewares/auth');

const router = express.Router();

router.get('/',requiereSesion ,recepcionController.inicioRecepcion) //Inicio para la recepcion

router.post('/',requiereSesion , recepcionController.buscarTurno); //Chequeo en que condicion llega el paciente (Emergencia, Derivacion o Programado)

router.post('/atras',requiereSesion , recepcionController.atrasRegistro);//Vuelvo a la ventana /recepcion/recepcion

router.post('/registro',requiereSesion , recepcionController.crearPaciente);//Aqui creo al paciente y lo redirijo a la pagina de asignacion de habitacion

router.post('/asignacion',requiereSesion , recepcionController.ingresarHabitacion);//Aqui le asigno una habitacion al paciente

router.get(`/lista`,requiereSesion , recepcionController.vistaPacientesConRecepcion);//Aqui muestro la tabla de paciente con recepcion

router.post(`/retirar/:id`,requiereSesion , recepcionController.retirarRecepcion);//Aqui cambio una recepcion a retirado y le coloco fecha de salida

module.exports = router;