'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import {  FormProperties, operator } from "app/context/FormContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";

export default function addCertificationPage(){

    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    
    const router = useRouter()
    
    useEffect(() => {

        const initialValues = {
            firstname: '',
            lastname: '',
            email: '',
            changedPassword: false,
            role: 2,
            company_id: undefined
        }
        setOldValues(initialValues)
    }, [])

    const add = async (data:any)=>{
        console.log('Aniadir 1 operator')
        setIsLoading(true)        
        try{
            const response = await axiosInstance.post(`/company-operator/add-operator`,{...data},{
                withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{
            router.push('/company-home/operators')
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Añadir un operador" onSubmit={add} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}>
                    <div className="col"/>
                    <Form.Input 
                        id="firstname" 
                        htmlfor="firstname"
                        label="Nombre" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                    <div className="col"/> 
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/>
                    <Form.Input 
                        id="lastname"
                        htmlfor="lastname" 
                        label="Apellidos" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Apellidos es necesario!'/>
                    <div className="col"/> 
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/> 
                    <Form.Input 
                        id="email"
                        htmlfor="email" 
                        label="Email" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        placeholder="El email se usará para iniciar sesión"
                        validationClass='invalid-feedback'
                        validationMsg='Email es necesario!'/>
                    <div className="col"/> 
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <p style={{color:"GrayText"}}>Le enviaremos un correo electrónico a la dirección proporcionada para notificarle que debe cambiar su contraseña e iniciar sesión.</p>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}