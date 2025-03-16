import {createContext} from 'react';
import { ObjectId } from 'mongodb';

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

export type workExperience ={
    responsability: string;
    companyName: string;
    contractType: string;
    iniDate: date;
    finDate?: date;
}

export type certification ={
    title: string;
    emitter: string;
}

export type language ={
    language: string;
    level: string;
}

export type disability ={
    type:string;
    degree:number;
}

export type newjob ={
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities: { type: string; degree: number; }[];
    minumumEducation: string;
    languages:{language:string, level:string}[];
    requiredKnowledge:string[];
    companysRequirements:string;
    description:string;
}

export type job ={
    _id?: ObjectId;
    company_id: ObjectId;
    applicants:ObjectId[];
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities: { type: string; degree: number; }[];
    minumumEducation: string;
    languages:{language:string, level:string}[];
    requiredKnowledge:string[];
    companysRequirements:string;
    description:string;
}

export type formValues = | string | number | boolean | string[] | undefined| null | study[] | date | workExperience[]| certification[]|language[]| disability[]; 
// Para definir el tipo de datos del formulario, restringimos a string tanto key como value, lo que compartimos entre componentes


export type FormProperties = Record<string, formValues>; 
// Para definir el tipo de datos del formulario, restringimos a string tanto key como value, lo que compartimos entre componentes

interface FormContextType { // Para definir el tipo de contexto, para compartir y actuialzar los datos del formulario
    formProperties: FormProperties;
    setFormProperties: (formProperties: FormProperties) => void;
}

export const FormContext = createContext<FormContextType|undefined>(undefined)



