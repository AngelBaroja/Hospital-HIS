// Función para cambiar entre pestañas
function cambiarPestana(url) {
       // Redireccionar a la página correspondiente
    window.location.href = url;
}
// Datos simulados de habitaciones
const habitaciones = [
    { numero: "101", ala: "Ala Norte", tipo: "Compartida", genero: "Masculino", estado: "Disponible" },
    { numero: "102", ala: "Ala Norte", tipo: "Compartida", genero: "Masculino", estado: "Disponible" },
    { numero: "103", ala: "Ala Norte", tipo: "Compartida", genero: "Masculino", estado: "Disponible" },
    { numero: "201", ala: "Ala Este", tipo: "Individual", genero: "Masculino", estado: "Disponible" },
    { numero: "202", ala: "Ala Este", tipo: "Compartida", genero: "Femenino", estado: "Disponible" },
    { numero: "203", ala: "Ala Este", tipo: "Individual", genero: "Femenino", estado: "Ocupada" },
    { numero: "301", ala: "Ala Oeste", tipo: "Individual", genero: "Masculino", estado: "Disponible" },
    { numero: "302", ala: "Ala Oeste", tipo: "Compartida", genero: "Femenino", estado: "Disponible" },
    { numero: "401", ala: "Ala Sur", tipo: "Compartida", genero: "Masculino", estado: "Disponible" },
    { numero: "402", ala: "Ala Sur", tipo: "Compartida", genero: "Masculino", estado: "Disponible" },
    { numero: "403", ala: "Ala Sur", tipo: "Compartida", genero: "Masculino", estado: "Disponible" }
];

let habitacionSeleccionada = null;

// Cargar habitaciones disponibles
function cargarHabitaciones(filtro = 'Todas') {
    const contenedor = document.getElementById('contenedor-habitaciones');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    const habitacionesFiltradas = habitaciones.filter(habitacion => {
        if (filtro === 'Todas') return habitacion.estado === "Disponible";
        if (filtro === 'Ala Norte') return habitacion.ala === "Ala Norte" && habitacion.estado === "Disponible";
        if (filtro === 'Ala Sur') return habitacion.ala === "Ala Sur" && habitacion.estado === "Disponible";
        if (filtro === 'Ala Este') return habitacion.ala === "Ala Este" && habitacion.estado === "Disponible";
        if (filtro === 'Ala Oeste') return habitacion.ala === "Ala Oeste" && habitacion.estado === "Disponible";
        if (filtro === 'Individual') return habitacion.tipo === "Individual" && habitacion.estado === "Disponible";
        if (filtro === 'Compartida') return habitacion.tipo === "Compartida" && habitacion.estado === "Disponible";
        return habitacion.estado === "Disponible";
    });
    
    if (habitacionesFiltradas.length === 0) {
        contenedor.innerHTML = '<p>No hay habitaciones disponibles con los filtros seleccionados.</p>';
        return;
    }
    
    habitacionesFiltradas.forEach(habitacion => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-habitacion';
        tarjeta.innerHTML = `
            <div class="numero-habitacion">Habitación ${habitacion.numero}</div>
            <div class="info-habitacion">
                <p><strong>Ala:</strong> ${habitacion.ala}</p>
                <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
                <p><strong>Género:</strong> ${habitacion.genero}</p>
                <p><strong>Estado:</strong> ${habitacion.estado}</p>
            </div>
        `;
        
        tarjeta.addEventListener('click', () => {
            document.querySelectorAll('.tarjeta-habitacion').forEach(card => {
                card.classList.remove('seleccionada');
            });
            
            tarjeta.classList.add('seleccionada');
            habitacionSeleccionada = habitacion.numero;
        });
        
        contenedor.appendChild(tarjeta);
    });
}

// Filtrar habitaciones
function filtrarHabitaciones() {
    const filtro = document.getElementById('filtro-habitaciones').value;
    cargarHabitaciones(filtro);
}

// Finalizar admisión
function completarAdmision() {
    if (!habitacionSeleccionada) {
        alert('Por favor seleccione una habitación');
        return;
    }
    
    // Aquí iría la lógica para enviar todos los datos al servidor
    const datosPaciente = {
        // Recopilar datos de todos los formularios
        habitacion: habitacionSeleccionada
    };
    
    console.log('Datos del paciente:', datosPaciente);
    alert(`Admisión completada. Habitación asignada: ${habitacionSeleccionada}`);
    
    // Redirección o reset del formulario
    // window.location.href = 'dashboard.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Cargar habitaciones si estamos en la página de asignación
    if (window.location.pathname.includes('asignacion.pug')) {
        cargarHabitaciones();
    }
});