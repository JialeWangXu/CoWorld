"use client";

import {useState} from 'react';
import { Input } from './components/Input';
import { Links } from './components/Link';
import { SubmitButton } from './components/SubmitButton';
import { FormContext,FormProperties } from '../../context/FormContext';



// los props que necesitamos para el formulario
interface FormProviderProps {
    children: React.ReactNode;
    title: string;
    onSubmit: (formProperties: FormProperties) => void;
}

export function Form({children, title, onSubmit}: FormProviderProps) {
    const [formProperties, setFormProperties] = useState<FormProperties>({})
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Evitar que el formulario se actualice
        onSubmit(formProperties); // Llamar a la función onSubmit con los datos del formulario
    }

    return(
        <FormContext.Provider value={{formProperties,setFormProperties}}>
            <form onSubmit={handleSubmit} className="p-2" style={{width: '80%'}}>
                <div className='mb-3'>
                    <h2>{title}</h2>
                </div>
                {children}
            </form>
        </FormContext.Provider>
    )
}

// Exponer hijos:
Form.Input = Input; 
Form.Links = Links;
Form.SubmitButton = SubmitButton;


