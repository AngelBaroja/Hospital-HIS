const express = require('express');
const app = express();
const pug = require('pug');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/img', express.static('img'));


app.set('view engine', 'pug'); 
app.set('views', './views');


app.get('/', (req, res) => {    
    res.render('login');
});

app.get('/recepcion', (req, res) => {
    res.render('recepcion');
});

app.get('/a', (req, res) => {
    res.render('a');
});

app.listen(PORT, () => {
    console.log('El servidor esta corriendo en http://localhost:3000');
});