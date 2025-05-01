'use client'
import { Form } from "app/components/Form";
import { useContext, useEffect, useState } from "react";
import { FormProperties } from "app/context/FormContext";
import { CompanyContext } from "app/context/CompanyContext";
import { useSnipper } from "app/hooks/useSnipper";
import { useRouter } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { ToastContext } from "app/context/ToastContext";


export default function editDescriptionPage(){
    const {company, waiting, getCompany} = useContext(CompanyContext);
    const [oldValues, setOldValues] = useState<FormProperties>({});
    const {isLoading,setIsLoading} = useSnipper();
    const {showToast} = useContext(ToastContext);
    const router = useRouter()
    
    useEffect(() => {
        if (!waiting && company) {
            const initialValues = {
                description: company.description
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
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center', margin:"auto"}}>         
            <Form title="Editar descripcion de la empresa" onSubmit={edit} oldValues={oldValues}>
                <div className="row" style={{marginBottom:'20px'}}>
                    <Form.TextAreas 
                        id="description"
                        placeholder="Cuéntenos algo sobre su empresa! :D"
                        className='form col-sm-12'
                        row={10}
                        length={5000} />
                </div> 
                <div className='text-center'>
                    <Form.SubmitButton text="Guardar" loading={isLoading}/>
                    <Form.Links href="/company-home/profile" text="" linkText='Volver'/>
                </div>   
            </Form>
        </div>
    )
}