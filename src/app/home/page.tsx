"use client"

import JobFilter from "app/components/JobFilters";
import { useState, useEffect } from "react";
import useLocalStorage from "app/hooks/useLocalStorage";
import axiosInstance from "lib/axiosInterceptor";
import { IJobAndCompany, JobFilters } from "types/JobFilter";
import { DISABILITIES_INITIAL_VALUE } from "util/constants";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";

export default function HomePage(){

    // tengo que hacer 1 esqueleto para cuando carga...
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [debounce, setDebounce] = useState<NodeJS.Timeout>()
    const router = useRouter();
    const [filter, setFilter] = useLocalStorage<JobFilters>("JobFilters",{
        city:[],
        disabilities:DISABILITIES_INITIAL_VALUE,
        mode:[],
        workHours:[],
        workCategory:[],
        experience:"",
        minumumEducation:[],
        intership:false
    })
    const [jobList, setJobList] = useState<IJobAndCompany[]>([]);

    useEffect(()=>{
        const controller = new AbortController();

        const fetchFilteredJobs = async ()=>{

            try{
                
                // convertimos filtros como parametros de url antes de hacer llamada
                const param ={
                    city: filter.city.join(','),
                    disabilities: encodeURIComponent(JSON.stringify(filter.disabilities)),
                    mode: filter.mode.join(','),
                    workHours: filter.workHours.join(','),
                    workCategory: filter.workCategory.join(','),
                    experience: filter.experience,
                    minumumEducation: filter.minumumEducation.join(','),
                    intership:filter.intership
                }
                setLoading(true);

                const {data} = await axiosInstance.get(`/candidate-home/get-jobs` ,{
                    params: param,
                    withCredentials:true,
                    signal:controller.signal
                })

                setJobList(data.jobList);
                setError("")

            }catch(e){
                if(!controller.signal.aborted){
                    setError("Error al cargar los datos de trabajos filtrados");
                    console.log("ERRORRRRRR CARGAR TRABAJOS FILTRADOS",e);
                }
            }finally{
                if(!controller.signal.aborted){
                    setLoading(false);
                }
            }
        }

        if(debounce){
            clearTimeout(debounce)
        }
        const timeOut = setTimeout(fetchFilteredJobs,500)
        setDebounce(timeOut)

        return () => {
            controller.abort()
            clearTimeout(debounce)
        }
    },[filter])


    return(
        <div>
            <JobFilter filters={filter} setFilters={setFilter}></JobFilter>
            {loading&&<div>Cargando los datos....</div>}
            {error&&<div>Tenido error al cargar los datos</div>}
            {!loading&&!error&&<div className="container">
                {jobList.length > 0 ? (
                    jobList.map((job, index) => (
                        <div className="row" key={index} style={{marginTop:"15px"}}>
                                <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/company-home/edit-job/${job._id.toString()}`)}}>
                                    <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                                        <div className="col-6" style={{paddingLeft:0}}>
                                        <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                                        <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                                        </div>
                                        <div className="col-6">
                                            <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                                <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                                    <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
                                                    <h6 >{job.company_id?.industry}  {job.company_id?.scale}</h6>
                                                </div>
                                                <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                                    <img src={ job.company_id.logo as Base64URLString||"/imgs/user.png"} 
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
                    <div className="row">
                        <div className="col-sm-12" style={{fontSize:"1.4rem", color:"GrayText", fontWeight:"500"}}> No se ha encontrado ningún trabajo que cumpla con los filtros introducidos.</div>
                    </div>
                )}
            </div>}
        </div>
    );
}