const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT||7000
const passport = require('passport')
const models = require('./models')
const app = express()
const jwt = require('jsonwebtoken')
require('./passport')

const JSONquestions = require('./questions/questions.json')
const JSONanswers = require('./answers/answers.json')

/*function fillTenRandomQuestions(array){
  const tenRandomQuestions = []
  while(tenRandomQuestions.length<10){
    let i = Math.floor(Math.random()*array.length)
      tenRandomQuestions.push(array[i])
      array.splice(i,1)
    }
   console.log('Ten',tenRandomQuestions)
   return tenRandomQuestions
}*/

/*function getAnswers(obj){
  const entries= []
  for(let k in obj){
     const mapped =   obj[k].map(item=>Object.entries(item))
      entries.push(mapped)
      console.log('Foo',entries)
    } 
    return entries
}*/

/*function full(ten, answ){
  const searchedAnswer = ten.map(item=>{
    for (let i=0;i<answ.length;i++){
      console.log('Full',answ[i][0][0])
      if(answ[i][0][0]===item.order){
        return answ[i][0][1]
      }
    }})
    console.log('Full',searchedAnswer)
   return searchedAnswer
  }

function mapping(ten, answ){
  const arrayOfAnswers = []
  for(let i=0;i<3;i++){
    const full3 = full(ten[i], answ[i])
    arrayOfAnswers.push(full3)
  }
  return arrayOfAnswers
}*/

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(function(req, res, next){
res.setHeader('Access-Control-Allow-Origin','*'),
res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT, DELETE, OPTIONS'),
res.setHeader('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers,Authorization');
next()
})

let auth = (req, res, next)=>{
  try{
    const {authorization} = req.headers
    console.log(10,req.headers.authorization)
    if(authorization){
        const token =  req.headers.authorization.split(" ")[1]
        console.log(11,token)
        const result = jwt.verify(token, process.env.JWT_SECRET,{algorithms:['HS256']})
        req.payload = result
    console.log(12,result.email)
    next()
    } else {
        res.send("No Token")
    } 
  }
  catch{
    res.send({"message":'ERROR'})
  }
}

/*app.get('/a', (req, res)=>{
    res.send('5000')
    console.log('A')
})*/
app.get('/getTests',(req, res)=>{
  console.log(JSONquestions,JSONanswers)
  res.send({questions:JSONquestions, answers:JSONanswers})
})

app.post('/post'/*, auth*/,(req, res)=>{
    console.log(req.body.answer)
    models.passTest(req,res)
    .then(response => {
      console.log(response.rows);res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
 })

app.post('/postFromLocalStorage'/*, auth*/,(req, res)=>{
  console.log(req.body.answer)
  models.passTestFromLocalStorage(req,res)
  .then(response => {
    console.log(response.rows);res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/isTestPassed', (req, res)=>{
  models.passedTest(req, res)
  .then(response=>{
    res.status(200).send(response);console.log('If test Passed',response)})
    .catch(error=>{
      res.status(500).send(error)
      console.log(error)})
})

app.post('/register', (req, res)=>{
    models.register (req, res)
  .then(response => {
    res.status(200).send(response);
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })
})

app.post('/login', (req, res)=>{
  console.log(2,req.body)
    models.login(req,res)
})

app.post('/ch',(req, res)=>{
  console.log(130,req.body)
  models.checkUserByNameSurname(req, res)
  .then (response=>{res.send(response);console.log(response)})
  .catch(err=>console.log(err))
})

app.post('/checkRegExpEmail', (req, res)=>{
  models.checkRegExpEmail(req)
  .then(response=>{res.send(response);console.log(response)})
})

app.post('/checkuser', (req, res)=>{
  console.log(req.body)
  res.send(req.body)
})
  
app.listen(port,()=> console.log(`Server is listening at ${port}`))
