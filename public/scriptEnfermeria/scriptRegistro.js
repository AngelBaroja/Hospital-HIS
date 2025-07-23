function agregarContactoEmergencia() {
                var input = document.getElementById('contacto_emergencia');
                var valor = input.value.trim();
                var error = document.getElementById('error');
                if (error) error.remove();

                // Validar vacío
                if (!valor) {
                    mostrarError('Primero agregue un número de emergencia');
                    return;
                }
                // Validar 10 dígitos numéricos
                if (!/^\d{10}$/.test(valor)) {
                    mostrarError('El número de celular es incorrecto');
                    return;
                }
                // Crear nuevo input después del input principal
                var nuevoInput = document.createElement('input');
                nuevoInput.type = 'text';
                nuevoInput.name = 'contacto_emergencia';
                nuevoInput.value = valor;
                nuevoInput.className = 'input-contacto-extra';
                nuevoInput.style.marginBottom = '5px';
                input.parentNode.insertBefore(nuevoInput, input); 

                // Limpiar el input original
                input.value = '';
            }

            function quitarContactoEmergencia() {
                var error = document.getElementById('error');
                if (error) error.remove();
                // Selecciona todos los inputs de contacto extra
                var contactos = document.querySelectorAll('.input-contacto-extra');
                if (contactos.length > 0) {
                    // Elimina solo el último input (el más cercano al input editable)
                    contactos[contactos.length - 1].remove();
                } else {
                    mostrarError('No hay contactos de emergencia para quitar');
                }
            }

            function mostrarError(mensaje) {
                var input = document.getElementById('contacto_emergencia');
                var error = document.createElement('div');
                error.id = 'error';
                error.style.color = 'red';
                error.style.fontSize = '13px';
                error.textContent = mensaje;
                input.parentNode.appendChild(error);
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