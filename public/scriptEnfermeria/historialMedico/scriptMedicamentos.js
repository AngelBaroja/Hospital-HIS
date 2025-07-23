function agregarMedicamento() {
    const nombre = document.getElementById('nombre_medicamento').value.trim();
    const dosis = document.getElementById('dosis').value.trim();
    const frecuencia = document.getElementById('frecuencia').value.trim();

    const mensajeExistente = document.getElementById('mensaje-error');
    if (mensajeExistente) mensajeExistente.remove();

    if (!nombre || !dosis || !frecuencia) {
    const error = document.createElement('p');
    error.id = 'mensaje-error';
    error.style.color = 'red';
    error.textContent = 'Debe completar todos los campos.';
    const botonAgregar = document.querySelector('.boton-agregar');
    botonAgregar.parentNode.insertBefore(error, botonAgregar);
    return;
    }
    
    if (isNaN(dosis)) {
        const error = document.createElement('p');
        error.id = 'mensaje-error';
        error.style.color = 'red';
        error.textContent = 'La dosis debe ser un número.';
        const botonAgregar = document.querySelector('.boton-agregar');
        botonAgregar.parentNode.insertBefore(error, botonAgregar);
        return;
    }

    const contenedor = document.getElementById('medicamentos-cargados');
    const bloque = document.createElement('div');
    bloque.className = 'bloque-historial entrando';
    bloque.innerHTML = `
    <div class="formulario-grid">
        <div class="grupo-formulario">
        <label>Medicamento:</label>
        <input type="text" name="nombre_medicamento" value="${nombre}" readonly>
        </div>
        <div class="grupo-formulario">
        <label>Dosis:</label>
        <input type="text" name="dosis" value="${dosis}" readonly>
        </div>
        <div class="grupo-formulario">
        <label>Frecuencia de Consumo:</label>
        <input type="text" name="frecuencia" value="${frecuencia}" readonly>
        </div>
        <div class="grupo-formulario" id="quitar">
        <button type="button" class="boton-quitar" onclick="quitarMedicamento(this)">Quitar</button>
        </div>
    </div>
    `;
    contenedor.prepend(bloque);
    setTimeout(() => bloque.classList.remove('entrando'), 700);

    // limpiar
    document.getElementById('nombre_medicamento').value = '';
    document.getElementById('dosis').value = '';
    document.getElementById('frecuencia').value = '';
}

function quitarMedicamento(btn) {
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