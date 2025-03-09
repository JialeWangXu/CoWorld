import Link from "next/link"
export function EditButton({ nextPath }: { nextPath: string }) {
    return(
        <Link href={nextPath} style={{textDecoration:'none'}}>
        <div  style={{margin:'10px', textAlign:'center'}}>
            <button type="button" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'100px', height:'3rem'}} > Editar </button>
        </div>
        </Link>
    )
}