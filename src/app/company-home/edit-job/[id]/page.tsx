'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties,newjob } from "app/context/FormContext";
import { CompanyContext } from "app/context/CompanyContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { HABLAR,FISICA,MENTAL,AUDITIVA,INTELECTUAL,PLURIDISCAPACIDAD,VISUAL } from "util/constants";
import { ToastContext } from "app/context/ToastContext";
import styles from './styles.module.scss'


export default function editInfoPage(){
    const {company, waiting, getCompany} = useContext(CompanyContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    const params = useParams<{ id: string}>()
    const [deleted,setDeleted] = useState(false)
    
    useEffect(() => {
        if(deleted){
            router.push("/company-home");
            return
        }
        if (!waiting && company) {
            const job = company.jobs.find((elem)=> elem._id.toString()===params.id);
            const initialValues = {
                currentStatus: job.currentStatus,
                jobTitle: job.jobTitle,
                city: job.city,
                mode: job.mode,
                workHours: job.workHours,
                experience: job.experience,
                intership: job.intership,
                workCategory: job.workCategory,
                ...Object.fromEntries(
                    job.disabilities.map(({ type, degree }) => [type, degree])),
                minumumEducation: job.minumumEducation,
                languages: job.languages,
                requiredKnowledge: job.requiredKnowledge,
                companysRequirements: job.companysRequirements,
                description: job.description,
            }
            console.log(initialValues)
            setOldValues(initialValues)
        }
    }, [waiting, company])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }

    const edit = async (data:any)=>{
        console.log('Editar informacion personal')
        setIsLoading(true)
        try{
           const response = await axiosInstance.post(`/company-jobs/edit-job`,{...data, _id:params.id},{
                withCredentials:true
           })
           showToast({msg:response.data.sucess, type:'Good',visible:true})
           getCompany()
        }catch(e:any){
           showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{
            router.push('/company-home')
        }
    }

    const deleteJob = async ()=>{
        console.log('Eliminar oferta');
        setIsLoading(true);
        setDeleted(true)
        try{
            const response = await axiosInstance.post(`/company-jobs/edit-job`,{_id:params.id, deleteJob:true},{
                withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            getCompany()
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{  
            router.push('/company-home')
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Editar oferta" onSubmit={edit} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.JobStatusSelect
                        id="currentStatus"
                        htmlfor="currentStatus"
                        label="En progreso / Cerrar "
                        className="col-md-12"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="jobTitle" 
                        htmlfor="jobTitle" 
                        label="Titulo de la oferta" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                    <Form.Checkbox
                        id="intership"
                        htmlfor="intership"
                        label="Busca Becario?  "
                        className="col-md-4"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.CitySelect 
                        id="city" 
                        htmlfor="city" 
                        label="Provincia" 
                        className='col-md-3'
                        required={true} />
                    <Form.ModeSelect
                        id="mode"
                        htmlfor="mode"
                        label="Presencial/Remoto"
                        className="col-md-3" />
                    <Form.WorkHoursSelect
                        id="workHours"
                        htmlfor="workHours"
                        label="Jornada laboral"
                        className="col-md-3" />
                    <Form.ExperienceSelect
                        id="experience"
                        htmlfor="experience"
                        label="Experiencia requerida"
                        className="col-md-3" />
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.JobCategorySelect
                        id="workCategory"
                        htmlfor="workCategory"
                        label="Categoría de la oferta"
                        className="col-md-6"
                    />
                    <Form.TitleSelect
                        id="minumumEducation"
                        htmlfor="minumumEducation"
                        label="Estudios mínimos"
                        className="col-md-6"                        
                    />
                </div>
                <hr/> 
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DegreeSelect
                        id={FISICA}
                        htmlfor={FISICA}
                        label="Discapcidad Física"
                        className='col-md-3'
                    />
                    <Form.DegreeSelect
                        id={AUDITIVA}
                        htmlfor={AUDITIVA}
                        label="Discapcidad auditiva"
                        className='col-md-3'
                    />
                    <Form.DegreeSelect
                        id={VISUAL}
                        htmlfor={VISUAL}
                        label="Discapcidad visual"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={HABLAR}
                        htmlfor={HABLAR}
                        label="Trastorno del hablar"
                        className="col-md-3"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DegreeSelect
                        id={MENTAL}
                        htmlfor={MENTAL}
                        label="Discapcidad mental"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={INTELECTUAL}
                        htmlfor={INTELECTUAL}
                        label="Discapcidad intelectual"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={PLURIDISCAPACIDAD}
                        htmlfor={PLURIDISCAPACIDAD}
                        label="Pluridiscapacidad"
                        className="col-md-3"
                    />
                </div> 
                <hr/>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.LanguageInput 
                        id="languages" 
                        htmlfor="languages" 
                        label="Idiomas de la oferta"  
                        className='col-md-12' />
                </div>
                <div className="row" style={{marginBottom:'30px'}}>
                    <Form.TagInput
                        id="requiredKnowledge"
                        htmlfor="requiredKnowledge"
                        label="Conocimientos necesarios"
                        maxTag={40}
                        className="col-md-12"
                    />
                </div >
                <div className="row" style={{marginBottom:'20px'}}>
                    <label className='form-label'>Más requisitos del puesto para la empresa</label>
                    <Form.TextAreas
                        id="companysRequirements"
                        placeholder="Puede completar más requisitos en aqui!"
                        className="col-md-10"
                        row={5}
                        length={5000}
                    />
                </div>
                <hr/>
                <div className="row" style={{marginBottom:'20px'}}>
                    <label className='form-label'>Descripción del puesto</label>
                    <Form.TextAreas
                        id="description"
                        placeholder="Dar un descripción breve para que los aplicantes puede conocer mejor el puesto!"
                        className="col-md-10"
                        row={5}
                        length={5000}
                    />
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
                        <div className="modal fade" id="askAgainModal" tabIndex={-1} aria-labelledby="askAgainModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="askAgainModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Esta seguro de que quiere eliminar esta oferta?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteJob}>Eliminar</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    <Form.Links href="/company-home" text="" linkText='Volver'/>
                </div>    
            </Form>
        </div>
    )
}