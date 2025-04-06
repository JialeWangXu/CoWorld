import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail, onlyLetters, onlyLastNames } from "util/patterns";
import Operator, {IOperatorDocument} from "models/Operator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { EmialOperatorTemplate } from "app/components/EmailOperatorTemplate";

const RESEND_KEY = process.env.RESEND_KEY;
const resend = new Resend(RESEND_KEY);
export async function POST(request:NextRequest) {

    const accessToken = request.cookies.get('accessTokenCookie').value;
    console.log("He cogido access"+accessToken)

    try{
        await connectMD();

        const body = await request.json();
        const {firstname, lastname, email, role, changedPassword} = body

        //@ts-ignore
        const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        console.log("Access aprobado")

        // Primero se valida si tiene todos los campos rellenados:
        if(!firstname|| !lastname || !email){
            return NextResponse.json({
                error:message.error.notFull
            },{
                status:400
            })
        }

        // Comprueba si el email ya sido registrado 
        const findOperator = await Operator.findOne({email:email});

        if(findOperator){
            return NextResponse.json({
                error: message.error.alreadyExist
            },{status:400})
        }

        // Comprueba si es un email valido:
        if(!isEmail(email)){
            return NextResponse.json({
                error:message.error.invalidEmial
            },{
                status:400
            })
        }

        // Comprueba si es un nombre con formato correcto:
        if(!onlyLetters(firstname)){
            return NextResponse.json({
                error: message.error.onlyLetterName
            }, {status:400})
        }else if(!onlyLastNames(lastname)){
            return NextResponse.json({
                error: message.error.onlyLetterSpace
            }, {status:400})
        }

        // Finalmente, crea usuario con pwd cifrado:
        const tempPassword = crypto.randomBytes(10).toString('hex');
        const pwdEncrypted = await bcrypt.hash(tempPassword,10);
        const newOperator:IOperatorDocument = new Operator({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:pwdEncrypted,
            changedPassword:changedPassword,
            company_id:data._id,
            role:role
        });
        await newOperator.save();

        //Extraer el pwd de usuario y almacena en userPass(porq password esta utilizado como 
        // un constante ya), y asi, usamos restos datos para generar token. (Seguridad))
        const {password:userPass, ...rest} = newOperator.toObject();

        const tokenForChangePwd = {
            email:newOperator.email,
            userId: newOperator._id,
        }
        // dejamos que se invalida este proceso en 2 dias
        const token = jwt.sign({data:tokenForChangePwd},process.env.RESET_PWD_TOKEN_SECRETE,{expiresIn:'2d'});
        
        const url = `http://localhost:3000/reset-password-operator?token=${token}`;
        
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "wangjiale0928@gmail.com",
            subject: "Bienvenido a la plataforma CoWorld",
            react: EmialOperatorTemplate({url:url,firstname:newOperator.firstname,companyName:data.companyName,tempPwd:tempPassword}),
        });

        // datas de response
        const response = NextResponse.json({
            newOperator: rest,
            sucess:message.sucess.OperatorCreated
        },{status:200})

        return response;

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}