import mongoose, {Schema, ObjectId, Document } from 'mongoose';

const jobSchema:Schema = new Schema({
    // Informaciones de 1 trabajo
    // relacion one to one con la empresa
    company_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company',
            required:true
    },
    // applicants of this offer
    applicants:{
        type:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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


export interface IJob{
    _id?: ObjectId;
    company_id: ObjectId;
    applicants:[ObjectId];
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities: [{type:string; degree:number;}];
    minumumEducation: string;
    languages:[{language:string, level:string}];
    requiredKnowledge:[string];
    companysRequirements:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IJobDocument extends Document{
    _id: ObjectId;
    company_id: ObjectId;
    applicants:[ObjectId];
    currentStatus:string;
    jobTitle: string;
    city: string;
    mode: string;
    workHours:string;
    experience:string;
    intership:boolean;
    workCategory: string;
    disabilities: [{type:string; degree:number;}];
    minumumEducation: string;
    languages:[{language:string, level:string}];
    requiredKnowledge:[string];
    companysRequirements:string;
    description:string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;