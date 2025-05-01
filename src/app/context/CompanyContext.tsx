'use client'
import React, { createContext, useState, useEffect } from "react"
import { ICompanyProfile } from "models/CompanyProfile"
import axiosInstance from "lib/axiosInterceptor";
import { job } from "./FormContext";

export interface companyContextType extends ICompanyProfile{  // solo parte de datos, para inicializar mas conveniente
        firstname: string;
        lastname: string;
        email: string;
        companyName: string;
        cif:string;
        jobs:job[];
        isOperator:number;
}

export interface ICompany {
    company?:companyContextType;
    waiting:boolean;
    getCompany:()=>Promise<void>
}

interface companyProviderProps{
    children: React.ReactNode;
}

export const CompanyContext = createContext<ICompany>({} as ICompany);

export const CompanyProvider=({children}:companyProviderProps)=>{
    const [company, setCompany] = useState<companyContextType>()
    const [waiting, setWaiting] = useState(true);
    
    const getCompany = async() =>{
        try{
        const {data} =await axiosInstance.get(`/company-profile/get-profile` ,{
            withCredentials:true
        });
        const  jobs = await axiosInstance.get(`/company-jobs/get-jobs` ,{
            withCredentials:true
        });
        const role = await axiosInstance.get(`/auth/company-check-role` ,{
            withCredentials:true
        });
        const company:companyContextType = {
            _id:data.profile._id,
            company_id:data.profile.company_id._id,
            firstname:data.profile.company_id.firstname,
            lastname: data.profile.company_id.lastname,
            email: data.profile.company_id.email,
            companyName:data.profile.company_id.companyName,
            cif:data.profile.company_id.cif,
            industry:data.profile.industry,
            city:data.profile.city,
            scale:data.profile.scale,
            url:data.profile.url,
            logo:data.profile.logo,
            description:data.profile.description,
            jobs:jobs.data.jobs,
            isOperator: role.data.isOperator,
        }
        setCompany(company);
        setWaiting(false);
        }catch(e){
            console.log("Hubido problema en cargar datos de empresa:"+e);
            setWaiting(false);
        }
    }
    useEffect(()=>{
        getCompany()
    },[]) //No ponemos dependencia de actualizacion en aqui es porqu sino se causa un bulce infinito de actualizacionnes.
          //Por eso actualizamos manualmente cada vez hay cambio en el profile, haciendo getCompany(). 

    return(
        <CompanyContext.Provider value={{company,waiting,getCompany}}>
            {children}
        </CompanyContext.Provider>
    )
}
