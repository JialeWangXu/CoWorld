'use client'
import {useContext} from 'react';
import { FormContext } from '../../../context/FormContext';

interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function JobCategorySelect({id, htmlfor: htmlFor, label,className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormProperties({...formProperties, [id]: event.target.value});
    }
    return(
        <div className={className}>
            <label htmlFor={htmlFor} className='form-label'>{label}</label>
            <select className='form-select' id={id}  onChange={handleChange} value={String(formProperties[id])} required>
                <option value="">Elegir una categoría </option>
                <option value="Administración de empresas">Administración de empresas</option>
                <option value="Atención a clientes">Atención a clientes</option>
                <option value="Calidad, producción e I+D">Calidad, producción e I+D</option>
                <option value="Compras, logística y almacén">Compras, logística y almacén</option>
                <option value="Educación y formación">Educación y formación</option>
                <option value="Informática y telecomunicaciones">Informática y telecomunicaciones</option>
                <option value="Ingenieros y técnicos">Ingenieros y técnicos</option>
                <option value="Inmobiliario y construcción">Inmobiliario y construcción</option>
                <option value="Profesiones, artes y oficios">Profesiones, artes y oficios</option>
                <option value="Sanidad y salud">Sanidad y salud</option>
                <option value="Sector Farmacéutico">Sector Farmacéutico</option>
                <option value="Turismo y restauración">Turismo y restauración</option>
                <option value="Ventas al detalle">Ventas al detalle</option>
                <option value="Otros">Otros</option>
            </select>
        </div>
    )
}