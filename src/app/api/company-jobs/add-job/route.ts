import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import jwt from 'jsonwebtoken';
import Job, { IJobDocument } from "models/Job";
import { AUDITIVA, FISICA, HABLAR, INTELECTUAL, MENTAL, PLURIDISCAPACIDAD, VISUAL } from "util/constants";

export async function POST(request:NextRequest){

    try{

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        console.log("He cogido access"+accessToken)

        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")
            console.log(data._id)

            const body = await request.json();

            const{currentStatus,jobTitle,city,mode,workHours,experience,intership,workCategory,
                fisica,auditiva,visual,hablar,mental,intelectual,pluridiscapacidad,
                minumumEducation,languages,requiredKnowledge,companysRequirements,description} =body;

            const newJob:IJobDocument = new Job({
                    company_id: data._id,
                    applicants:[],
                    currentStatus:currentStatus,
                    jobTitle: jobTitle,
                    city: city,
                    mode: mode,
                    workHours:workHours,
                    experience:experience,
                    intership:intership,
                    workCategory: workCategory,
                    disabilities: [
                        {type:FISICA, degree:fisica},
                        {type: AUDITIVA, degree:auditiva},
                        {type: VISUAL, degree:visual},
                        {type: HABLAR, degree:hablar},
                        {type: MENTAL, degree:mental},
                        {type: INTELECTUAL, degree:intelectual},
                        {type: PLURIDISCAPACIDAD, degree:pluridiscapacidad},
                    ],
                    minumumEducation: minumumEducation,
                    languages:languages,
                    requiredKnowledge:requiredKnowledge,
                    companysRequirements:companysRequirements,
                    description:description
            });

            await newJob.save();

            if(newJob._id){
                return NextResponse.json({
                    newJob: newJob,
                    sucess:message.sucess.JobPublicated
                },{status:200})
            }else{
                return NextResponse.json({
                    error:message.error.jobPublicateError
                },{status:400}) 
            }

        }catch(tokenError){
            return NextResponse.json({
                error:message.error.noToken,tokenError
            },{status:400})            
        }

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}