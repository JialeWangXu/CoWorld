import mongoose, {Schema, ObjectId, Document } from 'mongoose';
import { CANDIDATE,COMPANY} from '../util/constants';

const companySchema:Schema = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },

    role:{
        type: Number,
        default: COMPANY
    },
    companyName:{
        type: String,
        required: true
    },
    cif:{
        type: String,
        required: true
    }
    },{timestamps: true});

export interface ICompany{
    _id?: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: number;
    companyName: string;
    cif: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICompanyDocument extends Document{
    _id: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: number;
    companyName: string;
    cif: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;