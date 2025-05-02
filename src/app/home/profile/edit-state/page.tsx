'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "../../../../context/FormContext";
import { UserContext } from "../../../../context/UserContext";
import { useSnipper } from "hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "../../../../context/ToastContext";



export default function editStatePage(){
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
            setOldValues(initialValues)
        }
    }, [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div>
    }

    const edit = async (data:any)=>{
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
            <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}> 
                <div className="col"></div>
                    <Form.StateSelect
                        id="state"
                        htmlfor="state"
                        label="Estado actual: "
                        className='col-md-8'
                    />
                    <div className="col"></div>
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                <div className="col"></div>
                    <Form.Checkbox 
                        id="huntingJob" 
                        htmlfor="huntingJob" 
                        label="Buscando trabajo: " 
                        className="col-md-8"
                    />
                    <div className="col"></div>
                </div> 
                <div className="row" style={{marginBottom:'30px'}}>
                    <div className="col"></div>
                    <Form.TagInput 
                        id="desiredJob"
                        htmlfor="desiredJob" 
                        label="Puestos de trabajo que busco:" 
                        placeholder="Escribe un puesto de trabajo"
                        maxTag={5}
                        unit="trabajos"
                        warning="Has alcanzado el límite de trabajos, elimina uno para añadir otro."
                        className='col-md-8' />
                    <div className="col"></div>
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}