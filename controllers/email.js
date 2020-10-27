const nodemailer = require('nodemailer');

const mysql = require('mysql2');

const auth = require('./auth');

const datab = require('./database');

/*
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});
*/


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
console.log('a is  ' + auth.getemail());
exports.send = function async (subject,html){
  
    /* 
    auth.getemail().forEach((address) => {
        
     transporter.sendMail({
        from: process.env.SMTP_USER,
        to: address.email,
        subject: subject,
        html: html
    });
    console.log('email sent');

});
*/
}

