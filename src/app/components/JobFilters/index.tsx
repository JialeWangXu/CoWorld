import { useEffect,useState } from "react";
import { JobFilters } from "types/JobFilter";
import { MultiSelectModal } from "./MultiSelection";
import { DisabilitiestSelectionModal } from "./DisabilitiesSelection";
import { Checkbox } from "./Checkbox/Checkbox";
import { DropDown } from "./DropDown";
import { JobFiltersOPTIONS,DISABILITIES_INITIAL_VALUE } from "util/constants";


interface Props {
    filters: JobFilters
    setFilters: (filters: JobFilters) => void
  }
  
export default function JobFilter ({filters,setFilters}:Props){

    useEffect(()=>{
        const debounce = setTimeout(()=>{
            setFilters(filters);
        },500)
        return ()=>clearTimeout(debounce);
    },[filters])

    const handleFilters=(id:keyof JobFilters, value:string[]|{type:string, degree:number}[]|string|boolean)=>{
        setFilters({ ...filters, [id]: value })
    }

    const handleReset=()=>{
        setFilters({
            city:[],
            disabilities:DISABILITIES_INITIAL_VALUE,
            mode:[],
            workHours:[],
            workCategory:[],
            experience:"",
            minumumEducation:[],
            intership:false
        });
    }

    return(
        <div className="bg-white p-4 shadow-sm rounded-lg">
            <div className="row">
                <div className="col-md-3 col-sm-12">
                    <MultiSelectModal
                        buttonName="Ubicación"
                        options={JobFiltersOPTIONS.city}
                        title="Provincias"
                        selected={filters.city || []}
                        onChange={(v)=>handleFilters("city",v)}
                        modalId="UbicationModal"
                        modalLableId="UbicationModalLabel"
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <DisabilitiestSelectionModal
                        buttonName="Discapacidad"
                        options={JobFiltersOPTIONS.disabilities}
                        title="Elegir sus propias condiciones"
                        selected={filters.disabilities || DISABILITIES_INITIAL_VALUE}
                        onChange={(v)=>handleFilters("disabilities",v)}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <MultiSelectModal
                        buttonName="Presencial/Remoto"
                        options={JobFiltersOPTIONS.mode}
                        title="Presencial/Remoto"
                        selected={filters.mode || []}
                        onChange={(v)=>handleFilters("mode",v)}
                        modalId="ModeModal"
                        modalLableId="ModeModalLabel"
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <MultiSelectModal
                        buttonName="Jornada Laboral"
                        options={JobFiltersOPTIONS.workHours}
                        title="Jornada Laboral"
                        selected={filters.workHours || []}
                        onChange={(v)=>handleFilters("workHours",v)}
                        modalId="WorkHoursModal"
                        modalLableId="WorkHoursModalLabel"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 col-sm-12">
                    <MultiSelectModal
                        buttonName="Categoría"
                        options={JobFiltersOPTIONS.workCategory}
                        title="Categoría de trabajo"
                        selected={filters.workCategory || []}
                        onChange={(v)=>handleFilters("workCategory",v)}
                        modalId="WorkCategoryModal"
                        modalLableId="WorkCategoryModalLabel"
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <DropDown
                        DefaultName="Experiencia"
                        options={JobFiltersOPTIONS.experience}
                        selected={filters.experience || ""}
                        onChange={(v)=>(handleFilters("experience",v))}
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <MultiSelectModal
                        buttonName="Estudios mínimos"
                        options={JobFiltersOPTIONS.minumumEducation}
                        title="Estudios mínimos"
                        selected={filters.minumumEducation || []}
                        onChange={(v)=>handleFilters("minumumEducation",v)}
                        modalId="MinimumEducationModal"
                        modalLableId="MinimumEducationModalLabel"
                    />
                </div>
                <div className="col-md-3 col-sm-12">
                    <Checkbox
                        label="Busco Práctica "
                        selected={filters.intership || false}
                        onChange={(v)=>(handleFilters("intership",v))}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12" style={{display:"flex", flexDirection:"row-reverse"}}>
                    <a href="#" className="link-secondary" onClick={handleReset} style={{paddingRight:"10px"}}>Limpiar filtros</a>
                </div>
            </div>
        </div>
    )
}