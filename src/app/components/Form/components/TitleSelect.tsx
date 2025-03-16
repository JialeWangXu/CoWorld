'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function TitleSelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id])} required>
                <option value="">Elegir un título </option>
                <option value="Sin estudios">Sin estudios</option>
                <option value="Educación Secundaria Obligatoria">Educación Secundaria Obligatoria</option>
                <option value="Bachillerato">Bachillerato</option>
                <option value="Ciclo Formativo Grado Medio">Ciclo Formativo Grado Medio</option>
                <option value="Ciclo Formativo Grado Superior">Ciclo Formativo Grado Superior</option>
                <option value="Enseñanzas artísticas (regladas)">Enseñanzas artísticas (regladas)</option>
                <option value="Enseñanzas deportivas (regladas)">Enseñanzas deportivas (regladas)</option>
                <option value="Grado">Grado</option>
                <option value="Licenciatura">Licenciatura</option>
                <option value="Diplomatura">Diplomatura</option>
                <option value="Ingeniería Técnica">Ingeniería Técnica</option>
                <option value="Ingeniería Superior">Ingeniería Superior</option>
                <option value="Postgrado">Postgrado</option>
                <option value="Máster">Máster</option>
                <option value="Doctorado">Doctorado</option>
                <option value="Otros títulos, certificaciones y carnés">Otros títulos, certificaciones y carnés</option>
                <option value="Otros cursos y formación no reglada">Otros cursos y formación no reglada</option>
                <option value="Formación Profesional Grado Medio">Formación Profesional Grado Medio</option>
                <option value="Formación Profesional Grado Superior">Formación Profesional Grado Superior</option>
            </select>
        </div>
    )
}