import {connectMD} from "../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import Job from "models/Job";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { IJobAndCompany } from "types/JobFilter";



export async function POST(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const body = await request.json();
            const {id} = body;

            const job = await Job.aggregate([
                {$match:{company_id: new ObjectId(id)}},
                {$match:{currentStatus:"active"}},
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
                jobList:jobParser
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:400})
    }
}