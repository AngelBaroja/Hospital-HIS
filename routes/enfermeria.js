const express = require('express');
const enfermeriaController = require('../controllers/enfermeriaController.js');
const {requiereSesion, requiereEnfermeria} = require('../middlewares/auth');

const router = express.Router();

router.get('/pacientesInternados', requiereSesion, enfermeriaController.pacientesInternados); // Carga la vista de pacientes internados

router.get(`/elegir/:id`, requiereSesion, enfermeriaController.elegirVista); //Carga la visa para elegir que acciones realizar con el paciente

router.get(`/registro/:id`, requiereSesion, enfermeriaController.vistaRegistroEnfermeria); // Carga la vista de registro de enfermería para un paciente específico
router.post('/registro', requiereSesion, enfermeriaController.registrarEnfermeria); // Procesa el control del registro de admicion la enfermería para un paciente internado 

router.get('/historialMedico/alergia/:id', requiereSesion, enfermeriaController.vistaAlergia); // Carga la vista del formulario de Alergias
router.post('/historialMedico/alergia/:id', requiereSesion, enfermeriaController.cargarAlergia); // Carga la vista del formulario de Alergias

router.get('/historialMedico/antecedentes/:id', requiereSesion, enfermeriaController.vistaAntecedentesFamiliares); // Carga la vista del formulario de Antecedentes Familiares
router.post('/historialMedico/antecedentes/:id', requiereSesion, enfermeriaController.cargarAntecedentesFamiliares); // Carga la vista del formulario de Antecedentes Familiares

router.get('/historialMedico/cirugia/:id', requiereSesion, enfermeriaController.vistaCirugiaPrevia); // Carga la vista del formulario de Cirugias Previas
router.post('/historialMedico/cirugia/:id', requiereSesion, enfermeriaController.cargarCirugiaPrevia); // Carga la vista del formulario de Cirugias Previas

router.get('/historialMedico/enfermedad/:id', requiereSesion, enfermeriaController.vistaEnfermedadPrevia); // Carga la vista del formulario de Enfermedades Previas
router.post('/historialMedico/enfermedad/:id', requiereSesion, enfermeriaController.cargarEnfermedadPrevia); // Carga la vista del formulario de Enfermedades Previas

router.get('/historialMedico/medicamentos/:id', requiereSesion, enfermeriaController.vistaMedicamentosPaciente); // Carga la vista del formulario de los Medicamentos previos del paciente
router.post('/historialMedico/medicamentos/:id', requiereSesion, enfermeriaController.cargarMedicamentosPaciente); // Carga la vista del formulario de los Medicamentos previos del paciente

router.get('/signosVitales/:id', requiereSesion, enfermeriaController.vistaSignosVitales); // Muestra la vista de los Signos Vitales
router.post('/signosVitales/:id', requiereSesion, enfermeriaController.cargarSignosVitales); // Muestra la vista de los Signos Vitales

router.get('/signosVitales/historial/:id', requiereSesion, enfermeriaController.tablaHistorialSignosVitales);
router.post('/signosVitales/historial/:id/:signo', requiereSesion, enfermeriaController.eliminarFilaHistorialSignosVitales);

router.get('/sintomas/:id', requiereSesion, enfermeriaController.vistaSintomas); // Muestra la vista de Sintomas
router.post('/sintomas/:id', requiereSesion, enfermeriaController.cargarSintomas); // Muestra la vista de Sintomas

router.get('/sintomas/historial/:id', requiereSesion, enfermeriaController.tablaHistorialSintomas);
router.post('/sintomas/historial/:id/:sintoma', requiereSesion, enfermeriaController.eliminarFilaHistorialSintomas);

router.post('/tratamiento/:id', requiereSesion, enfermeriaController.cargarTratamiento);

router.get('/tratamiento/historial/:id', requiereSesion, enfermeriaController.tablaHistorialTratamiento);
router.post('/tratamiento/historial/:id/:plan', requiereSesion, enfermeriaController.eliminarFilaHistorialTratamiento);

