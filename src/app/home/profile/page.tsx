'use client'
import { UserContext } from "app/context/UserContext";
import { useContext } from "react";
import { EditButton } from "app/components/PerfilComponents/EditButton";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";

export default function profilePage(){
    const {user,getUser,waiting} = useContext(UserContext)
    const router = useRouter();

    if (waiting) {
        return <div>Cargando datos del usuario...</div>
    }
    if (!user) {
        return <div>No user</div> 
    }
    

    const dis = user.disabilities.filter(({type,degree})=> degree>-1).map(({type,degree})=> `Discapacidad ${type}: Grado ${degree}`).join(" | ")
    return(
        <div className="container-fluid">
            <div className="row">
                <div className={`${styles.profilePhoto} col-md-2 col-sm-12`} style={{textAlign:'center'}}>
                    <img src={ user.photo as Base64URLString||"/imgs/user.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                </div>
                <div className="col-md-8 col-sm-12">
                    <h3 style={{fontWeight:'bold'}}>{user.firstname} {user.lastname}</h3>
                    <h5>{dis.length>0 ? dis:''}</h5>
                    <h5>{user.city ? user.city : ''}</h5>
                    <h5>{user.phone ? user.phone : ''}</h5>
                    <h5>{user.email}</h5>
                </div>
                <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                    <EditButton nextPath="/home/profile/edit-info"/>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Situación laboral y empleos previstos</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12" >
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Estado actual: </h4><h5 className={`${styles.stateDisplay}`}>{user.state || `Libre`}</h5></li>
                            <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Buscando trabjo: </h4><h5 className={`${styles.stateDisplay}`}>{user.huntingJob ? `Si`:`No`}</h5></li>
                            <li style={{display:'flex', alignItems:"center", gap:'8px'}}><h4>Trabajos que busco:</h4>{user.desiredJob.map(job => <h5 key={job} className={`${styles.jobDisplay}`}>{job}</h5>)}</li>
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-state"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Descripción personal</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        {user.description? <p>{user.description}</p>:<p style={{color:'gray', fontSize:'1.2rem'}}>Cuéntenos algo sobre usted!:D </p>}
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-description"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Estudios</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.studies.map((study, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.studyCard} `}>
                                        <h5 style={{fontWeight:"bold"}}>{study.institution}</h5>
                                        <h6>{study.title}</h6>
                                        <h6>{study.specialty}</h6>
                                        <h6>{study.iniDate.month <10 ? `0${study.iniDate.month}` : study.iniDate.month }/{study.iniDate.year} - {study.finDate ? study.finDate.month<10 ? `0${study.finDate.month}/${study.finDate.year}`:`${study.finDate.month}/${study.finDate.year}` : "Current"}</h6>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-studies/${index}`)}}>Modificar</button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <div  style={{margin:'10px', textAlign:'center'}}>
                            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'100px', height:'3rem'}} onClick={()=>{router.push(`/home/profile/edit-studies`)}}> Añadir </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Experiencia Laboral</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.workExperience.map((work, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.workExpCard} `}>
                                        <h5 style={{fontWeight:"bold"}}>{work.responsability}</h5>
                                        <h6>{work.companyName}</h6>
                                        {work.contractType&&<h6>{work.contractType}</h6>}
                                        <h6>{work.iniDate.month <10 ? `0${work.iniDate.month}` : work.iniDate.month }/{work.iniDate.year} - {work.finDate ? work.finDate.month<10 ? `0${work.finDate.month}/${work.finDate.year}`:`${work.finDate.month}/${work.finDate.year}` : "Current"}</h6>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-workExp/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <div  style={{margin:'10px', textAlign:'center'}}>
                            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'100px', height:'3rem'}} onClick={()=>{router.push(`/home/profile/edit-workExp`)}}> Añadir </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Habilidades</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0', flexWrap:"wrap",display:'flex', alignItems:"center", gap:'10px', marginBottom:0}}>
                            {user.skills.map((skill, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.skillCard} `}>
                                        <h5 style={{fontWeight:"bold", marginBottom:0}}>{skill}</h5>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-skills"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Licencias y certificaciones</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.certifications.map((certification, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.certificationCard} `}>
                                        <h5 style={{fontWeight:"550"}}>{certification.title} </h5> <h6 style={{fontWeight:"400", color:"#9e9e9e"}}>{certification.emitter}</h6>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-certifications/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <div  style={{margin:'10px', textAlign:'center'}}>
                            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'100px', height:'3rem'}} onClick={()=>{router.push(`/home/profile/edit-certifications`)}}> Añadir </button>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Idiomas</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.languages.map((language, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.languageCard} `}>
                                        <h5 style={{fontWeight:"550"}}>{language.language} </h5> <h6 style={{fontWeight:"400", color:"#9e9e9e"}}>{language.level}</h6>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-languages/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <div  style={{margin:'10px', textAlign:'center'}}>
                            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'100px', height:'3rem'}} onClick={()=>{router.push(`/home/profile/edit-languages`)}}> Añadir </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}