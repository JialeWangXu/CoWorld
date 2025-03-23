'use client'
import { useEffect, useState } from "react"
import axiosInstance from "lib/axiosInterceptor"
import { IJobAndCompany } from "types/JobFilter"
import { useParams } from "next/navigation";
import styles from './../../styles.module.scss'
import { IJob } from "models/Job";
import { AUDITIVA, DISABILITIES_INITIAL_VALUE, FISICA, HABLAR, INTELECTUAL, MENTAL, PLURIDISCAPACIDAD, VISUAL} from "util/constants";


export default function jobViewPage(){

    const initialJob:IJob={
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
    const params = useParams<{ id: string}>()

    useEffect(()=>{

        setLoading(true);

        
            const fetchJob = async() =>{
                try{
                    const {data} = await axiosInstance.post(`/candidate-home/get-job` ,{id:params.id},{
                        withCredentials:true
                    
                    })
                    setError("");
                    setJob(data.job)
                }catch(e){
                    setError("Hubido error al cargar datos de la oferta...");
                    console.log("Error al cargar el trabjo... check it out:"+e)
                }finally{
                    setLoading(false);
                }
            }
            fetchJob();
    },[])

    if (loading) {
        return <div>Cargando datos...</div>
    }
    if (error) {
        return <div>Error al cargar datos.</div> 
    }

    return(
    <div>
        <div className="container-fluid" style={{ padding:"1.5rem"}}>

           <div className="row">
            <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem",marginRight:"1rem",marginBottom:"1rem"}}>
                    <div className="col-6" style={{paddingLeft:0}}>
                        <h2 style={{fontWeight:"bold"}}>{job?.jobTitle}</h2>
                        <p style={{fontSize:"20px"}}>{job?.city} | {job?.mode}</p>
                        <div style={{display:"flex", gap:"8px", flexDirection:"row"}}>
                            <button type="button" className="btn btn-success btn-lg" style={{fontWeight:"bold"}}>Aplicar ahora</button > <button type="button" className="btn btn-outline-success btn-lg">Guardar</button>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row" style={{display:"flex", flexWrap:"nowrap",alignItems:"center"}}>
                            <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end", alignItems:"end"}} >
                                <h2 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h2>
                                <h6>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</h6>
                                <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} className="link-success">Ver perfil de la empresa</a>
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
                job.city&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/location.png"/><p className={ `${styles.jobDetailText}`}>{job.city}</p></div>)
            }
            {
                job.mode&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/suitcase.png"/><p className={ `${styles.jobDetailText}`}>{job.mode}</p></div>)
            }
            {
                job.workHours&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/time.png"/><p className={ `${styles.jobDetailText}`}>{job.workHours}</p></div>)
            }
            {
                job.experience&&(<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/expertise.png"/><p className={ `${styles.jobDetailText}`}>{job.experience==="No requerido"? job.experience+" experiencia": job.experience}</p></div>)
            }
            {
                (<div className={ `${styles.jobDetail} col`} style={{marginBottom:"1rem"}}><img src="/imgs/internship.png"/><p className={ `${styles.jobDetailText}`}>Becario</p></div>)
            }

           </div>

           <div className="row" style={{margin:"1rem"}}>
            <h5 style={{paddingLeft:0, fontWeight:"bold",marginBottom:"1rem"}}>Las restricciones disponibles para cada tipo de discapacidad son: </h5>
            {   

            job.disabilities.map((elem)=>(
                <div key={elem.type} className={ `${styles.disbilityCard}`} 
                style={elem.type===FISICA? {backgroundColor: "#f5b7b1"}: elem.type===AUDITIVA?{backgroundColor: "#fad7a0"}:
                elem.type===VISUAL?{backgroundColor: "#f9e79f"}:elem.type===HABLAR?{backgroundColor: "#abebc6"}:
                elem.type===MENTAL?{backgroundColor: "#a9cce3"}:elem.type===INTELECTUAL?{backgroundColor: "#aed6f1"}:elem.type===PLURIDISCAPACIDAD?{backgroundColor: "#d7bde2"}:{}}>
                <h6 style={{fontWeight:"bold"}}>{"Discapacidad "+elem.type}</h6>
                <p> {elem.degree===-1? "No hay restricciones en cuanto al grado de esta discapacidad.":"Grado "+elem.degree+" o inferior."}</p>
                </div>
            ))
            }
           </div>

        </div>
        <hr/>
        <div className="container-fluid" style={{ padding:"1.5rem"}}>

            <div className={`${styles.jobRequirementCard} container-fluid`}>
                <h2 style={{fontWeight:"bold", marginBottom:".5rem"}}>Requisitos</h2>
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
                <h2 style={{fontWeight:"bold", marginBottom:".5rem"}}>Descripción del puesto</h2>
                {
                     <p style={{fontSize:"1.2rem"}}>{job.description? job.description: "La empresa no ha añadido una descripción a esta oferta."}</p>
                }
            </div>
            <div style={{display:"flex", gap:"8px", flexDirection:"row", justifyContent:"center"}}>
                    <button type="button" className="btn btn-success btn-lg" style={{fontWeight:"bold"}}>Aplicar ahora</button > <button type="button" className="btn btn-outline-success btn-lg">Guardar</button>
            </div>
        </div>

    </div>
    )
}