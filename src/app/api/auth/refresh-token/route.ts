"use server";
import jwt from 'jsonwebtoken';
import {  NextRequest, NextResponse } from "next/server";
import { message } from 'util/message';

export async function POST(request:NextRequest) {
    try{
        console.log("Request Headers:", Array.from(request.headers.entries())); //ELIMINAMOS CUADO TERMINA
        const refreshToken = request.cookies.get('refreshTokenCookie')?.value;
        if(!refreshToken){
            console.log('No tienes refresh')
            return NextResponse.json({
                error: message.error.noToken
            },{status:401})
        }

        const isVliadToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        if(!isVliadToken){
            console.log('No es valido refresh tiene que logear')
            return NextResponse.json({
                error: message.error.invalidToken
            },{status:401})
        }
        // @ts-ignore
        const {data} = isVliadToken;
        // Si el refreshToken es valido, generamos un nuevo accessToken con la data del refreshToken
        const newAccsessToken = jwt.sign({data},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})

        console.log('devuevlo nuevo access')
        const response = NextResponse.json({
            newAccsessToken: newAccsessToken
        },{status:200})

        response.cookies.set("accessTokenCookie",newAccsessToken,{
            sameSite:"lax",
            secure:process.env.NODE_ENV==="production",
            maxAge:7200, //2H 2x60x60
            httpOnly:true,
            path: "/"
        });

        console.log("Response Headers:", Array.from(response.headers.entries()));
        console.log("MIRAR SI ESTA ACTUALIZANDO COOKIE"+response.cookies.get('accessTokenCookie').value)

        return response;

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }

}