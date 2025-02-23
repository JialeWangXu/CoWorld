import { Resend } from 'resend';
import { NextRequest,NextResponse } from 'next/server';
import { isEmail } from 'util/patterns';
import { message } from 'util/message';
import { connectMD } from 'lib/mongodb';
import User from 'models/User';
import jwt from 'jsonwebtoken';
import { EmailTemplate } from 'app/components/EmailTemplate';

const RESEND_KEY = process.env.RESEND_KEY;
const resend = new Resend(RESEND_KEY);

export async function POST(request:NextRequest) {
    
    try{
        await connectMD()
        console.log("Contectado a BD")
        const body = await request.json()
        const {email} = body
        console.log("leido email")

        if(!isEmail(email)){
            return NextResponse.json({
                error:message.error.invalidEmial
            },{status:400})
        }

        console.log("email correcto")

        const findUser = await User.findOne({email:email});
        console.log(`Usuario encontrado: ${findUser ? findUser.userId : "No encontrado"}`);


        if(!findUser){
            console.log("no encuentra")
            return NextResponse.json({
                error: message.error.notFoundEmail
            },{status:400})
        }

        const tokenForChangePwd = {
            email:findUser.email,
            userId: findUser._id,
        }
        // dejamos que se invalida este proceso en una hora 60*60*1000
        const token = jwt.sign({data:tokenForChangePwd},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});

        const url = `http://localhost:3000/reset-password?token=${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            react: EmailTemplate({url:url,firstname:findUser.firstname})
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



