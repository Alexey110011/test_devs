import {useNavigate} from 'react-router'

    const Result  = ({result}:{result:number|null})=>{
    const navigate = useNavigate()
    function home(){
        navigate('/')
    }
    return (
            <div style = {{margin:"100px auto"}}>
                {result&&result>=7?<Success/>:<Fail/>}
                You have {result} correct answer(s)
                <button style = {{display:"block", margin:'20px auto'}}onClick = {home}>Home</button>
            </div>
    )
}

export default Result

const Success = () =>{
    return (
        <div style = {{textAlign:"center", marginBottom:"10px"}}>
            <div className = "rond green"></div>
        </div>
    )
}

const Fail = ()=>{
    return (
        <div style = {{textAlign:"center", marginBottom:"10px"}}>
            <div className = "rond red"></div>
        </div>
    )
}
