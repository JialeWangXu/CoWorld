"use client"
import {  useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import styles from './styles.module.scss'
import { CompanyContext } from "../../context/CompanyContext";
import { ListsSkeleton } from "app/components/ListsSkeleton";

export default function CompanyJobListPage() {
    
    const [inProgress, setInProgress] = useState(true);
    const [activePage, setActivePage] = useState('EnCurso');
    const [actives, setActives] = useState(0);
    const [closed, setClosed] = useState(0);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showJobList, setShowJobList] = useState([]);
    const [demonstratingPages, setDemonstratingPages]= useState(0);
    const [paginationLimit, setPaginationLimit]=useState(0);

    const router = useRouter();
    const {company,getCompany,waiting} = useContext(CompanyContext);

    useEffect(()=>{
        if(company?.jobs){
            setActives(company?.jobs.filter((job) => job.currentStatus==="active").length);
            setClosed(company?.jobs.filter((job) => job.currentStatus==="closed").length);
            setShowJobList(inProgress? company?.jobs.filter((job) => job.currentStatus==="active").slice(0,5) : company?.jobs.filter((job) => job.currentStatus==="closed").slice(0,5))
            setTotalPages(Math.ceil(company?.jobs.filter((job) => job.currentStatus==="active").length/5));
            if(Math.ceil(company?.jobs.filter((job) => job.currentStatus==="active").length/5)>5){
                setDemonstratingPages(5);
                setPaginationLimit(5);
            }else{
                setDemonstratingPages(Math.ceil(company?.jobs.filter((job) => job.currentStatus==="active").length/5));
                setPaginationLimit(Math.ceil(company?.jobs.filter((job) => job.currentStatus==="active").length/5));
            } 
            setCurrentPage(1);
        }
    },[company?.jobs])
    
    useEffect(()=>{
        setShowJobList(inProgress? company?.jobs.filter((job) => job.currentStatus==="active").slice(0,5) : company?.jobs.filter((job) => job.currentStatus==="closed").slice(0,5));
        setTotalPages(inProgress?Math.ceil(company?.jobs.filter((job) => job.currentStatus==="active").length/5):Math.ceil(company?.jobs.filter((job) => job.currentStatus==="closed").length/5));
        if(totalPages>5){
            setDemonstratingPages(5);
            setPaginationLimit(5);
        }else{
            setDemonstratingPages(totalPages);
            setPaginationLimit(totalPages);
        }
        setCurrentPage(1); 
    },[inProgress])

    if (waiting) {
        return <ListsSkeleton/>
    }
    if (!company) {
        return <div>No Company</div> 
    }

    const handlePaginationJobs=(page:number)=>{
        const start= (page-1)*5;
        setShowJobList(inProgress? company?.jobs.filter((job) => job.currentStatus==="active").slice(start,start+5):company?.jobs.filter((job) => job.currentStatus==="closed").slice(start,start+5));
        setCurrentPage(page);
    }
    
    const displayPagesNumber= ()=>{
        const start = demonstratingPages -(paginationLimit-1);
        return Array.from({ length: paginationLimit }, (_, i) => start + i).map((index)=>(<button key={index}
            className={`${styles.paginationButton}`}
            onClick={()=>{ handlePaginationJobs(index)}}
            style={{ 
            fontWeight: currentPage===(index)? 'bold':'normal',
            margin: '0 5px',
            backgroundColor:  currentPage===(index)?'#306d1f':'white',
            color: currentPage===(index)? 'white':'#306d1f'
            }}
            >
                {index}
            </button>))
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

    return (
        <div className="container-fluid">
            <div className="row" style={{marginBottom:"1.5rem"}}>
                <div className="col-md-6 col-sm-12" style={{display:'flex', alignItems:"center", gap:'5px', fontSize:"1.8rem"}}>  
                    <a className={`${styles.hov} nav-link ${activePage ==='EnCurso' ? styles.active : ''}`}  href="#"
                            onClick={()=>{setActivePage("EnCurso"), setInProgress(true),setTotalPages(Math.ceil(actives/5));}} style={{fontSize:"1.8rem"}}> {`En curso (${actives})`} </a> | <a className={`${styles.hov} nav-link ${activePage ==='Cerrado' ? styles.active : ''}`} href="#"
                            onClick={()=>{setActivePage("Cerrado"), setInProgress(false),setTotalPages(Math.ceil(closed/5));}} style={{fontSize:"1.8rem"}}> {`Cerrado (${closed})`} </a>
                </div> 
                <div className="col"></div>
                <div className="col-md-3 col-sm-12">
                    <div  style={{margin:'10px', textAlign:'center'}}>
                        <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" onClick={()=>{router.push('/company-home/edit-job')}} >Publicar nueva oferta</button>
                    </div>
                </div>
            </div>
            {showJobList?.length > 0 ? (
                showJobList.map((job, index) => (
                    <div className="row" key={index} style={{marginBottom:"15px"}}>
                        <div className="col"/>
                        <div className={`${styles.jobCard} col-md-10 col-sm-12`} style={{padding:"20px"}}>
                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                            <h5>{job.city} | {job.mode}</h5>
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
            {showJobList?.length>0&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className={`${styles.paginationButton}`}
                    onClick={()=>{handlePrePagination(),handlePaginationJobs(currentPage-1)}}
                    disabled={currentPage===1}
                    >
                    &laquo;
                    </button>
                    {displayPagesNumber()}
                    <button className={`${styles.paginationButton}`}
                    onClick={()=>{handleNextPagenation(),handlePaginationJobs(currentPage+1)}}
                    disabled={currentPage===(totalPages)}
                    >
                    &raquo;
                    </button>
                </div>}
        </div>
    );
}