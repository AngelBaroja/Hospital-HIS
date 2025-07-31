const Recepcion = require('../models/Recepcion');
const Paciente = require('../models/Paciente');
const Mutual_Paciente = require('../models/Mutual_Paciente');
const Mutual = require('../models/Mutual');
const Motivo = require('../models/Motivo');
const Cama = require('../models/Cama');
const Habitacion = require('../models/Habitacion');
const Ala = require('../models/Ala');
const Contacto_Emergencia = require('../models/Contacto_Emergencia');
const Historial_Medico = require('../models/Historial_Medico');
const Enfermedad_Previa = require('../models/Enfermedad_Previa');
const Cirugia_Previa = require('../models/Cirugia_Previa');
const Medicamento_Paciente = require('../models/Medicamento_Paciente');
const Alergia = require('../models/Alergia');
const Antecedente_Familiar = require('../models/Antecedente_Familiar');
const Signos_Vitales = require('../models/Signos_Vitales');
const Sintoma = require('../models/Sintoma');
const Tratamiento = require('../models/Tratamiento');
const Chat = require('../models/Chat');
const Enfermero = require('../models/Enfermero');
const Doctor = require('../models/Doctor');
const Especialidad = require('../models/Especialidad');
const Radiografia = require('../models/Radiografia');
const Ecografia = require('../models/Ecografia');
const Tomografia = require('../models/Tomografia');
const ResonanciaMagnetica = require('../models/ResonanciaMagnetica');
const AnalisisSangre = require('../models/AnalisisSangre');
const AnalisisOrina = require('../models/AnalisisOrina');

const { Op } = require('sequelize');

async function vistaEstudios(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{model: Paciente}]
        });

        const estudiosRadriograficos = ["Craneo","Columna","Cervical","Tórax","Pierna Izquierda","Pierna Derecha","Brazo Izquierdo","Brazo Derecho","Mano Izquierda","Mano Derecha","Pie Izquierdo","Pie Derecho"];
         
        const estudiosSangre = ["Hemograma","Glucosa","Colesterol","Trigliceridos","Creatinina","Urea","Acido Urico"];

        const estudiosEcograficos = ["Abdominal","Cardiaca","Obstetrica"];

        const estudiosResonanciaMagnetica = ["Cerebral","Columna"];

        const estudiosTomografia = ["Cerebral","Torax","Abdominal"];        
        
        const estudiosOrina = ["Orina Completa","Sedimento Urinario","Urocultivo"];

        res.status(200).render('doctor/pruebasDiagnosticas', { usuario, cargo, recepcion, estudiosRadriograficos, estudiosSangre, estudiosOrina, estudiosEcograficos, estudiosResonanciaMagnetica, estudiosTomografia });
    }catch (error) {
        console.error('Error en la vista de los estudios ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de los estudios', error });
    }
}

