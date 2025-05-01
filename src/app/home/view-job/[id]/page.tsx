'use client'
import { useContext, useEffect, useState } from "react"
import axiosInstance from "lib/axiosInterceptor"
import { IJobAndCompany } from "types/JobFilter"
import { useParams } from "next/navigation";
import styles from './../../styles.module.scss'
import { IJob } from "models/Job";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { Spinner } from '../../../components/Spinner'
import { DetailPageSkeleton } from "app/components/DetailPageSkeleton";
import { AUDITIVA, DISABILITIES_INITIAL_VALUE, FISICA, HABLAR, INTELECTUAL, MENTAL, PLURIDISCAPACIDAD, VISUAL} from "util/constants";
import { ToastContext } from "app/context/ToastContext";


export default function jobViewPage(){

    const initialJob:IJob={
        companyName:"",
        currentStatus: "active",
        jobTitle: "",
        city: "",
        mode: "",
        workHours:"",
        experience: "",
        intership: false,
        workCategory: "",
        disabilities:DISABILITIES_INITIAL_VALUE,
        minumumEducation:"",
        languages:[],
        requiredKnowledge:[],
        companysRequirements:"",
        description:"",
        applicants:[],
        company_id:null
    }
    const initalIJobAndCompany:IJobAndCompany={
        ...initialJob,
        _id:null,
        company_id:{
            company_id: null,
            companyName: "",
            logo: "",
            scale: "",
            industry: ""
        }
    }
    const [job, setJob] = useState<IJobAndCompany>(initalIJobAndCompany);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);
    const [disableApply, setdisableApply] = useState(false);
    const params = useParams<{ id: string}>()
    const {user, waiting, getUser} = useContext(UserContext);
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);

    useEffect(()=>{

        setLoading(true);

            const fetchJob = async() =>{
                try{
                    const {data} = await axiosInstance.post(`/candidate-home/get-job` ,{id:params.id},{
                        withCredentials:true
                    
                    })
                    setError("");
                    setJob(data.job)
                    if(data.job.applicants.find(elem => elem.user===user.user_id)){
                        setdisableApply(true);
                    }
                    if(user?.savedJob.includes(data.job._id)){
                        setSaved(true);
                    }else{
                        setSaved(false);
                    }
                }catch(e){
                    setError("Hubido error al cargar datos de la oferta...");
                    console.log("Error al cargar el trabjo... check it out:"+e)
                }finally{
                    setLoading(false);
                }
            }
            fetchJob();
    },[waiting,user,saved,disableApply])

    if (loading||waiting) {
        return <DetailPageSkeleton/>
    }
    if (error) {
        return <div>Error al cargar datos.</div> 
    }

    const handleSaveJob= async()=>{
        setIsLoading(true)
        try{
            const response = await axiosInstance.post(`/candidate-home/save-job`,{job:job._id},{
                withCredentials:true
        })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            getUser()
            setSaved(saved? false:true);
            setIsLoading(false);
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
            setIsLoading(false);
        }
    }

    const handleApplyJob= async()=>{
        setIsLoading(true)
        setdisableApply(true)
        try{
            const response = await axiosInstance.post(`/candidate-home/apply-job`,{job:job._id},{
                withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            if(user.savedJob.find(elem => elem===job._id)){
                try{
                    const response = await axiosInstance.post(`/candidate-home/save-job`,{job:job._id},{
                        withCredentials:true
                    })
                    showToast({msg:response.data.sucess, type:'Good',visible:true})
                    getUser()
                    setSaved(!saved)
                }catch(e:any){
                    showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
                }
            }
            setIsLoading(false);

        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
            setdisableApply(false);
            setIsLoading(false);
        }
    }

    return(
    <div>
        <div className="container-fluid" style={{ padding:"1.5rem"}}>

            <div className="row">
            <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem",marginRight:"1rem",marginBottom:"1rem"}}>
                    <div className="col-6" style={{paddingLeft:0}}>
                        <h2 style={{fontWeight:"bold"}}>{job?.jobTitle}</h2>
                        <p style={{fontSize:"20px"}}>{job?.city} | {job?.mode}</p>
                        {(job.currentStatus==="closed")?(<div style={{display:"flex"}}><h6 style={{color:"red"}}>Ya no se aceptan solicitudes 🚫</h6></div>):(disableApply)?(<div id="alreadyApplicatedMessage" aria-live="polite" style={{display:"flex", justifyContent:"center"}}><p style={{fontWeight:"600", fontSize:"1rem"}}>Ha aplicado el puesto, esté atento a la notificación por correo electrónico o teléfono. ¡Buena suerte! &#128521;</p></div>):( <div style={{display:"flex", gap:"8px", flexDirection:"row"}}>
                                <button type="button" aria-controls="alreadyApplicatedMessage" className="btn btn-success btn-lg" style={{fontWeight:"bold"}} onClick={handleApplyJob} disabled={isLoading&&disableApply}>{(isLoading&&disableApply)?<Spinner/>:"Aplicar ahora"}</button > 
                                <button type="button" className="btn btn-outline-success btn-lg" disabled={isLoading} onClick={handleSaveJob}>{(isLoading)? <Spinner/> : saved?"Quitar de guardados":"Guardar"}</button>
                        </div>)}
                    </div>
                    <div className="col-6">
                        <div className="row" style={{display:"flex", flexWrap:"nowrap",alignItems:"center"}}>
                            <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end", alignItems:"end"}} >
                                <h2 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h2>
                                <p style={{fontSize:"1.25rem"}}>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</p>
                                <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} style={{color:"#145a32 "}}>Ver perfil de la empresa</a>
                            </div>
                            <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center', marginLeft:"15px"}}>
                            <img src={ job.company_id?.logo as Base64URLString||"/imgs/company.png"} 
                                    alt="logo de empresa" style={{width:'90px',height:'90px', borderRadius:'100%'}}/>
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>            
            </div>
            <div className="row" style={{display:"flex", gap:"8px", flexWrap:"wrap", margin:"1rem", flexDirection:"row"}}>

            {
                job.city&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/location.png" alt="Icono de localización."/><p className={ `${styles.jobDetailText}`}>{job.city}</p></div>)
            }
            {
                job.mode&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/suitcase.png" alt="Icono de modo de trabajo."/><p className={ `${styles.jobDetailText}`}>{job.mode}</p></div>)
            }
            {
                job.workHours&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/time.png" alt="Icono de horario de trabajo."/><p className={ `${styles.jobDetailText}`}>{job.workHours}</p></div>)
            }
            {
                job.experience&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/expertise.png" alt="Icono de experiencia requerida de trabajo."/><p className={ `${styles.jobDetailText}`}>{job.experience==="No requerido"? job.experience+" experiencia": job.experience}</p></div>)
            }
            {
                job.intership&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/internship.png" alt="Icono de si el trabajo busca becario."/><p className={ `${styles.jobDetailText}`}>Becario</p></div>)
            }

            </div>

            <div className="row" style={{margin:"1rem"}}>
            <p style={{paddingLeft:0, fontWeight:"bold",marginBottom:"1rem", fontSize:"1.25rem"}}>Las restricciones disponibles para cada tipo de discapacidad son: </p>
            {   

            job.disabilities.map((elem)=>(
                <div key={elem.type} className={ `${styles.disbilityCard}`} 
                style={elem.type===FISICA? {backgroundColor: "#f5b7b1"}: elem.type===AUDITIVA?{backgroundColor: "#fad7a0"}:
                elem.type===VISUAL?{backgroundColor: "#f9e79f"}:elem.type===HABLAR?{backgroundColor: "#abebc6"}:
                elem.type===MENTAL?{backgroundColor: "#a9cce3"}:elem.type===INTELECTUAL?{backgroundColor: "#aed6f1"}:elem.type===PLURIDISCAPACIDAD?{backgroundColor: "#d7bde2"}:{}}>
                <p style={{fontWeight:"bolder", fontSize:"1rem"}}>{"Discapacidad "+elem.type}</p>
                <p> {elem.degree===-1? "No hay restricciones en cuanto al grado de esta discapacidad.":"Grado "+elem.degree+" o inferior."}</p>
                </div>
            ))
            }
            </div>

        </div>
        <hr/>
        <div className="container-fluid" style={{ padding:"1.5rem"}}>

            <div className={`${styles.jobRequirementCard} container-fluid`}>
                <h3 style={{fontWeight:"bold", marginBottom:".5rem"}}>Requisitos</h3>
                <h4 style={{fontWeight:"bold"}}>Estudios mínimos</h4>
                {
                    <p style={{fontSize:"1.2rem"}}>{job.minumumEducation? job.minumumEducation:"No especificado."}</p>
                }
                <h4 style={{fontWeight:"bold"}}>Idiomas</h4>
                {
                    job.languages?
                    job.languages.map((elem)=>(
                        <p key={elem.language} style={{fontSize:"1.2rem"}}>{elem.language} - {elem.level}</p>
                    ))
                    :<p style={{fontSize:"1.2rem"}}>No requerido.</p>
                }
                <h4 style={{fontWeight:"bold"}}>Experiencia mínima</h4>
                {
                    <p style={{fontSize:"1.2rem"}}>{job.experience? job.experience:"No espcificado."}</p>
                }
                <h4 style={{fontWeight:"bold"}}>Conocimientos requeridos</h4>
                {
                    job.requiredKnowledge?
                    job.requiredKnowledge.map((elem)=>(
                        <p key={elem} style={{fontSize:"1.2rem"}}>{elem}</p>
                    ))
                    :<p style={{fontSize:"1.2rem"}}>No especificado.</p>
                }
                <h4 style={{fontWeight:"bold"}}>Requerimientos mínimos para el puesto:</h4>
                {
                    <p style={{fontSize:"1.2rem"}}>{job.companysRequirements? job.companysRequirements:"No espcificado."}</p>
                }
            </div>
            <div className={`${styles.jobRequirementCard} container-fluid`}>
                <h3 style={{fontWeight:"bold", marginBottom:".5rem"}}>Descripción del puesto</h3>
                {
                    <p style={{fontSize:"1.2rem"}}>{job.description? job.description: "La empresa no ha añadido una descripción a esta oferta."}</p>
                }
            </div>
            {(job.currentStatus==="closed")?(<div style={{display:"flex", justifyContent:"center"}}><h6 style={{color:"red"}}>Ya no se aceptan solicitudes 🚫</h6></div>):(disableApply&&job.currentStatus!=="closed")?(<div id="alreadyApplicatedMessage2" aria-live="polite" style={{display:"flex", justifyContent:"center"}}><p style={{fontWeight:"600", fontSize:"1rem"}}>Ha aplicado el puesto, esté atento a la notificación por correo electrónico o teléfono. ¡Buena suerte! &#128521;</p></div>):( <div style={{display:"flex", gap:"8px", flexDirection:"row", justifyContent:"center"}}>
                    <button type="button" aria-controls="alreadyApplicatedMessage2" className="btn btn-success btn-lg" style={{fontWeight:"bold"}} onClick={handleApplyJob} disabled={isLoading&&disableApply}>{(isLoading&&disableApply)?<Spinner/>:"Aplicar ahora"}</button > 
                    <button type="button" className="btn btn-outline-success btn-lg" disabled={isLoading} onClick={handleSaveJob}>{(isLoading)? <Spinner/> : saved?"Quitar de guardados":"Guardar"}</button>
            </div>)}
        </div>

    </div>
    )
}