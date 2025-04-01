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

    useEffect(()=>{

        const fetchCandiates= async()=>{
            try{
                setLoading(true);
                const {data} = await axiosInstance.post(`/company-candidates/get-previews`,{id:params.id},{
                    withCredentials:true
                })
                setCandidateList(data.candidates);
                setError("")
                setLoading(false)
            }catch(e){
                setError("Error al cargar candidatos de la oferta");
                setLoading(false)
            }
        }

        fetchCandiates();

    },[params.id])

    if(loading){
        return <ListsSkeleton/>
    }
    if(error){
        return <div>Hubido error cargar datos...</div>
    }

    const pendingCandidats = candiateList.filter(elem => elem.status==="solicitado");
    const toComunicateCandidats = candiateList.filter(elem => elem.status==="a comunicar");
    const comunicatedCandidats = candiateList.filter(elem => elem.status==="comunicado");

    return(<div className="container">
        <div className="row" style={{marginBottom:"1rem"}}>
            <div className="col"></div>
                <div className=" col-sm-10" style={{display:'flex', alignItems:"center",justifyContent:"center", gap:'8px', fontSize:"1.8rem", flexWrap:"wrap"}}>  
                    <a className={`${styles.hovA} nav-link ${activePage ==='pending' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("pending")}} style={{fontSize:"1.8rem"}}> {`Pendiente (${pendingCandidats.length})`} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='aComunicar' ? styles.activeA : ''}`}  href="#"
                    onClick={()=>{setActivePage("aComunicar")}} style={{fontSize:"1.8rem"}}> {`A comunicar (${toComunicateCandidats.length}) `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='Comunicado' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("Comunicado")}} style={{fontSize:"1.8rem"}}> {`Comunicado (${comunicatedCandidats.length})`} </a>
                </div>
            <div className="col"></div>
        </div>
        {activePage==="pending"&&(
        (pendingCandidats.length>0)? (<div className="container-fluid">
            {pendingCandidats.map((cant, index)=>(
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
            <div style={{textAlign:"center"}}>La oferta no tiene ningún candidat@ pendiente de momento, <a href='/company-home/candidates' className='link-success'>ver otras ofertas</a> &#128204;</div>
        ))}
        {activePage==="aComunicar"&&(
        (toComunicateCandidats.length>0)? (<div className="container-fluid">
            {toComunicateCandidats.map((cant, index)=>(
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
            <div style={{textAlign:"center"}}>La oferta no tiene ningún candidat@ a comunicar de momento, <a href='/company-home/candidates' className='link-success'>ver otras ofertas</a> &#128204;</div>
        ))}
        {activePage==="Comunicado"&&(
        (comunicatedCandidats.length>0)? (<div className="container-fluid">
            {comunicatedCandidats.map((cant, index)=>(
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
            <div style={{textAlign:"center"}}>La oferta no tiene ningún candidat@ comunicado de momento, <a href='/company-home/candidates' className='link-success'>ver otras ofertas</a> &#128204;</div>
        ))}
        </div>)
}