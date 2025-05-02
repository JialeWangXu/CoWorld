import {useContext} from 'react';
import { FormContext } from '../../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function DegreeSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const currentValue = formProperties[id] ?? -1;
    // Es necesario cambiar valor a string, porque select solo acepta string
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const rawValue = event.target.value;
        const numericValue = Number(rawValue);
        // Al guardarlo, convertimos a numerico 
        setFormProperties({...formProperties, [id]: numericValue});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={currentValue === null ? "-1" : String(currentValue)} style={{width:'150px'}}>
                <option value="-1">None</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
    )
}