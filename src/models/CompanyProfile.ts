import mongoose, {Schema, ObjectId, Document } from 'mongoose';

const companyProfileSchema:Schema = new Schema({
    // Informaciones empresa
    // relacion one to one con la empresa
    company_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company'
    },
    industry:{
        type: String,
        default:""
    },
    city:{
        type: String,
        default:""
    },
    scale:{
        type: String,
        default:""
    },
    url: {
        type:String,
        default: ""
    },
    logo:{
        type: String,
        default:""
    },
    description:{
        type: String,
        default:""
    }
    },{timestamps: true});


export interface ICompanyProfile{
    _id?: ObjectId;
    company_id: ObjectId;
    industry: string;
    city: string;
    scale: string;
    url:string;
    logo:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICompanyProfileDocument extends Document{
    _id: ObjectId;
    company_id: ObjectId;
    industry: string;
    city: string;
    scale: string;
    url:string;
    logo:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const CompanyProfile = mongoose.models.CompanyProfile || mongoose.model('CompanyProfile', companyProfileSchema);
export default CompanyProfile;