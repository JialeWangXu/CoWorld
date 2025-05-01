import { connectMD } from "lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import Job from "models/Job";
import { IJobAndCompany } from "types/JobFilter";

export async function POST(request:NextRequest) {
    
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            try{
                const body = await request.json();
                const {activePage,page} = body;
                var job:any;
                if(activePage==="solicitados"){
                    job= await Job.aggregate([
                    {$match:{currentStatus:"active"}},    
                    {$match: {
                        applicants: { $elemMatch: { user: new ObjectId(data._id), status:"solicitado"  } }
                    }},
                    {$lookup:{
                        from:"companyprofiles",
                        localField:"company_id",
                        foreignField:"company_id",
                        as:"companyProfile"
                    }},
                    {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}}
                    ])
                }else if(activePage ==="enCurso"){
                    job= await Job.aggregate([
                        {$match:{currentStatus:"active"}},    
                        {$match: {
                            applicants: { $elemMatch: { user: new ObjectId(data._id), $or:[{status:"a comunicar"},{status:"comunicado"}] } }
                        }},
                        {$lookup:{
                            from:"companyprofiles",
                            localField:"company_id",
                            foreignField:"company_id",
                            as:"companyProfile"
                        }},
                        {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}}
                        ])
                }else if(activePage==="cerrados"){
                    job= await Job.aggregate([
                        {$match:{currentStatus:"closed"}},    
                        {$match: {
                            applicants: { $elemMatch: { user: new ObjectId(data._id) } }
                        }},
                        {$lookup:{
                            from:"companyprofiles",
                            localField:"company_id",
                            foreignField:"company_id",
                            as:"companyProfile"
                        }},
                        {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}}
                    ])
                }else{
                    return NextResponse.json({
                        error:message.error.genericError
                    },{status:400})
                }

                const jobParser = job.map(job => ({
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