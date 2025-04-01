import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
export function ProfileSkeleton(){
    return(
        <>
            <Skeleton height={200} count={8} style={{marginBottom:"1.5rem"}}></Skeleton>
        </>
    )
}