async function realizarRadiografia(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }

        let direccion;
        let detalle;

        const { placa } = req.body;
       switch (placa) {
            case 'Craneo':
                direccion = '/img/radiografias/Craneo.ico';
                detalle = [
                    "Estudio de rutina para evaluar la estructura ósea del cráneo.",
                    "Control radiológico para verificar la simetría y forma craneal.",
                    "Imagen general del cráneo en estudio preventivo o de control."
                ];
                break;
            case 'Columna':
                direccion = '/img/radiografias/Columna.ico';
                detalle = [
                    "Evaluación de la alineación general de la columna vertebral.",
                    "Radiografía de control para observar la curvatura espinal.",
                    "Imagen de columna tomada en estudio postural o preventivo."
                ];
                break;
            case 'Cervical':
                direccion = '/img/radiografias/Cervical.ico';
                detalle = [
                    "Imagen cervical tomada para chequeo de movilidad o postura.",
                    "Estudio de rutina para observar las vértebras del cuello.",
                    "Evaluación cervical sin hallazgos de gravedad visibles."
                ];
                break;
            case 'Tórax':
                direccion = '/img/radiografias/Torax.ico';
                detalle = [
                    "Control torácico con buena visualización del área pulmonar.",
                    "Radiografía de rutina para evaluación general del tórax.",
                    "Imagen torácica obtenida como parte de un chequeo clínico."
                ];
                break;
            case 'Pierna Izquierda':
                direccion = '/img/radiografias/Pierna-Izquierda.ico';
                detalle = [
                    "Radiografía de la pierna izquierda para control de estructura ósea.",
                    "Estudio de rutina sin alteraciones visibles importantes.",
                    "Imagen tomada para verificar alineación y forma de los huesos."
                ];
                break;
            case 'Pierna Derecha':
                direccion = '/img/radiografias/Pierna-Derecha.ico';
                detalle = [
                    "Chequeo de la pierna derecha con visibilidad adecuada de la estructura.",
                    "Estudio simple con enfoque en huesos largos y articulaciones.",
                    "Imagen de control sin signos evidentes de anomalías estructurales."
                ];
                break;
            case 'Brazo Izquierdo':
                direccion = '/img/radiografias/Brazo Izquierdo.jpg';
                detalle = [
                    "Imagen del brazo izquierdo tomada como parte de un control general.",
                    "Evaluación de rutina con buena visualización ósea del brazo.",
                    "Radiografía realizada para estudio preventivo o seguimiento leve."
                ];
                break;
            case 'Brazo Derecho':
                direccion = '/img/radiografias/Brazo Derecho.jpg';
                detalle = [
                    "Estudio radiológico del brazo derecho sin hallazgos relevantes.",
                    "Imagen clara del brazo derecho para evaluación de rutina.",
                    "Control radiográfico con buena definición de la estructura ósea."
                ];
                break;
            case 'Mano Izquierda':
                direccion = '/img/radiografias/Mano-Izquierda.ico';
                detalle = [
                    "Estudio de la mano izquierda realizado con fines preventivos.",
                    "Imagen de control con visibilidad de las falanges y metacarpos.",
                    "Chequeo radiológico simple sin alteraciones notorias."
                ];
                break;
            case 'Mano Derecha':
                direccion = '/img/radiografias/Mano-Derecha.ico';
                detalle = [
                    "Radiografía de la mano derecha para control de forma y alineación.",
                    "Estudio simple de rutina para evaluación general de la mano.",
                    "Imagen tomada sin presencia de signos graves visibles."
                ];
                break;
            case 'Pie Izquierdo':
                direccion = '/img/radiografias/Pie-Izquierdo.ico';
                detalle = [
                    "Control radiográfico del pie izquierdo con observación general.",
                    "Imagen de rutina para evaluación de la estructura del pie.",
                    "Estudio simple del pie izquierdo sin hallazgos significativos."
                ];
                break;
            case 'Pie Derecho':
                direccion = '/img/radiografias/Pie-Derecho.ico';
                detalle = [
                    "Evaluación radiológica del pie derecho en chequeo preventivo.",
                    "Estudio tomado para control anatómico del pie derecho.",
                    "Imagen general sin evidencia de lesiones visibles importantes."
                ];
                break;
            default:
                detalle = [
                    "Radiografía de zona no especificada.",
                    "Imagen sin clasificación detallada.",
                    "Estudio radiológico general no asignado a una región específica."
                ];
                break;
        }
        let descripcion = detalle[Math.floor(Math.random() * detalle.length)];
        const radiografia = await Radiografia.create({
            tipo: placa,
            informacion: descripcion,
            ruta: direccion,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'Radiografía registrada exitosamente', radiografia });
    } catch (error) {
        console.error('Error al registrar radiografía:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar radiografía', error });
    }
}

