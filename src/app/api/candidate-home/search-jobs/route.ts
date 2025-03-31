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
            console.log("Access aprobado para editar")

            try{
                const body = await request.json();

                const {search} = body

                const job= await Job.aggregate([
                    {$match:{
                        $text:{
                            $search: search as string
                        }
                    }},
                    {$match:{currentStatus:"active"}},
                    {$addFields:{
                        score:{$meta:'searchScore'}
                    }},
                    {$lookup:{
                        from:"companyprofiles",
                        localField:"company_id",
                        foreignField:"company_id",
                        as:"companyProfile"
                    }},
                    {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}},
                    {$sort:{
                        createdAt: -1,
                        score:-1
                    }}
                ])

                console.log("Encontrado el trabajo"+job.length)

                const jobParser = job.map(job => ({
                    ...job,
                    company_id: {
                        company_id:job.companyProfile.company_id,
                        companyName: job.companyName,
                        logo:job.companyProfile?.logo,
                        scale:job.companyProfile?.scale,
                        industry:job.companyProfile?.industry
                    }
                })) as IJobAndCompany[];

                return NextResponse.json({
                    job:jobParser
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