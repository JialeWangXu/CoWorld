'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { HABLAR,FISICA,MENTAL,AUDITIVA,INTELECTUAL,PLURIDISCAPACIDAD,VISUAL } from "util/constants";
import { ToastContext } from "app/context/ToastContext";
import styles from './styles.module.scss'


export default function editInfoPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    useEffect(() => {
        if (!waiting && user) {
            const initialValues = {
                state: user.state,
                huntingJob: user.huntingJob,
                desiredJob: user.desiredJob
            }
            console.log(initialValues)
            setOldValues(initialValues)
        }
    }, [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }

    const edit = async (data:any)=>{
        console.log('Editar estado laboral')
        setIsLoading(true)
        try{
           const response = await axiosInstance.post(`/profile/edit-profile`,data,{
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
            <Form title="Editar Situación laboral y empleos previstos" onSubmit={edit} oldValues={oldValues}>
            <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.StateSelect
                        id="state"
                        htmlfor="state"
                        label="Estado actual: "
                        className='col-sm-12'
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Checkbox 
                        id="huntingJob" 
                        htmlfor="huntingJob" 
                        label="Buscando trabajo: " 
                     />
                </div> 
                <div className="row" style={{marginBottom:'30px'}}>
                    <Form.TagInput 
                        id="desiredJob"
                        htmlfor="desiredJob" 
                        label="Puestos de trabajo que busco:" 
                        placeholder="Escribe un puesto de trabajo"
                        maxTag={5}
                        className='col-md-6' />
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}