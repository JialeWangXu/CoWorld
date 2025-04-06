import {connectMD} from "../../../../lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import jwt from 'jsonwebtoken';

export async function GET(request:NextRequest) {

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        console.log("He cogido access"+accessToken)
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado")
            console.log(data.isOperator)
            const isOperator = data.isOperator
            return NextResponse.json({
                isOperator:isOperator
            },{status:200})
        
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:401})
    }
}