router.post('/alerta/:id', requiereSesion, enfermeriaController.cargarAlerta);

router.get('/chats/chat', requiereSesion, enfermeriaController.vistaChats); // Carga la vista de chats para enfermería

router.post('/chats/enviar', requiereSesion, enfermeriaController.enviarMensaje);

//=================================================

/*
router.get('/pacientesInternados', requiereSesion, requiereEnfermeria, enfermeriaController.pacientesInternados); // Carga la vista de pacientes internados

router.get(`/elegir/:id`, requiereSesion, requiereEnfermeria, enfermeriaController.elegirVista); //Carga la visa para elegir que acciones realizar con el paciente

router.get(`/registro/:id`, requiereSesion, requiereEnfermeria, enfermeriaController.vistaRegistroEnfermeria); // Carga la vista de registro de enfermería para un paciente específico
router.post('/registro', requiereSesion, requiereEnfermeria, enfermeriaController.registrarEnfermeria); // Procesa el control del registro de admicion la enfermería para un paciente internado 

router.get('/historialMedico/alergia/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaAlergia); // Carga la vista del formulario de Alergias
router.post('/historialMedico/alergia/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarAlergia); // Carga la vista del formulario de Alergias

router.get('/historialMedico/antecedentes/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaAntecedentesFamiliares); // Carga la vista del formulario de Antecedentes Familiares
router.post('/historialMedico/antecedentes/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarAntecedentesFamiliares); // Carga la vista del formulario de Antecedentes Familiares

router.get('/historialMedico/cirugia/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaCirugiaPrevia); // Carga la vista del formulario de Cirugias Previas
router.post('/historialMedico/cirugia/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarCirugiaPrevia); // Carga la vista del formulario de Cirugias Previas

router.get('/historialMedico/enfermedad/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaEnfermedadPrevia); // Carga la vista del formulario de Enfermedades Previas
router.post('/historialMedico/enfermedad/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarEnfermedadPrevia); // Carga la vista del formulario de Enfermedades Previas

router.get('/historialMedico/medicamentos/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaMedicamentosPaciente); // Carga la vista del formulario de los Medicamentos previos del paciente
router.post('/historialMedico/medicamentos/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarMedicamentosPaciente); // Carga la vista del formulario de los Medicamentos previos del paciente

router.get('/signosVitales/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaSignosVitales); // Muestra la vista de los Signos Vitales
router.post('/signosVitales/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarSignosVitales); // Muestra la vista de los Signos Vitales

router.get('/signosVitales/historial/:id', requiereSesion, requiereEnfermeria, enfermeriaController.tablaHistorialSignosVitales);
router.post('/signosVitales/historial/:id/:signo', requiereSesion, requiereEnfermeria, enfermeriaController.eliminarFilaHistorialSignosVitales);

router.get('/sintomas/:id', requiereSesion, requiereEnfermeria, enfermeriaController.vistaSintomas); // Muestra la vista de Sintomas
router.post('/sintomas/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarSintomas); // Muestra la vista de Sintomas

router.get('/sintomas/historial/:id', requiereSesion, requiereEnfermeria, enfermeriaController.tablaHistorialSintomas);
router.post('/sintomas/historial/:id/:sintoma', requiereSesion, requiereEnfermeria, enfermeriaController.eliminarFilaHistorialSintomas);

router.post('/tratamiento/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarTratamiento);

router.get('/tratamiento/historial/:id', requiereSesion, requiereEnfermeria, enfermeriaController.tablaHistorialTratamiento);
router.post('/tratamiento/historial/:id/:plan', requiereSesion, requiereEnfermeria, enfermeriaController.eliminarFilaHistorialTratamiento);

router.post('/alerta/:id', requiereSesion, requiereEnfermeria, enfermeriaController.cargarAlerta);

router.get('/chats/chat', requiereSesion, requiereEnfermeria, enfermeriaController.vistaChats); // Carga la vista de chats para enfermería

router.post('/chats/enviar', requiereSesion, requiereEnfermeria, enfermeriaController.enviarMensaje);
*/



module.exports = router;