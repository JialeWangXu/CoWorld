'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function DegreeSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: Number(event.target.value)});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={Number(formProperties[id]) ?? -1} style={{width:'150px'}}>
                <option value={-1}>None</option>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
            </select>
        </div>
    )
}