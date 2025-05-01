interface Props {
    DefaultName:string;
    options: string[];
    selected: string;
    arialLable:string;
    onChange:(value:string)=>void;
}

export function DropDown({DefaultName,options,selected,onChange, arialLable}:Props){

    return(
        <div  style={{display:'flex', justifyContent:"center", gap:'5px', marginBottom:"2rem"}}>
            <select aria-label={arialLable} className="form-select" id={DefaultName}  onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>{onChange(event.target.value)}} value={selected? selected: ""}  style={{width:'200px', borderColor:"rgb(25, 135, 84)", color:"rgb(25, 135, 84)", cursor:"pointer"}}> 
                <option value={""}>{DefaultName}</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    )

}