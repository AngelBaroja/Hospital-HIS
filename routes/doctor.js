const express = require('express');
const doctorController = require('../controllers/doctorController.js');
const {requiereSesion, requiereDoctor} = require('../middlewares/auth');

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

//=================================================

/*
router.get('/estudios/:id', requiereSesion,requiereDoctor, doctorController.vistaEstudios);

router.post('/estudios/radiografia/:id', requiereSesion,requiereDoctor, doctorController.realizarRadiografia);
router.get('/radiografia/historial/:id', requiereSesion, doctorController.historialRadiografia);

router.post('/estudios/ecografia/:id', requiereSesion, requiereDoctor, doctorController.realizarEcografia);
router.get('/ecografia/historial/:id', requiereSesion, requiereDoctor, doctorController.historialEcografia);

router.post('/estudios/tomografia/:id', requiereSesion, requiereDoctor, doctorController.realizarTomografia);
router.get('/tomografia/historial/:id', requiereSesion, requiereDoctor, doctorController.historialTomografia);

router.post('/estudios/resonanciaMagnetica/:id', requiereSesion, requiereDoctor, doctorController.realizarResonanciaMagnetica);
router.get('/resonanciaMagnetica/historial/:id', requiereSesion, requiereDoctor, doctorController.historialResonanciaMagnetica);

router.post('/estudios/analisisSangre/:id', requiereSesion, requiereDoctor, doctorController.realizarAnalisisSangre);
router.get('/analisisSangre/historial/:id', requiereSesion, requiereDoctor, doctorController.historialAnalisisSangre);

router.post('/estudios/analisisOrina/:id', requiereSesion, requiereDoctor, doctorController.realizarAnalisisOrina);
router.get('/analisisOrina/historial/:id', requiereSesion, requiereDoctor, doctorController.historialAnalisisOrina);

router.get('/alta/:id', requiereSesion, requiereDoctor, doctorController.vistaAltaMedica);
router.post('/alta/:id', requiereSesion, requiereDoctor, doctorController.cargarAltaMedica);
*/


module.exports = router;