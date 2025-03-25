import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import Job from "models/Job";

export async function POST(request:NextRequest) {
    
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado para editar")
            try{
                const body = await request.json();
                const {job} = body;

                const resul = await Job.findOneAndUpdate(
                    {_id:job},
                    {
                    $push: {applicants: {
                        user:data._id,
                        status:"solicitado"
                    }}
                    },
                    {new:true})
                
                if(!resul){
                    return NextResponse.json({
                        error:message.error.JobApplyError
                    },{status:400})
                }
                return NextResponse.json({
                        sucess:message.sucess.JobSaved
                },{status:200})

            }catch(e){
                return NextResponse.json({
                    error:message.error.genericError,e
                },{status:400})
            }
        }catch(tokenError){
            return NextResponse.json({
                error:message.error.noToken,tokenError
            },{status:401})
        }

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}