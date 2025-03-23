import {connectMD} from "../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import CompanyProfile from "models/CompanyProfile";
import jwt from 'jsonwebtoken';
import Company from "models/Company";
import mongoose from "mongoose";



export async function POST(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        console.log("He cogido access "+accessToken)
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")

            const body = await request.json();
            const {id} = body;
            console.log("El id es: "+id)
            console.log("Modelos:   "+mongoose.modelNames());
            const profile = await CompanyProfile.findOne({company_id:id}).populate('company_id').lean();
            console.log("A ver su perfil:         "+profile)

            if(!profile){
                return NextResponse.json({
                    error:message.error.profileLoadError
                }, {status:400})
            }
            return NextResponse.json({
                profile:profile
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:400})
    }
}