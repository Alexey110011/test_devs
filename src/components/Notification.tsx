import { useNavigate } from "react-router"
import {Answer,HowManyFailed } from "../types"

const Notification = ({topic, failed, passed}:{topic:string, failed:HowManyFailed, passed:Answer})=>{
    
    console.log("notification","HMF",failed ,topic,"ARP", passed)
    const navigate = useNavigate()
    type ObjectKey = keyof typeof failed
    const myVar = topic as ObjectKey
    const attempts = failed[`${myVar}`]
    console.log('Topic:',attempts)
    const color = attempts===1?"blue":"orange"
    const answerPassed = passed[`${myVar}`]

    if(answerPassed&&attempts<3){
        return ( 
            <div>You have passed {answerPassed} test
               <button onClick ={()=>navigate('/')}>Back</button>
            </div>
        )    
    } else {
        return (
            <div style = {{/*position:"relative",height:"100vh", backgroundColor:"green"*/}}>
                <div className = "modall" style = {{/*margin:"0 auto", */minWidth:"150px"}}>
                    <div>You have already tried <b style ={{color:`${color}`}}>{attempts===1?'once':'twice'}<br/></b> to pass {<b >{topic}</b>} test.</div>
                    <p>Now you have {attempts===2?'only':null} <b><span>{`${3-attempts} attempts`}</span></b> to repass</p>
                    <button style = {{display:"block", margin:"5px auto", border:`1px solid ${color}`}} className = "btn btn-light" onClick = {()=>navigate('/question')}>To test</button>
                </div>
                 
            </div>
        )
    }
}

export default Notification 