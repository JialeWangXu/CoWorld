import {connectMD} from "../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import CompanyProfile from "models/CompanyProfile";
import jwt from 'jsonwebtoken';



export async function POST(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const body = await request.json();
            const {id} = body;
            const profile = await CompanyProfile.findOne({company_id:id}).populate('company_id').lean();


            if(!profile){
                return NextResponse.json({
                    error:message.error.profileLoadError
                }, {status:400})
            }
            return NextResponse.json({
                profile:profile
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:400})
    }
}