'use client'
import styles from './styles.module.scss'
import { useState } from 'react';

export function NavbarCandidate(){

    const [activePage, setActivePage] = useState('');
    
    const handleActivePage = (page:string) => {
        setActivePage(page);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className={`${styles.logo} navbar-brand logo`} href="/home"
                onClick={() => handleActivePage('')}>CoWorld</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav linknav">
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='ofertas' ? styles.active : ''}`} aria-current="page" href="#"
                    onClick={()=>{handleActivePage('ofertas')}}>Ofertas</a>
                    </li>
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='misEmpleos' ? styles.active : ''}`} href="#"
                    onClick={()=> handleActivePage('misEmpleos')}>Mis Empleos</a>
                    </li>
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='perfil' ? styles.active : ''}`}  href="#"
                    onClick={()=>{handleActivePage('perfil')}}>Perfil</a>
                    </li>
                    <li className="nav-item">
                    <a className={`${styles.hov} nav-link ${activePage ==='ayuda' ? styles.active : ''}`} href="#"
                    onClick={()=>{handleActivePage('ayuda')}}>Ayuda</a>
                    </li>
                </ul>
                <a className="nav-link ms-auto" href="#"><img src='/imgs/power-off.png' style={{paddingRight:'8px'}}></img></a>
                </div>
            </div>
        </nav>
    );
}