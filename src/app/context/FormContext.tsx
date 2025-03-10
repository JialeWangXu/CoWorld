import {createContext} from 'react';

// Uso contexto para compartir los datos del formulario entre componentes, evitar pasando props nivel por nivel

export type date = {
    month: number;
    year: number;
}

export type study ={
    institution: string;
    title: string;
    specialty: string;
    iniDate: date;
    finDate?: date;
}

export type formValues = | string | number | boolean | string[] | undefined| null | study[] | date;


export type FormProperties = Record<string, formValues>; 
// Para definir el tipo de datos del formulario, restringimos a string tanto key como value, lo que compartimos entre componentes

interface FormContextType { // Para definir el tipo de contexto, para compartir y actuialzar los datos del formulario
    formProperties: FormProperties;
    setFormProperties: (formProperties: FormProperties) => void;
}

export const FormContext = createContext<FormContextType|undefined>(undefined)



