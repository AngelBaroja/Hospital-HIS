const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const usuario = req.session.nombreUsuario;
    res.render('home', { usuario });
});

module.exports = router;