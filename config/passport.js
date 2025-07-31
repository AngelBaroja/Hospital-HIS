const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Configuración de la estrategia local
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
        const usuario = await Usuario.findOne({ where: { usuario: username.trim().toLowerCase() } });
      if (!usuario) {        
        return done(null, false, { message: 'incorrecto.' });
      }
      const validPassword = await bcrypt.compare(password, usuario.contraseña);
      if (!validPassword) {
        return done(null, false, { message: 'incorrecta.' });
      }      
      return done(null, usuario);
    } catch (error) {
      console.error('Error en login:', error);
      return done(error);
    }
  }
));

// Serialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;