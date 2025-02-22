"use client";

import {useState, useEffect} from 'react';
import { Input } from '../Form/components/Input';
import { Links } from '../Form/components/Link';
import { SubmitButton } from '../Form/components/SubmitButton';
import { Checkbox } from '../Form/components/Checkbox';
import { FormContext,FormProperties } from '../../context/FormContext';


// los props que necesitamos para el formulario
interface FormProviderProps {
    children: React.ReactNode;
    title: string;
    onSubmit: (formProperties: FormProperties) => void;
}

export function ValidationForm({children, title, onSubmit}: FormProviderProps) {

    const [formProperties, setFormProperties] = useState<FormProperties>({})

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Evitar que el formulario se actualice
        onSubmit(formProperties); // Llamar a la función onSubmit con los datos del formulario
    }

    useEffect(()=>{
        'use strict';
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
              if (!(form as HTMLFormElement).checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                onSubmit(formProperties);// Llamar a la hook onSubmit con los datos del formulario
              }
              form.classList.add('was-validated')
            }, false)
          })
    }
    ,[])

    return(
        <FormContext.Provider value={{formProperties, setFormProperties}}>
            <form onSubmit={handleSubmit} className=" row g-3 needs-validation p-2" style={{width: '80%'}} noValidate>
                    <h2 style={{marginBottom:'0'}}>{title}</h2>
                {children}
            </form>
        </FormContext.Provider>
    )
}

// Exponer hijos:
ValidationForm.Input = Input; 
ValidationForm.Links = Links;
ValidationForm.Checkbox =Checkbox;
ValidationForm.SubmitButton = SubmitButton;


