import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styles from './styles.module.scss'

interface Props {
    cards:number;
}

export  function CardSkeleton({cards}:Props){

    return(
        Array(cards).fill(0).map((_, index)=>(
        <div className={`${styles.jobCard} col-sm-12`} key={index} >
            <div className="row" style={{display:"flex", flexWrap:"nowrap", marginLeft:"1rem"}}>
                    <div className="col-6" style={{paddingLeft:0}}>
                        <Skeleton count={2}></Skeleton>
                    </div>
                    <div className="col-6">
                            <div className="row" style={{display:"flex", flexWrap:"nowrap"}}>
                                <div className="col-sm-8"style={{display:"flex", flexDirection:"column", textAlign:"end"}} >
                                <Skeleton count={3}></Skeleton>
                                </div>
                                <div className={`${styles.profilePhoto} col-sm-4`} style={{textAlign:'center'}}>
                                        <Skeleton circle width={90} height={90}></Skeleton>
                                </div>
                                    <div className="col-1" style={{padding:0, width:"36px"}}></div>
                            </div>
                    </div>
            </div>
                <Skeleton count={2}></Skeleton>
        </div>))
        
    )
}