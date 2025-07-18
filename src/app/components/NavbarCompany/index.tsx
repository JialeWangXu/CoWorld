'use client'
import styles from './styles.module.scss'
import { useState } from 'react';
import { ToastContext } from "../../../context/ToastContext";
import { useContext } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { CompanyContext } from '../../../context/CompanyContext';

export function NavbarCompany(){

    const [activePage, setActivePage] = useState('');
    const {waiting,company, getCompany}=useContext(CompanyContext);
    const {showToast} = useContext(ToastContext);
    const router = useRouter();

    // solo es para que cuando pincha un enlace,el enlace se queda activado
    const handleActivePage = (page:string) => {
        setActivePage(page);
    }

    const handleLogOut = async () =>{
        try{        
        const {data} =await axios.post(`/api/auth/logout`)
        showToast({msg:data.sucess, type:'Good',visible:true})
        router.push('/')
        }catch(e){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }
    }
    const handleProfile = async () =>{
        try{
        await getCompany()
        router.push('/company-home/profile')
        }catch(e){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }
    }
    

    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{marginBottom:'20px', backgroundColor:"#d5f5e3 "}}>
            <div className="container-fluid">
                <a className={`${styles.logo} navbar-brand logo`} href="/company-home"
                onClick={() => handleActivePage('')}>CoWorld</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav linknav">
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='ofertas' ? styles.active : ''}`} aria-current="page" href="/company-home"
                    onClick={()=>{handleActivePage('ofertas')}}>Ofertas</a>
                    </li>
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='candidatos' ? styles.active : ''}`} href="/company-home/candidates"
                    onClick={()=> handleActivePage('candidatos')}>Candidatos</a>
                    </li>
                    {(company?.isOperator!==2)&&<li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='operators' ? styles.active : ''}`} href="/company-home/operators"
                    onClick={()=> handleActivePage('operators')}>Operadores</a>
                    </li>}
                    { company?.isOperator!==2&& ( <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='perfil' ? styles.active : ''}`}  href="/company-home/profile"
                    onClick={()=>{handleActivePage('perfil'), handleProfile()}}>Perfil</a>
                    </li>)}
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='ayuda' ? styles.active : ''}`} href="/company-home/help"
                    onClick={()=>{handleActivePage('ayuda')}}>Ayuda</a>
                    </li>
                </ul>
                <a className="nav-link ms-auto" aria-label='Haz click al link para cerrar sesion.' href="/"
                    onClick={()=>{handleLogOut()}}><img src='/imgs/power-off.png' style={{paddingRight:'8px'}} alt='Logo de cerrar sesion'></img></a>
                </div>
            </div>
        </nav>
    );
}