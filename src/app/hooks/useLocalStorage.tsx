import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key:string, initalValues:T){

    const [values, setValues] = useState<T>(()=>{

        if(typeof window==="undefined"){ // cuando esta rederizando
            return initalValues;
        }else{
            try{
            // intentar leer los valores que tenemos guardado 
            const historial = localStorage.getItem(key);
            return historial? JSON.parse(historial):initalValues;
            }catch(e){
                console.log("Error al recuperar la historial, devuelvo valor inicial"+e);
                return initalValues;
            }
        }
    });

    useEffect(()=>{
        try{
            localStorage.setItem(key,JSON.stringify(values));
        }catch(e){
            console.log("Error en actualizar contenido de localStorage!!!"+e)
        }
    },[key,values])

    return [values,setValues] as const
}