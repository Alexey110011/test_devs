//import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {useState,useCallback} from 'react'
import {Routes, Route} from 'react-router-dom'
import Question from './components/Question';
import Login from './components/Login'
import Register from './components/Register'
import Tests from './components/Tests'
import Result from './components/Result'
import Notification from './components/Notification'
import Loader from './components/Loader'

import  {HowManyFailed, Answer, AllData} from './types'

function App() {
  const [topic, setTopic] = useState<string>('')
  const [tests, setTests] = useState<AllData>({
    questions:{
      JavaScript:[]/*/{
        eng:[],
        bel:[],
        rus:[]
      }*/,
      NodeJS:[]/*{
        eng:[],
        bel:[],
        rus:[]
      }*/,
      React:[]/*{
        eng:[],
        bel:[],
        rus:[]
      }*/
    },
    answers:{
      JavaScript:[],NodeJS:[],React:[]
    }
  })
  const [result, setResult] = useState<number|null>(null)
  const [failed, setFailed] = useState<HowManyFailed>({
    JavaScript:0, NodeJS:0, React:0
  })
  const [passed, setPassed] = useState<Answer>({
    JavaScript:false, NodeJS:false, React:false
  })
  const [language, setLanguage] = useState<string>('eng')

  function chooseTopic(arg:string){
    setTopic(arg)
  }

  function chooseLanguage(arg:string){
    setLanguage(arg)
  }

  function sendResult(arg:any){
    setResult(arg)
  }

  const sendPassed = useCallback((arg:Answer)=>{
    setPassed(arg)
  },[])

  const sendFailed = useCallback((arg:HowManyFailed)=>{
    setFailed(arg)
  },[])

const  sendTests = useCallback((arg:AllData)=>{
  setTests(arg)
},[])

  return (
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Tests choosetopic = {chooseTopic} language = {language} sendTests = {sendTests} sendFailed = {sendFailed} sendPassed = {sendPassed}/>}/>
        <Route path = "/loader" element = {<Loader/>}/>
        <Route path = "/register" element = {<Register/>}/> 
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/question" element ={<Question topic = {topic} sendResult = {sendResult}  tests = {tests}/>}/>
        <Route path = "/result" element = {<Result result = {result}/>}/>
        <Route path = '/notification' element = {<Notification topic = {topic} failed = {failed} passed = {passed}/>}/>
      </Routes>
    </div>
  );
}

export default App;
