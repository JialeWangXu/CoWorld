'use client'
import { CompanyContext } from "app/context/CompanyContext";
import { useContext } from "react";
import { EditButton } from "app/components/PerfilComponents/EditButton";
import styles from './styles.module.scss'
import { useRouter } from "next/navigation";
import { ProfileSkeleton } from "app/components/ProfileSkeleton";

export default function profilePage(){
    const {company,getCompany,waiting} = useContext(CompanyContext)
    const router = useRouter();

    if (waiting) {
        return <ProfileSkeleton/>
    }
    if (!company) {
        return <div>No Company</div> 
    }
    
    return(
        <div className="container-fluid">
            <div className="row">
                <div className={`${styles.profilePhoto} col-md-2 col-sm-12`} style={{textAlign:'center'}}>
                    <img src={ company.logo as Base64URLString||"/imgs/company.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                </div>
                <div className="col-md-8 col-sm-12">
                    <h3 style={{fontWeight:'bold'}}>{company.companyName}</h3>
                    <h5>{company.city ? company.city : ''}</h5>
                    <h5>{company.industry ? company.industry : ''}</h5>
                    <h5>{company.scale ? company.scale +' empleos' : ''}</h5>
                    <h5>{company.url ? company.url :''}</h5>
                </div>
                <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                    <EditButton nextPath="/company-home/profile/edit-info" content="Editar"/>
                </div>
            </div>
            <hr/>
            <div>
                <h2 style={{fontWeight:'bold'}}>Descripción de la empresa</h2>
                <div className="row">
                    <div className="col-md-10 col-sm-12">
                        {company.description? <p>{company.description}</p>:<p style={{color:'gray', fontSize:'1.2rem'}}>Cuéntenos algo sobre su empresa!:D </p>}
                    </div>
                    <div className="col-md-2 col-sm-12" style={{display:"flex", flexDirection:'column',justifyContent:'end'}}>
                        <EditButton nextPath="/company-home/profile/edit-description" content="Editar"/>
                    </div>
                </div>
            </div>
        </div>
    );
}