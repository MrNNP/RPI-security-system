const mysql = require('mysql2');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const datab = require('./database');

const authController = require('../controllers/auth')

/*
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});
*/


exports.armdisarm = function(req,res){
const token = req.cookies.user;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
console.log(req.body);

authController.checkuser(req,res,'controlpanel',decoded.name);

}