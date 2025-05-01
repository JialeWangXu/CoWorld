import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import Job from "models/Job";
import { NextRequest, NextResponse } from "next/server";
import { IJobAndCompany, JobFilters } from "types/JobFilter";
import { message } from "util/message";
import CandidateProfile from "models/CandidateProfile";

export async function GET(request:NextRequest) {
    
    const filterParser= (params:any):JobFilters=>({
        city:params.city?.split(','),
        disabilities:JSON.parse(decodeURIComponent(params.disabilities as string)),
        mode:params.mode?.split(','),
        workHours:params.workHours?.split(','),
        workCategory:params.workCategory?.split(','),
        experience:params.experience,
        minumumEducation:params.minumumEducation?.split(','),
        intership:params.intership
    })

    const query=(filter:JobFilters)=>{
        var query:any={};
        // los trabajos que esten uno de estos ciudades
        if(!(filter.city?.length==1 && filter.city.at(0)==="")){
            query.city ={$in: filter.city}
        }
        if(filter?.disabilities.length>0){
            query.$and = filter.disabilities.map(({ type, degree }) => ({
            $or: [
                { disabilities: { $elemMatch: { type: type, degree: -1 } } }, // Si la empresa no impone restricciones
                { disabilities: { $elemMatch: { type: type, degree: { $gte: degree } } } } // Si el trabajo acepta el grado del candidato o uno mayor
            ]
        }));
        }
        if(!(filter.mode?.length==1 && filter.mode.at(0)==="")){
            query.mode={$in:filter.mode}
        }
        if(!(filter.workHours?.length==1 && filter.workHours.at(0)==="")){
            query.workHours={$in:filter.workHours}
        }
        if(!(filter.workCategory?.length==1 && filter.workCategory.at(0)==="")){
            query.workCategory={$in:filter.workCategory}
        }
        if(filter?.experience.length>0){
            query.experience={$eq:filter.experience}
        }
        if(!(filter.minumumEducation?.length==1 && filter.minumumEducation.at(0)==="")){
            query.minumumEducation={$in:filter.minumumEducation}
        }
        if(filter?.intership){
            query.intership=(String(filter.intership)==="true")
        }else{
            query.intership=(String(filter.intership)==="false")
        }
        
        return query;
    }

    try{
        await connectMD();
    
            try{
                const accessToken = request.cookies.get('accessTokenCookie').value;
                 //@ts-ignore
                const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

                const profile = await CandidateProfile.findOne({user_id: data._id});

                // obtener los filtros en forma de lista de key value
                try{
                    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
                    const filters = filterParser(params);
                    const jobQuery =query(filters);

                    const job = await Job.aggregate([
                        {$match:{currentStatus:"active"}},
                        {$match:jobQuery},
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
                            finalScore:-1}}
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

                    const totalPage = Math.ceil(jobParser.length/5);
                    const start= (parseInt(params.page)-1)*5;
                    const slicedJobList = jobParser.slice(start,start+5);
                
                    return NextResponse.json({
                        jobList:slicedJobList,
                        totalPage:totalPage
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