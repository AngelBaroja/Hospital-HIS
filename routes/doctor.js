const express = require('express');
const doctorController = require('../controllers/doctorController.js');
const {requiereSesion} = require('../middlewares/auth');

const router = express.Router();

router.get('/estudios/:id', requiereSesion, doctorController.vistaEstudios);

router.post('/estudios/radiografia/:id', requiereSesion, doctorController.realizarRadiografia);
router.get('/radiografia/historial/:id', requiereSesion, doctorController.historialRadiografia);


router.post('/estudios/ecografia/:id', requiereSesion, doctorController.realizarEcografia);
router.get('/ecografia/historial/:id', requiereSesion, doctorController.historialEcografia);


router.post('/estudios/tomografia/:id', requiereSesion, doctorController.realizarTomografia);
router.get('/tomografia/historial/:id', requiereSesion, doctorController.historialTomografia);


router.post('/estudios/resonanciaMagnetica/:id', requiereSesion, doctorController.realizarResonanciaMagnetica);
router.get('/resonanciaMagnetica/historial/:id', requiereSesion, doctorController.historialResonanciaMagnetica);

router.post('/estudios/analisisSangre/:id', requiereSesion, doctorController.realizarAnalisisSangre);
router.get('/analisisSangre/historial/:id', requiereSesion, doctorController.historialAnalisisSangre);

router.post('/estudios/analisisOrina/:id', requiereSesion, doctorController.realizarAnalisisOrina);
router.get('/analisisOrina/historial/:id', requiereSesion, doctorController.historialAnalisisOrina);

router.get('/alta/:id', requiereSesion, doctorController.vistaAltaMedica);
router.post('/alta/:id', requiereSesion, doctorController.cargarAltaMedica);


module.exports = router;