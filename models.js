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
const setPassword = function(user,password){
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt,1000,64,'sha512').toString('hex')
  user.salt = this.salt;
  user.hash = this.hash
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

const register = function(req,res) {
  console.log(req.body)
      if(!req.body.name ||!req.body.surname||!req.body.email ||!req.body.password){
      sendJSONResponse( res, 400, {"message":"All fields required"});
      return;
      }  
      let user={name:'',surname:'', email:'', salt:'', hash:''}
      user.name = req.body.name,
      user.surname = req.body.surname,
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
          pool.query('INSERT INTO students (name, surname, email, salt, hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',[user.name, user.surname, user.email, user.salt, user.hash], (error, results) => {
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

    function checkUserByNameSurname(req,res){
      console.log(120,req.body)
      const {name, surname} = req.body
      console.log(name, surname)
      return new Promise(function (resolve, reject){
          pool.query(
              `SELECT * FROM students WHERE name = $1 AND surname ~ $2`,[name, `^${surname}$`],(error, results)=>{
              if(error){reject(error)
              }
              resolve (results.rows)
          })
      })
  }
  
  const checkRegExpEmail = (req, res)=>{
    console.log(100,req.body)
    const reg = req.body.email
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
  }
const passedTest = (req, res)=>{
    console.log(150,req.body)
  const {email, tests} = req.body
  return new Promise(function(resolve, reject){
    pool.query(
        `SELECT * FROM tests WHERE email = $1 AND test = $2`, [email, tests], (error, results)=>{
            if(error){
                reject (error)
            } 
                resolve (results.rows)
        })
})
}

const passTest = (req, res)=>{
    const {email,test, answer, result, timestamp} = req.body
    console.log('Answer',answer)
    const [n1, n2, n3, n4, n5, n6, n7, n8, n9,n10] = answer
   
    return new Promise (function(resolve, reject){
        pool.query(`INSERT INTO tests (email, test, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, result, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`, [/*fullname, tests*/ /*answer[i]*/email, test, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, result, timestamp], (error, results) => {
            if (error) {
                reject(error)
              }
              resolve(results)
            })
    })
}  

const passTestFromLocalStorage = (req, res)=>{
    const {email,test, answer, result/*, timestamp*/} = req.body.student
    console.log('AnswerLS', req.body.student)
    const [n1, n2, n3, n4, n5, n6, n7, n8, n9,n10] = answer
   
    return new Promise (function(resolve, reject){
        pool.query(`INSERT INTO tests (email, test, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, result) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, [email, test, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, result/*, timestamp*/], (error, results) => {
            if (error) {
                reject(error)
              }
              resolve(results)
            })
    })
}  

        const findResult =(req, res)=>{
          const {fullname,test, answer} = req.body
          console.log(answer)
          const topic = results[`${test}`]
          const result =[]
          console.log('Topic:', test,topic)
          for(let i=0; i<answer.length;i++){
            if(answer[i]===topic[i]){console.log(1);result.push(1)}else {console.log(0); result.push(0)}
          }
         const ini = 0;
          const amount = result.reduce((acc, current)=> acc+current,ini)
          console.log('Result',result, amount )
          return amount
        }

        module.exports = {passTest,
                          passTestFromLocalStorage,
                          passedTest,
                          findResult,
                          register,
                          login, 
                          checkUserByNameSurname,
                          checkRegExpEmail}