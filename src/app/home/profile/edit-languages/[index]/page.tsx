'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties, language } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";
import { useParams } from 'next/navigation';



export default function editCertificationPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    const params = useParams<{ index: string}>()
    const [deleted,setDeleted] = useState(false)
    
    useEffect(() => {
        if(deleted){
            router.push('/home/profile')
            return
        }
        if (!waiting && user) {
            const language = user.languages[parseInt(params.index)];
            const initialValues:language = {
                language: language.language,
                level: language.level
            }
            setOldValues(initialValues)
        }
        
    }
    , [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div>
    }


    const update = async (data:any)=>{
        setIsLoading(true)        
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{...data, modifyLanguage:true, index:params.index},{
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

    const deleteLanguage = async ()=>{
        setIsLoading(true);
        setDeleted(true)
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{index:params.index, deleteLanguage:true},{
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
            <Form title="Modificar un idioma" onSubmit={update} oldValues={oldValues}>
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
                    <div className="row" >
                    <div className="col"/>
                        <div className="col-md-4 col-sm-12">
                        <Form.SubmitButton text="Guardar" loading={isLoading}/>
                        </div>
                        <div className="col-md-4 col-sm-12">  
                        <button type="button" className="col-6 btn btn-danger" data-bs-toggle="modal" data-bs-target="#askAgainModal" style={{width:'65%', height:'3.5rem'}}>
                        Eliminar
                        </button>
                        </div>  
                    <div className="col"/>
                    </div>
                        <div className="modal fade" id="askAgainModal" tabIndex={-1} aria-labelledby="askAgainModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="askAgainModalLabel">Eliminar idioma</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Esta seguro de que quiere eliminar este idioma?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteLanguage}>Eliminar</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}