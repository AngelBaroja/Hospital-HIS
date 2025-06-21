const passport = require('passport');
const Doctor = require('../models/Doctor');
const Enfermero = require('../models/Enfermero');
const Recepcionista = require('../models/Recepcionista');

function validarUsuario(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, async (err) => {
      if (err) { return next(err); }
      
      // Buscar el empleado asociado al usuario autenticado
      const recepcionista = await Recepcionista.findOne({ where: { id_usuario: user.id } });
      if (recepcionista) {
        req.session.nombreUsuario = `${recepcionista.nombre} ${recepcionista.apellido}`;            
        req.session.tipoUsuario = 'Recepcionista';
      }
      const doctor = await Doctor.findOne({ where: { id_usuario: user.id } });
      if (doctor) {
        req.session.nombreUsuario = `${doctor.nombre} ${doctor.apellido}`;
        if (doctor.genero == "Femenino") {
          req.session.tipoUsuario = 'Doctora'; 
        }else {
          req.session.tipoUsuario = 'Doctor'; 
        }              
      }
      const enfermero = await Enfermero.findOne({ where: { id_usuario: user.id } });
      if (enfermero) {
        req.session.nombreUsuario = `${enfermero.nombre} ${enfermero.apellido}`;
        if (enfermero.genero == "Femenino") {
          req.session.tipoUsuario = 'Enfermera';
        }else {
          req.session.tipoUsuario = 'Enfermero';
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

module.exports = {  
  validarUsuario,
  formularioLogin 
};