'use client'
import {useContext, useEffect, useState} from 'react';
import { FormContext } from '../../../context/FormContext';

import { language } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor:string;
    label: string;
    className?: string;
}

export function LanguageInput({id, label, className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;
    const [error , setError] = useState("");
   
    const initailLanguages = ()=>{
        const value = formProperties[id]
        return Array.isArray(value) ? value as language[] : [];
    } 
    const [languages, setLanguages] = useState<language[]>(initailLanguages)
    const [language, setLanguage] = useState("");
    const [level, setLevel] = useState("");

    useEffect(()=>{
        setLanguages(initailLanguages);
    }, [formProperties[id] as language[]])

    useEffect(()=>{
        setFormProperties({...formProperties, [id]:languages});
    },[languages])

    
    const handleAddLanguage =()=>{

        if(language!=="" && level!==""){
            if(languages.some(elem => elem.language ===language.trim() && elem.level ===level.trim())){
                setError("Requisito repetido!")
                return
            }
            setLanguages([...languages, {language:language.trim(), level:level.trim()}]);
            setLanguage("");
            setLevel("");
            setError("");
        }else{
            setError("No se puede añadir contenidos vacios!");
        }
        
    }

    const handleRemoveLanguage = (index:number) => {
        setLanguages(languages.filter((_, i) => i !== index));
    }

    return(
        <div className={className} >
            <label className='form-label'>{label}</label>
            <div style={{display:'flex', alignItems:"center", gap:'5px'}}>
            <input type="text" aria-label="Idioma"className='form-control' placeholder={"Idioma"} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{setLanguage(event.target.value)}} value={ language}
                style={{width:"200px"}} />
            <select style={{width:"200px"}} aria-label="Nivel"className='form-control' onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>{setLevel(event.target.value)}} value={ level}>
                <option value={""}>Elegir un nivel</option>
                <option value={"Básico"}>Básico</option>
                <option value={"Intermedio"}>Intermedio</option>
                <option value={"Avanzado"}>Avanzado</option>
                <option value={"Nativo"}>Nativo</option>
            </select>
            <button type="button" className="btn btn-success fw-bold  --bs-bg-opacity: .5" style={{ width: '100px', height: '2.5rem' }} onClick={handleAddLanguage}>Añadir</button>
            </div>
            {error && <span style={{ color: "red" }}>{error}</span>}
            <div className="d-flex flex-wrap">
                {languages.map((language, index) => (
                    <div key={index} className="badge bg-primary rounded-pill m-1" style={{fontSize: '1rem'}}>
                        <span>{language.language+" - "+language.level}</span>
                        <button type="button" className="btn-close btn-close-white" onClick={() => handleRemoveLanguage(index)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    )
}