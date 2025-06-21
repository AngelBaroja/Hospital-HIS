const express = require('express');
const router = express.Router();
const { requiereSesion }  = require('../middlewares/auth');

router.get('/', requiereSesion,(req, res) => {
    const usuario = req.session.nombreUsuario;
    const cargo = req.session.tipoUsuario;

    res.render('home', { usuario , cargo });
});

module.exports = router;