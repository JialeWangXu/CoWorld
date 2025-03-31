import mongoose, {Schema, ObjectId, Document } from 'mongoose';
import Company from './Company';

const jobSchema:Schema = new Schema({
    // Informaciones de 1 trabajo
    // relacion one to one con la empresa
    company_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company',
            required:true
    },
    companyName:{
        type:String,
        required:true,
        index:true
    },
    // applicants of this offer
    applicants:{
        type:[
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
                status:{
                    type:String, default:"solicitado"
                }
            }
        ],
        default:[]
    },
    // current status of job
    currentStatus:{
        type:String,
        required:true,
        default:"active"
    },
    // Basic informations
    jobTitle:{
        type: String,
        required:true,
        default:""
    },
    city:{
        type: String,
        required:true,
        default:""
    },
    mode:{
        type: String,
        required:true,
        default:""
    },
    workHours: {
        type:String,
        required:true,
        default: ""
    },
    experience:{
        type: String,
        required:true,
        default:""
    },
    intership:{
        type: Boolean,
        default:false
    },
    workCategory:{ //creo que voy a usar para filtros
        type: String,
        required:true,
        default:""
    },
    // Limitations about disabilities
    disabilities: [
        {
            type:{type: String, required: true},
            degree: {type: Number, min:-1, max:4, required: true},
        }
    ],
    // Details about the work
    minumumEducation:{
        type:String,
        default:""
    },
    languages:[{
        language:{type:String, required: true},
        level:{type:String, required: true}
    }],
    requiredKnowledge:{
        type:[String],
        default:[]    
    },
    companysRequirements:{
        type:String,
        default:""
    },
    // descripcion de la oferta
    description:{
        type: String,
        default:""
    }
    },{timestamps: true});

    // este middleware lo definimos para despues del save el documento nuevo de Job, popula automaticamente el 
    // nombre de empresa.
    jobSchema.pre('save', async function (next) {
        try{
            const company = await Company.findOne({_id:this.company_id});
            if(!company){
                throw new Error("No existe la compania ERROR!");
            }
            this.companyName = company.companyName;
            next();
        }catch(e){
            next(e as Error);
        }
    });

export interface IJob{
    _id?: ObjectId;
    company_id: ObjectId;
    companyName: string;
    applicants:{user:ObjectId, status:string}[];
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities: {type:string; degree:number;}[];
    minumumEducation: string;
    languages:{language:string, level:string}[];
    requiredKnowledge:string[];
    companysRequirements:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IJobDocument extends Document{
    _id: ObjectId;
    company_id: ObjectId;
    companyName:string;
    applicants:{user:ObjectId, status:string}[];
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities:{type:string; degree:number;}[];
    minumumEducation: string;
    languages:{language:string, level:string}[];
    requiredKnowledge:string[];
    companysRequirements:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;