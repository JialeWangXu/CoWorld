'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    placeholder?: string;
    className?: string;

}

export function TextAreas({id,  placeholder, className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className}>
            <textarea className='form-control' id={id} name={id} placeholder={placeholder} onChange={handleChange} value={String(formProperties[id])} rows={10} maxLength={800}/>
        </div>
    )
}
