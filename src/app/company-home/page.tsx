"use client"
import {  useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import styles from './styles.module.scss'
import { CompanyContext } from "app/context/CompanyContext";
import { ListsSkeleton } from "app/components/ListsSkeleton";

export default function CompanyJobListPage() {
    
    const [inProgress, setInProgress] = useState(true);
    const [activePage, setActivePage] = useState('EnCurso');
    const [actives, setActives] = useState(0);
    const [closed, setClosed] = useState(0);

    const router = useRouter();
    const {company,getCompany,waiting} = useContext(CompanyContext)

    useEffect(()=>{
        if(company?.jobs){
            setActives(company.jobs.filter((job) => job.currentStatus==="active").length);
            setClosed(company.jobs.filter((job) => job.currentStatus==="closed").length);
        }
    },[company?.jobs])    

    if (waiting) {
        return <ListsSkeleton/>
    }
    if (!company) {
        return <div>No Company</div> 
    }

    const jobList = inProgress? company.jobs.filter((job) => job.currentStatus==="active") : company.jobs.filter((job) => job.currentStatus==="closed");

    return (
        <div className="container-fluid">
            <div className="row" style={{marginBottom:"1.5rem"}}>
                <div className="col-md-6 col-sm-12" style={{display:'flex', alignItems:"center", gap:'5px', fontSize:"1.8rem"}}>  
                    <a className={`${styles.hov} nav-link ${activePage ==='EnCurso' ? styles.active : ''}`}  href="#"
                            onClick={()=>{setActivePage("EnCurso"), setInProgress(true)}} style={{fontSize:"1.8rem"}}> {`En curso (${actives})`} </a> | <a className={`${styles.hov} nav-link ${activePage ==='Cerrado' ? styles.active : ''}`} href="#"
                            onClick={()=>{setActivePage("Cerrado"), setInProgress(false)}} style={{fontSize:"1.8rem"}}> {`Cerrado (${closed})`} </a>
                </div> 
                <div className="col"></div>
                <div className="col-md-3 col-sm-12">
                    <div  style={{margin:'10px', textAlign:'center'}}>
                        <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" onClick={()=>{router.push('/company-home/edit-job')}} >Publicar nueva oferta</button>
                    </div>
                </div>
            </div>
            {jobList.length > 0 ? (
                jobList.map((job, index) => (
                    <div className="row" key={index} style={{marginBottom:"15px"}}>
                        <div className="col"/>
                        <div className={`${styles.jobCard} col-md-10 col-sm-12`} style={{padding:"20px"}}>
                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                            <h6>{job.city} | {job.mode}</h6>
                            <p className={`${styles.text}`}>{job.description}</p>
                            <div className="justify-content-end">
                                <button type="button" className="btn btn-light" onClick={()=>{router.push(`/company-home/edit-job/${job._id.toString()}`)}}>Modificar</button>
                            </div>
                        </div>
                        <div className="col"/>
                    </div>
                ))
            ) : (
                <div className="row">
                    <div className="col-sm-12" style={{fontSize:"1.4rem", color:"GrayText", fontWeight:"500"}}> No tienes trabajos {inProgress? "en curso" : "cerrados"}</div>
                </div>
            )}
        </div>
    );
}