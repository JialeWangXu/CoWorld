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

const User = mongoose.model('User', userSchema) || mongoose.models.User;
export default User;