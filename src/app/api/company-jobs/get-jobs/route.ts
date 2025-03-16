import {connectMD} from "../../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import Job from "models/Job";
import jwt from 'jsonwebtoken';



export async function GET(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        console.log("He cogido access"+accessToken)
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")
            console.log(data._id)
            const jobs = await Job.find({company_id: data._id}).populate('company_id').lean();

            if(!jobs){
                return NextResponse.json({
                    error:message.error.jobsLoadError
                }, {status:400})
            }
            console.log("He encontrado sus trabajos")
            console.log(jobs)
            return NextResponse.json({
                jobs:jobs
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:401})
    }
}