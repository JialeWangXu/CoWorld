'use client'

import {useContext} from 'react';
import { FormContext } from '..';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    type: string;
    placeholder?: string;
}

export function Checkbox({id, htmlfor: htmlFor, label, type, placeholder}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className='mb-3 form-check'>
            <input type={type} className='form-check-input' id={id} name={id} placeholder={placeholder} onChange={handleChange} value={formProperties[id] || ''}/>
            <label htmlFor={htmlFor} className='form-check-label'>{label}</label>
        </div>
    )
}