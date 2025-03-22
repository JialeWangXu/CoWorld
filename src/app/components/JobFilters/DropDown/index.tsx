'use client'

import { useEffect, useState } from "react";

interface Props {
    DefaultName:string;
    options: string[];
    selected: string;
    onChange:(value:string)=>void;
}

export function DropDown({DefaultName,options,selected,onChange}:Props){

    const [values, setValues] = useState(selected);

    // useEffect(()=>{
    //     setValues(selected);
    // },[selected])

    return(
        <div  style={{display:'flex', justifyContent:"center", gap:'5px', marginBottom:"2rem"}}>
            <select className="form-select" id={DefaultName}  onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>{setValues(event.target.value),onChange(event.target.value)}} value={values}  style={{width:'165px', borderColor:"rgb(25, 135, 84)", color:"rgb(25, 135, 84)", cursor:"pointer"}}> 
                <option value={""}>{DefaultName}</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    )

}