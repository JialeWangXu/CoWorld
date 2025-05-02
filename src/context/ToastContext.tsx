'use client'
import React, { createContext, useState } from "react"
import {Toast, toastType} from '../app/components/Toast/index'

export interface toastContextType{ // solo parte de datos, para inicializar mas conveniente
    msg:string,
    type:toastType,
    visible:boolean
}

const initialToastContextType: toastContextType={ // initializar datos
    msg: null,
    type:null,
    visible:false
}

interface IToast extends toastContextType{ // Para que otros componentes usa como una funcion 
    showToast: (props:toastContextType)=>void
}

interface toastProviderProps{
    children: React.ReactNode;
}

export const ToastContext = createContext<IToast>({} as IToast)

export const ToastProvider=({children}:toastProviderProps)=>{
    const [toast, setToast] = useState<toastContextType>(initialToastContextType)

    const showToast=(props:toastContextType)=>{ // handler de toast
        if(props){
            setToast(props)
            
            setTimeout(()=>{ // despues de mostrar, volver a estado iniciar
                setToast({msg:null, type:null,visible:false})
            },3000)
        }
    }
 // defino el provider aqui, porque todo el sys solo voy a necesitar 1 toast para todos
    return(
        <ToastContext.Provider value={{...toast, showToast}}>
            {children}
            {toast.visible&& (<Toast msg={toast.msg} type={toast.type}/>)}
        </ToastContext.Provider>
    )
}