async function historialRadiografia(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [Radiografia]
                }]
            }]
        });
        
         //Si el paciente tiene Radiografia les formateo la fecha 
        if (recepcion.Paciente.Historial_Medico.Radiografia) {
            recepcion.Paciente.Historial_Medico.Radiografia.forEach(radio => {
            if (radio.createdAt) {
                const fecha = new Date(radio.createdAt);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                // Se agrega la propiedad fecha_formateada al objeto radio
                radio.fecha_formateada = `${dia}/${mes}/${anio}`;
            }
            });
        }
        
        
        
        const radiografias = recepcion.Paciente.Historial_Medico.Radiografia;
        res.status(200).render('doctor/historiales/radiografias', { usuario, cargo, recepcion, radiografias });
    } catch (error) {
        console.error('Error al obtener historial de radiografías:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de radiografías', error });
    }
}

async function realizarEcografia(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }


        let direccion;
        let detalle;
        const numeroAleatorio = Math.floor(Math.random() * 2) + 1; 

        const { placa } = req.body;
        switch (placa) {
                case "Abdominal":
                    if(numeroAleatorio === 1){
                        direccion = '/img/ecografia/Abdominal1.jpg';
                    }else{
                        direccion = '/img/ecografia/Abdominal2.jpg';
                    }
                    detalle = 
                        `Se evaluaron los órganos sólidos y huecos del abdomen con adecuada ventana ecográfica.
                        • Hígado: de tamaño y ecogenicidad conservados, sin lesiones focales. No se observa dilatación de vías biliares.
                        • Vesícula biliar: de forma y tamaño normal, sin litos ni engrosamiento parietal.
                        • Páncreas: parcialmente visualizado, sin alteraciones estructurales aparentes.
                        • Bazo: de tamaño normal, sin masas ni alteraciones ecotexturales.
                        • Riñones: de forma, tamaño y ecogenicidad conservados.
                        • No se visualizan cálculos ni hidronefrosis.
                        • Vejiga urinaria: bien distendida, paredes finas, contenido anecoico.

                        No se observa líquido libre en cavidad.
                        Estudio dentro de parámetros normales.`;                
                    break;
                case "Cardiaca":
                    if(numeroAleatorio === 1){
                        direccion = '/img/ecografia/Cardiaca1.jpg';
                    }else{
                        direccion = '/img/ecografia/Cardiaca2.jpg';
                    }               
                    detalle = 
                        `Se realizó ecocardiograma transtorácico en modo M y bidimensional con doppler color.
                        
                        • Ventrículo izquierdo: con motilidad global conservada. Fracción de eyección estimada en 60%, dentro de los límites normales.
                        • Aurículas: de tamaño normal.
                        • Válvulas cardíacas: sin estenosis ni insuficiencias significativas.
                        • Tricúspide y mitral con morfología conservada.
                        • Pericardio: sin derrame.
                        • Grandes vasos: sin dilataciones ni signos de patología estructural.
                        
                        Conclusión: función sistólica conservada, sin hallazgos patológicos relevantes.`
                    ;
                    break;
                case "Obstetrica":
                    direccion = '/img/ecografia/Obstetricia.jpg';
                    detalle = 
                        `Se realizó evaluación fetal por vía transabdominal:
                        
                        • Feto único, intrauterino, con biometrías acordes a edad gestacional (aproximadamente 39 semanas).
                        • Actividad cardíaca presente, con frecuencia de 145 lpm.
                        • Movimientos fetales activos y tono conservado.
                        • Placenta: inserta en cara anterior, grado I de maduración, sin signos de desprendimiento.
                        • Líquido amniótico: en cantidad normal (índice de líquido amniótico adecuado).
                        • Cérvix uterino: cerrado, longitud conservada.

                        Estudio compatible con embarazo en desarrollo normal, sin signos ecográficos de alarma al momento del examen.`
                    ;
                    break;           
            }
        
        const ecografia = await Ecografia.create({
            tipo: placa,
            informacion: detalle,
            ruta: direccion,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'Ecografia registrada exitosamente', ecografia });
    } catch (error) {
        console.error('Error al registrar ecografía:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar Ecografia', error });
    }
}

