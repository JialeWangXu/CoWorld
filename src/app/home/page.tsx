"use client"

import JobFilter from "app/components/JobFilters";
import JobListDisplay from "app/components/JobsDisplay";
import { useState, useEffect } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import axiosInstance from "lib/axiosInterceptor";
import { IJobAndCompany, JobFilters } from "types/JobFilter";
import { DISABILITIES_INITIAL_VALUE } from "util/constants";
import styles from "./styles.module.scss"
import { CardSkeleton } from "app/components/CardSkeleton";

export default function HomePage(){

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [searched, setSearched] = useState(false);
    const [debounce, setDebounce] = useState<NodeJS.Timeout>()
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [demonstratingPages, setDemonstratingPages]= useState(0);
    const [paginationLimit, setPaginationLimit]=useState(0);

    useEffect(()=>{
        const controller = new AbortController();

        const fetchFilteredJobs = async (page:number)=>{

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
                    intership:filter.intership,
                    page:page
                }
                setLoading(true);

                const {data} = await axiosInstance.get(`/candidate-home/get-jobs` ,{
                    params: param,
                    withCredentials:true,
                    signal:controller.signal
                })

                setJobList(data.jobList);
                setCurrentPage(page);
                setTotalPages(data.totalPage);
                if(data.totalPage>5){
                    setDemonstratingPages(5);
                    setPaginationLimit(5);
                }else{
                    setDemonstratingPages(data.totalPage);
                    setPaginationLimit(data.totalPage);
                }
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
            const timeOut = setTimeout(()=>fetchFilteredJobs(1),500)
            setDebounce(timeOut)
        }else{
            var jobs:IJobAndCompany[] = filterJobs(jobList,filter);
            setTotalPages(Math.ceil(jobs.length/5));
            if(Math.ceil(jobs.length/5)>5){
                setDemonstratingPages(5);
                setPaginationLimit(5);
            }else{
                setDemonstratingPages(Math.ceil(jobs.length/5));
                setPaginationLimit(Math.ceil(jobs.length/5));
            }
            jobs = jobs.slice(0,5);
            setSearchedList(jobs);
            setCurrentPage(1);

        }

        return () => {
            controller.abort()
            clearTimeout(debounce)
        }
    },[filter])

    const filterJobs=(jobs: IJobAndCompany[], filters: JobFilters) =>{
        if(jobs?.length>0){
        let temp:IJobAndCompany[] = [...jobs];
        if(filters?.city.length > 0){
            temp = temp.filter(job => filters.city.includes(job.city));

            if(!temp){
                return [];
            }
        }
        if(filters?.disabilities.length>0){
            let tempFilter = filters.disabilities.filter(({type, degree})=> degree>-1);
            temp = temp.filter( job => {let aux=true;tempFilter.forEach(element => {
                let jobDegree = job?.disabilities.find(ele => ele.type === element.type)?.degree;
                if(jobDegree<element.degree && jobDegree!==-1){
                    aux= false;
                }
            }) 
                return aux;
            }  
            )
            if(!temp){
                return [];
            }
        }
        if(filters?.mode.length>0){
            temp = temp.filter(job => filters.mode.includes(job.mode));
            if(!temp){
                return [];
            }
        }
        if(filters?.workHours.length>0){
            temp = temp.filter(job => filters.workHours.includes(job.workHours));

            if(!temp){
                return [];
            }
        }
        if(filters?.workCategory.length>0){
            temp = temp.filter(job => filters.workCategory.includes(job.workCategory));

            if(!temp){
                return [];
            }
        }
        if(filters?.experience.length>0){
            temp = temp.filter(job => filters.experience===job.experience);

            if(!temp){
                return [];
            }
        }
        if(filters?.minumumEducation.length>0){
            temp = temp.filter(job => filters.minumumEducation.includes(job.minumumEducation));

            if(!temp){
                return [];
            }
        }
        if(filter?.intership){
            temp = temp.filter(job => job.intership===true);

        }else{
            temp = temp.filter(job => job.intership===false);

        }

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
                setJobList(data.job);
                setTotalPages(Math.ceil(data.job.length/5));
                setCurrentPage(1);
                setSearchedList(data.job.slice(0,5));
                if(Math.ceil(data.job.length/5)>5){
                    setDemonstratingPages(5);
                    setPaginationLimit(5);
                }else{
                    setDemonstratingPages(Math.ceil(data.job.length/5));
                    setPaginationLimit(Math.ceil(data.job.length/5));
                }
                setError("");
    
            }catch(e){
                    setError("Error al cargar los datos de trabajos buscados");
                    console.log("ERRORRRRRR CARGAR TRABAJOS BUSCADOS",e);
            }finally{
                    setLoading(false);
            }
        }

    }

    
    const displayPagesNumber= ()=>{
        const start = demonstratingPages -(paginationLimit-1);
        return Array.from({ length: paginationLimit }, (_, i) => start + i).map((index)=>(<button key={index}
            className={`${styles.paginationButton}`}
            onClick={()=>{searched? handlePaginationSearched(index): handlePaginationJobs(index)}}
            style={{ 
            fontWeight: currentPage===(index)? 'bold':'normal',
            margin: '0 5px',
            backgroundColor:  currentPage===(index)?'#306d1f':'white',
            color: currentPage===(index)? 'white':'#306d1f'
            }}
        >
            {index}
        </button>
        ))
    }

    const handlePaginationSearched =(page:number)=>{
        const start=(page-1)*5;
        setSearchedList(
            jobList.slice(start, start+5)
        )
        setCurrentPage(page);
    }

    const handlePaginationJobs= async(page:number)=>{
        try{
            const param ={
                city: filter.city.join(','),
                disabilities: encodeURIComponent(JSON.stringify(filter.disabilities)),
                mode: filter.mode.join(','),
                workHours: filter.workHours.join(','),
                workCategory: filter.workCategory.join(','),
                experience: filter.experience,
                minumumEducation: filter.minumumEducation.join(','),
                intership:filter.intership,
                page:page
            }
            setLoading(true);

            const {data} = await axiosInstance.get(`/candidate-home/get-jobs` ,{
                params: param,
                withCredentials:true
            })

            setJobList(data.jobList);
            setCurrentPage(page);
            setLoading(false);
            setError("")
        }catch(e){
            console.log("bad request for pagination"+e);
        }
    }

    const handleNextPagenation =()=>{
        if(currentPage%5===0){
            if((currentPage+5)> totalPages){
                setDemonstratingPages(totalPages);
                setPaginationLimit(totalPages-currentPage);
            }else{
                setDemonstratingPages(currentPage+5)
            }
        }
    }

    const handlePrePagination =()=>{
        if( currentPage%5==1 ){
            if(currentPage!==1){
                setDemonstratingPages(currentPage-1);
                setPaginationLimit(5);
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
            {loading&&<CardSkeleton cards={5}/>}
            {error&&<div>Tenido error al cargar los datos</div>}
            {!loading&&!error&&<div className="container"style={{marginTop:"15px"}}>
                {searched? <JobListDisplay jobList={searchedList} />:<JobListDisplay jobList={jobList} />}
                {((searched&&searchedList.length>0) || (!searched && jobList.length>0) )&&
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className={`${styles.paginationButton}`}
                    onClick={()=>{handlePrePagination(),(searched? handlePaginationSearched(currentPage-1): handlePaginationJobs(currentPage-1))}}
                    disabled={currentPage===1}
                    >
                    &laquo;
                    </button>
                    {displayPagesNumber()}
                    <button className={`${styles.paginationButton}`}
                    onClick={()=>{handleNextPagenation(),(searched? handlePaginationSearched(currentPage+1): handlePaginationJobs(currentPage+1))}}
                    disabled={currentPage===(totalPages)}
                    >
                    &raquo;
                    </button>
                </div>
                }
                </div>
            }
            
        </div>
    );
}