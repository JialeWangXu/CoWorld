'use client'
import { UserContext } from "app/context/UserContext";
import { useContext } from "react";
import { EditButton } from "app/components/PerfilComponents/EditButton";
import styles from './styles.module.scss'

export default function profilePage(){
    const {user,getUser,waiting} = useContext(UserContext)
    
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
                    <h6>{dis.length>0 ? dis:''}</h6>
                    <h6>{user.city ? user.city : ''}</h6>
                    <h6>{user.phone ? user.phone : ''}</h6>
                    <h6>{user.email}</h6>
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
                        <ul style={{listStyle:'none'}}>
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
        </div>
    );
}