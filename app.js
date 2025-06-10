require('dotenv').config();
const express = require('express');
const path = require('path');
const modelos = require('./models/modelosBD');
const session = require(`express-session`);
const passport = require('./config/passport');


const app = express();


// Importar las rutas
const indexRoutes = require('./routes/index');
const homeRutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const recepcionRoutes = require('./routes/recepcion');
const turnosRoutes = require('./routes/turno');
//const pacienteRoutes = require('./routes/paciente');
const authRoutes = require('./routes/auth');

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para obtener datos del formulario
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/img', express.static('img'));

// Configuracion del motor de plantillas - PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para session
app.use(session({
  secret: 'angel',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Rutas
app.use('/', indexRoutes);
app.use('/login', loginRoutes);
app.use('/home', homeRutes);
app.use('/recepcion', recepcionRoutes);
app.use('/turno', turnosRoutes);
//app.use('/paciente', pacienteRoutes);
app.use('/', authRoutes);

// Inicio del servidor
modelos.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar modelos:', err);
  });
 