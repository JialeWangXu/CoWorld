import {useContext} from 'react';
import { FormContext } from '../../../../context/FormContext';


interface inputProps {
    id: string;
    htmlfor: string;
    label: string;
    className?: string;
}

export function Checkbox({id, htmlfor: htmlFor, label, className}: inputProps) {
    const {formProperties, setFormProperties} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormProperties({...formProperties, [id]: (event.target.checked? true:false)});
    }
    return(
        <div className={className? className:'col-sm-12'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor={htmlFor} className='form-check-label'>{label}
            <input type='checkbox' className='form-check-input'id={id} name={id} onChange={handleChange}
            checked={!!formProperties[id]}/> </label>
        </div>
    )
}