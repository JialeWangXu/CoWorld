'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function ScaleSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} >
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "")}>
                <option value={""}>Seleccionar el tamaño de la empresa</option>
                <option value="1 - 10">1 - 10 empleados</option>
                <option value="11 - 50">11 - 50 empleados</option>
                <option value="51 - 200">51 - 200 empleados</option>
                <option value="201 - 500">201 - 500 empleados</option>
                <option value="501 - 1000">501 - 1000 empleados</option>
                <option value="1001+">Más de 1000 empleados</option>
            </select>
        </div>
    )
}