function abrirModalAlerta() {
    document.getElementById('modalAlerta').style.display = 'flex';
    document.getElementById('motivo-alerta').value = '';
}
function cerrarModalAlerta() {
    document.getElementById('modalAlerta').style.display = 'none';
}

function agregarMedicamento() {
    const nombre = document.getElementById('nombre_medicamento').value.trim();
    const dosis = document.getElementById('dosis').value.trim();
    const frecuencia = document.getElementById('frecuencia').value.trim();
    const tratamiento = document.getElementById('plan_tratamiento').value.trim();

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
    <p id="textoMedicamentos">Medicamento: ${nombre} / Dosis: ${dosis}Mg / Frecuencia de Consumo: ${frecuencia}</p>
    <input type="hidden" name="nombre_medicamento" value="${nombre}">
    <input type="hidden" name="dosis" value="${dosis}">
    <input type="hidden" name="frecuencia" value="${frecuencia}">
    <div class="grupo-formulario" id="quitar2">
    <button type="button" class="boton-quitar" onclick="quitarMedicamento(this)">Quitar</button>
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

document.getElementById('formulario-tratamiento-total').addEventListener('submit', function(e) {
        const plan = document.getElementById('plan_tratamiento');
        const detalle = document.getElementById('detalle_tratamiento');
        let error = document.getElementById('error-detalle-tratamiento');
        if (error) error.remove();

        if (plan && plan.value === 'Otro' && detalle && detalle.value.trim() === '') {
            e.preventDefault();
            detalle.classList.add('input-error');
            error = document.createElement('span');
            error.id = 'error-detalle-tratamiento';
            error.style.color = 'red';
            error.style.fontSize = '0.95em';
            error.textContent = 'Debe detallar el tratamiento si selecciona "Otro".';
            detalle.parentNode.appendChild(error);
            detalle.focus();
        } else if (detalle) {
            detalle.classList.remove('input-error');
        }
    });

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
