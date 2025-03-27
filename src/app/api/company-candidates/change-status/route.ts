import { NextRequest, NextResponse } from "next/server";
import { connectMD } from "lib/mongodb";
import { ObjectId } from "mongodb";
import Job from "models/Job";
import jwt from 'jsonwebtoken';
import { message } from "util/message";

export async function POST(request:NextRequest) {
    
    try{
        await connectMD();
        const accessToken = request.cookies.get('accessTokenCookie').value;
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")
            const body = await request.json();
            const{id, candidate,status} = body;
            
            const job = await Job.findOne({_id:id});
            console.log("El candidate es    "+candidate)

            const index = job.applicants.findIndex(elem=> elem.user.toString() === candidate);
            console.log("El index es: "+index)

            job.applicants.set(index, {user: new ObjectId(candidate), status:status});
            const resul = await job.save();
            if(!resul){
                return NextResponse.json({
                    error:message.error.statusUpdateError
                },{status:400})
            }
            return NextResponse.json({
                sucess:message.sucess.StatusUpdated
            },{status:200})

        }catch(e){
            return NextResponse.json({
                error:message.error.noToken,e
            },{status:400})
        }        

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}