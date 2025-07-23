function agregarAntecedenteFamiliar() {
    const enfermedad = document.getElementById('enfermedad_familiar').value.trim();
    const parentesco = document.getElementById('parentesco').value;

    var mensajeError = document.getElementById('mensaje-error');
    if (mensajeError) mensajeError.remove();

    if (!enfermedad || !parentesco) {                    
        var error = document.createElement('p');
        error.id = 'mensaje-error';
        error.style.color = 'red';
        error.textContent = 'Debe completar ambos campos.';
        var botonAgregar = document.querySelector('.boton-agregar');
        botonAgregar.parentNode.insertBefore(error, botonAgregar);
        return;
    }

    const contenedor = document.getElementById('antecedentes-cargados');
    const bloque = document.createElement('div');
    bloque.className = 'bloque-historial entrando';
    bloque.innerHTML = `
        <div class="formulario-grid">
            <div class="grupo-formulario">
                <label>Enfermedad Familiar:</label>
                <input type="text" name="enfermedad_familiar" value="${enfermedad}" readonly>
            </div>
            <div class="grupo-formulario">
                <label>Parentesco:</label>
                <input type="text" name="parentesco" value="${parentesco}" readonly>
            </div>
            <div class="grupo-formulario">
            </div>
            <div class="grupo-formulario" id="quitar">
                <button type="button" class="boton-quitar" onclick="quitarAntecedenteFamiliar(this)">Quitar</button>
            </div>
        </div>
    `;
    contenedor.prepend(bloque);
    // Quita la clase 'entrando' después de la animación para que no interfiera con futuras animaciones
    setTimeout(() => bloque.classList.remove('entrando'), 700);
    // limpiar campos
    document.getElementById('enfermedad_familiar').value = '';
    document.getElementById('parentesco').value = '';
}

function quitarAntecedenteFamiliar(btn) {
    const bloque = btn.closest('.bloque-historial');
    bloque.classList.add('saliendo');
    bloque.addEventListener('animationend', function() {
        bloque.remove();
    });
}

function familiaresOptions(selected) {
    return familiares.map(f => 
        `<option value="${f}" ${f === selected ? 'selected' : ''}>${f}</option>`
    ).join('');
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