import { ICandidateProfile } from 'models/CandidateProfile';
import { ObjectId } from 'mongodb';

export interface IUserSimple{
    _id?: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
}

export interface IUserSimpleWithUserProfile extends Omit<ICandidateProfile,"user_id" >{
    user_id:IUserSimple;
    status:string;
}

export interface IUserSimpleWithSimpleUserProfile {
    user_id:IUserSimple;
    phone?:string;
    city?: string;
    disabilities?: Array<{type:string; degree:number;}>;
    status:string;
    photo:string;
}