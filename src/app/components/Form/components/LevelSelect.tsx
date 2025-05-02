import {useContext} from 'react';
import { FormContext } from '../../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function LevelSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} style={{display:'flex', alignItems:"center", gap:'5px'}}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "")} style={{width:'180px'}} required>
                <option value={""}>Elegir un nivel</option>
                <option value={"Básico"}>Básico</option>
                <option value={"Intermedio"}>Intermedio</option>
                <option value={"Avanzado"}>Avanzado</option>
                <option value={"Nativo"}>Nativo</option>
            </select>
        </div>
    )
}