async function historialEcografia(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [Ecografia]
                }]
            }]
        });
        
         //Si el paciente tiene Ecografia les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.Ecografia){
            recepcion.Paciente.Historial_Medico.Ecografia.forEach(eco => {
                if (eco.createdAt) {
                    const fecha = new Date(eco.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    eco.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        
        
        const ecografias = recepcion.Paciente.Historial_Medico.Ecografia;

        res.status(200).render('doctor/historiales/ecografias', { usuario, cargo, recepcion, ecografias });
    } catch (error) {
        console.error('Error al obtener historial de ecografias:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de ecografias', error });
    }
}

async function realizarTomografia(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }


        let direccion;
        let detalle;
        const numeroAleatorio = Math.floor(Math.random() * 2) + 1; 

        const { placa } = req.body;
        switch (placa) {
                case "Abdominal":
                    direccion = '/img/tomografia/Abdominal.jpg';
                    if(numeroAleatorio === 1){
                        detalle = `Estudio con contraste oral y endovenoso:

                        • Hígado, vesícula, bazo, páncreas y riñones: de tamaño y forma conservados, sin lesiones focales.
                        • Grandes vasos abdominales: sin aneurismas ni trombosis.
                        • Asas intestinales: sin dilataciones ni engrosamientos parietales.
                        • Vejiga: de paredes finas, sin imágenes litiásicas.

                        Conclusión: tomografía abdominal dentro de parámetros normales.`
                    }else{
                        detalle = `Tomografía contrastada:

                        • Se observa quiste simple en riñón izquierdo de 2,5 cm, sin realce.
                        • Vesícula biliar con imagen compatible con litiasis de 1 cm, sin signos de inflamación.
                        • El resto de los órganos sólidos y huecos no presenta alteraciones.

                        Conclusión: litiasis vesicular y quiste renal simple como hallazgos incidentales.`;
                    }
                    break;
                case "Cerebral":
                    direccion = '/img/tomografia/Cerebro.jpg';
                    if(numeroAleatorio === 1){
                        detalle = `Estudio sin contraste:

                        • Parénquima cerebral: sin evidencia de lesiones ocupantes de espacio, hemorragias ni infartos recientes.
                        • Sistemas ventriculares: de morfología y tamaño normales, sin signos de hidrocefalia.
                        • Surcos corticales y cisuras: conservados para la edad.
                        • Huesos craneales: sin fracturas ni alteraciones estructurales.

                        Conclusión: estudio normal, sin hallazgos patológicos visibles.`
                    }else{
                        detalle = `Tomografía sin contraste:

                        • Leve hipodensidad periventricular compatible con cambios microangiopáticos crónicos.
                        • No se observan hemorragias ni masas.
                        • Ventrículos laterales discretamente aumentados de tamaño, compatibles con atrofia cerebral moderada.

                        Conclusión: signos de encefalopatía vascular crónica, sin hallazgos agudos.`;
                    }
                    break;
                case "Torax":
                    direccion = '/img/tomografia/Torax.jpg';
                    if(numeroAleatorio === 1){
                        detalle = `Estudio realizado con técnica helicoidal y cortes finos:

                        • Campos pulmonares: sin consolidaciones, nódulos ni lesiones focales.
                        • Árbol bronquial: permeable.
                        • Mediastino: sin adenomegalias ni masas.
                        • Pleura: sin derrame pleural.
                        • Corazón y grandes vasos: de tamaño normal.
                        
                        Conclusión: tomografía de tórax normal.`
                    }else{
                        detalle = `Tomografía con contraste:

                        • Se visualiza un engrosamiento bronquial difuso bilateral, sugestivo de proceso inflamatorio crónico.
                        • Nódulo pulmonar en lóbulo superior derecho de 6 mm, de contornos regulares, a controlar.
                        • No hay adenopatías mediastinales ni derrames pleurales.
                        
                        Conclusión: hallazgo nodular aislado a seguimiento, sin signos de enfermedad aguda.`;
                    }
                    break;           
            }
        
        const tomografia = await Tomografia.create({
            tipo: placa,
            informacion: detalle,
            ruta: direccion,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'tomografia registrada exitosamente', tomografia });
    } catch (error) {
        console.error('Error al registrar radiografía:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar tomografia', error });
    }
}

