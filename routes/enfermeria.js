const express = require('express');
const enfermeriaController = require('../controllers/enfermeriaController.js');
const {requiereSesion} = require('../middlewares/auth');

const router = express.Router();

router.get('/pacientesInternados', requiereSesion, enfermeriaController.pacientesInternados); // Carga la vista de pacientes internados

router.get(`/registro/:id`, requiereSesion, enfermeriaController.vistaRegistroEnfermeria); // Carga la vista de registro de enfermería para un paciente específico

router.post('/registro', requiereSesion, enfermeriaController.registrarEnfermeria); // Procesa el control del registro de admicion la enfermería para un paciente internado 

router.get('/historialMedico/Alergia/:id', requiereSesion, enfermeriaController.vistaAlegia); // Carga la vista del formulario de Alergias

router.get('/historialMedico/Antecedentes/:id', requiereSesion, enfermeriaController.vistaAntecedentesFamiliares); // Carga la vista del formulario de Antecedentes Familiares

router.get('/historialMedico/Cirugia/:id', requiereSesion, enfermeriaController.vistaCirugiaPrevia); // Carga la vista del formulario de Cirugias Previas

router.get('/historialMedico/Enfermedad/:id', requiereSesion, enfermeriaController.vistaEnfermedadPrevia); // Carga la vista del formulario de Enfermedades Previas

router.get('/historialMedico/Medicamentos/:id', requiereSesion, enfermeriaController.vistaMedicamentosPaciente); // Carga la vista del formulario de los Medicamentos previos del paciente

//router.post('/historialMedico', requiereSesion, enfermeriaController.historialMedico); // Procesa el historial médico del paciente

module.exports = router;