import {useContext} from 'react';
import { FormContext } from '../../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function StateSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} style={{display:'flex', alignItems:"center", gap:'5px'}}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "Libre")} style={{width:'150px'}}>
                <option value={"Libre"}>Libre</option>
                <option value={"Estudiando"}>Estudiando</option>
                <option value={"Trabajando"}>Trabajando</option>
            </select>
        </div>
    )
}