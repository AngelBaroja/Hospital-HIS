
      function validarFormulario() {
          const usuario = document.getElementById('username');
          const contraseña = document.getElementById('password');
          
         
          const errorUsuario = document.getElementById('error-usuario');
          const errorContraseña = document.getElementById('error-contraseña');
          if (errorUsuario) errorUsuario.remove();
          if (errorContraseña) errorContraseña.remove();
          
          
          let hayError = false;
          if (!usuario.value.trim()) {
              const error = document.createElement('p');
              error.id = 'error-usuario';
              error.style.color = 'red';
              error.style.fontSize = '12px';
              error.textContent = 'El campo usuario es obligatorio.';
              usuario.parentNode.appendChild(error);
              hayError = true;
          }
          
          if (!contraseña.value.trim()) {
              const error = document.createElement('p');
              error.id = 'error-contraseña';
              error.style.color = 'red';
              error.style.fontSize = '12px';
              error.textContent = 'El campo contraseña es obligatorio.';
              contraseña.parentNode.appendChild(error);
              hayError = true;
          }
          
          if (hayError) {
              return;
          }else{
                window.location.href = '/recepcion'; 
          }
        }