import { connectMD } from "lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import Job from "models/Job";
import { NextRequest, NextResponse } from "next/server";
import { IJobAndCompany} from "types/JobFilter";
import { message } from "util/message";

export  async function POST(request:NextRequest){

    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
             //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

            try{
                const body = await request.json();

                const {id} = body

                const job= await Job.aggregate([
                    {$match:{_id: new ObjectId(id)}},
                    {$lookup:{
                        from: "companies",
                        localField:"company_id",
                        foreignField:"_id",
                        as: "companyInfo"
                    }}, // para obtener companyName
                    {$unwind:{path:"$companyInfo",preserveNullAndEmptyArrays:true}},
                    {$lookup:{
                        from:"companyprofiles",
                        localField:"company_id",
                        foreignField:"company_id",
                        as:"companyProfile"
                    }},
                    {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}}
                ])

                const jobParser = job.map(job => ({
                    ...job,
                    company_id: {
                        company_id:job.companyInfo._id,
                        companyName: job.companyInfo.companyName,
                        logo:job.companyProfile?.logo,
                        scale:job.companyProfile?.scale,
                        industry:job.companyProfile?.industry
                    }
                })) as IJobAndCompany[];

                return NextResponse.json({
                    job:jobParser[0]
                },{status:200})

            }catch(e){
                return NextResponse.json({
                    error:message.error.jobLoadError,e
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