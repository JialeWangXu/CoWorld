import jwt from 'jsonwebtoken';
import {  NextRequest, NextResponse } from "next/server";
import { message } from 'util/message';

export async function POST(request:NextRequest) {
    try{
        const refreshToken = request.cookies.get('refreshTokenCookie')?.value;
        if(!refreshToken){
            console.log('No tienes refresh')
            return NextResponse.json({
                error: message.error.noToken
            },{status:401})
        }

        const isVliadToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        if(!isVliadToken){
            console.log('No es valido refresh')
            return NextResponse.json({
                error: message.error.invalidToken
            },{status:401})
        }
        // @ts-ignore
        const {data} = isVliadToken;
        // Si el refreshToken es valido, generamos un nuevo accessToken con la data del refreshToken
        const newAccsessToken = jwt.sign({data},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})

        console.log('devuevlo nuevo access')
        const response = NextResponse.json({
            newAccsessToken: newAccsessToken
        },{status:200})

        response.cookies.set("accessTokenCookie",newAccsessToken,{
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
            maxAge:900, //15 minutos= 15x60
            httpOnly:true,
            path: "/"
        });

        return response;

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }

}