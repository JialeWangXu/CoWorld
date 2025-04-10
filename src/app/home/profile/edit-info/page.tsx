'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { UserContext } from "app/context/UserContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { HABLAR,FISICA,MENTAL,AUDITIVA,INTELECTUAL,PLURIDISCAPACIDAD,VISUAL } from "util/constants";
import { ToastContext } from "app/context/ToastContext";
import styles from './styles.module.scss'
import { set } from "mongoose";

export default function editInfoPage(){
    const {user, waiting, getUser} = useContext(UserContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && user) {
            const initialValues = {
                firstname: user.firstname,
                lastname: user.lastname,
                photo: user.photo,
                city: user.city || '',
                phone: user.phone || '',
                ...Object.fromEntries(
                    user.disabilities.map(({ type, degree }) => [type, degree]))
            }
            console.log(initialValues)
            setOldValues(initialValues)
        }
    }, [waiting, user])

    if(waiting){
        return<div>Cargandno contenido</div> // muy probable que tengo que hacer un esqueleto
    }

    const edit = async (data:any)=>{
        console.log('Editar informacion personal')
        setIsLoading(true)
        try{
            const response = await axiosInstance.post(`/profile/edit-profile`,data,{
            withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            getUser()
            router.push('/home/profile')
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Editar información personal" onSubmit={edit} oldValues={oldValues}>
                <div className="row"style={{marginBottom:'20px', textAlign:'center'}}>
                    <label htmlFor="photo" className={`${styles.profilePhoto}`}>
                        <img src={ oldValues.photo as Base64URLString||"/imgs/user.png"} alt="foto de perfil" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                    </label>
                    <p style={{textAlign:'center', color:'GrayText', marginBottom:0, marginTop:'10px'}}>Pinchar para subir foto</p>
                    <Form.Input 
                        id="photo" 
                        htmlfor="photo" 
                        label="" 
                        type="file" 
                        className='col-sm-12' 
                        accept=".png, .jpg, .jpeg"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.Input 
                        id="firstname" 
                        htmlfor="firstname" 
                        label="Nombre" 
                        type="text" 
                        className='col-md-6' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                    <Form.Input 
                        id="lastname" 
                        htmlfor="lastname" 
                        label="Apellidos" 
                        type="text" 
                        className='col-md-6' 
                        required={true} 
                        validationClass='invalid-feedback'
                        validationMsg='Apellido es necesario!'/>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DegreeSelect
                        id={FISICA}
                        htmlfor={FISICA}
                        label="Discapcidad Física"
                        className='col-md-3'
                    />
                    <Form.DegreeSelect
                        id={AUDITIVA}
                        htmlfor={AUDITIVA}
                        label="Discapcidad auditiva"
                        className='col-md-3'
                    />
                    <Form.DegreeSelect
                        id={VISUAL}
                        htmlfor={VISUAL}
                        label="Discapcidad visual"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={HABLAR}
                        htmlfor={HABLAR}
                        label="Trastorno del hablar"
                        className="col-md-3"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}> 
                    <Form.DegreeSelect
                        id={MENTAL}
                        htmlfor={MENTAL}
                        label="Discapcidad mental"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={INTELECTUAL}
                        htmlfor={INTELECTUAL}
                        label="Discapcidad intelectual"
                        className="col-md-3"
                    />
                    <Form.DegreeSelect
                        id={PLURIDISCAPACIDAD}
                        htmlfor={PLURIDISCAPACIDAD}
                        label="Pluridiscapacidad"
                        className="col-md-3"
                    />
                </div> 
                <div className="row" style={{marginBottom:'30px'}}>
                    <Form.CitySelect 
                        id="city" 
                        htmlfor="city" 
                        label="Ciudad" 
                        className='col-md-6' />
                    <Form.Input 
                        id="phone" 
                        htmlfor="phone" 
                        label="Telefono" 
                        type="tel"
                        pattern="[0-9]{9}"
                        placeholder="123456789" 
                        className='col-md-6' />
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}