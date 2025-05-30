const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.get(`/`, loginController.formularioLogin);
router.post('/', loginController.validarUsuario);

module.exports = router;