'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties, study } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";

export default function addStudyPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const [cursando, setCursando] = useState(false);
    const router = useRouter()
    const [error, setError] = useState('')
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues:study = {
                institution: '',
                title: '',
                specialty: '',
                iniDate:{
                    month: 0,
                    year: 0
                },
                finDate:null
            }
            setOldValues(initialValues)
        }
    }
    , [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }


    const add = async (data:any)=>{
        console.log('Aniadir 1 estudio personal')

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
           const response = await axiosInstance.post(`/profile/edit-profile`,{...finalData, newStudy:true},{
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
            <Form title="Añadir un estudio" onSubmit={add} oldValues={oldValues}>
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
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}