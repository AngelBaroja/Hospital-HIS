document.addEventListener('DOMContentLoaded', () => {
    // Obtener datos de las listas renderizadas
    const pacientesData = JSON.parse(document.querySelector('#pacientes-data').textContent);
    const mutualPacientesData = JSON.parse(document.querySelector('#mutual-pacientes-data').textContent);
    const mutualesData = JSON.parse(document.querySelector('#mutuales-data').textContent);
    const contactosEmergenciaData = JSON.parse(document.querySelector('#contactos-emergencia-data').textContent);

    // Almacenar en variables globales para acceso rápido
    window.datosApp = {
        pacientes: pacientesData,
        mutualPacientes: mutualPacientesData,
        mutuales: mutualesData,
        contactosEmergencia: contactosEmergenciaData
    };

    // Configurar evento del botón buscar
    document.querySelector('button[onclick="buscarPaciente()"]').addEventListener('click', buscarPaciente);
});

function buscarPaciente() {     
      
    // Limpiar mensajes anteriores
    document.querySelectorAll('.mensaje-error').forEach(el => {            
        el.textContent = '';
        el.classList.remove('visible');
    });   

    const dni = document.querySelector('#dni').value.trim();
    const dniError = document.querySelector('#dni-error');
    const pacienteError = document.querySelector('#paciente-no-encontrado-error');

    // Validar DNI
    if (!dni || dni.length !== 8) { 
        limpiarCampos();
        dniError.textContent = 'Por favor ingrese un DNI válido de 8 caracteres';
        dniError.classList.add('visible');
        document.querySelector('#dni').classList.add('input-error');
        return;
    }
    // Buscar paciente
    const paciente = window.datosApp.pacientes.find(p => p.dni === dni);
    
    if (!paciente) {
        limpiarCampos();
        pacienteError.textContent = 'Paciente no encontrado. Complete los datos manualmente.';
        pacienteError.classList.add('visible');
        document.querySelector('#dni').classList.add('input-error');
        return;
    }

    // Buscar mutual del paciente si existe
    let mutualPaciente = null;
    let mutual = null;
    
    mutualPaciente = window.datosApp.mutualPacientes.find(mp => mp.id_paciente === paciente.id);
    if (mutualPaciente) {
        mutual = window.datosApp.mutuales.find(m => m.id === mutualPaciente.id_mutual);
    }

    // Buscar contactos de emergencia del paciente
    const contactosEmergencia = window.datosApp.contactosEmergencia.filter(ce => ce.id_paciente === paciente.id);
    
    // Llenar formulario
    llenarFormulario(paciente, mutualPaciente, mutual, contactosEmergencia);
}

function limpiarCampos() {
    // Limpiar campos de datos personales
    document.querySelector('#nombre').value = '';
    document.querySelector('#apellido').value = '';
    document.querySelector('#fecha_nacimiento').value = '';
    document.querySelector('#genero').value = '';
    document.querySelector('#contacto_emergencia').value = '';
    document.querySelector('#direccion').value = '';
    document.querySelector('#provincia').value = '';
    document.querySelector('#localidad').value = '';
    
    // Limpiar campos de mutual
    document.querySelector('#seguro').value = '';
    document.querySelector('#codigo_mutual').value = '';
    document.querySelector('#tipo_cobertura').value = '';
    document.querySelector('#mutual_activa').value = '';
    
    // Limpiar doctor y motivo
    document.querySelector('#doctor').value = '';
    document.querySelector('#fecha_turno').value = '';
    document.querySelector('#hora').value = '';
    document.querySelector('#detalle_motivo').value = '';
    
    // Limpiar mensajes de error
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('visible');
    });
    
    // Remover clases de error de los inputs
    document.querySelectorAll('.input-error').forEach(el => {
        el.classList.remove('input-error');
    });
    
    // Opcional: llevar el foco al campo DNI
    document.querySelector('#dni').focus();
}


