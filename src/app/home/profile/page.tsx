'use client'
import { UserContext } from "app/context/UserContext";
import { useContext } from "react";
import { EditButton } from "app/components/PerfilComponents/EditButton";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";
import { ProfileSkeleton } from "app/components/ProfileSkeleton";

export default function profilePage(){
    const {user,getUser,waiting} = useContext(UserContext)
    const router = useRouter();

    if (waiting) {
        return <ProfileSkeleton/>
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
                    <p className={`${styles.infoDisplay}`}>{dis.length>0 ? dis:''}</p>
                    <p className={`${styles.infoDisplay}`}>{user.city ? user.city : ''}</p>
                    <p className={`${styles.infoDisplay}`}>{user.phone ? user.phone : ''}</p>
                    <p className={`${styles.infoDisplay}`}>{user.email}</p>
                </div>
                <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                    <EditButton nextPath="/home/profile/edit-info" content="Editar"/>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Situación laboral y empleos previstos</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12" >
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Estado actual: </h4><p className={`${styles.stateDisplay}`}>{user.state || `Libre`}</p></li>
                            <li style={{display:'flex', alignItems:"center", gap:'5px'}}><h4>Buscando trabjo: </h4><p className={`${styles.stateDisplay}`}>{user.huntingJob ? `Si`:`No`}</p></li>
                            <li style={{display:'flex', alignItems:"center", gap:'8px'}}><h4>Trabajos que busco:</h4>{user.desiredJob.map(job => <p key={job} className={`${styles.jobDisplay}`}>{job}</p>)}</li>
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-state" content="Editar"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Descripción personal</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        {user.description? <p>{user.description}</p>:<p style={{color:'gray', fontSize:'1.2rem'}}>Cuéntenos algo sobre usted!:D </p>}
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-description" content="Editar"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Estudios</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.studies.map((study, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.studyCard} `}>
                                        <h4 style={{fontWeight:"bold"}}>{study.institution}</h4>
                                        <h5>{study.title}</h5>
                                        <h5>{study.specialty}</h5>
                                        <h5>{study.iniDate.month <10 ? `0${study.iniDate.month}` : study.iniDate.month }/{study.iniDate.year} - {study.finDate ? study.finDate.month<10 ? `0${study.finDate.month}/${study.finDate.year}`:`${study.finDate.month}/${study.finDate.year}` : "Current"}</h5>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-studies/${index}`)}}>Modificar</button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-studies" content="Añadir"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Experiencia Laboral</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.workExperience.map((work, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.workExpCard} `}>
                                        <h4 style={{fontWeight:"bold"}}>{work.responsability}</h4>
                                        <h5>{work.companyName}</h5>
                                        {work.contractType&&<h5>{work.contractType}</h5>}
                                        <h5>{work.iniDate.month <10 ? `0${work.iniDate.month}` : work.iniDate.month }/{work.iniDate.year} - {work.finDate ? work.finDate.month<10 ? `0${work.finDate.month}/${work.finDate.year}`:`${work.finDate.month}/${work.finDate.year}` : "Current"}</h5>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-workExp/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-workExp" content="Añadir"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Habilidades</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0', flexWrap:"wrap",display:'flex', alignItems:"center", gap:'10px', marginBottom:0}}>
                            {user.skills.map((skill, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.skillCard} `}>
                                        <p style={{fontWeight:"bold", marginBottom:0, fontSize:"1.25rem"}}>{skill}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-skills" content="Editar"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Licencias y certificaciones</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.certifications.map((certification, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.certificationCard} `}>
                                        <h4 style={{fontWeight:"550"}}>{certification.title} </h4> <h5 style={{fontWeight:"400", color:"#616a6b"}}>{certification.emitter}</h5>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-certifications/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-certifications" content="Añadir"/>
                    </div>
                </div>
            </div>
            <hr/>
            <div>
                <h3 style={{fontWeight:'bold'}}>Idiomas</h3>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        <ul style={{listStyle:'none', paddingLeft:'0'}}>
                            {user.languages.map((language, index)=>{
                                return(
                                    <li key={index} style={{display:'flex', alignItems:"left", flexDirection:'column', marginBottom:"10px"}}className={`${styles.languageCard} `}>
                                        <h4 style={{fontWeight:"550"}}>{language.language} </h4> <h5 style={{fontWeight:"400", color:"#616a6b"}}>{language.level}</h5>
                                        <div>
                                        <button type="button" className="btn btn-light" onClick={()=>{router.push(`/home/profile/edit-languages/${index}`)}}> Modificar </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/home/profile/edit-languages" content="Añadir"/>
                    </div>
                </div>
            </div>
        </div>
    );
}