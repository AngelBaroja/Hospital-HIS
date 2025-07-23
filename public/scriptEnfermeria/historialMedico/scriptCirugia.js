function agregarCirugia() {
    const nombre = document.getElementById('nombre_cirugia').value.trim();
    const fecha = document.getElementById('fecha_cirugia').value;
    const detalle = document.getElementById('detalle_motivo').value.trim();

    const errorExistente = document.getElementById('mensaje-error');
    if (errorExistente) {
        errorExistente.remove();
    }

    if (!nombre || !fecha ) {
        const error = document.createElement('p');
        error.id = 'mensaje-error';
        error.style.color = 'red';
        error.textContent = 'Debe completar todos los campos nombre y fecha.';
        const botonAgregar = document.querySelector('.boton-agregar');
        botonAgregar.parentNode.insertBefore(error, botonAgregar);
        return;
    }else{
        const hoy = new Date();
        const fechaCirugia = new Date(fecha);
        hoy.setHours(0,0,0,0);
        fechaCirugia.setHours(0,0,0,0);
        
        if (fechaCirugia >= hoy){
            const error = document.createElement('p');
            error.id = 'mensaje-error';
            error.style.color = 'red';
            error.textContent = 'La fecha debe ser anterior a hoy.';
            const botonAgregar = document.querySelector('.boton-agregar');
            botonAgregar.parentNode.insertBefore(error, botonAgregar);
            return;
        }
    }                

    const contenedor = document.getElementById('cirugias-cargadas');
    const bloque = document.createElement('div');
    bloque.className = 'bloque-historial entrando';
    bloque.innerHTML = `
        <div class="formulario-grid">
            <div class="grupo-formulario">
                <label>Nombre de la Cirugia:</label>
                <input type="text" name="nombre_cirugia" value="${nombre}" readonly>
            </div>
            <div class="grupo-formulario">
                <label>Fecha de la Cirugia:</label>
                <input type="date" name="fecha_cirugia" value="${fecha}" readonly>
            </div>
            <div class="grupo-formulario">
                <label>Detalle de la Internación:</label>
                <textarea rows="3" name="detalle_motivo" readonly>${detalle}</textarea>
            </div>
            <div class="grupo-formulario" id="quitar">
                <button type="button" class="boton-quitar" onclick="quitarCirugia(this)">Quitar</button>
            </div>
        </div>
    `;
    contenedor.prepend(bloque);
    setTimeout(() => bloque.classList.remove('entrando'), 700);

    document.getElementById('nombre_cirugia').value = '';
    document.getElementById('fecha_cirugia').value = '';
    document.getElementById('detalle_motivo').value = '';
}

function quitarCirugia(btn) {
    const bloque = btn.closest('.bloque-historial');
    bloque.classList.add('saliendo');
    bloque.addEventListener('animationend', function() {
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