const Loader = ()=>{
    return (
    <div className = 'loader_wrapper'>
        <div style= {{color:'white'}}>Loading...</div>
        <div className = "circles">
            <div className = 'circle c_1' id ='c_1'></div>
            <div className = 'circle _2' id ='c_2'></div>
            <div className = 'circle _3' id ='c_3'></div>
        </div>
    </div>)
}
export default Loader