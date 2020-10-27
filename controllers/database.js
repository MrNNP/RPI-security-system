const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});
console.log('This is test for datbase'+process.env.DATABASE_HOST);

db.connect((err)=>{
    if (err){
        console.log(err);
    } else {
        console.log('database connected');
    }
});

db.query('SELECT email FROM users', (err,result) =>{
    console.log('as ' +result);
    console.log(err); 
});

exports.db = function(){
    return db;
};