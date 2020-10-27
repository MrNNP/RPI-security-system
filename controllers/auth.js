const mysql = require('mysql2');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const datab = require('./database');

/*
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});
*/

exports.getemail = function(){
    datab.db().query('SELECT email FROM users', (err,result) =>{
        console.log("s is " +result);
        return result;
    });
}


exports.logout = function async(req,res){
try {
    res.clearCookie('user');
    res.status('200').redirect('/');  

    }catch(err){
        console.log(err);   
    }


}

exports.checkuser = function async(req, res,page,name){
    try {
      //  console.log(req.cookies.user);
      console.log(name);
        const token = req.cookies.user;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decoded);
        if (decoded.id>0){
            try{
            res.render(page,{userin:2,name:name[0]});
            }catch(err){
                res.render(page,{userin:2});
            }
            return 20;
        }else{
            res.render(page);
        }

    } catch(err){
        console.log(err);
        res.render(page);
    }
}

exports.login = function async (req, res){
    try{
     const{email, password} = req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please provide an email and a password'
            });
        }

        datab.db().query('SELECT * FROM users WHERE email = ?', [email], async(err,result)=>{
   console.log(result);
    
   if(result.length<1 || !(await bcrypt.compare(password, result[0].password))){
        res.status(401).render('login',{
            message:'The email or the password is incorrect'
        });
    } else {
        const id = result[0].id;
        const email = result[0].email;
        const name = result[0].name.split(' ');
        
        const token = jwt.sign({id,email,name}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        //console.log('tocken is'+token);
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }

        res.cookie('user', token, cookieOptions);
        res.status(200).redirect("/");
    }

});
    } catch (err){
console.log(err);
    }


}

exports.register = function(req, res){
    

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfim = req.body.passwordConfim;

    datab.db().query('SELECT email FROM users WHERE email = ?', [email], async (err, result) =>{
        if (err){
            console.log(err);
        }
        if(result.length>0){
            return res.render('register',{
                message: 'That email is already in use.'
            });
        } else if (password != passwordConfim){
            return res.render('register',{
                message: 'Those passwords do not match.'
            });
        }


        
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        datab.db().query('INSERT INTO users SET ?', {name:name, email: email, password:hashedPassword}, (err, result)=>{
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.render('register',{
                    message: 'User Registered, Please login using link in nav bar.'
                })
            }
            
        })
        //res.send('form submitted');
    });
}