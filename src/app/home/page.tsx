"use client"
import { useGet } from "app/hooks/useGet";
export default function HomePage(){
    const profileFetch = useGet();
    const handleProfile = async () =>{
        try{
        console.log('ir profile-------------------------------------------------')
        
        await profileFetch({nextPath:'/home/profile'})
        console.log('fin ')
        }catch(e){
            console.log(e)
        }
    }
    return(
        <div><h1>Home Page</h1>
        <a href="/home/profile"
                    onClick={()=>{handleProfile()}}>Perfil</a>
        </div>
    );
}