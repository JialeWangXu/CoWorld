'use client'
import React, { createContext, useState, useEffect } from "react"
import { ICandidateProfile } from "models/CandidateProfile"
import axiosInstance from "lib/axiosInterceptor";

export interface userContextType extends ICandidateProfile{  // solo parte de datos, para inicializar mas conveniente
        firstname: string;
        lastname: string;
        email: string;
}

export interface IUser {
    user?:userContextType;
    waiting:boolean;
    getUser:()=>Promise<void>
}

interface userProviderProps{
    children: React.ReactNode;
}

export const UserContext = createContext<IUser>({} as IUser);

export const UserProvider=({children}:userProviderProps)=>{
    const [user, setUser] = useState<userContextType>()
    const [waiting, setWaiting] = useState(true);
    
    const getUser = async() =>{
        try{
        const {data} =await axiosInstance.get(`/profile/get-profile` ,{
            withCredentials:true
        });
        const user:userContextType = {
            _id:data.profile._id,
            user_id:data.profile.user_id,
            firstname:data.profile.user_id.firstname,
            lastname: data.profile.user_id.lastname,
            email: data.profile.user_id.email,
            phone:data.profile.phone,
            city:data.profile.city,
            photo:data.profile.photo,
            disabilities:data.profile.disabilities,
            state:data.profile.state,
            huntingJob:data.profile.huntingJob,
            desiredJob:data.profile.desiredJob,
            description:data.profile.description,
            studies:data.profile.studies,
            workExperience:data.profile.workExperience,
            skills:data.profile.skills,
            languages:data.profile.languages,
            certifications:data.profile.certifications
        }
        setUser(user);
        console.log("Seteado usuario");
        setWaiting(false);
        }catch(e){
            console.log("Hubido problema en cargar datos de usuario:"+e);
            setWaiting(false);
        }
    }
    useEffect(()=>{
        console.log("cargando contenido de usuario")
        getUser()
        console.log("Terminod e cargar")
    },[]) // sospecho que tengo que poner dependencia para que se hace fetch cada vez actualiza. 

    return(
        <UserContext.Provider value={{user,waiting,getUser}}>
            {children}
        </UserContext.Provider>
    )
}

