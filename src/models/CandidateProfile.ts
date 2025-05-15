import mongoose, {Schema, ObjectId, Document } from 'mongoose';

const candidateProfileSchema:Schema = new Schema({
    // Informaciones personal
    // relacion one to one con el candidato
    user_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
    },
    phone:{
        type: String,
        default:""
    },
    city:{
        type: String,
        default:""
    },
    photo:{
        type: String,
        default:""
    },
    disabilities: [
        {
            type:{type: String, required: true},
            degree: {type: Number, min:-1, max:4, required: true},
        }
    ],
    // Situacion laboral 
    state:{
        type: String,
        default:""
    },
    huntingJob:{
        type: Boolean,
        default: false
    },
    desiredJob:{
        type:[String],
        default:[]
    },
    // Descripcion personal 
    description:{
        type: String,
        default:""
    },
    // Estudios
    studies:[
        {
            institution:{type:String, required: true},
            title:{type:String, default:""},
            specialty:{type:String, default:""},
            iniDate:{
                month:{type: Number, min:1 , max: 12},
                year:{type: Number, min: 1925} // maximo restringimos desde front}
            },
            finDate:{
                month:{type: Number, min:1 , max: 12},
                year:{type: Number, min: 1925} // maximo restringimos desde front
            }
        }
    ],
    // experiencia laboral
    workExperience:[
        {
            responsability:{type:String, required: true},
            companyName:{type:String, required: true}, 
            contractType:{type:String, default:""},
            iniDate:{
                month:{type: Number, min:1 , max: 12},
                year:{type: Number, min: 1925},// maximo restringimos desde front
            },
            finDate:{
                month:{type: Number, min:1 , max: 12},
                year:{type: Number, min: 1925} // maximo restringimos desde front
            }
        }
    ],
    //Habilidades
    skills:{
        type:[String],
        default:[]
    },
    //Languages
    languages:[{
        language:{type:String, required: true},
        level:{type:String, required: true}
    }],
    // certifications
    certifications:[{
        title:{type:String, required: true},
        emitter:{type:String, required: true}
    }]
    },{timestamps: true});


export interface ICandidateProfile{
    _id?: ObjectId;
    user_id: ObjectId;
    // Informaciones personal
    phone: string;
    city: string;
    photo: string;
    disabilities: Array<{type:string; degree:number;}>;
    // Situacion laboral 
    state: string;
    huntingJob: boolean;
    desiredJob:string[];
    // Descripcion personal 
    description: string;
    // Estudios
    studies:Array<
        {
            institution: string;
            title: string;
            specialty: string;
            iniDate:{
                month:number;
                year:number; // maximo restringimos desde front}
            },
            finDate?:{
                month:number;
                year:number; // maximo restringimos desde front
            };
        }
    >;
    // experiencia laboral
    workExperience:Array<
        {
            responsability: string;
            companyName: string;
            contractType: string;
            iniDate:{
                month: number;
                year: number; // maximo restringimos desde front}
            };
            finDate:{
                month: number;
                year: number;// maximo restringimos desde front
            };
        }
    >;
    //Habilidades
    skills:string[];
    //Languages
    languages:Array<{
        language: string;
        level: string;
    }>;
    // certifications
    certifications:Array<{
        title: string;
        emitter: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICandidateProfileDocument extends Document{
    _id: ObjectId;
    user_id: ObjectId;
    // Informaciones personal
    phone: string;
    city: string;
    photo: string;
    disabilities: Array<
        {
            type: string;
            degree:number;
        }
    >;
    // Situacion laboral 
    state: string;
    huntingJob: boolean;
    desiredJob:string[];
    // Descripcion personal 
    description: string;
    // Estudios
    studies:Array<
        {
            institution: string;
            title: string;
            specialty: string;
            iniDate:{
                month:number;
                year:number; // maximo restringimos desde front}
            };
            finDate:{
                month:number;
                year:number; // maximo restringimos desde front
            };
        }
    >;
    // experiencia laboral
    workExperience:Array<
        {
            responsability: string;
            companyName: string;
            contractType: string;
            iniDate:{
                month: number;
                year: number; // maximo restringimos desde front}
            };
            finDate:{
                month: number;
                year: number; // maximo restringimos desde front
            };
        }
    >;
    //Habilidades
    skills:string[];
    //Languages
    languages:Array<{
        language: string;
        level: string;
    }>;
    // certifications
    certifications:Array<{
        title: string;
        emitter: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const CandidateProfile = mongoose.models.CandidateProfile as mongoose.Model<ICandidateProfileDocument> || mongoose.model<ICandidateProfileDocument>('CandidateProfile', candidateProfileSchema);
export default CandidateProfile;