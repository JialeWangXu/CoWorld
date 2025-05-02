import {useContext} from 'react';
import { FormContext } from '../../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function JobStatusSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} style={{display:'flex', alignItems:"center", gap:'5px'}}>
            <label htmlFor={htmlFor} className='form-label'style={{fontWeight:"bold"}}>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id])}style={{width:'200px'}}>
                <option value={"active"}>En progreso</option>
                <option value={"closed"}>Cerrar la oferta</option>
            </select>
        </div>
    )
}