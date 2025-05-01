interface emailProps{
    url:string,
    firstname:string
}

export const EmailTemplate = ({url, firstname}:emailProps)=>{
    return(
        <div className="card text-center">
            <div className="card-header">
                <img src="/imgs/CoWorldLogoLogin.png" alt="CoWorld logo" className='col-sm-8' style={{ width: '80%', height: 'auto' }}/>
            </div>
            <div className="card-body">
                <h1 className="card-title">Informacion de restablecer contraseña</h1>
                <p className="card-text">¡Hola, {firstname}! Recibimos tu solicitud para restablecer la contraseña recientemente. Si la has perdido o deseas restablecerla, utiliza el siguiente enlace para empezar.</p>
                <a href={url} className="btn btn-primary">Restablecer tu contraseña</a>
            </div>
            <div className="card-footer text-muted">
            Este enlace caducará en una hora. Si no ha solicitado una nueva contraseña, ignore este mensaje. 
            <br></br>
            ¿Tiene preguntas? Póngase en contacto con support@coworld.com.
            </div>
        </div>
    );
}