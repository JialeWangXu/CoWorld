interface emailProps{
    url:string,
    firstname:string,
    companyName:string,
    tempPwd:string
}

export const EmialOperatorTemplate = ({url, firstname, companyName,tempPwd}:emailProps)=>{
    return(
        <div className="card text-center">
            <div className="card-header">
            <img src="/imgs/CoWorldLogoLogin.png" alt="CoWorld logo" className='col-sm-8' style={{ width: '80%', height: 'auto' }}/>
            </div>
            <div className="card-body">
                <h1 className="card-title">Se le ha añadido a la cuenta de la plataforma CoWorld de {companyName}.</h1>
                <p className="card-text">¡Hola, {firstname}! Ha sido añadido como operador por {companyName}. Adjuntamos la contraseña temporal generada. Para poder iniciar sesión, es necesario que cambie la contraseña de su cuenta.</p>
                <p className="card-text">Contraseña temporal: <strong>{tempPwd}</strong></p>
                <a href={url} className="btn btn-primary">Pinchar este link para cambiar su contraseña</a>
            </div>
            <div className="card-footer text-muted">
            Este enlace caducará en 2 días. 
            <br></br>
            ¿Tiene preguntas? Póngase en contacto con support@coworld.com.
            </div>
        </div>
    );
}