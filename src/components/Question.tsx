import React, {useState, useEffect, useRef, useCallback} from 'react'
import { useNavigate } from 'react-router'
import {AllData, QuestionType, SendResult, Amount} from '../types'
//https://beamish-treacle-2d1dc7.netlify.app
const Question = ({topic,sendResult,tests}:{topic:string,sendResult:SendResult,tests:AllData})=>{
    type ObjectKey = keyof typeof tests.answers
    const myVar = topic as ObjectKey
    const chosenTopic = (tests.questions[`${myVar}`])    
    
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(tests.questions[`${myVar}`][0])
    const [i, setI] = useState<number>(1)
    const [variant, setVariant] = useState<string>('')
    const [answer, setAnswer] = useState<string[]>([])
    const [bu, setBu] = useState<boolean>(true)
    const [buttonValue, setButtonValue] = useState<boolean>(false)
    const [server,setServer] = useState<boolean>(true)
    const [timer, setTimer] = useState<number>(90)
    const [minutes, setMinutes] = useState<number>(1)
    const [seconds, setSeconds] = useState<number|string>(90)
    const [alert, setAlert] = useState<boolean>(false)
    const amountRef = useRef<Amount>({amount:0})
    const navigate = useNavigate()

    //Formates json data from file "questions.json" into readable view
    function whitefy(str2:string){
        const reggy1 = /\t/g
        let str3 = str2.replace(reggy1,(x:string)=>{
          return x.replace(reggy1, "\u00A0".repeat(x.length))
        })
        console.log("Str3", str3)
        return str3
        }
    
    // Decreases time counter by 1 second
    const getTime =()=>{
        setTimer(timer=>timer-1)
    }

    //Pushes current user's answer (letter) into answers array
    const push = useCallback((a:string)=>{
        answer.push(a)
        console.log(answer)
    },[answer])

    //Checks result of test: passed or failed
    const findResult = useCallback((answer:string[],topic:string, sendResult=(f:any)=>f)=>{
        const result =[]
        type ObjectKey = keyof typeof tests.answers
        const myVar = topic as ObjectKey
        const answerTopic = tests.answers[`${myVar}`]
        console.log('Topic:',topic, tests.answers,'AnswerTopic:',answerTopic)
        for(let i=0; i<answer.length;i++){
            if (answer[i]===answerTopic[i]){
            console.log(1);
            result.push(1) //if answer is correct, pushes into array result 1
            } else {
                console.log(0);
                 result.push(0) //elsewhere pushes into array result 0
            }
    }
        const ini = 0;
        amountRef.current.amount = result.reduce((acc, current)=> acc+current,ini) // Gets amount of correct answers
        console.log('Result',result, amountRef.current.amount );
        sendResult(amountRef.current.amount)
    } ,[tests])  

    //Sends information of passing / failing on server
    const send = useCallback(()=>{
        navigate('/loader')
        const tok =  getToken()
        console.log(60,tok)
        findResult(answer, topic,sendResult)
        const userResponse = {
            email: (JSON.parse(window.atob(localStorage['token'].split('.')[1]))).email,
            test: topic,
            answer:answer,
            result:(amountRef.current.amount>=7)?"passed":"failed",
            timestamp:new Date().getFullYear()+'-'+ (new Date().getMonth()+1) + '-' + (`${new Date().getDate()<10?('0'+ new Date().getDate()):new Date().getDate()}`) +' ' + (`${new Date().getHours()<10?('0'+new Date().getHours()):new Date().getHours()}`)+':'+ (`${new Date().getMinutes()<10?('0'+ new Date().getMinutes()):new Date().getMinutes()}`) + ':' + (`${new Date().getSeconds()<10?('0'+ new Date().getSeconds()):new Date().getSeconds()}`)
        }
        localStorage.setItem(`student`,JSON.stringify(userResponse))
        fetch('https://activities-server-db.herokuapp.com/post',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${tok}`},
            body:JSON.stringify({
                email: (JSON.parse(window.atob(localStorage['token'].split('.')[1]))).email,
                test: topic,
                answer:answer,
                result:(amountRef.current.amount>=7)?"passed":"failed", 
                timestamp:new Date().getFullYear()+'-'+ (new Date().getMonth()+1) + '-' + (`${new Date().getDate()<10?('0'+ new Date().getDate()):new Date().getDate()}`) +' ' + (`${new Date().getHours()<10?('0'+new Date().getHours()):new Date().getHours()}`)+':'+ (`${new Date().getMinutes()<10?('0'+ new Date().getMinutes()):new Date().getMinutes()}`) + ':' + (`${new Date().getSeconds()<10?('0'+ new Date().getSeconds()):new Date().getSeconds()}`)
            })
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(100,data)
            if(data.rows.length>0){
                localStorage.removeItem('student')
                console.log(localStorage)
                setAnswer([])
            };
            navigate('/result')
        })
        console.log(localStorage)
    },[answer, findResult, navigate , sendResult, topic])

 //Runs timer
const nextQuestion = useCallback(()=>{
    setI((i<=9)?(i+1):10)
    const nextQuestion = (i<chosenTopic.length)?chosenTopic[i]:chosenTopic[chosenTopic.length-1]
    console.log(nextQuestion)
    setCurrentQuestion(nextQuestion)
    push(variant)
    setVariant('')
    setBu(true)
    setTimer(90)
    setMinutes(1)
    setAlert(false)
    console.log(localStorage)
    if(answer.length===10){
        setBu(true)
        setServer(!server)
        send()
    }
},[answer.length, chosenTopic, i, push, send, server, variant])

useEffect(()=>{
    const intervalID = setInterval(getTime,1000)
    return ()=>{clearInterval(intervalID)}
},[])

//Time viewing
useEffect(()=>{
    if(timer>=70){
        setSeconds(timer-60)
    } else if (timer>59&&timer<70){
        setSeconds('0'+(timer-60))
    } else if (timer===59){
        setSeconds(timer)
        setMinutes(minutes=>minutes-1)
    } else if(timer<59&&timer>9){
        setSeconds(timer)
    } else if (timer<10&&timer>0){    
        setAlert(true);
        setSeconds('0' + timer)   
    } else {
        setSeconds(0);
        nextQuestion()
    }
    console.log(timer)
},[timer,nextQuestion])


function getToken() {
    console.log(localStorage['token'])
    return localStorage['token']
}
//andles options and buttons (enables or disables)
const radioChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
    setVariant(e.target.value);
    setBu((answer.length===10)?true:false)
    if(answer.length===9){
        setButtonValue(true)}
}
    
return (
    <div className = "question_wrapper">
        <div><h3 className="page">{i}</h3>
            <h2 style = {{color:(alert)?"red":"black"}}>{minutes}:{seconds}</h2>
            <form>
                <div className = "radio_wrapper">
                    <div className = "question" style = {{paddingLeft:"10px"}}>{currentQuestion.question.split('\n').map((line,i)=>{;return(<div style = {{paddingLeft:"10px"}} key = {i}>{whitefy(line)}</div>)})}</div>
                    
                <div style = {{marginTop:"5px"}}>
                        <div className = "radio"><div>a</div><div><input type = "radio" value = "a" name = "answer" onChange = {e=>{radioChange(e)}} checked = {variant === "a"}/></div><div>{currentQuestion.answers.a.split('\n').map((line,i)=>{return(<div style ={{display:"block"}} key = {i}>{whitefy(line)}</div>)})}</div></div>
                        <div className = "radio"><div>b</div><div><input type = "radio" value = "b" name = "answer" onChange = {e=>{radioChange(e)}} checked = {variant === "b"}/></div><div>{currentQuestion.answers.b.split('\n').map((line,i)=>{return(<div style ={{display:"block"}} key = {i}>{whitefy(line)}</div>)})}</div></div>
                        <div className = "radio"><div>c</div><div><input type = "radio" value = "c" name = "answer" onChange = {e=>{radioChange(e)}} checked = {variant === "c"}/></div><div>{currentQuestion.answers.c.split('\n').map((line,i)=>{return(<div style ={{display:"block"}} key = {i}>{whitefy(line)}</div>)})} </div></div>
                        <div className = "radio"><div>d</div><div><input type = "radio" value = "d" name = "answer" onChange = {e=>{radioChange(e)}} checked = {variant === "d"}/></div><div>{currentQuestion.answers.d.split('\n').map((line,i)=>{return(<div style ={{display:"block"}} key = {i}>{whitefy(line)}</div>)})} </div></div>
                    </div>
                </div>
                <button onClick = {nextQuestion} className = {(!buttonValue?"btn btn-info":"btn btn-success")} disabled = {bu}>{(!buttonValue)?"Next":"Finish"}</button>
            </form>
        </div>  
    </div>   
) 
}

export default Question