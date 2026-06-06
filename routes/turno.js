const express = require('express');
const turnoController = require('../controllers/turnoController');
const { requiereSesion, requiereRecepcionista } = require('../middlewares/auth');

const router = express.Router();

router.get(`/elegir`, requiereSesion, requiereRecepcionista, turnoController.elegirVistaTurno);
router.get(`/generar`, requiereSesion, requiereRecepcionista, turnoController.vistaGenerarTurno);
router.post('/generar', requiereSesion, requiereRecepcionista, turnoController.generarTurno);
router.get('/lista', requiereSesion, requiereRecepcionista, turnoController.vistaListarTurno);

module.exports = router;