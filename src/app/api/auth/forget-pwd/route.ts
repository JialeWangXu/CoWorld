import { Resend } from 'resend';
import { NextRequest,NextResponse } from 'next/server';
import { isEmail } from 'util/patterns';
import { message } from 'util/message';
import { connectMD } from 'lib/mongodb';
import User from 'models/User';
import jwt from 'jsonwebtoken';
import { EmailTemplate } from 'app/components/EmailTemplate';
import Operator from 'models/Operator';
import Company from 'models/Company';

const RESEND_KEY = process.env.RESEND_KEY;
const resend = new Resend(RESEND_KEY);

export async function POST(request:NextRequest) {
    
    try{
        await connectMD()
        const body = await request.json()
        const {email} = body

        if(!isEmail(email)){
            return NextResponse.json({
                error:message.error.invalidEmial
            },{status:400})
        }

        const findUser = await User.findOne({email:email});
        const findCompany = await Company.findOne({email:email});
        const findOperator = await Operator.findOne({email:email});

        if(!findUser&&!findCompany&&!findOperator){
            console.log("no encuentra")
            return NextResponse.json({
                error: message.error.notFoundEmail
            },{status:400})
        }

        if(findOperator&&!findOperator.changedPassword){
            return NextResponse.json({
                error: message.error.notFoundEmail
            },{status:400})
        }

        const targetEntity = findUser || findCompany || findOperator;
        console.log("encuentra" + targetEntity.email + " " + targetEntity._id)


        const tokenForChangePwd = {
            email:targetEntity.email,
            userId: targetEntity._id,
        }

        // dejamos que se invalida este proceso en una hora 60*60*1000
        const token = jwt.sign({data:tokenForChangePwd},process.env.RESET_PWD_TOKEN_SECRETE,{expiresIn:'1h'});

        const url = `http://localhost:3000/reset-password?token=${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "wangjiale0928@gmail.com",
            subject: "Reset your password",
            react: EmailTemplate({url:url,firstname:targetEntity.firstname}),
        });

        return NextResponse.json({
            sucess:message.sucess.EmailSent
        },{status:200});
        
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }

}



