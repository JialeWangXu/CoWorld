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
    help?:boolean;
    accept?:string
    pattern?: string;
}

export function Input({pattern,id, htmlfor: htmlFor, label, type, placeholder, className, required, validationMsg, validationClass,help, accept}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const convertToBase64 = async function convertToBase64(file:File) {
        return new Promise((resolve, reject)=>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file); // lee fichero y convierte en cadena de base64
            fileReader.onload=()=>{
                resolve(fileReader.result) //resultado de imagen en cadena de base64
            };
            fileReader.onerror= (e) =>{
                reject(e);
            }
        })
    }

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        if(type === 'file'){
            const base64File = await convertToBase64(event.target.files[0]) as Base64URLString;
            setFormProperties({...formProperties, [id]: base64File});
        }else{
            setFormProperties({...formProperties, [id]: event.target.value});
        }
        
    }
    // cuando el input es de tipo file, solo es readOnly, por eso, no podemo poner value
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}{help &&<div className={`${styles.tooltip}`}> ❔<span className={`${styles.tooltiptext}`}>
            La contraseña debe contener al menos 8 caracteres, 1 letra minúscula, 1 mayúscula, 1 número y 1 carácter especial.</span></div>}</label>
            <input pattern={pattern} required={required} type={type} className='form-control' id={id} name={id} placeholder={placeholder} onChange={handleChange} {...(type !== 'file' ? { value: (formProperties[id] as string | number | readonly string[] || '') } : {})} accept={accept} style={{ display: type === "file" ? "none" : "" }}/>
            {required && <div className={validationClass}>{validationMsg}</div>}
        </div>
    )
}