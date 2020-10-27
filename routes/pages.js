const { Router } = require('express');
const express = require('express');
const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const routers = express.Router();


routers.get('/',(req, res)=>{
    authController.checkuser(req,res,'index');

    //res.render('index');
});

routers.get('/register',(req, res)=>{
    
    authController.checkuser(req, res,'register');
    //res.render('register');
});

routers.get('/login',(req, res)=>{
    authController.checkuser(req, res,'login');
    
    //res.render('login');
});

routers.get('/controlpanel',(req, res)=>{
   try{ const token = req.cookies.user;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        authController.checkuser(req, res,'controlpanel',decoded.name);
    }catch (err){
        console.log(err);
        res.clearCookie('user').redirect('/login');

        
   }
       
});

routers.get('/logout', (req, res)=>{
    res.render('logout');
    authController.logout(req, res);


})

module.exports = routers;
