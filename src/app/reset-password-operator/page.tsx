'use client'
import { Form } from '../components/Form';
import { useSnipper } from "hooks/useSnipper";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthFetch } from "hooks/useAuthFetch";
import styles from './styles.module.scss'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AxiosRequestConfig } from 'axios';
import { FormProperties } from '../../context/FormContext';

export default function ResetPwdPage(){
    const [token, setToken] = useState<string | null>(null);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const searchParams = useSearchParams();
    const {isLoading,setIsLoading} = useSnipper()
    const authFetch = useAuthFetch()

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) setToken(urlToken);
        const initialValues = {
            tempPwd:'',
            pwd: '',
            confirmpwd: ''
        }
        setOldValues(initialValues);
    }, [searchParams]);
    
    
    const resetPwd = async(data:any)=>{
        setIsLoading(true)
        console.log('obtengo token:')
        console.log(token)
        const config:AxiosRequestConfig<any> ={
            headers:{
                token: token ?? ''
            }
        }
        await authFetch({endpoint:'/reset-pwd-operator',nextPath:'/company-login',fetchdata:data,config:config})
        setIsLoading(false)
    }

    return(
        <div className={`${styles.allViewPort} row`}>
                <div className='col'></div>
                <div className='col-md-7 col-sm-12'>
                    <div className='card'>
                        <div className={`${styles.center} card-body`} >
                            <Form title="Cambiar su contraseña" onSubmit={resetPwd} oldValues={oldValues}>
                                <Form.Input 
                                    id="tempPwd" 
                                    htmlfor="tempPwd" 
                                    label="CONTRASEÑA TEMPORAL" 
                                    type="password" 
                                    placeholder="Introduce tu contraseña temporal" 
                                    className='mb-3' 
                                    required={true}
                                />
                                <Form.Input 
                                    id="pwd" 
                                    htmlfor="pwd" 
                                    label="NUEVA CONTRASEÑA" 
                                    type="password" 
                                    help={true}
                                    placeholder="Introduce tu nueva contraseña" 
                                    className='mb-3' 
                                    required={true}
                                />
                                <Form.Input 
                                    id="confirmpwd" 
                                    htmlfor="confirmpwd" 
                                    label="CONFIRMAR CONTRASEÑA" 
                                    type="password" 
                                    placeholder="Confirmar tu nueva contraseña" 
                                    className='mb-3' 
                                    required={true}
                                />                                
                                <Form.SubmitButton text="RESTABLECER" loading={isLoading}/>
                            </Form>
                        </div>     
                    </div>                   
                </div>
                <div className='col'></div>
            </div>
    );
}