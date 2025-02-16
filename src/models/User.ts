import mongoose, {Schema, ObjectId, Document } from 'mongoose';
import { CANDIDATE} from '../util/constants';

const userSchema:Schema = new Schema({
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
        default: CANDIDATE
    }
    },{timestamps: true});

export interface IUser{
    _id?: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends Document{
    _id: ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Para evitar el error de cuando el model ya esta creada.
const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
export default User;