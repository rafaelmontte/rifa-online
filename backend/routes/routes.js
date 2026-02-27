const express = require('express');
const route = express.Router();
const Rifa = require('../controllers/RifaController');
const LoginController = require('../controllers/LoginController')


route.get('/numeros-vendidos', Rifa.numerosVendidos);
route.post('/comprar', Rifa.comprarNumeros);
route.post('/login', LoginController.login);

module.exports = route;