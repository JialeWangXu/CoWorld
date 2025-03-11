'use client'
import { useContext, useEffect, useState} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    placeholder?: string;
    className?: string;
    maxTag?:number;
    warning?:string;
    unit?:string;
}

export function TagInput({id, htmlfor: htmlFor, label, placeholder, className, maxTag, warning, unit}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const initialTags = () => {
        const value = formProperties[id];
        return Array.isArray(value) ? value as string[] : [];
    };

    const [tag, setTag] = useState<string[]>(initialTags);
    const [job, setJob] = useState<string>("");

    useEffect(() => {
        setTag(initialTags);
    }, [formProperties[id]]);

    useEffect(() => {
        setFormProperties({...formProperties, [id]: tag});
    }, [tag]);
    
    const handleAddJob = () => {
        if(tag.length < maxTag && !tag.includes(job.trim())){
            setTag([...tag, job.trim()]);
            setJob("");
        }           
    }

    const handleRemoveJob = (index:number) => {
        setTag(tag.filter((_, i) => i !== index));
    }
    // cuando el input es de tipo file, solo es readOnly, por eso, no podemo poner value
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {tag.length < maxTag ? 
                <><input type='text' className='form-control' id={id} name={id} placeholder={placeholder} onChange={(e) => setJob(e.target.value)} value={job}/><button type="button" className="btn btn-success fw-bold  --bs-bg-opacity: .5" style={{ width: '100px', height: '2.5rem' }} onClick={handleAddJob}>Añadir</button></>
                : <div className="alert alert-primary d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
                <div>
                    {warning}
                </div>
              </div>}
            </div>
            <div className="d-flex flex-wrap">
                {tag.map((job, index) => (
                    <div key={index} className="badge bg-primary rounded-pill m-1" style={{fontSize: '1rem'}}>
                        <span>{job}</span>
                        <button type="button" className="btn-close btn-close-white" onClick={() => handleRemoveJob(index)}>×</button>
                    </div>
                ))}
            </div>
            <span> Añadido {tag.length} / {maxTag} {unit}</span>
        </div>
    )
}