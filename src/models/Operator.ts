import mongoose, {Schema, ObjectId, Document } from 'mongoose';
import { OPERATOR} from '../util/constants';

const operatorSchema:Schema = new Schema({
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
    changedPassword:{
        type: Boolean,
        default: false
    },
    role:{
        type: Number,
        default: OPERATOR
    },
    // relacion one to many con el company, 
    // el company puede tener varios operadores pero el operador solo 1 company
    company_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    }

    },{timestamps: true});

export interface IOperator{
    _id?: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    changedPassword: boolean;
    role: number;
    company_id: ObjectId
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOperatorDocument extends Document{
    _id: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    changedPassword: boolean;
    role: number;
    company_id: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const Operator = mongoose.models.Operator || mongoose.model('Operator', operatorSchema);
export default Operator;