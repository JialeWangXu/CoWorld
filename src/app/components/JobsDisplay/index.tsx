import { IJobAndCompany } from "types/JobFilter";
import styles from "./styles.module.scss"
import { useRouter } from "next/navigation";

interface Props {
    jobList: IJobAndCompany[],
}

export default function JobListDisplay({jobList}:Props){
    const router = useRouter();
    return(<>{(jobList?.length > 0) ? (
        jobList.map((job, index) => (
            <div className="row" key={index} style={{marginBottom:"15px"}}>
                    <div className={`${styles.jobCard} ${styles.hov} col-sm-12`} onClick={()=>{router.push(`/home/view-job/${job._id.toString()}`)}}>
                        <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                            <div className="col-6" style={{paddingLeft:0}}>
                            <h4 style={{fontWeight:"bold"}}>{job.jobTitle}</h4>
                            <p style={{fontSize:"20px"}}>{job.city} | {job.mode}</p>
                            </div>
                            <div className="col-6">
                                <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                        <h4 style={{fontWeight:"bold"}}>{job.company_id.companyName}</h4>
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
        <div className="row">
            <div className="col-sm-12" style={{fontSize:"1.4rem", color:"GrayText", fontWeight:"500"}}> No se ha encontrado ningún trabajo que cumpla con los filtros introducidos.</div>
        </div>
    )}</>);
    

}