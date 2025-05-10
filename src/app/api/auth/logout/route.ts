import { cookies } from "next/headers";
import {NextResponse } from "next/server";
import { message } from "util/message";

export async function POST(){

    try{
        const cookieStore = await cookies();
        cookieStore.delete('accessTokenCookie');
        cookieStore.delete('refreshTokenCookie');
        return NextResponse.json({
            sucess:message.sucess.UserLoggedOut
        },{status:200})
    }catch(e){
        return NextResponse.json({
            error: message.error.logOutError
        },{status:500})
    }
}