"use client"
import { useParams,useSearchParams } from "next/navigation";
import { useContext, useEffect,useState } from "react";
import { ICandidateProfileWithUserInfo } from "types/Company";
import { INITIAL_CANDIATE_DETAIL } from "util/constants"; 
import axiosInstance from "lib/axiosInterceptor";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";
import { useSnipper } from "app/hooks/useSnipper";
import { Spinner } from '../../../../components/Spinner'
import { ToastContext } from "app/context/ToastContext";

export default function candiateDetailPage(){
    const params = useParams<{candidate:string, id:string}>()
    const searchParams = useSearchParams(); 
    const [profile, setProfile] = useState<ICandidateProfileWithUserInfo>(INITIAL_CANDIATE_DETAIL);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    const router = useRouter();
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    
    useEffect(()=>{

        const fetchDetail= async()=>{
            try{
            setLoading(true);
            const {data} = await axiosInstance.post(`/company-candidates/get-candidate-detail`,{candidate:params.candidate},{
                    withCredentials:true
                })
            console.log(data)
            setProfile({
                user_id:data.profile.user_id._id,
                firstname:data.profile.user_id.firstname,
                lastname: data.profile.user_id.lastname,
                email: data.profile.user_id.email,
                phone:data.profile.phone,
                city:data.profile.city,
                photo:data.profile.photo,
                disabilities:data.profile.disabilities,
                state:data.profile.state,
                huntingJob:data.profile.huntingJob,
                desiredJob:data.profile.desiredJob,
                description:data.profile.description,
                studies:data.profile.studies,
                workExperience:data.profile.workExperience,
                skills:data.profile.skills,
                languages:data.profile.languages,
                certifications:data.profile.certifications
            }as ICandidateProfileWithUserInfo)
            setError("");

        }catch(e){
            setError("Hubido error al cargar detalle del candidato..."+e);
        }finally{
            setLoading(false);
        }
        }

        fetchDetail();
        
    },[])

    if(error){
        return <div>Hubido error cargar datos...</div>
    }

    if(loading){
        return<div>Cargando datos....</div>
    }

    const handleUpdateStatus= async(status:string)=>{
        setIsLoading(true);
        try{
            const resul = await axiosInstance.post(`/company-candidates/change-status`,{candidate:params.candidate,id:params.id,status:status},{
                        withCredentials:true
            })
            showToast({msg:resul.data.sucess, type:'Good',visible:true})
            router.push(`/company-home/candidates/${params.id}/${params.candidate}?status=${status}`);
        }catch(e){
            showToast({msg:e.response.data.error as string, type:"Bad",visible:true})
        }finally{
            setIsLoading(false);
        }
        
    }
 
    const dis = profile.disabilities.filter(({type,degree})=> degree>-1).map(({type,degree})=> `Discapacidad ${type}: Grado ${degree}`).join(" | ")
    return(
    <div className="container-fluid">
        <div className="row">
            <div className={`${styles.profilePhoto} col-md-2 col-sm-12`} style={{textAlign:'center'}}>
                <img src={ profile.photo as Base64URLString||"/imgs/user.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
            </div>
            
            <div className="col-6">
                <h3 style={{fontWeight:'bold'}}>{profile.firstname} {profile.lastname}</h3>
                <h5>{dis.length>0 ? dis:''}</h5>
                <h5>{profile.city ? profile.city : ''}</h5>
                <h5>{profile.phone ? profile.phone : ''}</h5>
                <h5>{profile.email}</h5>
            </div>
            <div className="col-md-4 col-sm-12 " style={{display:"flex", flexDirection:'column',justifyContent:'end', alignItems:"end"}}>
            {searchParams.get("status")==="solicitado"&&(<div  style={{gap:'10px',display:"flex",flexDirection:"row",justifyContent:"flex-end",marginRight:"10px"}}>
                <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("a comunicar")}} disabled={isLoading} > {isLoading?<Spinner/>:"A comunicar"} </button>
                <button type="button" className="btn btn-outline-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("comunicado")}} disabled={isLoading}> {isLoading?<Spinner/>:"Comunicado"} </button>
            </div>)}
            {searchParams.get("status")==="a comunicar"&&(<div  style={{marginRight:"10px"}}>
                <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("comunicado")}} disabled={isLoading} > {isLoading?<Spinner/>:"Comunicado"} </button>
            </div>)}
            {searchParams.get("status")==="comunicado"&&(<div style={{fontWeight:"bold", color:"red", fontSize:"1.2rem",marginRight:"10px"}}>
                ¡El candidato ha sido comunicado! 
            </div>)}
            </div>
        </div>
        <hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Situación laboral y empleos previstos</h2>
            <div className="row">
                <div className="col-10" style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0'}}>
                        <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Estado actual: </h4><h5 className={`${styles.stateDisplay}`}>{profile.state || `Libre`}</h5></li>
                        <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Buscando trabjo: </h4><h5 className={`${styles.stateDisplay}`}>{profile.huntingJob ? `Si`:`No`}</h5></li>
                        {profile.desiredJob.length>0&&(<li style={{display:'flex', alignItems:"center", gap:'8px'}}><h4>Trabajos que busco:</h4>{profile.desiredJob.map(job => <h5 key={job} className={`${styles.jobDisplay}`}>{job}</h5>)}</li>)}
                    </ul>
                </div>
                <div className="col-2" ></div>
            </div>
        </div>
        {(profile.description!=="")&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Descripción personal</h2>
            <div className="row">
                <div className="col-10" style={{marginLeft:"2rem"}}>
                    {profile.description? <p>{profile.description}</p>:<p style={{color:'gray', fontSize:'1.2rem'}}>Cuéntenos algo sobre usted!:D </p>}
                </div>

            </div>
        </div></>)}
        {profile.studies.length>0&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Estudios</h2>
            <div className="row">
                <div className="col-10" style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0'}}>
                        {profile.studies.map((study, index)=>{
                            return(
                                <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.studyCard} `}>
                                    <h5 style={{fontWeight:"bold"}}>{study.institution}</h5>
                                    <h6>{study.title}</h6>
                                    <h6>{study.specialty}</h6>
                                    <h6>{study.iniDate.month <10 ? `0${study.iniDate.month}` : study.iniDate.month }/{study.iniDate.year} - {study.finDate ? study.finDate.month<10 ? `0${study.finDate.month}/${study.finDate.year}`:`${study.finDate.month}/${study.finDate.year}` : "Current"}</h6>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-2">
                </div>
            </div>
        </div></>)}
        {profile.workExperience.length>0&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Experiencia Laboral</h2>
            <div className="row">
                <div className="col-10"style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0'}}>
                        {profile.workExperience.map((work, index)=>{
                            return(
                                <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.workExpCard} `}>
                                    <h5 style={{fontWeight:"bold"}}>{work.responsability}</h5>
                                    <h6>{work.companyName}</h6>
                                    {work.contractType&&<h6>{work.contractType}</h6>}
                                    <h6>{work.iniDate.month <10 ? `0${work.iniDate.month}` : work.iniDate.month }/{work.iniDate.year} - {work.finDate ? work.finDate.month<10 ? `0${work.finDate.month}/${work.finDate.year}`:`${work.finDate.month}/${work.finDate.year}` : "Current"}</h6>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-2 col-sm-12" >
                </div>
            </div>
        </div></>)}
        {profile.skills.length>0&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Habilidades</h2>
            <div className="row">
                <div className="col-10"style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0', flexWrap:"wrap",display:'flex', alignItems:"center", gap:'10px', marginBottom:0}}>
                        {profile.skills.map((skill, index)=>{
                            return(
                                <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.skillCard} `}>
                                    <h5 style={{fontWeight:"bold", marginBottom:0}}>{skill}</h5>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div></>)}
        {profile.certifications.length>0&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Licencias y certificaciones</h2>
            <div className="row">
                <div className="col-10"style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0'}}>
                        {profile.certifications.map((certification, index)=>{
                            return(
                                <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.certificationCard} `}>
                                    <h5 style={{fontWeight:"550"}}>{certification.title} </h5> <h6 style={{fontWeight:"400", color:"#9e9e9e"}}>{certification.emitter}</h6>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-2" ></div>
            </div>
        </div></>)}
        {profile.languages.length>0&&(<><hr/>
        <div>
            <h2 style={{fontWeight:'bold',marginLeft:"2rem"}}>Idiomas</h2>
            <div className="row">
                <div className="col-10"style={{marginLeft:"2rem"}}>
                    <ul style={{listStyle:'none', paddingLeft:'0'}}>
                        {profile.languages.map((language, index)=>{
                            return(
                                <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.languageCard} `}>
                                    <h5 style={{fontWeight:"550"}}>{language.language} </h5> <h6 style={{fontWeight:"400", color:"#9e9e9e"}}>{language.level}</h6>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="col-2"></div>
            </div>
        </div></>)}
        <hr/>
        <div className="container " style={{display:"flex", flexDirection:'column',justifyContent:'center', alignItems:"center", paddingBottom:"1rem"}}>
            {searchParams.get("status")==="solicitado"&&(<div style={{gap:'10px',display:"flex",flexDirection:"row",justifyContent:"flex-end",marginRight:"10px"}}>
                <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("a comunicar")}} disabled={isLoading} > {isLoading?<Spinner/>:"A comunicar"} </button>
                <button type="button" className="btn btn-outline-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("comunicado")}} disabled={isLoading}> {isLoading?<Spinner/>:"Comunicado"} </button>
            </div>)}
            {searchParams.get("status")==="a comunicar"&&(<div  >
                <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'200px', height:'auto'}} onClick={()=>{handleUpdateStatus("comunicado")}} disabled={isLoading} > {isLoading?<Spinner/>:"Comunicado"} </button>
            </div>)}
            {searchParams.get("status")==="comunicado"&&(<div style={{fontWeight:"bold", color:"red", fontSize:"1.2rem"}}>
                ¡El candidato ha sido comunicado! 
            </div>)}
        </div>
    </div>);
}