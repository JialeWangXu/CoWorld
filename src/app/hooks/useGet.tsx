"use client"
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";
import { useContext } from "react";

 interface authProps{
    nextPath:string
 }

 export function useGet() {
    const router = useRouter();
    const {showToast} = useContext(ToastContext)
    const profileFetch=async({nextPath}:authProps)=>{
        try{
           const {data} =await axiosInstance.get(`/profile/get-profile` ,{
                     withCredentials:true
             });
           showToast({msg:"PROFILE CARGADOOOO", type:'Good',visible:true})
           router.push(nextPath)
        }catch(e:any){
           showToast({msg:e as string, type:'Bad',visible:true})
        }
    }
    
    return profileFetch
 }