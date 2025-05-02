'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { certification, FormProperties } from "../../../../context/FormContext";
import { UserContext } from "../../../../context/UserContext";
import { useSnipper } from "hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "../../../../context/ToastContext";

export default function addCertificationPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues:certification = {
                title: '',
                emitter: ''
            }
            setOldValues(initialValues)
        }
    }
    , [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div>
    }


    const add = async (data:any)=>{
        setIsLoading(true)        
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{...data, newCertification:true},{
                withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            getUser()
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{
            router.push('/home/profile')
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Añadir una licencia o certificacion" onSubmit={add} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/>
                    <Form.Input 
                        id="title" 
                        htmlfor="title"
                        label="Nombre de la certificacion" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Titulo es necesario!'/>
                    <div className="col"/>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/>
                    <Form.Input 
                        id="emitter"
                        htmlfor="emitter" 
                        label="Nombre del emisor" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Emisor es necesario!'/>
                    <div className="col"/>
                </div>
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}