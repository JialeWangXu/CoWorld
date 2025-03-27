'use client'
import { useState, useContext, useEffect } from "react"
import styles from './../styles.module.scss'
import axiosInstance from "lib/axiosInterceptor"
import { IJobAndCompany } from "types/JobFilter"
import { useRouter } from "next/navigation"

export default function ApplicationViewPage(){

    const [activePage,setActivePage] = useState("enCurso")
    const [jobList, setJobList] = useState<IJobAndCompany[]>([]);
    const [savedJobList, setSavedJobList] = useState<IJobAndCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState("");
    const router = useRouter();

    useEffect(()=>{

        const fetchJob = async() =>{
            try{
                setLoading(true);
                const {data} = await axiosInstance.get(`/candidate-home/get-applied-jobs` ,{
                    withCredentials:true
                })
                const savedJob = await axiosInstance.get(`/candidate-home/get-saved-jobs` ,{
                    withCredentials:true
                })
                setError("");
                setJobList(data.job);
                setSavedJobList(savedJob.data.job);
            }catch(e){
                setError("Hubido error al cargar datos de las ofertas...");
                console.log("Error al cargar los trabjos... check it out:"+e)
            }finally{
                setLoading(false);
            }
        }
        fetchJob();

    },[])

    if(loading){
        return <div>Cargando datos...</div>
    }
    if(error){
        return <div>Error al cargar datos...</div>
    }

    const inProgressJobs = jobList.filter(elem => elem.currentStatus==="active").filter(elem => !!elem.applicants.find(i => (i.status === "a comunicar"||"comunicado"))); // para lista en curso
    const activeJobs = jobList.filter(elem => elem.currentStatus==="active").filter(elem => !!elem.applicants.find(i => i.status === "solicitado")); // para lista solicitados
    const closedJobs = jobList.filter(elem => elem.currentStatus==="closed"); // para lista cerrados

    return(
        <div className="container">
            <div className="row">
                <div className="col"></div>
                <div className=" col-sm-10" style={{display:'flex', alignItems:"center",justifyContent:"center", gap:'8px', fontSize:"1.8rem", flexWrap:"wrap"}}>  
                    <a className={`${styles.hovA} nav-link ${activePage ==='guardados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("guardados")}} style={{fontSize:"1.8rem"}}> {`Guardados (${savedJobList.length})`} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='solicitados' ? styles.activeA : ''}`}  href="#"
                    onClick={()=>{setActivePage("solicitados")}} style={{fontSize:"1.8rem"}}> {`Solicitados (${activeJobs.length}) `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='enCurso' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("enCurso")}} style={{fontSize:"1.8rem"}}> {`En curso (${inProgressJobs.length})`} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='cerrados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("cerrados")}} style={{fontSize:"1.8rem"}}> {`Cerrados (${closedJobs.length})`} </a> 
                </div>
                <div className="col"></div>
            </div>
                {activePage==="guardados"&&(
                    (savedJobList.length) > 0 ? (
                        savedJobList.map((job, index) => (
                            <div className="row" key={index} style={{marginTop:"1rem"}}>
                                    <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/home/view-job/${job._id.toString()}`)}}>
                                        <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                                            <div className="col-6" style={{paddingLeft:0}}>
                                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                                            <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                                            </div>
                                            <div className="col-6">
                                                <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                                        <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
                                                        <h6>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</h6>
                                                        <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} className="link-success">Ver perfil de la empresa</a>
                                                    </div>
                                                    <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                                        <img src={ job.company_id.logo as Base64URLString||"/imgs/company.png"} 
                                                        alt="logo de empresa" style={{width:'90px',height:'90px', borderRadius:'100%'}}/>
                                                    </div>
                                                    <div className="col-1" style={{padding:0, width:"36px"}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`${styles.text}`}>{job.description}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="row" style={{marginTop:"1rem"}}>
                            <div className="col-sm-12" style={{display:"flex",fontSize:"1.4rem", color:"GrayText", fontWeight:"500", textAlign:"center", flexDirection:"column", alignContent:"center"}}>
                                <p>No tienes ofertas guardadas</p>
                                <a href="/home" className="link-primary">Ir a ver ofertas</a>
                            </div>
                        </div>)
                    )}
    
                {activePage==="solicitados"&&(
                    (activeJobs.length) > 0 ? (
                        activeJobs.map((job, index) => (
                            <div className="row" key={index} style={{marginTop:"1rem"}}>
                                    <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/home/view-job/${job._id.toString()}`)}}>
                                        <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                                            <div className="col-6" style={{paddingLeft:0}}>
                                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                                            <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                                            </div>
                                            <div className="col-6">
                                                <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                                        <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
                                                        <h6>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</h6>
                                                        <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} className="link-success">Ver perfil de la empresa</a>
                                                    </div>
                                                    <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                                        <img src={ job.company_id.logo as Base64URLString||"/imgs/company.png"} 
                                                        alt="logo de empresa" style={{width:'90px',height:'90px', borderRadius:'100%'}}/>
                                                    </div>
                                                    <div className="col-1" style={{padding:0, width:"36px"}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`${styles.text}`}>{job.description}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="row" style={{marginTop:"1rem"}}>
                            <div className="col-sm-12" style={{display:"flex",fontSize:"1.4rem", color:"GrayText", fontWeight:"500", textAlign:"center", flexDirection:"column", alignContent:"center"}}>
                                <p>No tienes ofertas solicitadas</p>
                                <a href="/home" className="link-primary">Ir a ver ofertas</a>
                            </div>
                        </div>)
                    )}
                    {activePage==="enCurso"&&(
                    (inProgressJobs.length) > 0 ? (
                        inProgressJobs.map((job, index) => (
                            <div className="row" key={index} style={{marginTop:"1rem"}}>
                                    <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/home/view-job/${job._id.toString()}`)}}>
                                        <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                                            <div className="col-6" style={{paddingLeft:0}}>
                                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                                            <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                                            </div>
                                            <div className="col-6">
                                                <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                                        <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
                                                        <h6>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</h6>
                                                        <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} className="link-success">Ver perfil de la empresa</a>
                                                    </div>
                                                    <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                                        <img src={ job.company_id.logo as Base64URLString||"/imgs/company.png"} 
                                                        alt="logo de empresa" style={{width:'90px',height:'90px', borderRadius:'100%'}}/>
                                                    </div>
                                                    <div className="col-1" style={{padding:0, width:"36px"}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`${styles.text}`}>{job.description}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="row" style={{marginTop:"1rem"}}>
                            <div className="col-sm-12" style={{display:"flex",fontSize:"1.4rem", color:"GrayText", fontWeight:"500", textAlign:"center", flexDirection:"column", alignContent:"center"}}>
                                <p>De momento no tienes ofertas en curso</p>
                                <a href="/home" className="link-primary">Ir a ver ofertas</a>
                            </div>
                        </div>)
                    )}
                    {activePage==="cerrados"&&(
                    (closedJobs.length) > 0 ? (
                        closedJobs.map((job, index) => (
                            <div className="row" key={index} style={{marginTop:"1rem"}}>
                                    <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/home/view-job/${job._id.toString()}`)}}>
                                        <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                                            <div className="col-6" style={{paddingLeft:0}}>
                                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                                            <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                                            </div>
                                            <div className="col-6">
                                                <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                                        <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
                                                        <h6>{job.company_id?.industry ? job.company_id?.industry:""}  {job.company_id?.scale ? job.company_id?.scale+" empleos":""}</h6>
                                                        <a href={`/home/view-company/${job.company_id?.company_id?.toString()}`} className="link-success">Ver perfil de la empresa</a>
                                                    </div>
                                                    <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                                        <img src={ job.company_id.logo as Base64URLString||"/imgs/company.png"} 
                                                        alt="logo de empresa" style={{width:'90px',height:'90px', borderRadius:'100%'}}/>
                                                    </div>
                                                    <div className="col-1" style={{padding:0, width:"36px"}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`${styles.text}`}>{job.description}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="row" style={{marginTop:"1rem"}}>
                            <div className="col-sm-12" style={{display:"flex",fontSize:"1.4rem", color:"GrayText", fontWeight:"500", textAlign:"center", flexDirection:"column", alignContent:"center"}}>
                                <p>No tienes ofertas cerradas</p>
                                <a href="/home" className="link-primary">Ir a ver ofertas</a>
                            </div>
                        </div>)
                    )}
                    
            
        </div>
    )
}