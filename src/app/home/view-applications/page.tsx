'use client'
import { useState, useContext, useEffect } from "react"
import styles from './../styles.module.scss'
import axiosInstance from "lib/axiosInterceptor"
import { IJobAndCompany } from "types/JobFilter"
import { useRouter } from "next/navigation"
import { ListsSkeleton } from "app/components/ListsSkeleton"

export default function ApplicationViewPage(){

    const [activePage,setActivePage] = useState("enCurso")
    const [jobList, setJobList] = useState<IJobAndCompany[]>([]);
    const [savedJobList, setSavedJobList] = useState<IJobAndCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState("");
    const router = useRouter();
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [demonstratingPages, setDemonstratingPages]= useState(0);
    const [paginationLimit, setPaginationLimit]=useState(0);

    useEffect(()=>{

        const fetchJob = async() =>{
            try{
                setLoading(true);
                const {data} = await axiosInstance.post(`/candidate-home/get-applied-jobs`,{activePage:activePage, page:1} ,{
                    withCredentials:true
                })
                const savedJob = await axiosInstance.post(`/candidate-home/get-saved-jobs`,{ page:1},{
                    withCredentials:true
                })
                setError("");
                setJobList(data.job);
                setSavedJobList(savedJob.data.job);
                if(data.totalPage>5){
                    setDemonstratingPages(5);
                    setPaginationLimit(5);
                }else{ 
                    setDemonstratingPages(data.totalPage);
                    setPaginationLimit(data.totalPage);
                } 
                setCurrentPage(1);
                setTotalPages(data.totalPage);
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
        return <ListsSkeleton/>
    }
    if(error){
        return <div>Error al cargar datos...</div>
    }

    const handlePaginationJobs=async(page:number, activePage:string)=>{
        if(activePage==="guardados"){
            try{
                setLoading(true);
                const savedJob = await axiosInstance.post(`/candidate-home/get-saved-jobs`,{ page:page},{
                    withCredentials:true
                })
                setError("");
                setSavedJobList(savedJob.data.job);
                setCurrentPage(page);
                if(page===1){
                    if(savedJob.data.totalPage>5){
                        setDemonstratingPages(5);
                        setPaginationLimit(5);
                    }else{ 
                        setDemonstratingPages(savedJob.data.totalPage);
                        setPaginationLimit(savedJob.data.totalPage);
                    }
                }
                setTotalPages(savedJob.data.totalPage);
            }catch(e){
                setError("Hubido error al cargar datos de las ofertas...");
                console.log("Error al cargar los trabjos... check it out:"+e)
            }finally{
                setLoading(false);
            }
        }else{
            try{
                setLoading(true);
                const {data} = await axiosInstance.post(`/candidate-home/get-applied-jobs`,{activePage:activePage, page:page} ,{
                    withCredentials:true
                })
                setError("");
                setJobList(data.job);
                setTotalPages(data.totalPage);
                setCurrentPage(page);
                if(page===1){
                    if(data.totalPage>5){
                        setDemonstratingPages(5);
                        setPaginationLimit(5);
                    }else{ 
                        setDemonstratingPages(data.totalPage);
                        setPaginationLimit(data.totalPage);
                    }
                }
                }catch(e){
                    setError("Hubido error al cargar datos de las ofertas...");
                    console.log("Error al cargar los trabjos... check it out:"+e)
                }finally{
                    setLoading(false);
            }
        }
    }
        
    const displayPagesNumber= ()=>{
        const start = demonstratingPages -(paginationLimit-1);
        console.log("start",start)
        console.log("paginationLimit",paginationLimit)
        return Array.from({ length: paginationLimit }, (_, i) => start + i).map((index)=>(<button key={index}
            className={`${styles.paginationButton}`}
            onClick={()=>{ handlePaginationJobs(index,activePage)}}
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


    return(
        <div className="container">
            <div className="row">
                <div className="col"></div>
                <div className=" col-sm-10" style={{display:'flex', alignItems:"center",justifyContent:"center", gap:'8px', fontSize:"1.8rem", flexWrap:"wrap"}}>  
                    <a className={`${styles.hovA} nav-link ${activePage ==='guardados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("guardados"),handlePaginationJobs(1,"guardados")}} style={{fontSize:"1.8rem"}}> {`Guardados `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='solicitados' ? styles.activeA : ''}`}  href="#"
                    onClick={()=>{setActivePage("solicitados"), handlePaginationJobs(1,"solicitados")}} style={{fontSize:"1.8rem"}}> {`Solicitados `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='enCurso' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("enCurso"),handlePaginationJobs(1,"enCurso")}} style={{fontSize:"1.8rem"}}> {`En curso `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='cerrados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("cerrados"),handlePaginationJobs(1,"cerrados")}} style={{fontSize:"1.8rem"}}> {`Cerrados `} </a> 
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
                                                        <h4 style={{fontWeight:"bold"}}>{job.companyName}</h4>
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
                    {activePage!=="guardados"&&(
                    (jobList.length) > 0 ? (
                        jobList.map((job, index) => (
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
                                                        <h4 style={{fontWeight:"bold"}}>{job.companyName}</h4>
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
                                <p>{`No tienes ofertas ${activePage==="solicitados"? "solicitadas":activePage==="enCurso"? "en curso":activePage==="cerrados"?"cerradas":""}.`}</p>
                                <a href="/home" className="link-primary">Ir a ver ofertas</a>
                            </div>
                        </div>)
                    
                    )} 
            {jobList.length>0&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className={`${styles.paginationButton}`}
                    onClick={()=>{handlePrePagination(),handlePaginationJobs(currentPage-1,activePage)}}
                    disabled={currentPage===1}
                    >
                    &laquo;
                    </button>
                    {displayPagesNumber()}
                    <button className={`${styles.paginationButton}`}
                    onClick={()=>{handleNextPagenation(),handlePaginationJobs(currentPage+1,activePage)}}
                    disabled={currentPage===(totalPages)}
                    >
                    &raquo;
                    </button>
                </div>}     
        </div>
    )
}