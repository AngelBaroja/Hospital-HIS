const express = require('express');
const recepcionController = require('../controllers/recepcionController');

const router = express.Router();

router.get('/', recepcionController.formulario);
router.post('/', recepcionController.buscarTurno);

router.get('/registro', recepcionController.abrirRegistro);
router.post('/registro', recepcionController.crearPaciente);

router.get('/asignacion', recepcionController.abrirAsignacion);

module.exports = router;