import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function ExperienceSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} >
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "")} required>
                <option value={""}>Elegir una opción</option>
                <option value={"No requerido"}>No requerido</option>
                <option value={"1 - 3 años"}>1 - 3 años</option>
                <option value={"4 - 6 años"}>4 - 6 años</option>
                <option value={"7 - 9 años"}>7 - 9 años</option>
                <option value={"10 - 10+ años"}>10 - 10+ años</option>
            </select>
        </div>
    )
}