async function historialTomografia(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [Tomografia]
                }]
            }]
        });
        
         //Si el paciente tiene Tomografia les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.Tomografia){
            recepcion.Paciente.Historial_Medico.Tomografia.forEach(tomo => {
                if (tomo.createdAt) {
                    const fecha = new Date(tomo.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    tomo.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        
        const tomografias = recepcion.Paciente.Historial_Medico.Tomografia;

        res.status(200).render('doctor/historiales/tomografias', { usuario, cargo, recepcion, tomografias });
    } catch (error) {
        console.error('Error al obtener historial de tomografias:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de tomografias', error });
    }
}

async function realizarResonanciaMagnetica(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }


        let direccion;
        let detalle;
        const numeroAleatorio = Math.floor(Math.random() * 2) + 1; 

        const { placa } = req.body;
        switch (placa) {
                case "Columna":
                    
                    if(numeroAleatorio === 1){
                        direccion = '/img/resonancia/Columna1.jpg';
                        detalle=`Estudio de columna :

                        • Columna lumbar sin hernias
                        • Estudio realizado sobre columna lumbar, cortes sagitales y axiales.
                        • Alineación vertebral conservada, sin signos de listesis.
                        • Altura y señal de los cuerpos vertebrales normales.
                        • Discos intervertebrales sin protrusiones ni hernias.
                        • Canal medular de calibre habitual, sin compresión radicular.
                        • No se observan lesiones óseas ni compromiso medular.

                        Conclusión: Resonancia lumbar sin alteraciones significativas. Estudio normal.`;
                    }else{
                        direccion = '/img/resonancia/Columna2.jpg';
                        detalle=`Estudio de columna lumbosacra:

                        • Deshidratación y disminución de altura del disco L4-L5, con leve protrusión discal posterior que contacta la raíz L5 sin desplazamiento.
                        • Cambios degenerativos incipientes en platillos vertebrales adyacentes.
                        • El resto de los discos y estructuras vertebrales no presentan alteraciones significativas.
                        • Canal espinal sin estenosis severa.

                        Conclusión: Cambios degenerativos leves a moderados en L4-L5, sin compresión significativa del canal ni raíces.`;
                    }                
                    break;
                case "Cerebral":
                    if(numeroAleatorio === 1){
                        direccion = '/img/resonancia/Cerebro1.jpg';
                        detalle=` Estudio cerebral sin contraste:

                        • Sin hallazgos patológicos
                        • Estudio realizado en cortes axiales, coronales y sagitales, con secuencias T1, T2 y FLAIR.
                        • El parénquima encefálico presenta señal y morfología conservadas, sin lesiones focales.
                        • No se observan áreas de restricción en difusión ni realce anormal con contraste.
                        • Los ventrículos laterales y estructuras de la línea media se encuentran centrados.
                        • Surcos corticales, cisternas y espacio subaracnoideo dentro de lo esperado para la edad.
                        • No se identifican malformaciones, masas ni colecciones.

                        Conclusión: Estudio dentro de parámetros normales. Sin evidencia de patología intracraneal activa.`;
                    }else{
                        direccion = '/img/resonancia/Cerebro2.jpg';
                        detalle=`Resonancia magnética realizada con contraste endovenoso:

                        • Se observan pequeñas lesiones hiperintensas en sustancia blanca periventricular, inespecíficas, compatibles con cambios microangiopáticos crónicos.
                        • Las estructuras subyacentes y ganglios basales muestran morfología conservada.
                        • No hay desplazamientos de la línea media ni signos de hipertensión endocraneana.
                        • Senos venosos permeables.
                        • No se observa captación patológica de contraste.

                        Conclusión: Cambios crónicos vasculares leves. Sin lesiones agudas.`;
                    } 
                    break;                    
            }
        
        const resonanciaMagnetica = await ResonanciaMagnetica.create({
            tipo: placa,
            informacion: detalle,
            ruta: direccion,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'ResonanciaMagnetica registrada exitosamente', resonanciaMagnetica });
    } catch (error) {
        console.error('Error al registrar ResonanciaMagnetica:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar ResonanciaMagnetica', error });
    }
}

