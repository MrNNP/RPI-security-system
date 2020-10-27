const { Router } = require('express');
const express = require('express');
const authController = require('../controllers/auth');
const armController = require('../controllers/arm');
const routers = express.Router();


routers.post('/register', authController.register);

routers.post('/login', authController.login);

routers.post('/armdisarm',armController.armdisarm);

module.exports = routers;
 