
interface Props {
    label:string;
    selected: boolean;
    onChange:(value:boolean)=>void;
}

export function Checkbox({label, selected,onChange}: Props) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked? true:false)
    }
    return(
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom:"2rem"}}>
            <label htmlFor={label} className='form-check-label' style={{color:"rgb(25, 135, 84)"}}>{label}
            <input type='checkbox' style={{borderColor:"rgb(25, 135, 84)", cursor:"pointer"}} className='form-check-input'id={label} name={label} onChange={handleChange}
            checked={!!selected}/> </label>
        </div>
    )
}