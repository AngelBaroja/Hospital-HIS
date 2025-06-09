const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Configuración de la estrategia local
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const usuario = await Usuario.findOne({ where: { usuario: username } });
      
      if (!usuario) {
        return done(null, false, { message: 'Usuario incorrecto.' });
      }
      
      const validPassword = await bcrypt.compare(password, usuario.contraseña);
      if (!validPassword) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }
      
      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  }
));

// Configuración de la estrategia GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Buscar o crear usuario basado en GitHub profile
      let usuario = await Usuario.findOne({ where: { usuario: profile.username } });
      
      if (!usuario) {
        // Crear nuevo usuario si no existe
        usuario = await Usuario.create({
          usuario: profile.username,
          contraseña: await bcrypt.hash(profile.id + Date.now(), 10), // Contraseña aleatoria
          cargo: 'Medico' // O algún valor por defecto
        });
      }
      
      return done(null, usuario);
    } catch (error) {
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