"use client";

import {useEffect, useState} from 'react';
import { Input } from './components/Input';
import { Links } from './components/Link';
import { DegreeSelect } from './components/DegreeSelect';
import { TitleSelect } from './components/TitleSelect';
import { ModeSelect } from './components/ModeSelect';
import { ExperienceSelect } from './components/ExperienceSelect';
import { WorkHoursSelect } from './components/WorkHoursSelect';
import { JobCategorySelect } from './components/JobCategorySelect';
import { CitySelect } from './components/CitySelector';
import {LanguageInput} from './components/LanguageInput'
import { JobStatusSelect } from './components/JobStatusSelect';
import { ScaleSelect } from './components/ScaleSelect';
import { StateSelect } from './components/StateSelect';
import {LevelSelect} from './components/LevelSelect';
import { ContractTypeSelect } from './components/ContractTypeSelect';
import { DateInput } from './components/DateInput';
import { Checkbox } from './components/Checkbox';
import { TagInput } from './components/TagInput';
import { TextAreas } from './components/TextAreas';
import { SubmitButton } from './components/SubmitButton';
import { FormContext,FormProperties } from '../../../context/FormContext';



// los props que necesitamos para el formulario
interface FormProviderProps {
    children: React.ReactNode;
    title: string;
    oldValues?:FormProperties;
    onSubmit: (formProperties: FormProperties) => void;
}

export function Form({children, title, onSubmit, oldValues={} }: FormProviderProps) {
    //iniciamos oldValues con {} para caso de que no tiene valores viejos. 
    const [formProperties, setFormProperties] = useState<FormProperties>(oldValues)

    useEffect(()=>{
        setFormProperties(oldValues);
    },[oldValues])

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
Form.DegreeSelect = DegreeSelect;
Form.TitleSelect = TitleSelect;
Form.StateSelect = StateSelect;
Form.ScaleSelect = ScaleSelect;
Form.LevelSelect = LevelSelect;
Form.ModeSelect = ModeSelect;
Form.ExperienceSelect = ExperienceSelect;
Form.WorkHoursSelect = WorkHoursSelect;
Form.JobCategorySelect =JobCategorySelect;
Form.CitySelect=CitySelect;
Form.ContractTypeSelect = ContractTypeSelect;
Form.Checkbox = Checkbox;
Form.JobStatusSelect = JobStatusSelect;
Form.TagInput = TagInput;
Form.LanguageInput = LanguageInput;
Form.TextAreas = TextAreas;
Form.DateInput = DateInput;
Form.SubmitButton = SubmitButton;