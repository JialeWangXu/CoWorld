'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { CompanyContext } from "app/context/CompanyContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { HABLAR,FISICA,MENTAL,AUDITIVA,INTELECTUAL,PLURIDISCAPACIDAD,VISUAL } from "util/constants";
import { ToastContext } from "app/context/ToastContext";

export default function editInfoPage(){
    const {company, waiting, getCompany} = useContext(CompanyContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && company) {
            const initialValues = {
                currentStatus: "active",
                jobTitle: "",
                city: "",
                mode: "",
                workHours:"",
                experience: "",
                intership: false,
                workCategory: "",
                ...Object.fromEntries(
                    [{type:FISICA,degree:-1},{type:AUDITIVA,degree:-1},{type:VISUAL,degree:-1},{type:HABLAR,degree:-1},{type:MENTAL,degree:-1},{type:INTELECTUAL,degree:-1},{type:PLURIDISCAPACIDAD,degree:-1}].map(({ type, degree }) => [type, degree])),
                minumumEducation:"",
                languages:[],
                requiredKnowledge:[],
                companysRequirements:"",
                description:"",
            }
            setOldValues(initialValues)
        }
    }, [waiting, company])

    if(waiting){
        return<div>Cargandno contenido</div>
    }

    const edit = async (data:any)=>{
        setIsLoading(true)
        try{
            const response = await axiosInstance.post(`/company-jobs/add-job`,data,{
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
            <Form title="Publicar una nueva oferta de trabajo" onSubmit={edit} oldValues={oldValues}>
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
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/company-home" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}