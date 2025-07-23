function agregarEnfermedadPrevia() {
    const nombre = document.getElementById('nombre_enfermedad').value.trim();
    const fecha = document.getElementById('fecha_diagnostico').value;

    const mensajeExistente = document.getElementById('mensaje-error');
    if (mensajeExistente) mensajeExistente.remove();

    if (!nombre || !fecha) {
        const error = document.createElement('p');
        error.id = 'mensaje-error';
        error.style.color = 'red';
        error.textContent = 'Debe completar ambos campos.';
        const botonAgregar = document.querySelector('.boton-agregar');
        botonAgregar.parentNode.insertBefore(error, botonAgregar);
        return;
    }

    const hoy = new Date();
    const fechaDiagnostico = new Date(fecha);
    hoy.setHours(0,0,0,0);
    fechaDiagnostico.setHours(0,0,0,0);

    if (fechaDiagnostico >= hoy) {
    const error = document.createElement('p');
    error.id = 'mensaje-error';
    error.style.color = 'red';
    error.textContent = 'La fecha debe ser anterior a hoy.';
    const botonAgregar = document.querySelector('.boton-agregar');
    botonAgregar.parentNode.insertBefore(error, botonAgregar);
    return;
    }

    const contenedor = document.getElementById('enfermedades-cargadas');
    const bloque = document.createElement('div');
    bloque.className = 'bloque-historial entrando';
    bloque.innerHTML = `
    <div class="formulario-grid">
        <div class="grupo-formulario">
            <label>Nombre de la Enfermedad:</label>
            <input type="text" name="nombre_enfermedad" value="${nombre}" readonly>
        </div>
        <div class="grupo-formulario">
            <label>Fecha Diagnóstico:</label>
            <input type="date" name="fecha_diagnostico" value="${fecha}" readonly">
        </div>
        <div class="grupo-formulario"></div>
        <div class="grupo-formulario" id="quitar">
            <button type="button" class="boton-quitar" onclick="quitarEnfermedad(this)">Quitar</button>
        </div>
    </div>
    `;
    contenedor.prepend(bloque);
    setTimeout(() => bloque.classList.remove('entrando'), 700);

    // limpiar
    document.getElementById('nombre_enfermedad').value = '';
    document.getElementById('fecha_diagnostico').value = '';
}

function quitarEnfermedad(btn) {
    const bloque = btn.closest('.bloque-historial');
    bloque.classList.add('saliendo');
    bloque.addEventListener('animationend', function () {
    bloque.remove();
    });
}

document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('modalExito');
            if (modal) {
                modal.classList.add('visible');
                
                document.querySelector('.btn-cerrar-modal').addEventListener('click', () => {
                    modal.style.display = 'none';
                });
                
                // Cerrar al hacer clic fuera del contenido
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }
        });