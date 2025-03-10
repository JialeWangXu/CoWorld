'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";


export default function editDescriptionPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues = {
                description: user.description
            }
            console.log(initialValues)
            setOldValues(initialValues)
        }
    }, [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }

    const edit = async (data:any)=>{
        console.log('Editar descripcion personal')
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
            <Form title="Editar información personal" onSubmit={edit} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.TextAreas 
                        id="description"
                        placeholder="Cuéntenos algo sobre usted! :D"
                        className='form col-sm-12' />
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}