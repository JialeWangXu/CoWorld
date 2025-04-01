import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../CardSkeleton'

export function ListsSkeleton(){
    return(
        <>
        <Skeleton height={55} width={950} style={{marginBottom:"2rem", display:"block", margin:"auto"}}></Skeleton>
        <div className='container'>
            <CardSkeleton cards={3}/>
        </div>
        </>
    )
}