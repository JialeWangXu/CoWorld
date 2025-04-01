'use client'
import { useContext, useEffect, useState } from "react";
import { CompanyContext } from "app/context/CompanyContext";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";
import { ListsSkeleton } from "app/components/ListsSkeleton";

export default function ViewCandidatePage(){
    
        const {company,getCompany,waiting} = useContext(CompanyContext)
        const [jobList, setJoblist] = useState([]);
        const router = useRouter();
        useEffect(()=>{
            if(company?.jobs){
                setJoblist(company.jobs);
            }
        },[company?.jobs])    
    
        if (waiting) {
            return <ListsSkeleton/>
        }
        if (!company) {
            return <div>No Company</div> 
        }
    

    return(
        <div className="container"> 
            <h2 style={{marginBottom:"1.2rem"}}> { jobList.length > 0 ? ("Elegir una oferta para ver candidatos: ") : (<>No tienes ningún trabajo de momento, <a href='/company-home' className='link-success'>¡ve a publicar una oferta!</a> &#128204;</>) }</h2>
            {jobList.length>0&&(<div className="container-fluid">
                {jobList.map((job,index) =>(
                    <div className="row" key={index} style={{marginBottom:"15px"}}>
                        <div className="col"/>
                        <div className={`${styles.jobCard} col-md-10 col-sm-12`} style={{padding:"20px"}} onClick={()=>{router.push(`/company-home/candidates/${job._id.toString()}`)}}>
                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                            <h6>{job.city} | {job.mode}</h6>
                            <p className={`${styles.text}`}>{job.description}</p>
                        </div>
                        <div className="col"/>
                    </div>
                ))}
            </div>)}
        </div>
    )
}