const express = require('express');
const pacienteController = require('../controllers/pacienteController');

const router = express.Router();

router.get(`/lista`, pacienteController.vistaPacientesConRecepcion);
//router.get(`/generar`, turnoController.vistaGenerarTurno);
//router.post('/generar', turnoController.generarTurno);
//router.get('/lista', turnoController.vistaListarTurno);

module.exports = router;