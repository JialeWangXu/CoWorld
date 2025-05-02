'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axiosInstance from "lib/axiosInterceptor";
import { ListsSkeleton } from "app/components/ListsSkeleton"
import styles from './styles.module.scss'
import { operator } from "../../../context/FormContext";

export default function ViewOperatorsPage(){

    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    const [operatorsList, setOperatorsList] = useState<operator[]>([])
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [demonstratingPages, setDemonstratingPages]= useState(0);
    const [paginationLimit, setPaginationLimit]=useState(0);
    const router = useRouter();

    const fetchOperators= async(page:number)=>{
        try{
            setLoading(true);
            const {data} = await axiosInstance.post(`/company-operator/get-operators`,{page:page},{
                withCredentials:true
            })
            setOperatorsList(data.operators);
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
        fetchOperators(1);
    },[])

    if(loading){
        return <ListsSkeleton/>
    }
    if(error){
        return <div>Error al cargar datos...</div>
    }

    const handlePaginationJobs=(page:number)=>{
        fetchOperators(page);
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
    
    return(
    <div className="container-fluid">
        <div className="row" style={{marginBottom:"1.5rem"}}>
            <div className="col-md-6 col-sm-12" style={{display:'flex', alignItems:"left", gap:'5px', flexDirection:"column", marginLeft:"20px"}}>  
                <h3>Lista de operadores:</h3>
                <p style={{color:"GrayText"}}>Los operadores tendrán acceso igual que usted, excepto en lo que respecta a la funcionalidad de gestión de operadores.</p>
            </div> 
            <div className="col"></div>
            <div className="col-md-3 col-sm-12">
            <div  style={{margin:'10px', textAlign:'center'}}>
                <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" onClick={()=>{router.push('/company-home/operators/add-operator')}} >Añadir operatores</button>
            </div>
            </div>
        </div>
        {operatorsList.length>0?(
            (
                operatorsList.map((operator, index)=>(
                    <div className="row" key={index} style={{marginBottom:"15px"}}>
                        <div className="col"/>
                        <div className={`${styles.operatorCard} col-md-6 col-sm-12`} style={{padding:"20px"}}>
                            <h4 style={{fontWeight:"bold"}}>{operator.firstname} {operator.lastname}</h4>
                            <h5>{operator.email}</h5>
                            <h6 style={{ color: operator.changedPassword ? "#145a32" : "#616a6b" }}>Estado: {operator.changedPassword ? "Activado" : "Pendiente"}</h6>
                            <div className="justify-content-end">
                                <button type="button" className="btn btn-light" onClick={()=>{router.push(`/company-home/operators/edit-operator/${operator._id.toString()}`)}}>Modificar</button>
                            </div>
                        </div>
                        <div className="col"/>
                    </div>
                ))
            )     
            ):(<div style={{marginBottom:"1.5rem", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h3>De momento no tienes ningún operador añadido.&#128204;</h3>
        </div>)}
        {operatorsList.length>0&&<div style={{ marginTop: '20px', textAlign: 'center' }}>
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