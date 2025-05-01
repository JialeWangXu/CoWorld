import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function WorkHoursSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} >
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "")} required>
                <option value={""}>Elegir una opción</option>
                <option value={"Completa"}>Completa</option>
                <option value={"Parcial - Mañana"}>Parcial - Mañana</option>
                <option value={"Parcial - Tarde"}>Parcial - Tarde</option>
                <option value={"Parcial - Noche"}>Parcial - Noche</option>
            </select>
        </div>
    )
}