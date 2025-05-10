'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties, study } from "../../../../../context/FormContext";
import { UserContext } from "../../../../../context/UserContext";
import { useSnipper } from "hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "../../../../../context/ToastContext";
import { useParams } from 'next/navigation';



export default function editStudyPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const [cursando, setCursando] = useState(false);
    const router = useRouter()
    const [error, setError] = useState('')
    const params = useParams<{ index: string}>()
    const [deleted,setDeleted] = useState(false)
    
    useEffect(() => {
        if(deleted){
            router.push('/home/profile')
            return
        }
        if (!waiting && user) {
            const study = user.studies[parseInt(params.index)];
            const initialValues:study = {
                institution: study.institution,
                title: study.title,
                specialty: study.specialty,
                iniDate: study.iniDate,
                finDate: study.finDate,
            }
            setOldValues(initialValues)
            setCursando(!study.finDate)
        }
        
    }
    , [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div>
    }


    const update = async (data:any)=>{
        const {finDate, iniDate, ...rest} = data
        if(!cursando){
            if(finDate===undefined ){
                setError('Fecha de fin no puede ser nula')
                return
            }
            if(finDate.year < iniDate.year || (finDate.year === iniDate.year && finDate.month < iniDate.month)){
                setError('Fecha de fin no puede ser anterior a la fecha de inicio')
                return
            }
        }
        setError('')

        var finalData = data;
        if(cursando){
            finalData = {...rest, iniDate}
        }
        setIsLoading(true)        
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{...finalData, modifyStudy:true, index:params.index},{
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

    const deleteStudy = async ()=>{
        setIsLoading(true);
        setDeleted(true)
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{index:params.index, deleteStudy:true},{
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
            <Form title="Modificar un estudio" onSubmit={update} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="institution" 
                        htmlfor="institution" 
                        label="Centro de estudios" 
                        type="text" 
                        className='col-sm-12' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.TitleSelect 
                        id="title" 
                        htmlfor="title" 
                        label="Título" 
                        className='col-sm-12' />
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="specialty"
                        htmlfor="specialty" 
                        label="Especialidad" 
                        type="text" 
                        className='col-sm-12' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Especialidad es necesario!'/>
                </div>
                <div className="row" style={{marginBottom:'20px', display: 'flex', alignItems: 'center', gap: '8px'}}> 
                    <label>Cursando actualmente <input type="checkbox" checked={!!cursando} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{setCursando(event.target.checked? true:false)}}></input></label>
                </div>
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DateInput 
                        id="iniDate" 
                        label="Fecha de inicio" 
                        type="number" 
                        className='input-group col-sm-4' />
                    { cursando ? null :   
                    <Form.DateInput 
                        id="finDate" 
                        label="Fecha Fin" 
                        type="number" 
                        className=' input-group col-sm-6' />}
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </div> 
                <div className='text-center'>
                    <div className="row" >
                        <div className="col-md-6 col-sm-12">
                        <Form.SubmitButton text="Guardar" loading={isLoading}/>
                        </div>
                        <div className="col-md-6 col-sm-12">  
                        <button type="button" className="col-6 btn btn-danger" data-bs-toggle="modal" data-bs-target="#askAgainModal" style={{width:'70%', height:'3.5rem'}}>
                        Eliminar
                        </button>
                        </div>  
                    </div>
                        <div className="modal fade" id="askAgainModal" tabIndex={-1} aria-labelledby="askAgainModalLabel" >
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="askAgainModalLabel">Eliminar estudio</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Esta seguro de que quiere eliminar este estudio?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteStudy}>Eliminar</button>
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