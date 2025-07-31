const passport = require('passport');
const Doctor = require('../models/Doctor');
const Enfermero = require('../models/Enfermero');
const Recepcionista = require('../models/Recepcionista');
const Administrador = require('../models/Administrador');

function validarUsuario(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, async (err) => {
      if (err) { return next(err); }
      
      // Buscar el empleado asociado al usuario autenticado
      const recepcionista = await Recepcionista.findOne({ where: { id_usuario: user.id } });
      if (recepcionista) {
        req.session.usuarioCompleto = recepcionista;
        req.session.nombreUsuario = `${recepcionista.nombre} ${recepcionista.apellido}`;            
        req.session.tipoUsuario = 'Recepcionista';
        if(recepcionista.activo==false){
            return res.redirect('/');
        }
      }
      const doctor = await Doctor.findOne({ where: { id_usuario: user.id } });
      if (doctor) {
        req.session.usuarioCompleto = doctor;
        req.session.nombreUsuario = `${doctor.nombre} ${doctor.apellido}`;
        if (doctor.genero == "Femenino") {
          req.session.tipoUsuario = 'Doctora'; 
        }else {
          req.session.tipoUsuario = 'Doctor'; 
        }
        if(doctor.activo==false){
            return res.redirect('/');
        }              
      }
      const enfermero = await Enfermero.findOne({ where: { id_usuario: user.id } });
      if (enfermero) {
        req.session.usuarioCompleto = enfermero;
        req.session.nombreUsuario = `${enfermero.nombre} ${enfermero.apellido}`;
        if (enfermero.genero == "Femenino") {
          req.session.tipoUsuario = 'Enfermera';
        }else {
          req.session.tipoUsuario = 'Enfermero';
        }
        if(enfermero.activo==false){
            return res.redirect('/');
        } 
                       
      }
      
      const administrador = await Administrador.findOne({ where: { id_usuario: user.id } });
      if (administrador) {
        req.session.usuarioCompleto = administrador;
        req.session.nombreUsuario = `${administrador.nombre} ${administrador.apellido}`;
        if (administrador.genero == "Femenino") {
          req.session.tipoUsuario = 'Administradora';
        }else {
          req.session.tipoUsuario = 'Administrador';
        }
        
        if(administrador.activo==false){
            return res.redirect('/');
        }                
      }
      return res.redirect('/home');
    });
  })(req, res, next);
}


async function formularioLogin(req, res) { 
  try{    
   res.render('login');
  }catch (error) {
    console.error('Error al validarUsuario:', error);
    res.status(500).render('error', {
      mensaje: 'Error al cargar el formulario de login',
      error
    });
  }
}

async function cerrarSesion(req, res) {
  try {      
    req.logout(err => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).render('error', {
          mensaje: 'Error al cerrar sesión',
          error: err
        });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al destruir la sesión:', err);
          return res.status(500).render('error', {
            mensaje: 'Error al destruir la sesión',
            error: err
          });
        }
        res.redirect('/login');
      });
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).render('error', {
      mensaje: 'Error al cerrar sesión',
      error
    });
  }
}

module.exports = {  
  validarUsuario,
  formularioLogin,
  cerrarSesion 
};