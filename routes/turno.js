const express = require('express');
const turnoController = require('../controllers/turnoController');
const { requiereSesion } = require('../middlewares/auth');

const router = express.Router();

router.get(`/elegir`, requiereSesion, turnoController.elegirVistaTurno);
router.get(`/generar`, requiereSesion, turnoController.vistaGenerarTurno);
router.post('/generar', requiereSesion, turnoController.generarTurno);
router.get('/lista', requiereSesion, turnoController.vistaListarTurno);

module.exports = router;