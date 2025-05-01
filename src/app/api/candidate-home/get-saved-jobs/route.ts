import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import {ObjectId} from "mongodb"
import { IJobAndCompany } from "types/JobFilter";
import User from "models/User";

export async function POST(request:NextRequest) {
    
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

            try{
                const body = await request.json();
                const{page}=body;
                const user = await User.aggregate([
                    {$match:{_id: new ObjectId(data._id)}},
                    {$lookup:{
                        from:"jobs",
                        let: {savedJobs:"$savedJob"}, // para luego el pipline puede usar ese dato
                        pipeline:[
                            {$match:{
                                $expr:{ $in:["$_id","$$savedJobs"] } // para poder usar la varianle local, con expr
                            }},
                            {$lookup:{
                                from:"companyprofiles",
                                localField:"company_id",
                                foreignField:"company_id",
                                as:"companyProfile"
                            }},
                            {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}}
                        ],
                        as: "savedJobPopulated"
                    }},
                    {
                        $project: {
                            savedJobPopulated:1,
                            firstname:1,
                            lastname:1,
                            email:1,
                            _id:1
                        }
                    }
                ])

                const jobParser = user[0].savedJobPopulated.map(job => ({
                    ...job,
                    company_id: {
                        company_id:job.companyProfile.company_id,
                        companyName: job.companyProfile.companyName,
                        logo:job.companyProfile?.logo,
                        scale:job.companyProfile?.scale,
                        industry:job.companyProfile?.industry
                    }
                })) as IJobAndCompany[];

                const totalPage = Math.ceil(jobParser.length/5);
                const start= (parseInt(page)-1)*5;
                const slciedJobList = jobParser.slice(start,start+5);

                return NextResponse.json({
                    job:slciedJobList,
                    totalPage:totalPage
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