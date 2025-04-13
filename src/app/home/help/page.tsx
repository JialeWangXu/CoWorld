import style from "../styles.module.scss"
export default function CandiateHelpPage(){
    return(<div className={`container-fluid ${style.helpContainer}`}>
        <h1 style={{color:"#3b8725", fontWeight:"bold"}}>¡Muchas gracias por ser miembro de CoWorld!</h1>
        <p style={{fontSize:"2rem"}}>No dejes de soñar, todos tenemos una oportunidad.&#128522;</p>
        <p style={{fontSize:"2rem", fontWeight:500}}>&#127757; ¡Porque somos un mundo colaborativo! &#127759;</p>
        <br/>
        <h1 style={{color:"#3b8725", fontWeight:"bold"}}>Cualquier necesidad que surja no dude en contactarnos</h1>
        <p style={{fontSize:"2rem"}}>&#128231; help@coworld.support.com | &#128222; +34 123123123</p>
    </div>)
}