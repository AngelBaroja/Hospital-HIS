const express = require('express');
const enfermeriaController = require('../controllers/enfermeriaController.js');
const {requiereSesion} = require('../middlewares/auth');

const router = express.Router();

router.get('/pacientesInternados', requiereSesion, enfermeriaController.pacientesInternados); // Carga la vista de pacientes internados

router.get(`/registro/:id`, requiereSesion, enfermeriaController.vistaRegistroEnfermeria); // Carga la vista de registro de enfermería para un paciente específico

router.post('/registro', requiereSesion, enfermeriaController.registrarEnfermeria); // Procesa el control del registro de admicion la enfermería para un paciente internado 

//router.post('/historialMedico', requiereSesion, enfermeriaController.historialMedico); // Procesa el historial médico del paciente

module.exports = router;