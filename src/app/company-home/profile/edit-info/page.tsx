'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { CompanyContext } from "app/context/CompanyContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";
import styles from './styles.module.scss'

export default function editInfoPage(){
    const {company, waiting, getCompany} = useContext(CompanyContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && company) {
            const initialValues = {
                companyName:company.companyName,
                logo: company.logo,
                city: company.city || '',
                industry: company.industry || '',
                scale: company.scale || '',
                url: company.url || ''
            }
            setOldValues(initialValues)
        }
    }, [waiting, company])

    if(waiting){
        return<div>Cargandno contenido</div>
    }

    const edit = async (data:any)=>{
        setIsLoading(true)
        try{
            const response = await axiosInstance.post(`/company-profile/edit-profile`,data,{
                withCredentials:true
            })
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            getCompany()
        }catch(e:any){
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        }finally{
            router.push('/company-home/profile')
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Editar información de la empresa" onSubmit={edit} oldValues={oldValues}>
                <div className="row"style={{marginBottom:'20px', textAlign:'center'}}>
                    <label htmlFor="logo" className={`${styles.profilePhoto}`}>
                        <img src={ oldValues.logo as Base64URLString||"/imgs/company.png"} alt="foto de perfil empresa" style={{width:'110px',height:'110px', borderRadius:'100%'}}></img>
                    </label>
                    <p style={{textAlign:'center', color:'GrayText', marginBottom:0, marginTop:'10px'}}>Pinchar para subir foto</p>
                    <Form.Input 
                        id="logo" 
                        htmlfor="logo" 
                        label="" 
                        type="file" 
                        className='col-sm-12' 
                        accept=".png, .jpg, .jpeg"
                    />
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"></div>
                    <Form.Input 
                        id="companyName" 
                        htmlfor="companyName" 
                        label="Nombre de la empresa" 
                        type="text" 
                        className='col-md-8' 
                        required={true}
                        validationClass='invalid-feedback'
                        validationMsg='Nombre es necesario!'/>
                    <div className="col"></div>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"></div>
                    <Form.CitySelect 
                        id="city" 
                        htmlfor="city" 
                        label="Ciudad" 
                        className='col-md-8' />
                    <div className="col"></div>
                </div>
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"></div>
                    <Form.Input 
                        id="industry" 
                        htmlfor="industry" 
                        label="Sector de la empresa" 
                        type="text" 
                        className='col-md-8' />
                    <div className="col"></div>
                </div> 
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"></div>
                    <Form.ScaleSelect 
                        id="scale" 
                        htmlfor="scale" 
                        label="Tamaño de la empresa: " 
                        className='col-md-8' />
                    <div className="col"></div>
                </div>  
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col"></div>
                    <Form.Input 
                        id="url" 
                        htmlfor="url" 
                        label="Enlace oficial de la empresa" 
                        type="text" 
                        className='col-md-8' />
                    <div className="col"></div>
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/company-home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}