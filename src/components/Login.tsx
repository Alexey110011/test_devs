import {useState,useRef} from 'react'
import { Link,useNavigate } from 'react-router-dom'

const Login= ()=>{
    const navigate = useNavigate()
    const [notAuthenticated, setNotAuthenticated] = useState<boolean>(false)
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>

    function saveToken(token:string){
        localStorage['token']=token
        console.log(localStorage['token'])
    }

    function onSubmit(e:React.ChangeEvent<HTMLFormElement>){
        e.preventDefault()
        fetch('https://activities-server-db.herokuapp.com/loginStudent',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'},
            body:JSON.stringify({
                email:emailRef.current.value,
                password:passwordRef.current.value
            })
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.message){
                setNotAuthenticated (true)
            } else {
                console.log(data)
                saveToken(data.token)
                navigate('/question')}
        })
    }

    return (
        <div className = "row">
        <div className="log_wrapper">
            <div className = "lead">
                <span className="log_header">Please, log in  or 
                    <Link style = {{color:"blue"}} to = '/register'> register</Link>
                </span>
            </div>
            <form method = "POST" onSubmit={onSubmit}>
                <div className = "form-group form_group">
                    <label htmlFor = "email">Email</label>
                    <input type = "text" id = "email" name ="email" ref = {emailRef} required/>
                </div>
                <div className = "form-group form_group">
                    <label htmlFor = "password">Password</label>
                    <input type = "text" id = "password" name ="password" ref = {passwordRef}/>
                </div>
                <input type = "submit" value= "Submit" className = "btn btn-primary submit_btn" required/>
                <div className = {notAuthenticated?"vis":"hid"}>Check email or password</div>
            </form><button onClick = {()=>console.log(localStorage)}>LocalStorage</button>
        </div>
    </div>
   )
}
export default Login