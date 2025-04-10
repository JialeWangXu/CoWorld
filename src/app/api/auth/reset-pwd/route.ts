import { NextRequest, NextResponse } from "next/server";
import { connectMD } from "lib/mongodb";
import User from "models/User";
import bcrypt from 'bcryptjs';
import { message } from "util/message";
import { passwordRestrict } from "util/patterns";
import jwt from 'jsonwebtoken';
import { headers } from "next/headers";
import Company from "models/Company";
import Operator from "models/Operator";


export async function POST(request:NextRequest) {
    
    try{
        await connectMD();

        const body = await request.json();
        const {pwd, confirmpwd} = body

        const headerList = headers()
        const token = (await headerList).get('Token')

        if(!token){
            return NextResponse.json({
                error:message.error.noToken
            },{status:400})
        }

        try{
            const isVliadToken = jwt.verify(token,process.env.RESET_PWD_TOKEN_SECRETE);
            // @ts-ignore
            const {data} = isVliadToken;
            if(!pwd || !confirmpwd){
                return NextResponse.json({
                    error:message.error.notFull
                }, {status:400})
            }
    
            // Comrprueba si el password  nuevo cumple con las retsriciones:
            if(passwordRestrict(pwd)){
                return NextResponse.json({
                    error: message.error.passwordRestrict
                },{
                    status:400
                })
            }       
    
            if(pwd!==confirmpwd){
                return NextResponse.json({
                    error: message.error.notMatchPwd
                },{
                    status:400
                })
            }
    
            const newPwd = await bcrypt.hash(pwd,10)
    
            var user = await User.findOneAndUpdate({_id:data.userId},{password:newPwd},{new:true});
            if(!user){
                user = await Company.findOneAndUpdate({_id:data.userId},{password:newPwd},{new:true});
            }
            if(!user){
                user = await Operator.findOneAndUpdate({_id:data.userId},{password:newPwd},{new:true});
            }
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
                error:message.error.invalidToken
            },{status:400})
        }
        
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}