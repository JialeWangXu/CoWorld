'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { certification, FormProperties, language, workExperience } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";

export default function addLanguagePage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues:language = {
                language: '',
                level: ''
            }
            setOldValues(initialValues)
        }
    }
    , [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }


    const add = async (data:any)=>{
        console.log('Aniadir 1 lenguage')
        setIsLoading(true)        
        try{
           const response = await axiosInstance.post(`/profile/edit-profile`,{...data, newLanguage:true},{
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
            <Form title="Añadir un idioma" onSubmit={add} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/>
                    <Form.Input 
                        id="language"
                        htmlfor="language" 
                        label="Nombre del idioma" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                    <div className="col"/>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"/>
                    <Form.LevelSelect 
                        id="level"
                        htmlfor="level"
                        label="Nivel del idioma" 
                        className='col-md-8' />
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