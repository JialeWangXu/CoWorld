'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function ContractTypeSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className} style={{display:'flex', alignItems:"center", gap:'5px'}}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id] ?? "")} style={{width:'150px'}}>
                <option value={""}>Elegir un tipo de contrato</option>
                <option value={"Indefinido"}>Indefinido</option>
                <option value={"Temporal"}>Temporal</option>
                <option value={"Formativo"}>Formativo</option>
                <option value={"Otros tipos"}>Otros tipos</option>
            </select>
        </div>
    )
}