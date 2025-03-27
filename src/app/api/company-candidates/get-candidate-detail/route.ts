import {connectMD} from "../../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import CandidateProfile from "models/CandidateProfile";
import jwt from 'jsonwebtoken';



export async function POST(request:NextRequest) {

    try{
            await connectMD();

            const accessToken = request.cookies.get('accessTokenCookie').value;
            console.log("He cogido access"+accessToken)
            try{
                //@ts-ignore
                const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
                console.log("Access aprobado")
                const body = await request.json();
                const {candidate} = body

                const profile = await CandidateProfile.findOne({user_id: candidate}).populate('user_id','-password').lean();

                if(!profile){
                    return NextResponse.json({
                        error:message.error.profileLoadError
                    }, {status:400})
                }

                return NextResponse.json({
                    profile:profile
                },{status:200})
            
        } catch (e) {
            return NextResponse.json({
                error:message.error.genericError,e
            },{status:401})
        }
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}