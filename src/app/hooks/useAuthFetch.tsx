import { useRouter } from "next/navigation";
import axios,{AxiosRequestConfig} from "axios";
import { ToastContext } from "app/context/ToastContext";
import { useContext } from "react";

 interface authProps{
    endpoint:string,
    nextPath:string,
    config?:AxiosRequestConfig,
    fetchdata:any
 }

 export function useAuthFetch() {
    const router = useRouter();
    const {showToast} = useContext(ToastContext)
    const authFetch=async({endpoint,nextPath,config,fetchdata}:authProps)=>{
        try{
            const updatedConfig = {
               ...config,
               withCredentials: true,
            };
           const {data} =await axios.post(`/api/auth/${endpoint}`,fetchdata,updatedConfig)
           showToast({msg:data.sucess, type:'Good',visible:true})
           router.push(nextPath)
        }catch(e:any){
           showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }
    }
    
    return authFetch
 }