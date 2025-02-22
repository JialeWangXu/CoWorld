'use client'

import {useContext, useState} from 'react';
import { FormContext } from '../../../context/FormContext';
import { COMPANY,CANDIDATE } from 'util/constants';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
}

export function Checkbox({id, htmlfor: htmlFor, label}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;
    const [checked, setChecked] = useState(0)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked ? 1 : 0);
        setFormProperties({...formProperties, [id]: (event.target.checked? COMPANY:CANDIDATE)});
    }
    return(
        <div className='form-check'>
            <input type='checkbox' className='form-check-input'id={id} name={id} onChange={handleChange} value={formProperties[id] || ''}
            checked={!!checked}/>
            <label htmlFor={htmlFor} className='form-check-label'>{label}</label>
        </div>
    )
}