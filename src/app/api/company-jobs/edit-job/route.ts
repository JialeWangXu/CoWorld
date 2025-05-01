import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import Job from "models/Job";
import { message } from "util/message";
import { NextRequest,NextResponse } from "next/server";
import { AUDITIVA, FISICA, HABLAR, INTELECTUAL, MENTAL, PLURIDISCAPACIDAD, VISUAL } from "util/constants";


export async function POST(request:NextRequest){

    try{

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;

        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

            const body = await request.json();

            const{currentStatus,jobTitle,city,mode,workHours,experience,intership,workCategory,
                fisica,auditiva,visual,hablar,mental,intelectual,pluridiscapacidad,
                minumumEducation,languages,requiredKnowledge,companysRequirements,description, deleteJob,_id} =body;
            
                
            const job = await Job.findOne({_id: _id});
            if(!job){
                return NextResponse.json({
                    error:message.error.jobLoadError
                },{status:400})
            }

            if(deleteJob){
                const del = await Job.deleteOne({_id:_id});
                if(del){
                    return NextResponse.json(
                        {sucess:message.sucess.JobEdited},
                        {status:200}
                    )
                }else{
                    return NextResponse.json({
                        error:message.error.jobEditError
                    },{status:400})
                }
            }
            job.currentStatus=currentStatus
            job.jobTitle =jobTitle
            job.city=city
            job.mode=mode
            job.workHours=workHours
            job.experience=experience
            job.intership=intership
            job.workCategory=workCategory
            job.disabilities = [
                {type:FISICA, degree:fisica},
                {type: AUDITIVA, degree:auditiva},
                {type: VISUAL, degree:visual},
                {type: HABLAR, degree:hablar},
                {type: MENTAL, degree:mental},
                {type: INTELECTUAL, degree:intelectual},
                {type: PLURIDISCAPACIDAD, degree:pluridiscapacidad},
            ]
            job.minumumEducation=minumumEducation
            job.languages=languages
            job.requiredKnowledge=requiredKnowledge
            job.companysRequirements=companysRequirements
            job.description=description
            const resul = await job.save();
            if(resul){
                return NextResponse.json(
                    {sucess:message.sucess.JobEdited},
                    {status:200}
                )
            }else{
                return NextResponse.json({
                    error:message.error.jobEditError
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