async function historialResonanciaMagnetica(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [ResonanciaMagnetica]
                }]
            }]
        });
        
         //Si el paciente tiene ResonanciaMagnetica les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.ResonanciaMagneticas){
            recepcion.Paciente.Historial_Medico.ResonanciaMagneticas.forEach(tomo => {
                if (tomo.createdAt) {
                    const fecha = new Date(tomo.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    tomo.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        
        const resonanciaMagneticas = recepcion.Paciente.Historial_Medico.ResonanciaMagneticas;

        res.status(200).render('doctor/historiales/resonanciaMagneticas', { usuario, cargo, recepcion, resonanciaMagneticas });
    } catch (error) {
        console.error('Error al obtener historial de Resonancias Magneticas:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de Resonancias Magneticas', error });
    }
}

async function realizarAnalisisSangre(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }


        
        let detalle;         
        const { placa } = req.body;
        switch (placa) {
                case "Hemograma":                    
                        detalle=`Se observa un recuento de glóbulos rojos dentro de los valores normales, con una hemoglobina adecuada para el sexo y la edad del paciente. El hematocrito presenta una proporción esperada, sin signos de anemia o hemoconcentración. Los leucocitos están dentro del rango fisiológico, sin desviaciones sugestivas de infección aguda o crónica. El recuento de plaquetas se encuentra normal, sin signos de trombocitopenia ni trombocitosis. No se evidencian alteraciones morfológicas en las células de la serie roja, blanca o plaquetaria.`;                               
                    break;
                case "Glucosa":                                 
                        detalle=`La glucemia en ayunas se encuentra dentro de parámetros normales, lo cual indica un adecuado control metabólico de la glucosa. No se evidencian valores compatibles con hipoglucemia ni hiperglucemia. Este resultado sugiere una función pancreática preservada, sin evidencia de alteraciones compatibles con diabetes mellitus o resistencia a la insulina en este momento.`;                
                    break;
                case "Trigliceridos":
                    detalle=`Los triglicéridos se encuentran dentro de límites normales, lo que sugiere un adecuado metabolismo lipídico. No se observa hipertrigliceridemia, y se descartan estados de riesgo metabólico inmediato. Este resultado es compatible con un buen control dietético y ausencia de síndrome metabólico activo.`;
                    break;
                case "Colesterol":
                    detalle=`El nivel de colesterol total está ligeramente elevado, lo que podría indicar un mayor riesgo cardiovascular si se asocia a otros factores como hipertensión o antecedentes familiares. Se recomienda complementar con perfil lipídico fraccionado (HDL, LDL) para una evaluación más precisa del riesgo aterogénico. No obstante, en ausencia de síntomas o antecedentes clínicos relevantes, podría tratarse de una variación fisiológica o dietaria. `;
                    break;
                case "Creatinina":
                    detalle=`El valor de creatinina sérica está en rango normal, lo que sugiere una función renal conservada. No se observan signos bioquímicos de insuficiencia renal aguda ni crónica. La tasa de filtración glomerular estimada (TFGe), calculada a partir de este valor, se encuentra dentro de los valores esperados para la edad del paciente.`;
                    break;
                case "Urea":
                    detalle=`Los niveles de urea en sangre se hallan dentro de los valores normales. Esto indica una excreción nitrogenada eficaz y una función hepatorrenal sin alteraciones aparentes. La relación urea/creatinina no presenta desviaciones significativas, descartando procesos de deshidratación o catabolismo excesivo.`;
                    break;
                case "Acido Urico":
                    detalle=`El ácido úrico plasmático se encuentra dentro del intervalo de referencia. No se detecta hiperuricemia, lo cual reduce el riesgo de gota o nefrolitiasis asociada a cristales de urato. Este resultado sugiere un equilibrio adecuado entre la producción y excreción de purinas.`;
                    break;
            }
        
        const analisisSangre = await AnalisisSangre.create({
            tipo: placa,
            informacion: detalle,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'Analisis de Sangre registrado exitosamente', analisisSangre });
    } catch (error) {
        console.error('Error al registrar el Analisis de Sangre:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar el Analisis de Sangre', error });
    }
}

