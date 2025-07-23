document.addEventListener('DOMContentLoaded', async () => {
    try {
        const paciente = JSON.parse(document.querySelector('input[name="paciente"]').value);
        const generoPaciente = paciente.genero;
        
        const habitacionesData = JSON.parse(document.querySelector('#habitaciones-data').textContent);
        const recepcionesData = JSON.parse(document.querySelector('#recepciones-data').textContent);
        
        // Procesar recepciones para fácil acceso
        const recepcionesActivas = recepcionesData.filter(r => r.fecha_salida === null);
        const camasOcupadas = new Map();
        
        recepcionesActivas.forEach(recepcion => {
            if (recepcion.Paciente && recepcion.id_cama) {
                camasOcupadas.set(recepcion.id_cama, {
                    genero: recepcion.Paciente.genero,
                    habitacionId: recepcion.Cama?.id_habitacion
                });
            }
        });

        // Almacenar datos globalmente
        window.datosHospital = {
            habitaciones: habitacionesData,
            camasOcupadas,
            generoPaciente
        };
        
        document.getElementById('filtro-habitaciones').addEventListener('change', () => {
            const filtro = document.getElementById('filtro-habitaciones').value;
            filtrarHabitaciones(filtro);
        });
        
        filtrarHabitaciones('Todas');
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los datos. Intente nuevamente.');
    }
});

// Función mejorada para filtrar por género
function filtrarHabitaciones(filtro) {
    const { habitaciones, camasOcupadas, generoPaciente } = window.datosHospital;
    const contenedor = document.getElementById('contenedor-habitaciones');
    contenedor.innerHTML = '';
    
    const habitacionesFiltradas = habitaciones.filter(habitacion => {
        // Aplicar filtros básicos
        if (filtro === 'Individual' && habitacion.tipo !== 'Individual') return false;
        if (filtro === 'Compartida' && habitacion.tipo !== 'Compartida') return false;
        if (filtro.includes('Ala') && habitacion.Ala?.sector !== filtro.split(' ')[1]) return false;
        
        return true;
    });
    
    mostrarCamasDisponibles(habitacionesFiltradas, camasOcupadas, generoPaciente);
}

// Función mejorada para mostrar camas
function mostrarCamasDisponibles(habitaciones, camasOcupadas, generoPaciente) {
    const contenedor = document.getElementById('contenedor-habitaciones');
    
    habitaciones.forEach(habitacion => {
        habitacion.Camas?.forEach(cama => {
            // Verificar disponibilidad básica
            if (cama.estado !== 'Libre') return;
            
            // Verificar si está ocupada según recepciones
            if (camasOcupadas.has(cama.id)) return;
            
            // Para habitaciones compartidas, verificar género
            if (habitacion.tipo === 'Compartida') {
                const otrasCamas = habitacion.Camas.filter(c => c.id !== cama.id);
                const camasOcupadasEnHabitacion = otrasCamas.filter(c => camasOcupadas.has(c.id));
                
                if (camasOcupadasEnHabitacion.length > 0) {
                    const generoOcupante = camasOcupadas.get(camasOcupadasEnHabitacion[0].id).genero;
                    if (generoPaciente !== 'No Especificado' && generoOcupante !== generoPaciente) {
                        return; // No mostrar si géneros no coinciden
                    }
                }
            }
            
            crearTarjetaCama(habitacion, cama);
        });
    });
    
    if (contenedor.innerHTML === '') {
        contenedor.innerHTML = '<p>No hay camas disponibles con los filtros seleccionados.</p>';
    }
}

function crearTarjetaCama(habitacion, cama) {
    const contenedor = document.getElementById('contenedor-habitaciones');
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-habitacion';
    tarjeta.dataset.habitacionId = habitacion.id;
    tarjeta.dataset.camaId = cama.id;
    
    // Información de la habitación y cama
    const alaInfo = habitacion.Ala ? `Ala: ${habitacion.Ala.sector}` : '';
    const extras = [
        cama.electrica ? 'Eléctrica' : '',
        cama.oxigeno ? 'Oxígeno' : ''
    ].filter(Boolean).join(' | ');
    
    tarjeta.innerHTML = `       
        <div class="numero-habitacion">Habitación ${habitacion.id}</div>
        <div class="numero-cama">Cama ${cama.numero}</div>        
        <div class="info-habitacion">
            <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
            <p><strong>${alaInfo}</strong></p>
            <p><strong>Cama:</strong> ${cama.tipo}</p>
            <p class="extras"><small>${extras}</small></p>
        </div>
    `;
    
    // Manejar selección
    tarjeta.addEventListener('click', () => {
        document.querySelectorAll('.tarjeta-habitacion').forEach(t => {
            t.classList.remove('seleccionada');
        });
        tarjeta.classList.add('seleccionada');
        actualizarSeleccion(habitacion.id, cama.id);
    });
    
    contenedor.appendChild(tarjeta);
}

function actualizarSeleccion(habitacionId, camaId) {
    const form = document.querySelector('#formulario-recepcion');
    
    // Eliminar selecciones anteriores
    const inputsPrevios = form.querySelectorAll('input[name="idHabitacion"], input[name="idCama"]');
    inputsPrevios.forEach(input => input.remove());
    
    // Agregar nuevos campos ocultos
    const inputHabitacion = document.createElement('input');
    inputHabitacion.type = 'hidden';
    inputHabitacion.name = 'idHabitacion';
    inputHabitacion.value = habitacionId;
    form.appendChild(inputHabitacion);
    
    const inputCama = document.createElement('input');
    inputCama.type = 'hidden';
    inputCama.name = 'idCama';
    inputCama.value = camaId;
    form.appendChild(inputCama);
}

// Validación del formulario
document.querySelector('#formulario-recepcion').addEventListener('submit', function(e) {
    const camaSeleccionada = document.querySelector('.tarjeta-habitacion.seleccionada');
    
    if (!camaSeleccionada) {
        e.preventDefault();
        alert('Por favor seleccione una cama para asignar al paciente.');
    }
});