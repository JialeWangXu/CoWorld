'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IUserSimpleWithSimpleUserProfile } from "types/Company"
import axiosInstance from "lib/axiosInterceptor"
import styles from './../styles.module.scss'
import { useRouter } from "next/navigation"
import { ListsSkeleton } from "app/components/ListsSkeleton"

export default function ViewOneJobCandidatesPage(){

    const params = useParams<{ id: string}>()
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    const [activePage,setActivePage] = useState("pending")
    const [candiateList, setCandidateList] = useState<IUserSimpleWithSimpleUserProfile[]>([])
    const router = useRouter();
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [demonstratingPages, setDemonstratingPages]= useState(0);
    const [paginationLimit, setPaginationLimit]=useState(0);

    const fetchCandiates= async(status:string,page:number)=>{
        try{
            setLoading(true);
            const {data} = await axiosInstance.post(`/company-candidates/get-previews`,{id:params.id, status:status, page:page},{
                withCredentials:true
            })
            setCandidateList(data.candidates);
            setTotalPages(data.totalPage);
            setCurrentPage(page);
            if(data.totalPage>5){
                setDemonstratingPages(5);
                setPaginationLimit(5);
            }else{
                setDemonstratingPages(data.totalPage);
                setPaginationLimit(data.totalPage);
            }
            setError("")
            setLoading(false)
        }catch(e){
            setError("Error al cargar candidatos de la oferta");
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchCandiates("solicitado",1);
    },[params.id])

    useEffect(()=>{
        if(activePage==="pending"){
            fetchCandiates("solicitado",1);
        }else if(activePage==="aComunicar"){    
            fetchCandiates("a comunicar",1);
        }
        else if(activePage==="Comunicado"){
            fetchCandiates("comunicado",1);
        }
    },[activePage])

    if(loading){
        return <ListsSkeleton/>
    }
    if(error){
        return <div>Hubido error cargar datos...</div>
    }

    const handlePaginationJobs=(page:number)=>{
        if(activePage==="pending"){
            fetchCandiates("solicitado",page);
        }else if(activePage==="aComunicar"){    
            fetchCandiates("a comunicar",page);
        }
        else if(activePage==="Comunicado"){
            fetchCandiates("comunicado",page);
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

    return(<div className="container">
        <div className="row" style={{marginBottom:"1rem"}}>
            <div className="col"></div>
                <div className=" col-sm-10" style={{display:'flex', alignItems:"center",justifyContent:"center", gap:'8px', fontSize:"1.8rem", flexWrap:"wrap"}}>  
                    <a className={`${styles.hovA} nav-link ${activePage ==='pending' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("pending")}} style={{fontSize:"1.8rem"}}> {`Pendiente `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='aComunicar' ? styles.activeA : ''}`}  href="#"
                    onClick={()=>{setActivePage("aComunicar")}} style={{fontSize:"1.8rem"}}> {`A comunicar `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='Comunicado' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("Comunicado")}} style={{fontSize:"1.8rem"}}> {`Comunicado `} </a>
                </div>
            <div className="col"></div>
        </div>
        {
        (candiateList.length>0)? (<div className="container-fluid">
            {candiateList.map((cant, index)=>(
                <div className="row" key={index} style={{marginBottom:"15px"}}>
                <div className="col"/>
                <div className={`${styles.candidateCard} col-md-8 col-sm-12`} style={{padding:"20px"}} onClick={()=>{router.push(`/company-home/candidates/${params.id.toString()}/${cant.user_id._id.toString()}?status=${cant.status}`)}}>
                    <div className="row">
                        <div className={`${styles.profilePhoto} col-2`} style={{textAlign:'center'}}>
                            <img src={ cant.photo as Base64URLString||"/imgs/user.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                        </div>
                        <div className="col-10">
                            <h4 style={{fontWeight:"bold"}}>{cant.user_id.firstname+" "+cant.user_id.lastname}</h4>
                            {cant.disabilities.filter(({type,degree})=> degree>-1).length>0? 
                            cant.disabilities.filter(({type,degree})=> degree>-1).map(({type,degree})=> `Discapacidad ${type}: Grado ${degree}`).join(" | "):""}
                            <h6>{cant.city? cant.city:""}</h6>
                            <h6>{cant.phone? cant.phone:""}</h6>
                            <h6>{cant.user_id.email}</h6>
                            <p>{cant.status}</p>
                        </div>
                    </div>
                </div>
                <div className="col"/>
            </div>
            ))}
        </div>):(
            <div style={{textAlign:"center"}}>{`La oferta no tiene ningún candidat@ ${activePage==="pending"? "de pendiente":activePage==="aComunicar"?"a comunicar":"comunicado"} de momento, `}<a href='/company-home/candidates' className='link-success'>ver otras ofertas</a> &#128204;</div>
        )}
        {candiateList?.length>0&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
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
        </div>)
}