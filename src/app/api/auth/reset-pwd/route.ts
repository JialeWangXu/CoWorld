import { NextRequest, NextResponse } from "next/server";
import { connectMD } from "lib/mongodb";
import User from "models/User";
import bcrypt from 'bcryptjs';
import { message } from "util/message";


export async function PUT(request:NextRequest) {
    
    try{
        await connectMD;

        const body = await request.json();
        const {pwd, confirmpwd} = body

        const emailPassed = request.nextUrl.searchParams.get('email');

        if(!pwd || !confirmpwd){
            return NextResponse.json({
                error:message.error.notFull
            }, {status:400})
        }

        if(pwd!==confirmpwd){
            return NextResponse.json({
                error: message.error.notMatchPwd
            },{
                status:400
            })
        }

        const newPwd = bcrypt.hash(pwd,10)

        //@ts-ignore
        const user = await User.findOneAndUpdate({email:emailPassed},{password:newPwd},{new:true});
        if(!user){
            return NextResponse.json({
                error:message.error.pwdCantChange
            },{status:400})
        }
        
        return NextResponse.json({
            sucess:message.sucess.PwdChanged
        },{status:200})
        
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}