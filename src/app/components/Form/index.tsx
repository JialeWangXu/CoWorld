"use client";

import {createContext, useState} from 'react';
import { Input } from './components/Input';
import { Links } from './components/Link';
import { SubmitButton } from './components/SubmitButton';

// Uso contexto para compartir los datos del formulario entre componentes, evitar pasando props nivel por nivel

type FormProperties = Record<string, string>; 
// Para definir el tipo de datos del formulario, restringimos a string tanto key como value, lo que compartimos entre componentes


interface FormContextType { // Para definir el tipo de contexto, para compartir y actuialzar los datos del formulario
    formProperties: FormProperties;
    setFormProperties: (formProperties: FormProperties) => void;
}

// los props que necesitamos para el formulario
interface FormProviderProps {
    children: React.ReactNode;
    title: string;
    onSubmit: (formProperties: FormProperties) => void;
}

export const FormContext = createContext<FormContextType|undefined>(undefined)

export function Form({children, title, onSubmit}: FormProviderProps) {
    const [formProperties, setFormProperties] = useState<FormProperties>({})
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Evitar que el formulario se actualice
        onSubmit(formProperties); // Llamar a la función onSubmit con los datos del formulario
    }

    return(
        <FormContext.Provider value={{formProperties, setFormProperties}}>
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


