import { IJob } from "models/Job";
import { ObjectId } from "mongoose";

export interface JobFilters{
    city?:string[],
    disabilities?:{type:string, degree:number}[],
    mode?:string[],
    workHours?:string[],
    workCategory?:string[],
    experience?:string,
    minumumEducation?:string[],
    intership?:boolean
}

export interface ICompanyWithProfileSimple {
    company_id: ObjectId;
    companyName: string;
    logo:string;
    scale: string;
    industry: string;
  }

export interface IJobAndCompany extends Omit<IJob,'company_id'>{
    company_id:ICompanyWithProfileSimple;
    _id:ObjectId;
}

