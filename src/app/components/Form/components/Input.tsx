'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    type: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
    validationMsg?: string;
    validationClass?: string;
}

export function Input({id, htmlfor: htmlFor, label, type, placeholder, className, required, validationMsg, validationClass}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <input required={required} type={type} className='form-control' id={id} name={id} placeholder={placeholder} onChange={handleChange} value={formProperties[id] || ''}/>
            {required && <div className={validationClass}>{validationMsg}</div>}
        </div>
    )
}