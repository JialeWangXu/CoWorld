import style from '../styles.module.scss'

export default function CompanyHelpPage(){
    return(<div className={`container-fluid ${style.helpContainer}`}>
        <h1 style={{color:"#3b8725", fontWeight:"bold"}}>¡Muchas gracias por elegir CoWorld!</h1>
        <p style={{fontSize:"2rem"}}>Cada trabajo que publicas es una esperanza para este mundo.&#128522;</p>
        <p style={{fontSize:"2rem", fontWeight:500}}>&#127757; ¡Porque somos un mundo colaborativo! &#127759;</p>
        <br/>
        <h1 style={{color:"#3b8725", fontWeight:"bold"}}>Si surge alguna necesidad, no dude en contactarnos</h1>
        <p style={{fontSize:"2rem"}}>&#128231; help@coworld.support.com | &#128222; +34 123123123</p>
    </div>)
}