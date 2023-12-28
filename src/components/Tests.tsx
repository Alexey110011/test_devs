import {Link, useLocation, useNavigate} from 'react-router-dom' 
import {useRef, useState, useEffect, useCallback} from 'react'
import { AllData,AllQuestions, QuestionType, Answer,HowManyFailed, RowItem/*, Passed, Failed*/}  from '../types'
import JavaScript from '../images/JavaScript.png'
import NodeJS from  '../images/NodeJS.png'
import React from '../images/React.png' 

interface TestsProps{
  choosetopic(f:any):typeof f,
  language:any,
  sendTests(f:any):typeof f,
  sendFailed(f:any): typeof f,
  sendPassed(f:any):typeof f
}

function getToken(){
  return localStorage['token']
}

function isAuthenticated():boolean{
  let token = getToken()
  if(token){
    console.log(true)
      let payload = JSON.parse(window.atob(token.split('.')[1]))
      return payload.exp>Date.now()/1000
  } else {console.log(false);return false}
}

const Tests = (/*{choosetopic=(f:any)=>f, language:any, sendTests=(f:any)=>f, sendFailed = (f:any)=>f, sendPassed=(f:any)=>f*/{choosetopic, language, sendTests, sendFailed, sendPassed}:TestsProps) =>{
    const navigate = useNavigate()
    let topic:string;
    const location = useLocation();
    const javascriptRef = useRef() as React.MutableRefObject<HTMLHeadingElement>
    const nodeRef = useRef() as React.MutableRefObject<HTMLHeadingElement>
    const reactRef = useRef() as React.MutableRefObject<HTMLHeadingElement>
    const [alreadyPassed, setAlreadyPassed]= useState<Answer>({"JavaScript":false, "NodeJS":false, "React":false})
    const [alreadyFailed, setAlreadyFailed] = useState<Answer>({"JavaScript":false, "NodeJS":false, "React":false})
    const [howManyFailed, setHowManyFailed] = useState <HowManyFailed>({"JavaScript":0, "NodeJS":0, "React":0})
      /*const passedRef = useRef<Passed>({passed:[]})
      const failedRef = useRef<Failed>({failed:[]})
      let passed:any[]=[]
      let failed:any[]=[]*/
      
    const Item = ({topic, givenref}:{topic:any, givenref:React.MutableRefObject<HTMLHeadingElement>})=>{
      type ObjectKey=keyof typeof alreadyFailed
      const myVar = topic as ObjectKey
      return(
        <div className = "tests_topic">
            <img src = {(topic==="JavaScript")?JavaScript:(topic==="NodeJS")?NodeJS:React} alt = {topic}/>
            <h2 className = "topic" ref = {givenref}>{topic}</h2>
            <Link style = {{pointerEvents:(!alreadyFailed[`${myVar}`])?
                  'auto':
                  'none'}}
                  to = {isAuthenticated()&&(!alreadyPassed[`${myVar}`]&&howManyFailed[ `${myVar}`]===0)?
                  '/question':
                  (isAuthenticated()&&(alreadyPassed[`${myVar}`]||howManyFailed[`${myVar}`]>0))?
                  '/notification':
                  '/login'}>
                  <button className = {!alreadyFailed[`${myVar}`]?"btn btn-primary":"btn btn-warning"}
                          onClick = {topic==="JavaScript"?how:topic==="NodeJS"?how1:how2}>Start
                  </button>
            </Link>
            <div className = {(alreadyPassed[`${myVar}`])?"vis":"hid"}>
                The test is already passed
            </div>
            <div className = {(alreadyFailed[`${myVar}`])?"vis":"hid"} style = {{color:"orange"}}>
                The test is failed
            </div>
        </div>
    )
  }
  const chooseTenAnswers = useCallback((arrayAnswers:string[], arrayQuestions:QuestionType[]):any=>{
    const copyObject = structuredClone(arrayAnswers) as typeof arrayAnswers
    const entries = copyObject.map(item=>
       Object.entries(item))

    const look =arrayQuestions.map(item=>{
      for (let i=0;i<entries.length;i++){
          if(entries[i][0][0]===item.order){
          console.log(entries[i][0][1])
          return entries[i][0][1]
        }
      } return null
    })
    console.log('Lookk',copyObject,'Question',arrayQuestions, 'Entries',entries,'Lookk',look)
    return look
  },[])

   const createObjectTests = useCallback((obj:any):any=>{
    const dat = structuredClone(obj) as typeof obj
    let obj1:any={};
    for (let k in dat){
        const kk = chooseTenRandomQuestions(dat[k])
        console.log(k,'KK',kk)
        obj1[`${k}`] = kk
    }
    console.log('CreataObject',obj1)
    return obj1
   },[])

  const createObjectAnswers = useCallback((objAnswers:AllData, objQuestions:AllQuestions):any=>{
    let obj1:any = {}
    type ObjectKey  = keyof typeof objAnswers.answers 
    
    for(let k in  objAnswers.answers){
    const kk = chooseTenAnswers(objAnswers.answers[k as ObjectKey], objQuestions[k as ObjectKey])
    console.log('ll',k)
    obj1[`${k}`] = kk
  } 
    console.log('CreataObject1',obj1)
    return obj1
  },[chooseTenAnswers])

   function chooseTenRandomQuestions(array:QuestionType[]){
    const tenRandomQuestions:QuestionType[] = []
    while(tenRandomQuestions.length<10){
      let i = Math.floor(Math.random()*array.length)
        tenRandomQuestions.push(array[i])
        array.splice(i,1)
      }
     console.log('Ten',tenRandomQuestions)
     return tenRandomQuestions
  }
  
const  getTests = useCallback((data:AllQuestions)=>{
      const tenTests = createObjectTests(data)
      console.log("TenTests",tenTests)
      return tenTests
},[createObjectTests])

    const ifFailed = useCallback((array:RowItem[])=>{
    const failed = array.filter(item=>item.result==='failed')
    console.log('Failed',failed)
    return failed
  },[])

const ifPassed = useCallback((array:RowItem[])=>{
    const passed = array.filter(item=>item.result==='passed')
    console.log('Passed',passed)
    return passed
  },[])

  const checkIfTestAlreadyPassed = useCallback((topic:string)=>{
    type ObjectKey = keyof typeof alreadyFailed
    const myVar = topic as ObjectKey
    /*const ifFailed = (array:RowItem[])=>{
      const failed = array.filter(item=>item.result==='failed')
      console.log('Failed',failed)
      return failed
    }

  const ifPassed = (array:RowItem[])=>{
      const passed = array.filter(item=>item.result==='passed')
      console.log('Passed',passed)
      return passed
    }*/
    fetch('http://localhost:7000/isTestPassed',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email:localStorage['token']?JSON.parse(window.atob(localStorage['token'].split('.')[1])).email:null,
          tests:topic
        })
      })
      .then(response=>response.json())
      .then(data=>{
          console.log(10,data);
          const/*passedRef.current.*/passed = ifPassed(data)
          console.log('PCP', /*passedRef.current.*/passed)
          if(/*passedRef.current.*/passed.length>0){
          setAlreadyPassed(alreadyPassed=>({...alreadyPassed, [`${myVar/*topic*/}`]:true}))
          }
          //passedRef.current.passed = ifPassed(data)
          const/*failedRef.current.*/failed = ifFailed(data);
          setHowManyFailed(howManyFailed=>({...howManyFailed, [`${myVar/*topic*/}`]:/*failedRef.current.*/failed.length}))
        }
  )},[ifFailed,ifPassed])


   useEffect(()=>{
    
    //navigate('/loader')
    fetch('http://localhost:7000/getTests', {cache:"no-store"})
    .then(response=>response.json())
    .then(data=>{/*return data/*console.log('Server',data);*/
    const ten = getTests(data.questions)
    console.log('Data answers',data.answers)
    const tenAnswers = createObjectAnswers(data, ten)
    console.log("Here",tenAnswers)
    sendTests({questions:ten,answers:tenAnswers})
    })
    .catch(error=>{
        console.log(error)
    });//navigate('/')
   },[navigate, createObjectAnswers,getTests,sendTests])

    useEffect(()=>{
    const topics = ['JavaScript', 'NodeJS','React']
    topics.forEach(element=>checkIfTestAlreadyPassed(element))
    },[checkIfTestAlreadyPassed])


    useEffect(()=>{
      sendFailed(howManyFailed)
      },[sendFailed,/*failedRef.current.failed,*/howManyFailed]
    )
    
      useEffect(()=>{
        console.log("Tests ARP",alreadyPassed)
        sendPassed(alreadyPassed)}
        ,[sendPassed,/*passedRef.current.passed,*/ alreadyPassed]
      )

      useEffect(()=>{
        //const  topics = ["JavaScript", "NodeJS", "React"]
        //function checkIsFailed(topic:string){

        
        //const topics = ['JavaScript', 'NodeJS','React']
        type ObjectKey = keyof typeof howManyFailed
        //let myVar = topic as ObjectKey
        for (let top in howManyFailed){
        if(howManyFailed[top as ObjectKey]===3){
        setAlreadyFailed(alreadyFailed=>({...alreadyFailed,[top as ObjectKey]:true}))
          }
        }
          console.log('FAiled', howManyFailed, alreadyFailed)
          //topics.forEach(element=>checkIsFailed(element))
      },[howManyFailed])

      function getToken(){
      console.log(localStorage['token'],'Student',localStorage['student'])
        return localStorage['token']
    }

      useEffect(()=>{
        if(localStorage.getItem('student')){
          const tok =  getToken()
          fetch('http://localhost:7000/postFromLocalStorage',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${tok}`
            },
            body:JSON.stringify({
               student: JSON.parse(localStorage['student'])
            })
          })
          .then(response=>response.json())
            .then(data=>{
              console.log(100,data)
              if(data.rows.length>0){
                  localStorage.removeItem('student')
                  console.log(localStorage)
                };
              //navigate('/result')
            })
        }},[])

    function how(){
      topic = javascriptRef.current.innerHTML 
      choosetopic(topic)
    }

    function how1(){
      topic = nodeRef.current.innerHTML 
      choosetopic(topic)
    }

    function how2(){
      topic = reactRef.current.innerHTML 
      choosetopic(topic)
      console.log(topic)
    }

    return (
        <div className = "tests">
          <span className = 'tests_header'>Tests</span>
          <div className = "tests_wrapper">
            <Item topic = {'JavaScript'} givenref={javascriptRef}/>
            <Item topic = {'NodeJS'} givenref={nodeRef}/>
            <Item topic = {'React'} givenref={reactRef}/>
            <Link to ="/login" state={{prevState:location.pathname}}>Lin</Link>
              <button onClick ={()=>{localStorage.clear();console.log(localStorage)}}>Removes</button> 
        </div>
    </div>
     )
}
 
export default Tests