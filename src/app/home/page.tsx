"use client"

import JobFilter from "app/components/JobFilters";
import JobListDisplay from "app/components/JobsDisplay";
import { useState, useEffect, FormEvent } from "react";
import useLocalStorage from "app/hooks/useLocalStorage";
import axiosInstance from "lib/axiosInterceptor";
import { IJobAndCompany, JobFilters } from "types/JobFilter";
import { DISABILITIES_INITIAL_VALUE } from "util/constants";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useRouter } from "next/navigation";
import { CardSkeleton } from "app/components/CardSkeleton";

export default function HomePage(){

    // tengo que hacer 1 esqueleto para cuando carga...
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(false);
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
    const [searchedList, setSearchedList] =useState<IJobAndCompany[]>([]);

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
        if(!searched){
            console.log("Buscando por API")
            const timeOut = setTimeout(fetchFilteredJobs,500)
            setDebounce(timeOut)
        }else{
            console.log("Buscando de buscados")
            var jobs:IJobAndCompany[] = filterJobs(jobList,filter);
            setSearchedList(jobs);
        }

        return () => {
            controller.abort()
            clearTimeout(debounce)
        }
    },[filter])

    const filterJobs=(jobs: IJobAndCompany[], filters: JobFilters) =>{
        if(jobs?.length>0){
        let temp:IJobAndCompany[] = [...jobs];
        console.log("Temp es: "+JSON.stringify(temp))
        console.log("El filtro actual es"+JSON.stringify(filters))
        if(filters?.city.length > 0){
            temp = temp.filter(job => filters.city.includes(job.city));
            console.log("comprobando ciudad...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.disabilities.length>0){
            let tempFilter = filters.disabilities.filter(({type, degree})=> degree!==-1);
            temp = temp.filter( job => {tempFilter.forEach(element => {
                let jobDegree = job?.disabilities.find(ele => ele.type === element.type)?.degree;
                if(jobDegree<element.degree && jobDegree!==-1){
                    return false;
                }
            })
            return true;  
            }  
            )
            console.log("comprobando disa...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.mode.length>0){
            temp = temp.filter(job => filters.mode.includes(job.mode));
            console.log("comprobando mode...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.workHours.length>0){
            temp = temp.filter(job => filters.workHours.includes(job.workHours));
            console.log("comprobando WH...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.workCategory.length>0){
            temp = temp.filter(job => filters.workCategory.includes(job.workCategory));
            console.log("comprobando WC...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.experience.length>0){
            temp = temp.filter(job => filters.experience===job.experience);
            console.log("comprobando EXP...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filters?.minumumEducation.length>0){
            temp = temp.filter(job => filters.minumumEducation.includes(job.minumumEducation));
            console.log("comprobando EDu...."+JSON.stringify(temp));
            if(!temp){
                return [];
            }
        }
        if(filter?.intership){
            temp = temp.filter(job => job.intership===true);
            console.log("comprobando inter true...."+JSON.stringify(temp));
        }else{
            temp = temp.filter(job => job.intership===false);
            console.log("comprobando inter false...."+JSON.stringify(temp));
        }
        console.log("Devolviendo tempo ...."+JSON.stringify(temp))
        return temp;
        } else{return jobs}
    }
    const handleSearch=async(event: React.FormEvent)=>{
        event.preventDefault();
        const searchContent = new FormData(event.target as HTMLFormElement);
        const search = searchContent.get("search") as string;

        if(search==="" || search.replace(/\s/g, '').length===0){
            setSearched(false);
            setFilter({
                city:[],
                disabilities:DISABILITIES_INITIAL_VALUE,
                mode:[],
                workHours:[],
                workCategory:[],
                experience:"",
                minumumEducation:[],
                intership:false
            })
        }else{
            setFilter({
                city:[],
                disabilities:DISABILITIES_INITIAL_VALUE,
                mode:[],
                workHours:[],
                workCategory:[],
                experience:"",
                minumumEducation:[],
                intership:false
            })
            try{
                setLoading(true);
                setSearched(true);
                const {data} = await axiosInstance.post(`/candidate-home/search-jobs` ,{search: search},{
                    withCredentials:true
                })
                console.log("Lo que hemos buscado es: "+JSON.stringify(data.job));
                setJobList(data.job);
                setSearchedList(data.job);
                console.log("Ha seteado el list con lo qu eha buscado: "+jobList.length)
                setError("");
    
            }catch(e){
                    setError("Error al cargar los datos de trabajos buscados");
                    console.log("ERRORRRRRR CARGAR TRABAJOS BUSCADOS",e);
            }finally{
                    setLoading(false);
            }
        }

    }

    return(
        <div>
            <div className="bg-white p-4">
                <form onSubmit={handleSearch} className="d-flex justify-content-center">
                    <input name="search" style={{width:"600px"}}className="form-control " type="search" placeholder="Buscar por empresa, puesto, palabra clave...  " aria-label="Search"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
            <JobFilter filters={filter} setFilters={setFilter}></JobFilter>
            {loading&&<CardSkeleton cards={2}/>}
            {error&&<div>Tenido error al cargar los datos</div>}
            {!loading&&!error&&<div className="container"style={{marginTop:"15px"}}>
                {searched? <JobListDisplay jobList={searchedList} />:<JobListDisplay jobList={jobList} />}
            </div>}
        </div>
    );
}