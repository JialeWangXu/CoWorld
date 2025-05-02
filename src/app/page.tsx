'use client';
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from './components/Form';
import { useAuthFetch } from "hooks/useAuthFetch";
import { useSnipper } from "hooks/useSnipper";
import { FormProperties } from '../context/FormContext';

export default function LoginInPage() {
    const authFetch = useAuthFetch();
    const {isLoading,setIsLoading} = useSnipper();
    const [oldValues, setOldValues] = useState<FormProperties>({});

    const login = async (data:any)=>{
        setIsLoading(true)
        await authFetch({endpoint:'login',nextPath:'/home',fetchdata:data})
        setIsLoading(false)
        console.log('fin')
    }
    useEffect(() => {
                const initialValues = {
                    email: '',
                    password: ''
                }
                setOldValues(initialValues)
        }, [])
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
                        <Form title="Iniciar sesión" onSubmit={login} oldValues={oldValues}>
                            <Form.Input 
                            id="email" 
                            htmlfor="email" 
                            label="EMAIL" 
                            type="text" 
                            placeholder="Introduce tu email" 
                            className='mb-3' 
                            required={true}
                            validationClass='invalid-feedback'
                            validationMsg='Indique un email válido!'/>
                            <Form.Input id="password" htmlfor="password" label="CONTRASEÑA" type="password" placeholder="Introduce tu contraseña" className='mb-3' />
                            <Form.Links href="/forget-password" text="¿Has olvidado tu contraseña? " linkText='Recuperar contraseña'/>
                            <Form.SubmitButton text="ENTRAR" loading={isLoading}/>
                            <div className='text-center'>
                            <Form.Links href="/register" text="¿No tienes cuenta? " linkText='Regístrate'/>
                            <Form.Links href="/company-login" text="¿Buscaba iniciar como empresa? " linkText='Iniciar sesión como empresa'/>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    ); 
}         