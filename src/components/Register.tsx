import {useRef, useState} from 'react' 
import {useNavigate} from 'react-router-dom'

const Register = ({sendAuthenticated=(f:any)=>f}) => {
    const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const surnameRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const [userAlreadyExists, setUserAlreadyExists] = useState<boolean>(false)
    const [emailAlreadyExists, setEmailAlreadyExisis] = useState<boolean|null>(null)
    const [formNotCompleted, setFormNotCompleted] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate()
        
    function onSubmit(e:React.ChangeEvent<HTMLFormElement>){
        e.preventDefault()
        if(!userAlreadyExists&&!emailAlreadyExists&&passwordRef.current.value&&nameRef.current.value&&surnameRef.current.value){
            fetch("https://activities-server-db.herokuapp.com/registerStudent",{
                headers: {
                    "Content-Type":"application/json"},
                method:"POST",
                body:JSON.stringify({
                    name:nameRef.current.value,
                    surname:surnameRef.current.value,
                    email:emailRef.current.value,
                    password:passwordRef.current.value
                })
             })
                .then(response=>response.json())
                .then(data=> {saveToken(data.token);
                console.log(data);
                sendAuthenticated(true)
            })
            navigate('/question')}
            else{setFormNotCompleted(true)}
        }
    
    function checkEmail(){
        setEmail(emailRef.current.value)
        fetch('https://activities-server-db.herokuapp.com/checkStudentEmail', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:emailRef.current.value
            }) 
        })
        .then(response=>response.json())
        .then(data=>{console.log(1,data);
            if(data.length>0){
                setEmailAlreadyExisis(true)
            } else {
                setEmailAlreadyExisis(false)
            }
        })
    }
    
    function saveToken(token:string){
        localStorage['token']=token
        console.log(localStorage['token'])
    }

    function checkUser(){
        fetch('https://activities-server-db.herokuapp.com/ch', {
            method:"POST",
            headers:{
                "Content-Type":"application/json"},
            body:JSON.stringify({
                name:nameRef.current.value,
                surname:surnameRef.current.value
             }) 
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(100,data);
            if(data.length>0){
                setUserAlreadyExists(true)
            } else {
                setUserAlreadyExists(false)
            }
        })
        .catch(error=>console.log(error))
    }
       
    return (
         <div>
            <div className = "signup_wrapper">
                <div className = "lead">
                    <span className ="signup_header">Please, register</span>
                </div>
                <form method = "POST" onSubmit={onSubmit}>
                    <div className = "form-group form_group">
                        <label htmlFor = "name">Name</label>
                        <input type = "text" id = "name" name ="name" ref = {nameRef}/>
                    </div>

                    <div className = "form-group form_group">
                        <label htmlFor = "surname">Surname</label>
                        <input type = "text" id = "name" name ="surname" ref = {surnameRef} onChange = {checkUser}/>
                    </div>
                    <div className = {(userAlreadyExists)?"vis alert":"hid"}>This student is already exists</div>
                    <div className = "form-group form_group">
                        <label htmlFor = "email">Email</label>
                        <input type = "text" id = "email" name ="email" ref ={emailRef} onChange = {checkEmail}/>
                    </div>

                    <div>
                        <div className  ={emailAlreadyExists?"vis alert":"hid"}>Email <b>{email}</b>  is already exists</div>
                        <div className = {(emailAlreadyExists===false)?"vis success":"hid"}>Email <b>{email}</b> is available</div>
                    </div>

                    <div className = "form-group form_group">
                        <label htmlFor = "password">Password</label>
                        <input type = "text" id = "password" name ="password" ref = {passwordRef}/>
                    </div>

                    <div className = {formNotCompleted?"vis":"hid"}>Complete the form</div>
                        <input type = "submit" value = "Submit" className = "btn btn-primary submit_btn"/>
                </form>
            </div>
        </div>
    )
}
export default Register
