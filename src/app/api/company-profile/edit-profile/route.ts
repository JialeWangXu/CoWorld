import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import CompanyProfile from "models/CompanyProfile";
import jwt from 'jsonwebtoken';
import Company from "models/Company";

export async function POST(request:NextRequest) {
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
             //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const profile = await CompanyProfile.findOne({company_id: data._id}).populate('company_id').lean();
            if(!profile){
                return NextResponse.json({
                error:message.error.profileLoadError
                }, {status:400})
            }

            const body = await request.json();
            const {logo, companyName, city, industry, scale, url } = body
            if(companyName){
                const resul = await CompanyProfile.findOneAndUpdate(
                    { company_id: data._id },
                    {
                        logo: logo,
                        city: city,
                        industry: industry,
                        scale: scale,
                        url: url
                    },
                    {
                        new: true
                    }
                );
                const infoCompany = await Company.findOneAndUpdate({_id:data._id}, {companyName:companyName}, {new:true});
                if(!resul || !infoCompany){
                    return NextResponse.json({
                        error:message.error.companyProfileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            const {description} = body
            if(description){
                const resul = await CompanyProfile.findOneAndUpdate(
                    { company_id: data._id },
                    {
                        description: description
                    },
                    {
                        new: true
                    }
                );
                if(!resul){
                    return NextResponse.json({
                        error:message.error.companyProfileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
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