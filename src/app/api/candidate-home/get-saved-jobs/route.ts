import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import Job from "models/Job";
import {ObjectId} from "mongodb"
import { IJobAndCompany } from "types/JobFilter";
import User from "models/User";

export async function GET(request:NextRequest) {
    
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado para editar")
            try{
                const user = await User.aggregate([
                    {$match:{_id: new ObjectId(data._id)}},
                    {$lookup:{
                        from:"jobs",
                        let: {savedJobs:"$savedJob"}, // para luego el pipline puede usar ese dato
                        pipeline:[
                            {$match:{
                                $expr:{ $in:["$_id","$$savedJobs"] } // para poder usar la varianle local, con expr
                            }},
                            // empieza popular con datos de company como otras veces
                            {
                                $lookup:{
                                    from: "companies",
                                    localField:"company_id",
                                    foreignField:"_id",
                                    as: "companyInfo"
                                }
                            },
                            {$unwind:{path:"$companyInfo",preserveNullAndEmptyArrays:true}},
                            {$lookup:{
                                from:"companyprofiles",
                                localField:"company_id",
                                foreignField:"company_id",
                                as:"companyProfile"
                            }},
                            {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}},
                            {$addFields:{
                                companyInfo:{
                                    $mergeObjects: ["$companyInfo", "$companyProfile"]
                                },
                                __debug: "=== AFTER MERGE ==="
                            }},
                            {$project:{companyProfile:0}}
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


                console.log("Encontrado el trabajo "+JSON.stringify(user[0].savedJobPopulated))

                const jobParser = user[0].savedJobPopulated.map(job => ({
                    ...job,
                    company_id: {
                        company_id:job.companyInfo._id,
                        companyName: job.companyInfo.companyName,
                        logo:job.companyInfo?.logo,
                        scale:job.companyInfo?.scale,
                        industry:job.companyInfo?.industry
                    }
                })) as IJobAndCompany[];

                return NextResponse.json({
                    job:jobParser
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