async function historialAnalisisSangre(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [AnalisisSangre]
                }]
            }]
        });
        
         //Si el paciente tiene AnalisisSangre les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.AnalisisSangres){
            recepcion.Paciente.Historial_Medico.AnalisisSangres.forEach(tomo => {
                if (tomo.createdAt) {
                    const fecha = new Date(tomo.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    tomo.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        
        const analisisSangres = recepcion.Paciente.Historial_Medico.AnalisisSangres;

        res.status(200).render('doctor/historiales/analisisSangre', { usuario, cargo, recepcion, analisisSangres });
    } catch (error) {
        console.error('Error al obtener historial de Analisis de Sangre:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de Analisis de Sangre', error });
    }
}

async function realizarAnalisisOrina(req, res) {
    try {

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,                    
                }]
            }]
        });
        if (!recepcion) {
            res.status(400).json({ ok: false, error: 'Recepcion no encontrada' });
        }       
        let detalle;         
        const { placa } = req.body;
        switch (placa) {
                case "Orina Completa":                    
                        detalle=` Examen Físico-Químico de Orina (Orina Completa)
                        La muestra presenta un color amarillo claro, aspecto límpido y reacción ligeramente ácida (pH 6). La densidad urinaria es adecuada (1.020), lo que indica una correcta capacidad de concentración renal.
                        En cuanto a los parámetros químicos:
                        Glucosa: Ausente
                        Proteínas: Ausente
                        Nitritos: Negativos
                        Urobilinógeno y Bilirrubina: No detectados
                        Cetonas: Ausentes
                        Hemoglobina: Negativa
                        Estos resultados sugieren una orina sin alteraciones evidentes, con parámetros dentro de los límites fisiológicos.`;                               
                    break;
                case "Sedimento Urinario":                                 
                        detalle=`El análisis microscópico del sedimento urinario muestra:
                        Leucocitos: 1-2 por campo (dentro de lo normal)
                        Eritrocitos: 0-1 por campo (sin hematuria)
                        Células epiteliales: escasas, tipo escamosas (hallazgo fisiológico)
                        Cristales: oxalato de calcio en escasa cantidad (sin significancia patológica)
                        Cilindros: ausentes
                        Bacterias: no se observan
                        Este sedimento urinario no presenta alteraciones significativas. No hay indicios de infección urinaria ni de daño tubular.`;                
                    break;
                case "Urocultivo":
                    detalle=`Prueba de Orina de 24 Horas (Recolección Completa)
                    El volumen total recolectado fue de 1600 ml, dentro del rango esperado para una diuresis normal.
                    Se cuantificó:
                    Clearance de creatinina: dentro de valores normales, lo cual indica una función renal adecuada
                    Proteinuria en 24 hs: no detectable, descartando proteinuria persistente o nefropatía
                    Sodio y potasio urinario: en valores adecuados, con buena excreción renal de electrolitos
                    Este análisis permite evaluar la función renal de forma más integral y los resultados indican un funcionamiento renal eficiente sin signos de patología oculta.`;
                    break;                
            }
        
        const analisisOrina = await AnalisisOrina.create({
            tipo: placa,
            informacion: detalle,
            id_historial_medico: recepcion.Paciente.Historial_Medico.id
        });

        res.status(201).json({ ok: true, mensaje: 'Analisis de Orina registrada exitosamente', analisisOrina });
    } catch (error) {
        console.error('Error al registrar el Analisis de Orina:', error);
        res.status(500).json({ ok: false ,mensaje: 'Error al registrar el Analisis de Orina', error });
    }
}

