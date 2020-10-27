
const path = require('path');

const mysql = require('mysql2');

const dotenv = require('dotenv');

const python = require('./controllers/pythoninteract');

dotenv.config({ path: './.env'});

const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});



const publicDirectory = path.join(__dirname,'./public');

app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended:false }));

app.use(express.json());

app.use(cookieParser());

app.set('view engine','hbs');

 


db.query('SELECT email FROM users', (err,result) =>{
    console.log('as ' +result);
    console.log(err); 
});



app.use('/', require('./routes/pages.js'));
app.use('/auth', require('./routes/auth'));

//python.


app.listen(5000, ()=>
console.log('server up') 
);