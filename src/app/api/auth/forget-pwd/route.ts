import { Resend } from 'resend';
import { NextRequest,NextResponse } from 'next/server';
import { isEmail } from 'util/patterns';
import { message } from 'util/message';
import { connectMD } from 'lib/mongodb';
import User from 'models/User';

const resend = new Resend('re_64tzP3z7_BPNCGXu26mTSpG92wZDtYE5S'); // cambiar a env

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

        //@ts-ignore
        const findUser = await User.findOne({email:email});

        if(!findUser){
            return NextResponse.json({
                error: message.error.notFoundEmail.msg,
                rediUrl:message.error.notFoundEmail.rediUrl,
                linkmsg:message.error.notFoundEmail.linkmsg,
            })
        }

        const url = `http://localhost:3000/reset-pwd?email=${email}`

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Reset your password',
            html: `<h2>Please click follow button to start password rest process.<h2><br><a href=${url}>Reset your password here</a>`
        });
        
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }

}



