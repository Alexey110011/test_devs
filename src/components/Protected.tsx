import {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import {Navigate} from 'react-router-dom'
function isAuthenticated():boolean{
    let token = getToken()
    if(token){
        let payload = JSON.parse(window.atob(token.split('.')[1]))
        return payload.exp>Date.now()/1000
    } else {console.log(false);return false}
}
function getToken(){
    return localStorage['token']
  }

const Protected = ({isAuthenticated, children}:{isAuthenticated:boolean, children:any})=>{
   // const [aut, setAut] = useState<boolean>(true)
    const location = useLocation()
    console.log('Protected', isAuthenticated)
    /*useEffect(()=>{
        setAut(isAuthenticated())
    },[])*/
    if(!isAuthenticated){
        console.log('Not autenticated')
        return <Navigate to = '/login' replace state  = {{prevState:location.pathname}}/>
    }
    return children
}
export default Protected