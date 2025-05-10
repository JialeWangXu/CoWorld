import jwt from 'jsonwebtoken';
import { message } from 'util/message';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request:NextRequest){
    try{
        const accessToken = request.cookies.get('accessTokenCookie').value;

        if(!accessToken){
            return NextResponse.json({
                error:message.error.noToken
            },{status:400})
        }

        try{
            const data = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            return NextResponse.json({
                authorized:true, sucess:message.sucess.UserAuthorized
            },{status:200})

        }catch(e){
            return NextResponse.json({
                error:message.error.invalidToken, e
            },{status:401})

        }
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}