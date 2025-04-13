import { useRouter } from "next/navigation"
export function EditButton({ nextPath, content }: { nextPath: string, content:string }) {
    const router = useRouter()
    return(
        <div  style={{margin:'5px', textAlign:'center'}}>
            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'120px', height:'50px'}} onClick={()=>{router.push(nextPath)}}>{content}</button>
        </div>
    )
}