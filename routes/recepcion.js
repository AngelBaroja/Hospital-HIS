const express = require('express');
const recepcionController = require('../controllers/recepcionController');

const router = express.Router();


router.post('/', recepcionController.buscarTurno); //Chequeo en que condicion llega el paciente (Emergencia o Programado)

router.post('/registro', recepcionController.crearPaciente);//Aqui creo al paciente y lo redirijo a la pagina de asignacion de habitacion

router.post('/asignacion', recepcionController.ingresarHabitacion);

module.exports = router;