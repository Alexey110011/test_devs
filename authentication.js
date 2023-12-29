require('dotenv').config()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT

})

const sendJSONResponse = function(res, status, content){
    res.status(status)
    res.json(content)
}
const register = function(req, res) {
    console.log(req.body)
        if(!req.body.name ||!req.body.email ||!req.body.password){
        sendJSONResponse( res, 400, {"message":"All fields required"});
        return;
        }  
        let user={name:'', email:'', salt:'', hash:''}
        user.name = req.body.name
        user.email = req.body.email 
    setPassword(user,req.body.password)
    console.log(user)
           var token;
        /*if(err){
            sendJSONResponse(res,404, err)
        } else {*/
            token = generateJWT(user)
            sendJSONResponse(res,200,{"token":token})
            console.log(token)
            return new Promise(function (resolve,reject) {
            pool.query('INSERT INTO students (name, surname, email, salt, hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',[user.name, , user.surname, user.email, user.salt, user.hash], (error, results) => {
            if (error) {
                reject(error)
                console.log(error)
            }
                resolve(results)
            })
        })
    }
   
const login = function(req, res){
if(!req.body.email||!req.body.password) {
    sendJSONResponse(res, 400, {"message":"All fields required"});
    return
    }

passport.authenticate('local', 
function(err, user, info){
    console.log(4, user)
    let token;
    if(err){
        sendJSONResponse(res, 404, err);
        console.log(6)
        return
    }
    if(user){
        token = generateJWT(user);
        sendJSONResponse(res, 200,{"token":token})
        console.log("Token", token)
    }
    else {
        sendJSONResponse(res,401,info)
        console.log("Not authorized",5)
    }
})(req, res)
}

const setPassword = function(user,password){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt,1000,64,'sha512').toString('hex')
    user.salt = this.salt;
    user.hash = this.hash
    }
    
    const validPassword = function(user,password){
        console.log(user,password)
        let hash = crypto.pbkdf2Sync(password, user.salt,1000,64,'sha512').toString('hex')
        return user.hash === hash
    }

    const generateJWT = function(user) {
        let expiry = new Date()
        expiry.setDate(expiry.getDate()+7)
        console.log(this._id, this.email, this.name)
        return jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        exp: parseInt(expiry.getTime()/1000)
        }, process.env.JWT_SECRET)
    }

const getStudentByName= (req)=>{
    console.log(req)
    const {name} = req.body
    return new Promise(function (resolve, reject){
        pool.query(
            `SELECT * FROM students WHERE name = '$1'`,[name],(error, results)=>{
            if(error){reject(error)
            }
            resolve (results.rows)
        })
    })
}

const getStudentByEmail = (req)=>{
    console.log(req.email)
    const email = req.email
    return new Promise(function (resolve, reject){
        pool.query(
            `SELECT * FROM students WHERE email = $1`,[email],(error, results)=>{
            if(error){reject(error);
            }
            resolve (results.rows)
        })
    })
}

const getRegExpStudentName = async (req)=>{
    console.log(100,req.body)
    const reg = req.body.reg
    console.log(reg)
    return new Promise(function(resolve, reject){
        pool.query(
            `SELECT * FROM students WHERE name ~ $1`, [`^${reg}$`], (error, results)=>{
                if(error){
                    reject (error)
                } 
                    resolve (results.rows)
            })
    })
}

const getRegExpStudentEmail = async (req)=>{
    console.log(100,req.body)
    const reg = req.body.reg
    console.log(reg)
    return new Promise(function(resolve, reject){
        pool.query(
            `SELECT * FROM students WHERE email ~ $1`, [`^${reg}$`], (error, results)=>{
                if(error){
                    reject (error)
                } 
                    resolve (results.rows)
            })
    })
}*/
    
    module.exports = {
        setPassword,
        register,
        login,
        validPassword,
        generateJWT,
        getStudentByName,
        getStudentByEmail,
        getRegExpStudentName,
        getRegExpStudentEmail
    }