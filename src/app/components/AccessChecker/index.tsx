'use client'
import axiosInstance from "lib/axiosInterceptor"
import { useRouter, usePathname } from "next/navigation"
import { useContext, useEffect } from "react"
import { ToastContext } from "app/context/ToastContext";
import { UserContext } from "app/context/UserContext";

interface accessCheckerProps {
    children: React.ReactNode;
}

export default function AccessChecker({children}:accessCheckerProps){

    const router = useRouter();
    const path = usePathname();
    const {showToast} = useContext(ToastContext);
    const {user, waiting} = useContext(UserContext);

    useEffect(() => {
        const checkAccessToken = async () => {
            try {
                await axiosInstance.get('/auth/check-access-token');
            } catch (e) {
                showToast({ msg: 'EL session ha sido expirado, volver a iniciar.', type: 'Bad', visible: true })
                router.push('/')
            }
        };
        checkAccessToken();
    }, [user,router, path]) // cada vez si el usuario ir a paginas protegidas, se comprueba su token de acceso

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }
    return <>{children}</>
}