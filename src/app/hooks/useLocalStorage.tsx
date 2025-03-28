"use client"
import { useState, useEffect } from "react";

export default function useLocalStorage<T>(key:string, initalValues:T){


    const [value, setValue] = useState<T>(initalValues);

    useEffect(() => {
        try {
        const stored = localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored));
        } catch (e) {
        console.error("LocalStorage read error:", e);
        }
    }, [key]);

    useEffect(()=>{
        try{
            localStorage.setItem(key,JSON.stringify(value));
        }catch(e){
            console.log("Error en actualizar contenido de localStorage!!!"+e)
        }
    },[key,value])

    return [value,setValue] as const
}