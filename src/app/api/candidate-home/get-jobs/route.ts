import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import Job from "models/Job";
import { NextRequest, NextResponse } from "next/server";
import { IJobAndCompany, JobFilters } from "types/JobFilter";
import { message } from "util/message";

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
            console.log("Ciudad:"+filter.city)
            query.city ={$in: filter.city}
        }
        if(filter?.disabilities.length>0){
            console.log("Disabilidad"+filter.disabilities)
            query.$and = filter.disabilities.map(({ type, degree }) => ({
              $or: [
                { disabilities: { $elemMatch: { type: type, degree: -1 } } }, // Si la empresa no impone restricciones
                { disabilities: { $elemMatch: { type: type, degree: { $gte: degree } } } } // Si el trabajo acepta el grado del candidato o uno mayor
            ]
        }));
        }
        if(!(filter.mode?.length==1 && filter.mode.at(0)==="")){
            query.mode={$in:filter.mode}
            console.log("mode:"+filter.mode)
        }
        if(!(filter.workHours?.length==1 && filter.workHours.at(0)==="")){
            query.workHours={$in:filter.workHours}
            console.log("workH:"+filter.workHours)
        }
        if(!(filter.workCategory?.length==1 && filter.workCategory.at(0)==="")){
            query.workCategory={$in:filter.workCategory}
            console.log("workC:"+filter.workCategory)
        }
        if(filter?.experience.length>0){
            query.experience={$eq:filter.experience}
            console.log("exp:"+filter.experience)
        }
        if(!(filter.minumumEducation?.length==1 && filter.minumumEducation.at(0)==="")){
            query.minumumEducation={$in:filter.minumumEducation}
            console.log("edu:"+filter.minumumEducation)
        }
        if(filter?.intership){
            console.log("inter:"+filter.intership)
            query.intership=(String(filter.intership)==="true")
        }
        
        return query;
    }

    try{
        await connectMD();
    
            try{
                const accessToken = request.cookies.get('accessTokenCookie').value;
                 //@ts-ignore
                const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
                console.log("Access aprobado para editar")
                // obtener los filtros en forma de lista de key value
                try{
                    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
                    console.log("Params:"+JSON.stringify(params))
                    const filters = filterParser(params);
                    
                    console.log("Filtero: "+JSON.stringify(filters))
                    const jobQuery =query(filters);
                    console.log("QUERY: "+JSON.stringify(jobQuery));

                    //const jobPrueba = await Job.find({intership:false});
                    const job = await Job.aggregate([
                        {$match:{currentStatus:"active"}},
                        {$match:jobQuery},
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

                    
                    console.log("Hay trabajos? "+job.length)
                    const jobParser = job.map(job => ({
                        ...job,
                        company_id: {
                        ...job.companyInfo,
                        profile: job.companyProfile 
                        }
                    })) as IJobAndCompany[];
                    console.log("DESPUES DE CONVERTIR "+jobParser)
                
                    return NextResponse.json({
                        jobList:jobParser
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