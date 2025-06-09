const express = require('express');
const turnoController = require('../controllers/turnoController');

const router = express.Router();

router.get(`/elegir`, turnoController.elegirVistaTurno);
router.get(`/generar`, turnoController.vistaGenerarTurno);
router.post('/generar', turnoController.generarTurno);
router.get('/lista', turnoController.vistaListarTurno);

module.exports = router;