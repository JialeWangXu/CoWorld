'use client'
import { Spinner } from '../../Spinner'

interface submitButtonProps {
    text: string;
    loading: boolean;

}

export function SubmitButton({text,loading}: submitButtonProps) {

    return(
        <div className='mb-3' style={{display: 'flex', justifyContent: 'center'}}>
        <button type="submit" className="btn btn-success fw-bold fs-5 --bs-bg-opacity: .5" style={{width:'70%', height:'3.5rem'}} disabled={loading}>{loading ? <Spinner/> : text}</button>
        </div>
    )
}