const express = require('express');
const route = express.Router();
const Rifa = require('../controllers/RifaController');
const Login = require('../controllers/LoginController')

console.log(Login);

route.get('/numeros-vendidos', Rifa.numerosVendidos);
route.post('/comprar', Rifa.comprarNumeros);
route.post('/login', Login.login);

module.exports = route;