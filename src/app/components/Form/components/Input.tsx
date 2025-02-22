'use client'
import {useContext} from 'react';
import styles from './styles.module.scss'
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
    help?:boolean
}

export function Input({id, htmlfor: htmlFor, label, type, placeholder, className, required, validationMsg, validationClass,help}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}{help &&<div className={`${styles.tooltip}`}> ❔<span className={`${styles.tooltiptext}`}>
            La contraseña debe contener al menos 8 caracteres, 1 letra minúscula, 1 mayúscula, 1 número y 1 carácter especial.</span></div>}</label>
            <input required={required} type={type} className='form-control' id={id} name={id} placeholder={placeholder} onChange={handleChange} value={formProperties[id] || ''}/>
            {required && <div className={validationClass}>{validationMsg}</div>}
        </div>
    )
}