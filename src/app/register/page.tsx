'use client';
import { ValidationForm } from "app/components/ValidationForm";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function RegisterPage(){
        return(
            <div className="card m-0 p-0" style={{ width: '100%', height: '100vh' }}>
                <div className="row g-0 h-100">
                    <div className="col-sm-5 d-none d-md-block">
                        <img src="/imgs/team-green.jpg" className="img-fluid" alt="Log in image" style={{ width: '100%', height: '100%' }}/>
                    </div>
                    <div className="col-md-7">
                        <div className="card-body" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>
                                
                            <div className='row mb-3'>
                                <div className='col'></div>
                                <img src="/imgs/CoWorldLogoLogin.png" alt="CoWorld logo" className='col-sm-8' style={{ width: '80%', height: 'auto' }}/>
                                <div className='col'></div>
                            </div>
                            <ValidationForm title="Únete a CoWorld " onSubmit={(formProperties) => console.log(formProperties)} >
                                <ValidationForm.Input id="firstname" htmlfor="firstname" label="NOMBRE" type="text" className="col-md-6" required={true}
                                validationClass="invalid-feedback" validationMsg="Nombre es necesario!"/>
                                <ValidationForm.Input id="lastname" htmlfor="lastname" label="APELLIDOS" type="text" className="col-md-6" required={true}
                                validationClass="invalid-feedback" validationMsg="Apellidos es necesario!"/>
                                <ValidationForm.Input id="email" htmlfor="email" label="EMAIL" type="text" className="col-md-12" required={true}
                                validationClass="invalid-feedback" validationMsg="Email es necesario!"/>
                                <ValidationForm.Input id="password" htmlfor="password" label="CONTRASEÑA" type="password" className="col-md-12" required={true}
                                validationClass="invalid-feedback" validationMsg="Contraseña es necesario!"/>
                                <div className="col-12">
                                    <ValidationForm.Checkbox id="role" htmlfor="role" label="Regístrese como empresa"/>
                                </div>
                                <ValidationForm.SubmitButton text="UNIRSE" loading={false} />
                                <div className='text-center'>
                                <ValidationForm.Links href="/" text="¿Ya tienes cuenta? " linkText='Iniciar sesión'/>
                                </div>
                            </ValidationForm>
                        </div>
                    </div>
                </div>
            </div>
        );
}