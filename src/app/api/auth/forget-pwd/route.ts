import { Resend } from 'resend';
import { NextRequest,NextResponse } from 'next/server';
import { isEmail } from 'util/patterns';
import { message } from 'util/message';
import { connectMD } from 'lib/mongodb';
import User from 'models/User';
import jwt from 'jsonwebtoken';

const RESEND_KEY = process.env.RESEND_KEY;
const resend = new Resend(RESEND_KEY);

export async function POST(request:NextRequest) {
    
    try{
        await connectMD
        const body = await request.json()
        const {email} = body

        if(!isEmail(email)){
            return NextResponse.json({
                error:message.error.invalidEmial
            },{status:400})
        }

        const findUser = await User.findOne({email:email});

        if(!findUser){
            return NextResponse.json({
                error: message.error.notFoundEmail.msg,
                rediUrl:message.error.notFoundEmail.rediUrl,
                linkmsg:message.error.notFoundEmail.linkmsg,
            })
        }

        const tokenForChangePwd = {
            email:findUser.email,
            userId: findUser._id,
        }
        // dejamos que se invalida este proceso en una hora 60*60*1000
        const token = jwt.sign({data:tokenForChangePwd},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});

        const url = `http://localhost:3000/reset-pwd?token=${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `<h2>Please click follow button to start password rest process.<h2><br><a href=${url}>Reset your password here</a>`
        });

        return NextResponse.json({
            success:message.sucess.EmailSent
        },{status:200});
        
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }

}



