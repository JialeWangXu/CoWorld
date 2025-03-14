"use client"
import { useGet } from "app/hooks/useGet";
export default function CompanyHomePage(){
    const profileFetch = useGet();
    const handleProfile = async () =>{
        try{
        console.log('ir profile-------------------------------------------------')
        
        await profileFetch({nextPath:'/company-home/profile'})
        console.log('fin ')
        }catch(e){
            console.log(e)
        }
    }
    return(
        <div><h1>Company Home Page</h1>
        <a href="/company-home/profile"
                    onClick={()=>{handleProfile()}}>Perfil</a>
        </div>
    );
}