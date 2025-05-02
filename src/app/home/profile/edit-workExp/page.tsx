'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties, workExperience } from "../../../../context/FormContext";
import { UserContext } from "../../../../context/UserContext";
import { useSnipper } from "hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "../../../../context/ToastContext";

export default function addWorkExpPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const [trabajando, setTrabajando] = useState(false);
    const router = useRouter()
    const [error, setError] = useState('')
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues:workExperience = {
                responsability: '',
                companyName: '',
                contractType: '',
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
        return<div>Cargandno contenido</div>
    }


    const add = async (data:any)=>{
        const {finDate, iniDate, ...rest} = data
        if(!trabajando){
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
        if(trabajando){
            finalData = {...rest, iniDate}
        }
        setIsLoading(true)        
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,{...finalData, newWork:true},{
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
            <Form title="Añadir una experiencia laboral" onSubmit={add} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="responsability" 
                        htmlfor="responsability" 
                        label="Nombre del puesto" 
                        type="text" 
                        className='col-sm-12' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre del puesto es necesario!'/>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="companyName"
                        htmlfor="companyName" 
                        label="Nombre de la empresa" 
                        type="text" 
                        className='col-sm-12' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre de la empresa es necesario!'/>
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.ContractTypeSelect
                        id="contractType" 
                        htmlfor="contractType"
                        label="Tipo de contrato: " 
                        className='col-sm-12' />
                </div> 
                <div className="row" style={{marginBottom:'20px', display: 'flex', alignItems: 'center', gap: '8px'}}> 
                    <label>Trabajando actualmente: <input type="checkbox" checked={!!trabajando} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{setTrabajando(event.target.checked? true:false)}}></input></label>
                </div>
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DateInput 
                        id="iniDate" 
                        label="Fecha de inicio" 
                        type="number" 
                        className='input-group col-sm-4' />
                    { trabajando ? null :   
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