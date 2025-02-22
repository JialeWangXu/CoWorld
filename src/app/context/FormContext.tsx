import {createContext} from 'react';

// Uso contexto para compartir los datos del formulario entre componentes, evitar pasando props nivel por nivel

export type FormProperties = Record<string, string|number>; 
// Para definir el tipo de datos del formulario, restringimos a string tanto key como value, lo que compartimos entre componentes

interface FormContextType { // Para definir el tipo de contexto, para compartir y actuialzar los datos del formulario
    formProperties: FormProperties;
    setFormProperties: (formProperties: FormProperties) => void;
}

export const FormContext = createContext<FormContextType|undefined>(undefined)



