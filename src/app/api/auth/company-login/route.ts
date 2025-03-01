import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail } from "util/patterns";
import Company from "models/Company";
import Operator from "models/Operator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    
    try {
        await connectMD();

        const body = await request.json();
        const {email, password} = body;

        // comprobar todos los campos esten rellenados
        if(!email || !password){
            return NextResponse.json({
                error:message.error.notFull
            }, {status:400})
        }

        // comprobar el validez del email: 
        if(!isEmail(email)){
            return NextResponse.json({
                error:message.error.invalidEmial
            }, {status:400})
        }

        // comprobar la existencia del correo: 
        const findCompany = await Company.findOne({email:email})
        const findOperator = await Operator.findOne({email:email})

        if(!findCompany && !findOperator){
            return NextResponse.json({
                error:message.error.notFoundEmailCompany
            }, {status:400})
        }

        // comprobar si la contraseña es correcta
        const comparePwd = findCompany? await bcrypt.compare(password, findCompany.password) : await bcrypt.compare(password, findOperator.password)

        if(!comparePwd){
            return NextResponse.json({
                error:message.error.pwdIncorrect
            }, {status:400})
        }

        const {password:UserPass, ...rest} = findCompany? findCompany._doc : findOperator._doc;
        // Generar tokens para la sesion
        const accsessToken = jwt.sign({data:rest},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})
        const refreshToken = jwt.sign({data:rest},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d',})        

        const response = NextResponse.json({
            sucess:message.sucess.CompanyLogged,
            findUser:rest
        },{status:200})

        // generar tokens para la sesion
        response.cookies.set("accessTokenCookie",accsessToken,{
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
            maxAge:900, //15 minutos= 15x60
            httpOnly:true,
            path:"/"
        });
        
        response.cookies.set("refreshTokenCookie",refreshToken,{
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
            maxAge:604800, //7dias = 7x24x60x60
            httpOnly:true,
            path:"/"
        });
        return response;

    } catch (e) {
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}