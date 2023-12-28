import {useNavigate} from 'react-router'

    const Result  = ({result}:{result:number|null})=>{
    const navigate = useNavigate()
    function home(){
        navigate('/')
    }
    return (
            <div>
                {result&&result>=7?<Success/>:<Fail/>}
                {result}
                <button onClick = {home}>Home</button>
            </div>
    )
}

export default Result

const Success = () =>{
    return (
        <div>
            <div className = "rond green"></div>
        </div>
    )
}

const Fail = ()=>{
    return (
        <div>
            <div className = "rond red"></div>
        </div>
    )
}
