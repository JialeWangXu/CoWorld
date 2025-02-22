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

export function Input({id, htmlfor: htmlFor, label, type, placeholder}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className='mb-3'>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <input type={type} className='form-control' id={id} name={id} placeholder={placeholder} onChange={handleChange} value={formProperties[id] || ''}/>
        </div>
    )
}