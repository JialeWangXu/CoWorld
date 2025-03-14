import {connectMD} from "../../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import CompanyProfile from "models/CompanyProfile";
import jwt from 'jsonwebtoken';



export async function GET(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        console.log("He cogido access en company "+accessToken)
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")
            console.log(data._id)
            const profile = await CompanyProfile.findOne({company_id: data._id}).populate('company_id').lean();

            if(!profile){
                return NextResponse.json({
                    error:message.error.profileLoadError
                }, {status:400})
            }
            console.log("He encontrado su perfil de EMPRESAAA")
            console.log(profile)
            return NextResponse.json({
                profile:profile
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:401})
    }
}