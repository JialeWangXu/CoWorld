'use client'
import { useState } from "react"
import styles from './../styles.module.scss'

export default function ApplicationViewPage(){

    const [activePage,setActivePage] = useState("solicitados")

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col"></div>
                <div className=" col-sm-10" style={{display:'flex', alignItems:"center",justifyContent:"center", gap:'8px', fontSize:"1.8rem"}}>  
                    <a className={`${styles.hovA} nav-link ${activePage ==='solicitados' ? styles.activeA : ''}`}  href="#"
                    onClick={()=>{setActivePage("solicitados")}} style={{fontSize:"1.8rem"}}> {`Solicitados () `} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='guardados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("guardados")}} style={{fontSize:"1.8rem"}}> {`Guardados ()`} </a> | <a className={`${styles.hovA} nav-link ${activePage ==='cerrados' ? styles.activeA : ''}`} href="#"
                    onClick={()=>{setActivePage("cerrados")}} style={{fontSize:"1.8rem"}}> {`Cerrados ()`} </a>
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}