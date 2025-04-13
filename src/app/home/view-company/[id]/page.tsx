'use client'
import { useEffect, useState } from "react"
import axiosInstance from "lib/axiosInterceptor"
import { companyDetail } from "types/JobFilter"
import { useParams } from "next/navigation";
import styles from './../../styles.module.scss'
import { useRouter } from "next/navigation";
import { ProfileSkeleton } from "app/components/ProfileSkeleton";
import JobListDisplay from "app/components/JobsDisplay";

export default function companyViewPage(){

        const initialJob={
            company_id: null,
            industry: "",
            city: "",
            scale: "",
            url:"",
            logo:"",
            description:"",
            companyName:"",
            jobs:[]
        }

        const [company, setCompany] = useState<companyDetail>(initialJob);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [activePage,setActivePage] = useState("Info");
        const params = useParams<{ id: string}>()
        const router = useRouter();
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [jobLits, setJobList] = useState([]);
        const [demonstratingPages, setDemonstratingPages]= useState(0);
        const [paginationLimit, setPaginationLimit]=useState(0);

        useEffect(()=>{
        
                const fetchCompany = async() =>{
                    try{
                        setLoading(true);
                        const {data} = await axiosInstance.post(`/company-profile` ,{id:params.id},{
                            withCredentials:true
                        
                        })
                        const jobs = await axiosInstance.post(`/company-jobs` ,{id:params.id},{
                            withCredentials:true
                        })
                        const companyDetail={
                            company_id: data.profile.company_id._id,
                            industry: data.profile.industry,
                            city: data.profile.city,
                            scale: data.profile.scale,
                            url:data.profile.url,
                            logo:data.profile.logo,
                            description:data.profile.description,
                            companyName:data.profile.company_id.companyName,
                            jobs:jobs.data.jobList
                        }
                        console.table(companyDetail)
                        setCompany(companyDetail)
                        setCurrentPage(1);
                        setTotalPages(Math.ceil(jobs.data.jobList.length/5));
                        setJobList(jobs.data.jobList);
                        if(Math.ceil(jobs.data.jobList.length/5)>5){
                            setDemonstratingPages(5);
                            setPaginationLimit(5);
                        }else{ 
                            setDemonstratingPages(Math.ceil(jobs.data.jobList.length/5));
                            setPaginationLimit(Math.ceil(jobs.data.jobList.length/5));
                        } 
                        setError("");
                    }catch(e){
                        setError("Hubido error al cargar datos de la empresa...");
                        console.log("Error al cargar la empresa... check it out:"+e)
                    }finally{
                        setLoading(false);
                    }
                }

                fetchCompany();
        },[])

        const handlePaginationJobs=(page:number)=>{
            const start=(page-1)*5
            setJobList(
                company.jobs.slice(start, start+5)
            )
            setCurrentPage(page);
        }
        if (loading) {
            return <ProfileSkeleton/>
        }
        if (error) {
            return <div>Error al cargar datos de la empresa</div> 
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

        return(
            <div className="container-fluid">
                <div className="container-fluid" style={{marginBottom:"1.5rem"}}>
                    <div className="row">
                        <div className={`${styles.companyLogo} col-md-2 col-sm-2`} style={{textAlign:'center'}}>
                            <img src={ company.logo as Base64URLString||"/imgs/company.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                        </div>
                        <div className="col-md-8 col-sm-8">
                            <h2 style={{fontWeight:'bold'}}>{company.companyName}</h2>
                            <p style={{fontSize:"1.25rem", marginBottom:"4px", fontWeight:500}}>{company.city ? company.city : ''}</p>
                            <p style={{fontSize:"1.25rem", marginBottom:"4px", fontWeight:500}}>{company.industry ? company.industry : ''}</p>
                            <p style={{fontSize:"1.25rem", marginBottom:"4px", fontWeight:500}}>{company.scale ? company.scale +' empleos' : ''}</p>
                            <p style={{fontSize:"1.25rem", marginBottom:"4px", fontWeight:500}}>{company.url ? company.url :''}</p>
                        </div>
                        <div className="col-md-2 col-sm-2"></div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row" style={{marginBottom:"1.5rem"}}>
                        <div className="col-md-8 col-sm-12" style={{display:'flex', alignItems:"center", gap:'5px', fontSize:"1.8rem"}}>  
                            <a className={`${styles.hovA} nav-link ${activePage ==='Info' ? styles.activeA : ''}`}  href="#"
                                    onClick={()=>{setActivePage("Info")}} style={{fontSize:"1.8rem"}}> {`Información `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='Jobs' ? styles.activeA : ''}`} href="#"
                                    onClick={()=>{setActivePage("Jobs")}} style={{fontSize:"1.8rem"}}> {`Ofertas públicadas (${company.jobs.length})`} </a>
                        </div>
                        <div className="col"></div>
                        <div className="col-md-3 col-sm-12">
                        </div>
                    </div>
                    {
                        activePage==="Info"? (<div className="row" style={{border:"solid", borderWidth:"1px", marginLeft:"6px", marginRight:"6px", marginBottom:"1.5rem", padding:"1rem"}}>
                        <h2>Descripón de la empresa</h2>
                        <p style={{minHeight:"280px"}}>{company.description? company.description : "La empresa no ha añadido todavía su descripción."}</p>
                    </div> ):(<div>
                        { <div className="container">
                            {company.jobs.length > 0 ? (
                                <JobListDisplay jobList={company.jobs} />
                            ) : (
                                <div className="row">
                                    <div className="col-sm-12" style={{fontSize:"1.4rem", color:"GrayText", fontWeight:"500"}}> No se ha encontrado ningún trabajo que cumpla con los filtros introducidos.</div>
                                </div>
                            )}
                            {(company.jobs.length > 0)&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
                                
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
                    </div>}
                </div>)}
            </div>
        </div>
    );
}