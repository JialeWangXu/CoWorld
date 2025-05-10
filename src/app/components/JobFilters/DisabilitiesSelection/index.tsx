import { useState } from "react";
import { FISICA, AUDITIVA, VISUAL, HABLAR, MENTAL, INTELECTUAL, PLURIDISCAPACIDAD } from "util/constants";

interface Props {
    buttonName:string;
    options: string[];
    title: string;
    selected: {type:string, degree:number}[];
    onChange:(value:{type:string, degree:number}[])=>void;
}

export function DisabilitiestSelectionModal({buttonName,options,title,selected,onChange}:Props){

    var initialValues = [{type:FISICA,degree:-1},
        {type:AUDITIVA,degree:-1},
        {type:VISUAL,degree:-1},
        {type:HABLAR,degree:-1},
        {type:MENTAL,degree:-1},
        {type:INTELECTUAL,degree:-1},
        {type:PLURIDISCAPACIDAD,degree:-1}];

    const [values, setValues] = useState(selected);
    
    


    const handleOnchange=(event: React.ChangeEvent<HTMLSelectElement>, id:string)=>{
        setValues(prevValues =>
            prevValues.map(e =>
                e.type === id ? { ...e, degree: Number(event.target.value) } : e
            ));
    }

    const handleClean =()=>{
        setValues(initialValues);
    }

    const handleSubmit=()=>{
        selected = values;
        onChange(selected);
    }

    return(
        <div style={{display: "flex", justifyContent: "center",marginBottom:"2rem"}}>
            <button type="button" style={{width:"200px"}} className={`btn ${selected.filter(e=>e.degree>-1).length>0?'btn-success':'btn-outline-success'}`} data-bs-toggle="modal" data-bs-target="#DisabilityModal">{<div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px"}}>{buttonName} {selected.filter(e=>e.degree>-1).length>0&&(<div style={{borderRadius:"52%", width:"22px", height:"22px", backgroundColor:"white", color:"green", fontWeight:"bold", display:"flex", justifyContent:"center",alignItems:"center"}}>{selected.filter(e=>e.degree>-1).length}</div>)}</div>}</button>

            <div className="modal fade" id="DisabilityModal" tabIndex={-1} aria-labelledby="DisabilityModalLabel">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="DisabilityModalLabel">{title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form style={{ display: 'flex', flexWrap:"wrap"}}>
                                {options.map(option =>
                                    <div key={option} className="col-md-6 col-sm-12">
                                    <label htmlFor={option} className='form-label'>Discapacidad {option}</label>
                                    <select className='form-select' id={option}  onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleOnchange(event,option)} value={String(values.find(e => e.type===option).degree) ||"-1" } style={{width:'150px'}}>
                                        <option value="-1">None</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
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