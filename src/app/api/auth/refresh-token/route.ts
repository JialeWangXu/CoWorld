import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { message } from 'util/message';

export async function POST() {
    try{
        const cookieStore = await cookies(); 
        const refreshToken =  cookieStore.get("refreshTokenCookie")?.value;
        if(!refreshToken){
            return NextResponse.json({
                error: message.error.noToken
            },{status:401})
        }

        const isVliadToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        if(!isVliadToken){
            return NextResponse.json({
                error: message.error.invalidToken
            },{status:401})
        }
        // @ts-ignore
        const {data} = isVliadToken;
        // Si el refreshToken es valido, generamos un nuevo accessToken con la data del refreshToken
        const newAccsessToken = jwt.sign({data},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})

        const response = NextResponse.json({
            newAccsessToken: newAccsessToken
        },{status:200})

        return response;

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError
        },{status:500})
    }

}