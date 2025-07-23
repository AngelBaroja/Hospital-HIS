function agregarAlergia() {
                var sustancia = document.getElementById('alergia-nueva').value.trim();
                var reaccion = document.getElementById('reaccion-nueva').value.trim();
                var severidad = document.getElementById('severidad-nueva').value;

                var mensajeError = document.getElementById('mensaje-error');
                if (mensajeError) mensajeError.remove();

                if (!sustancia || !reaccion || !severidad) {
                    var error = document.createElement('p');
                    error.id = 'mensaje-error';
                    error.style.color = 'red';
                    error.textContent = 'Debe completar todos los campos para agregar una alergia.';
                    var botonAgregar = document.querySelector('.boton-agregar');
                    botonAgregar.parentNode.insertBefore(error, botonAgregar);
                    return;
                }

                var contenedor = document.getElementById('alergias-cargadas');

                const bloque = document.createElement('div');
                bloque.className = 'bloque-historial entrando';
                bloque.innerHTML = `
                    <div class="formulario-grid">
                        <div class="grupo-formulario">
                            <label>Alergia:</label>
                            <input type="text" name="sustancia" value="${sustancia}" readonly>
                        </div>
                        <div class="grupo-formulario">
                            <label>Reacción:</label>
                            <input type="text" name="reaccion" value="${reaccion}" readonly>
                        </div>
                        <div class="grupo-formulario">
                            <label>Severidad:</label>
                            <input type="text" name="severidad" value="${severidad}" readonly>
                        </div>
                        <div class="grupo-formulario" id="quitar">
                            <button type="button" class="boton-quitar" onclick="quitarAlergia(this)">Quitar</button>
                        </div>
                    </div>
                `;
                contenedor.prepend(bloque);
                // Quita la clase 'entrando' después de la animación para que no interfiera con futuras animaciones
                setTimeout(() => bloque.classList.remove('entrando'), 700);
                // Limpiar los campos
                document.getElementById('alergia-nueva').value = '';
                document.getElementById('reaccion-nueva').value = '';
                document.getElementById('severidad-nueva').value = '';
            }

            function quitarAlergia(btn) {
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