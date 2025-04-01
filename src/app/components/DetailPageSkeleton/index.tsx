import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from "./styles.module.scss"

export function DetailPageSkeleton(){
    return(
        <>
            <div className="container-fluid" style={{ padding:"1.5rem"}}>

                <div className="row">
                    <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem",marginRight:"1rem",marginBottom:"1rem"}}>
                        <div className="col-6" style={{paddingLeft:0}}>
                            <Skeleton count={2}/>
            </div>
            <div className="col-6">
                <div className="row" style={{display:"flex", flexWrap:"nowrap",alignItems:"center"}}>
                    <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end", alignItems:"end"}} >
                        <Skeleton count={3}/>
                    </div>
                    <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center', marginLeft:"15px"}}>
                        <Skeleton circle width={90} height={90}/>
                    </div>
                    <div className="col"></div>
                    </div>
                    </div>
                </div>            
            </div>
            <div className="row" style={{display:"flex", gap:"8px", flexWrap:"wrap", margin:"1rem", flexDirection:"row"}}>
                <Skeleton height={100}></Skeleton>
            </div>

            <div className="row" style={{margin:"1rem"}}>
                <Skeleton height={200}></Skeleton>
            </div>
            </div>
            <hr/>
            <div className="container-fluid" style={{ padding:"1.5rem"}}>

            <div className={`${styles.jobRequirementCard} container-fluid`}>
                <Skeleton count={10}></Skeleton>
            </div>
            <div className={`${styles.jobRequirementCard} container-fluid`}>
                <Skeleton count={2}></Skeleton>
            </div>
                <Skeleton></Skeleton>
            </div>
    </>
    )
}

