'use client'

import { useEffect, useState } from "react";
import styles from "../styles.module.scss"

interface Props {
    buttonName:string;
    options: string[];
    title: string;
    selected: string[];
    modalId:string;
    modalLableId:string;
    onChange:(value:string[])=>void;
}

export function MultiSelectModal({buttonName,options,title,selected,modalId,modalLableId,onChange}:Props){

    const [values, setValues] = useState(selected);

    const handleOnchange=(event: React.ChangeEvent<HTMLInputElement>, id:string)=>{
        if(event.target.checked && !values.includes(id)){
            setValues([...values, id]);
        }else if(!event.target.checked && values.includes(id)){
            setValues(values.filter(elem => elem!==id));
        }
    }

    const handleClean =()=>{
        setValues([]);
    }

    const handleSubmit=()=>{
        selected = values;
        onChange(selected);
    }

    useEffect(()=>{
        setValues(selected);
    },[selected])

    return(
        <div style={{display: "flex", justifyContent: "center",marginBottom:"2rem"}}>
            <button type="button" 
            className={`btn btn-outline-success ${styles.btnCustom} 
            ${selected.length > 0 ? styles.btnSelected : ''}`} 
            data-bs-toggle="modal" 
            data-bs-target={`#${modalId}`}>
                {<div className={`${styles.buttonDisplay}`}>{buttonName}
                {selected.length > 0 && 
                (<div className={`${styles.selectedNumber}`}>{selected.length}</div>)}
                </div>}
            </button>
            <div className="modal fade" id={modalId} tabIndex={-1} aria-labelledby={modalLableId} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={modalLableId}>{title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto", padding: "10px" }}>
                            <form style={{ display: 'grid' , gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap:"10px",  alignItems: 'center'}}>
                                {options.map(option =>
                                <div key={option} className='col-md-6 col-sm-12' style={{minWidth: '250px', fontSize: "1.2rem"}}>
                                        <label htmlFor={option} className='form-check-label'style={{display: 'flex', alignItems: 'center', gap: '8px',whiteSpace: 'nowrap'}}>{option+" "}
                                        <input type='checkbox' className='form-check-input'id={option} name={option} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleOnchange(event,option)}
                                        checked={values.includes(option)}   style={{ margin: 0, flexShrink: 0 }}/> </label>
                                </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"  onClick={handleClean}>Borrar Todo</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit}>Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}