function llenarFormulario(paciente, mutualPaciente, mutual, contactosEmergencia) {
     console.log("____________________________");
    // Función para formatear fecha (opcional)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

   
    
    // Datos básicos del paciente
    document.querySelector('#nombre').value = paciente.nombre || '';
    document.querySelector('#apellido').value = paciente.apellido || '';
    document.querySelector('#fecha_nacimiento').value = formatDate(paciente.fecha_nacimiento) || '';
    document.querySelector('#genero').value = paciente.genero || '';
    document.querySelector('#contacto').value = paciente.contacto || '';
    document.querySelector('#direccion').value = paciente.direccion || '';   
    document.querySelector('#provincia').value = paciente.provincia || '';
    document.querySelector('#localidad').value = paciente.localidad || '';

    // Datos de mutual si existen
    if (mutualPaciente && mutual) {
        document.querySelector('#seguro').value = mutual.nombre || '';
        document.querySelector('#codigo_mutual').value = mutualPaciente.codigo_mutual || '';
        document.querySelector('#tipo_cobertura').value = mutualPaciente.tipo_cobertura || '';
        document.querySelector('#mutual_activa').value = mutualPaciente.activa ? 'Activa' : 'Inactiva';
    } else {
        // Limpiar campos de mutual si no tiene
        document.querySelector('#seguro').value = '';
        document.querySelector('#codigo_mutual').value = '';
        document.querySelector('#tipo_cobertura').value = '';
        document.querySelector('#mutual_activa').value = '';
    }
    // Limpiar y llenar contactos de emergencia
        const contactoEmergenciaContainer = document.querySelector('.contacto-emergencia-container');
        contactoEmergenciaContainer.innerHTML = '';

        if (contactosEmergencia && contactosEmergencia.length > 0) {
            contactosEmergencia.forEach(contacto => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = contacto.numero;
                input.placeholder = 'Ingrese el contacto de emergencia';
                input.name = 'contacto_emergencia';
                input.minlength = '10';
                input.maxlength = '10';
                input.className = 'input-contacto-extra';
                input.style.marginBottom = '5px';
                contactoEmergenciaContainer.appendChild(input);
            });
        }

        // Agregar el input principal para nuevos contactos de emergencia
        const nuevoInput = document.createElement('input');
        nuevoInput.type = 'text';
        nuevoInput.placeholder = 'Ingrese el contacto de emergencia';
        nuevoInput.name = 'contacto_emergencia';
        nuevoInput.minlength = '10';
        nuevoInput.maxlength = '10';
        nuevoInput.style.marginBottom = '5px';
        contactoEmergenciaContainer.appendChild(nuevoInput);

        // Agregar botones para agregar y quitar contactos de emergencia
        const agregarButton = document.createElement('button');
        agregarButton.type = 'button';
        agregarButton.className = 'boton-agregar';
        agregarButton.textContent = 'Agregar';
        agregarButton.onclick = agregarContactoEmergencia;
        contactoEmergenciaContainer.appendChild(agregarButton);

        const quitarButton = document.createElement('button');
        quitarButton.type = 'button';
        quitarButton.className = 'boton-quitar';
        quitarButton.textContent = 'Quitar';
        quitarButton.onclick = quitarContactoEmergencia;
        contactoEmergenciaContainer.appendChild(quitarButton);
    }
                function agregarContactoEmergencia() {
                    const input = document.getElementById('contacto_emergencia');
                    if (!input) {
                        console.error('El input de contacto de emergencia no existe');
                        return;
                    }

                    const valor = input.value.trim();
                    const error = document.getElementById('error');
                    if (error) error.remove();

                    // Validate that the input is not empty
                    if (!valor) {
                        mostrarError('Primero agregue un número de emergencia');
                        return;
                    }

                    // Validate that the input is a 10-digit number
                    if (!/^\d{10}$/.test(valor)) {
                        mostrarError('El número de celular es incorrecto');
                        return;
                    }

                    // Create a new input element for the additional contact
                    const nuevoInput = document.createElement('input');
                    nuevoInput.type = 'text';
                    nuevoInput.name = 'contacto_emergencia';
                    nuevoInput.value = valor;
                    nuevoInput.className = 'input-contacto-extra';
                    nuevoInput.style.marginBottom = '5px';

                    // Insert the new input element after the original input
                    input.parentNode.insertBefore(nuevoInput, input.nextSibling);

                    // Clear the original input field
                    input.value = '';
                }

                // Function to remove the last emergency contact input
                function quitarContactoEmergencia() {
                    const contactos = document.querySelectorAll('.input-contacto-extra');
                    if (contactos.length > 0) {
                        contactos[contactos.length - 1].remove();
                    } else {
                        mostrarError('No hay contactos de emergencia para quitar');
                    }
                }

                // Function to display an error message
                function mostrarError(mensaje) {
                    const input = document.getElementById('contacto_emergencia');
                    if (!input) {
                        console.error('El input de contacto de emergencia no existe');
                        return;
                    }

                    const error = document.createElement('div');
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