async function historialAnalisisOrina(req, res){
    try {
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        const recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [AnalisisOrina]
                }]
            }]
        });
        
         //Si el paciente tiene Analisis de Orina les formateo la fecha 
        if(recepcion.Paciente.Historial_Medico.AnalisisOrinas){
            recepcion.Paciente.Historial_Medico.AnalisisOrinas.forEach(tomo => {
                if (tomo.createdAt) {
                    const fecha = new Date(tomo.createdAt);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    tomo.fecha_formateada = `${dia}/${mes}/${anio}`;
                }
            });
        } 
        
        
        const analisisOrinas = recepcion.Paciente.Historial_Medico.AnalisisOrinas;

        res.status(200).render('doctor/historiales/analisisOrina', { usuario, cargo, recepcion, analisisOrinas });
    } catch (error) {
        console.error('Error al obtener historial de Analisis de Orina:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de Analisis de Orina', error });
    }
}

async function vistaAltaMedica(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;

        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{model: Paciente}]
        });        

        res.status(200).render('doctor/alta', { usuario, cargo, recepcion});
    }catch (error) {
        console.error('Error en la vista de alta medica ', error);
        res.status(500).render('error', { mensaje: 'Error en la vista de la alta medica', error });
    }
}

async function cargarAltaMedica(req, res) {
    try{
        const usuario = req.session.nombreUsuario;
        const cargo = req.session.tipoUsuario;
        
        const alta = req.body.alta;
        
        // Actualiza la recepción
        await Recepcion.update(
                {
                    fecha_salida: new Date(),
                    estado: alta,        
                },
            { where: { id: req.params.id } },
        );

        // Obtener la recepción y el historial médico
        let recepcion = await Recepcion.findOne({
            where: { id: req.params.id },
            include: [{
                model: Paciente,
                include: [{
                    model: Historial_Medico,
                    include: [{ model: Sintoma }]
                }]
            },
            { 
                model: Cama,
                include: [
                    { model: Habitacion }
                ]
            }]
        });
        
        //Modificar la cama Libre
        await Cama.update(
                {
                    estado: "Libre",        
                },
            { where: { id: recepcion.Cama.id } },
        );

        let paciente = recepcion.Paciente;
        let historial = paciente.Historial_Medico;

        // Si el paciente NO tiene historial médico, créalo
        if (!historial) {
            historial = await Historial_Medico.create({
                id_paciente: paciente.id
            });            
        }

        await Sintoma.create({
            id_historial_medico: historial.id,
            sintomas: alta,
            prioridad: null
        });

        console.log(`Recepcion nº ${recepcion.id} cambiada a ${recepcion.estado}` );
        
        if (recepcion.fecha_salida) {
                    const fecha = new Date(recepcion.fecha_salida);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const anio = fecha.getFullYear();
                    recepcion.fecha_formateada = `${dia}/${mes}/${anio}`;
        }

        const cartelAlta=true;

        res.status(200).render('home', { usuario, cargo, recepcion, cartelAlta});
    }catch (error) {
        console.error('Error al cargar el alta medica ', error);
        res.status(500).render('error', { mensaje: 'Error al cargar el alta medica', error });
    }
}



module.exports = {  
  vistaEstudios,
  realizarRadiografia,
  historialRadiografia,
  realizarEcografia,
  historialEcografia,
  realizarTomografia,
  historialTomografia,
  realizarResonanciaMagnetica,
  historialResonanciaMagnetica,
  realizarAnalisisSangre,
  historialAnalisisSangre,
  realizarAnalisisOrina,
  historialAnalisisOrina,
  vistaAltaMedica,
  cargarAltaMedica
};