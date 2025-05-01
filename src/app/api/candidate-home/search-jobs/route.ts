import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import Job from "models/Job";
import { NextRequest, NextResponse } from "next/server";
import { IJobAndCompany} from "types/JobFilter";
import { message } from "util/message";
import CandidateProfile from "models/CandidateProfile";

export  async function POST(request:NextRequest){

    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
             //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

            try{
                const body = await request.json();

                const {search} = body
                const profile = await CandidateProfile.findOne({user_id: data._id});
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
                    {
                        $addFields:{
                            cityMatch:{
                                $cond:[{$eq:["$city",profile.city]},1,0]
                            },
                            disabilitiesMatch:{
                                $reduce:{
                                    input:"$disabilities",
                                    initialValue:0,
                                    in:{
                                        $let:{
                                            vars:{
                                                userDisability:{
                                                    $arrayElemAt:[ // necesitamos esto, porque filter nos devuelve simrpe un array 
                                                    {
                                                        $filter:{
                                                            input:profile.disabilities,
                                                            as:"userDis",
                                                            cond:{
                                                                $eq:["$$userDis.type","$$this.type"]
                                                            }
                                                        }
                                                    },0]
                                                },
                                            },
                                        in:{
                                            $add:["$$value",{                                                
                                                $cond:[ {$or: [
                                                { $eq: ["$$this.degree",-1] }, // Si la empresa no impone restricciones
                                                { $gte: ["$$this.degree","$$userDisability.degree"] } // Si el trabajo acepta el grado del candidato o uno mayor
                                            ]},1,0]}] // solo add point si en etos casos
                                            }
                                        }
                                    }
                                }
                            },
                            desireJobMatch:{
                                $size:{
                                    $filter:{
                                        input:profile.desiredJob,
                                        as:"desiredJob",
                                        cond:{
                                            $or:[ { 
                                                $regexMatch: {
                                                input: "$jobTitle",
                                                regex: "$$desiredJob",
                                                options: "i"
                                                }
                                            },              
                                            { 
                                                $regexMatch: { 
                                                input: "$description",
                                                regex: "$$desiredJob",
                                                options: "i"
                                                }
                                            },
                                            { 
                                                $regexMatch: { 
                                                input: "$companysRequirements",
                                                regex: "$$desiredJob",
                                                options: "i"
                                                }
                                            },{
                                                $in:[
                                                    "$$desiredJob",
                                                    "$requiredKnowledge"
                                                ]
                                            }]
                                        }
                                    }

                                }
                            },
                            skillsMatch:{
                                $size:{
                                    $filter:{
                                        input:profile.skills,
                                        as:"skill",
                                        cond:{
                                            $or:[ { 
                                                $regexMatch: {
                                                input: "$jobTitle",
                                                regex: "$$skill",
                                                options: "i"
                                                }
                                            },              
                                            { 
                                                $regexMatch: { 
                                                input: "$description",
                                                regex: "$$skill",
                                                options: "i"
                                                }
                                            },
                                            { 
                                                $regexMatch: { 
                                                input: "$companysRequirements",
                                                regex: "$$skill",
                                                options: "i"
                                                }
                                            },{
                                                $in:[
                                                    "$$skill",
                                                    "$requiredKnowledge"
                                                ]
                                            }]
                                        }
                                    }

                                }
                            },
                        } 
                    },
                    {$addFields:{
                        finalScore:{
                            $add:[
                                {$multiply:["$cityMatch",0.1]},
                                {$multiply:["$disabilitiesMatch",0.4]},
                                {$multiply:["$desireJobMatch",0.3]},
                                {$multiply:["$skillsMatch",0.2]}
                            ]
                        }
                    }},
                    {$lookup:{
                        from:"companyprofiles",
                        localField:"company_id",
                        foreignField:"company_id",
                        as:"companyProfile"
                    }},
                    {$unwind:{path:"$companyProfile",preserveNullAndEmptyArrays: true}},
                    {$sort:{
                        finalScore:-1,
                        score:-1,
                        createdAt: -1
                    }}
                ])

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