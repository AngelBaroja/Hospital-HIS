const express = require('express');
const router = express.Router();
const { requiereSesion }  = require('../middlewares/auth');

router.get('/', requiereSesion,(req, res) => {
    const usuario = req.session.nombreUsuario;
    res.render('home', { usuario });
});

module.exports = router;