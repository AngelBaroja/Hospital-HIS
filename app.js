const express = require('express');
const path = require('path');
const app = express();
const modelos = require('./models/modelosBD');

const PORT = 3000;

// Importar las rutas
const indexRoutes = require('./routes/index');
const loginRoutes = require('./routes/login');
const recepcionRoutes = require('./routes/recepcion');
const turnosRoutes = require('./routes/turno');
const habitacionRoutes = require('./routes/habitacion');


/*
app.get('/turno', (req, res) => {
  res.render('recepcion/turno', { title: 'Login' });
});

app.get('/recepcion', (req, res) => {
  res.render('recepcion/recepcion', { title: 'Login' });
});

app.get('/registro', (req, res) => {
  res.render('recepcion/registro', { title: 'Login' });
});

app.get('/asignacion', (req, res) => {
  res.render('recepcion/asignacion', { title: 'Login' });
});*/

// Middleware para obtener datos del formulario
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/img', express.static('img'));

// Configuracion del motor de plantillas - PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', indexRoutes);
app.use('/login', loginRoutes);
app.use('/recepcion', recepcionRoutes);
//app.use('/turnos', turnosRoutes);
//app.use('/habitacion', habitacionRoutes);

// Inicio del servidor
modelos.sequelize.sync({ force: true })
  .then(() => {
    console.log('Modelos sincronizados');
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar modelos:', err);
  });
 