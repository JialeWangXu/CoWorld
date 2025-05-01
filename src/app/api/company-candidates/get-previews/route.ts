import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { connectMD } from "lib/mongodb";
import Job from "models/Job";
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { IUserSimpleWithSimpleUserProfile } from "types/Company";


export async function POST(request:NextRequest){

    try{
        await connectMD();
        const accessToken = request.cookies.get('accessTokenCookie').value;
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

            try{
                const body = await request.json();
                const {id, status, page} = body;

                const candidates = await Job.aggregate([
                    { $match: { _id: new ObjectId(id) } },
                    { $unwind: "$applicants" },
                    { $match: { "applicants.status": status } },
                    {$lookup:{
                        from:"candidateprofiles",
                        localField:"applicants.user",
                        foreignField:"user_id",
                        as:"userProfileInfo"
                    }},
                    {$unwind:{path:"$userProfileInfo", preserveNullAndEmptyArrays:true}},
                    {$lookup:{
                        from:"users",
                        localField:"applicants.user",
                        foreignField:"_id",
                        as:"userInfo"
                    }},
                    {$unwind:{path:"$userInfo", preserveNullAndEmptyArrays:true}},
                ]);
                if(!candidates){
                    return NextResponse.json(
                        {error:message.error.candiateLoadError},
                        {status:400}
                    )
                }

                const candidateParser =  candidates.map(elem =>({
                    user_id:{
                        _id:elem.userInfo._id,
                        firstname:elem.userInfo.firstname,
                        lastname:elem.userInfo.lastname,
                        email:elem.userInfo.email,
                    },
                    phone:elem.userProfileInfo.phone,
                    city:elem.userProfileInfo.city,
                    disabilities:elem.userProfileInfo.disabilities,
                    photo:elem.userProfileInfo.photo,
                    status:elem.applicants.status
                })) as IUserSimpleWithSimpleUserProfile[]

                const totalPage = Math.ceil(candidateParser.length/5);
                const start= (parseInt(page)-1)*5;
                const slicedJobList = candidateParser.slice(start,start+5);

                return NextResponse.json(
                    {candidates:slicedJobList,
                    totalPage:totalPage},
                    {status:200}
                )

            }catch(e){
                return NextResponse.json({
                    error:message.error.genericError,e
                },{status:400})
            }

        }catch(tokenError){
            return NextResponse.json({
                error:message.error.noToken,tokenError
            },{status:400})
        }

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}