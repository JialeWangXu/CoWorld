'use client';
import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "lib/axiosInterceptor";
import { Form } from "app/components/Form";
import { useSnipper } from "hooks/useSnipper";
import { ToastContext } from "../../../../../context/ToastContext";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function EditOperatorPage() {
    const params = useParams<{ id: string}>()
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState("");
    const [operator, setOpperator] = useState({});
    const {isLoading,setIsLoading} = useSnipper()
    const router = useRouter()
    const {showToast} = useContext(ToastContext);

    useEffect(() => {
        const fetchOperator = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.post(`/company-operator/get-operator`, { id: params.id }, {
                    withCredentials: true
                });
                setOpperator(data.operator);
                setLoading(false);
            } catch (e) {
                setError("Error al cargar datos del operador");
                setLoading(false);
            }
        }
        fetchOperator();
    }
    , [params.id]);

    if (loading) {
        return <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>
            <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}>
                <div className="col"/>
                <div className="col-md-8">
                <Skeleton count={1}  width={500} height={50} style={{marginBottom:'20px'}}/>
                </div>
                <div className="col"/>
            </div>
            <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}>
                <div className="col"/>
                <div className="col-md-8">
                    <Skeleton count={1} width={500} height={30}style={{marginBottom:'20px'}}/>
                </div>
                <div className="col"/>
            </div>
            <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}>
                <div className="col"/>
                <div className="col-md-8">
                    <Skeleton count={1} width={500} height={30} style={{marginBottom:'20px'}}/>
                </div>
                <div className="col"/>
            </div>
        </div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    const edit = async (data: any) => {
        setIsLoading(true)  
        try {
            const response = await axiosInstance.post(`/company-operator/edit-operator`, { ...data, id: params.id, isDelete:false }, {
                withCredentials: true
            });
            showToast({msg:response.data.sucess, type:'Good',visible:true})
            router.push('/company-home/operators')
        } catch (e: any) {
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        } finally {
            setIsLoading(false)
        }
    }

    const deleteOperator = async () => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(`/company-operator/edit-operator`, { id: params.id, isDelete:true }, {
                withCredentials: true
            });
            showToast({msg:response.data.sucess, type:'Good',visible:true})
        } catch (e: any) {
            showToast({msg:e.response.data.error as string, type:'Bad',visible:true})
        } finally {
            setIsLoading(false)
            router.push('/company-home/operators')
        }
    }

    return (
        <div className="container-fluid" style={{ height:'100%', flexDirection:'column', display:'flex', justifyContent:'center', alignItems:'center' }}>         
            <Form title="Moddificar información del operador" onSubmit={edit} oldValues={operator}>
                <div className="row" style={{marginBottom:'20px', marginTop:'20px'}}>
                    <div className="col"/>
                        <Form.Input 
                                id="firstname" 
                                htmlfor="firstname"
                                label="Nombre" 
                                type="text" 
                                className='col-md-8' 
                                required={true}
                                validationClass='invalid-feedback'
                                validationMsg='Nombre es necesario!'/>
                            <div className="col"/> 
                        </div>
                        <div className="row" style={{marginBottom:'20px'}}>
                            <div className="col"/>
                            <Form.Input 
                                id="lastname"
                                htmlfor="lastname" 
                                label="Apellidos" 
                                type="text" 
                                className='col-md-8' 
                                required={true}
                                validationClass='invalid-feedback'
                                validationMsg='Apellidos es necesario!'/>
                            <div className="col"/> 
                        </div>
                    <div className='text-center'>
                        <div className="row" >
                        <p style={{color:"GrayText"}}>No está permitido modificar el correo electrónico, puede eliminar o añadir un operador.</p>
                            <div className="col"></div>
                            <div className="col-md-4 col-sm-12">
                            <Form.SubmitButton text="Guardar" loading={isLoading}/>
                            </div>
                            <div className="col-md-4 col-sm-12">  
                            <button type="button" className="col-6 btn btn-danger" data-bs-toggle="modal" data-bs-target="#askAgainModal" style={{width:'65%', height:'3.5rem'}}>
                            Eliminar
                            </button>
                            </div>  
                            <div className="col"></div>
                        </div>
                            <div className="modal fade" id="askAgainModal" tabIndex={-1} aria-labelledby="askAgainModalLabel" >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="askAgainModalLabel">Eliminar operador</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                ¿Está seguro de que quiere eliminar el operador?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteOperator}>Eliminar</button>
                                </div>
                                </div>
                            </div>
                            </div>
                        <Form.Links href="/company-home/operators" text="" linkText='Volver'/>
                </div>    
                    </Form>
                </div>
    );
}