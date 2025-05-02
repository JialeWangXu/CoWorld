'use client'
import { Form } from '../components/Form';
import { useSnipper } from "hooks/useSnipper";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthFetch } from "hooks/useAuthFetch";
import styles from './styles.module.scss'
import { FormProperties } from '../../context/FormContext';
import { useEffect, useState } from 'react';

export default function ForgetPwdPage(){
    const authFetch = useAuthFetch();
        const {isLoading,setIsLoading} = useSnipper();
        const [oldValues, setOldValues] = useState<FormProperties>({});
    
        const forgetPwd = async (data:any)=>{
            console.log('fogrt starting')
            setIsLoading(true)
            await authFetch({endpoint:'forget-pwd',nextPath:'/',fetchdata:data})
            setIsLoading(false)
            console.log('fin')
        }

    useEffect(() => {
        const initialValues = {
                email: ''
        }
        setOldValues(initialValues);
    }, [])
    return(
        <div className={`${styles.allViewPort} row`}>
                <div className='col'></div>
                <div className='col-sm-7'>
                    <div className='card'>
                        <div className={`${styles.center} card-body`} >
                            <Form title="¿Has olvidado tu contraseña?" onSubmit={forgetPwd} oldValues={oldValues}>
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
                                <div className='container-fluid' style={{padding:0}}>
                                    <p style={{fontSize:'14px'}}>Enviaremos un enlace para empezar proceso de restablecer contraseña a este email si coincide con una cuenta de CoWorld existente.</p>
                                </div>                                    
                                <Form.SubmitButton text="ENTRAR" loading={isLoading}/>
                                <div className={`${styles.center} container`}>
                                <a href="/" className="link-secondary fw-bold" style={{textDecoration:'none', fontSize:'20px'}}>Volver</a>
                                </div>
                            </Form>
                        </div>     
                    </div>                   
                </div>
                <div className='col'></div>
            </div>
    );
}