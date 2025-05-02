'use client'
import {useContext, useEffect, useState} from 'react';
import { FormContext,date } from '../../../../context/FormContext';

interface inputProps {
    id: string;
    label: string;
    type: string;
    className?: string;
}

export function DateInput({id, label, type, className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;
    const [error , setError] = useState("");
    const [month, setMonth] = useState((formProperties[id] as date)?.month?.toString() ||"");
    const [year, setYear] = useState((formProperties[id] as date)?.year?.toString() ||"");

    useEffect(()=>{
        if(formProperties[id] as date){
            setMonth((formProperties[id] as date)?.month?.toString())
            setYear((formProperties[id] as date)?.year?.toString())
        }
    }, [formProperties[id] as date])

    const handleChange = async (month:string, year:string) => {

        if(month==="" || year===""){
            console.log("entra if1")
            setError("Por favor, rellene todos los campos")  
        }else if(parseInt(month)>12 || parseInt(month)<1){
            console.log("entra if 2")
            setError("La fecha que has introducido es incorrecta")
        }else if((parseInt(year)<1925 || parseInt(year)>new Date().getFullYear())){
            console.log("entra if 3")
            setError("La fecha que has introducido es incorrecta")
        }
        else{
            // Si todos bien, seteamos directamente al valor de formulario
            console.log("entra else")
            setError("")
            setFormProperties({...formProperties, [id]: {month: parseInt(month), year: parseInt(year)}});
        }
        console.log("error: ", error)
    }

    return(
        <div className={className} style={{width:"400px", marginBottom:"20px"}}>
            <span className="input-group-text">{label}</span>
            <input type={type} aria-label="Mes"className='form-control' placeholder={"Mes"} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{setMonth(event.target.value),handleChange(event.target.value,year)}} value={ month}
                style={{width:"100px"}} min={1} max={12}/>
            <input style={{width:"100px"}} type={type} aria-label="Año"className='form-control' placeholder={"Año"} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{setYear(event.target.value),handleChange(month,event.target.value)}} value={ year} min={1925} max={new Date().getFullYear()}/>
            {error && <span style={{ color: "red" }}>{error}</span>}
        </div>
    )
}
