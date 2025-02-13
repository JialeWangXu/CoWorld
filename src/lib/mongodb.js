import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

export const connectMD = async () => {
    try{
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB");
    }catch(e){
        console.log("Error connecting to MongoDB", e);
    }
}