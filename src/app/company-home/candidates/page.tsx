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
        const [currentPage,setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [demonstratingPages, setDemonstratingPages]= useState(0);
        const [paginationLimit, setPaginationLimit]=useState(0);

        useEffect(()=>{
            if(company?.jobs){
                setJoblist(company.jobs.slice(0,5));
                setTotalPages(Math.ceil(company?.jobs.length/5));
                if(Math.ceil(company?.jobs.length/5)>5){
                    setDemonstratingPages(5);
                    setPaginationLimit(5);
                }else{
                    setDemonstratingPages(Math.ceil(company?.jobs.length/5));
                    setPaginationLimit(Math.ceil(company?.jobs.length/5));
                }
                setCurrentPage(1);
            }
        },[company?.jobs])    
    
        if (waiting) {
            return <ListsSkeleton/>
        }
        if (!company) {
            return <div>No Company</div> 
        }

        const handlePaginationJobs=(page:number)=>{
            const start= (page-1)*5;
            setJoblist(company?.jobs.slice(start,start+5));
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
                }
            }
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
            {jobList?.length>0&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
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
    )
}