import { connectMD } from "lib/mongodb";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import User from "models/User";

export async function POST(request:NextRequest){

    try{
        await connectMD();
            try{
                const accessToken = request.cookies.get('accessTokenCookie').value;
                //@ts-ignore
                const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

                try{
                    
                    const user = await User.findOne({_id:data._id});
                    if(!user){
                        return NextResponse.json(
                            {error:message.error.notFoundUser},{status:400}
                        )
                    }
                    const body = await request.json();
                    const {job} = body

                    if (user.savedJob.includes(job)) {
                        let index = user.savedJob.indexOf(job);
                        user.savedJob.splice(index,1);
                    } else {
                        user.savedJob.push(job);
                    }
                    
                    const resul = await user.save();

                    if(!resul){
                        return NextResponse.json(
                            {error:message.error.saveJobError},
                            {status: 400}
                        )
                    }

                    return NextResponse.json({
                        sucess:message.sucess.GenericSuccess
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