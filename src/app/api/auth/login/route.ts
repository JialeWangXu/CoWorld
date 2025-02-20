import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail } from "util/patterns";
import User from "models/User";
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
        const findUser = await User.findOne({email:email})

        if(!findUser){
            return NextResponse.json({
                error:message.error.notFoundUser.msg,
                rediUrl:message.error.notFoundUser.rediUrl,
                linkmsg:message.error.notFoundUser.linkmsg
            }, {status:400})
        }

        // comprobar si la contraseña es correcta
        const comparePwd = await bcrypt.compare(password, findUser.password)

        if(!comparePwd){
            return NextResponse.json({
                error:message.error.pwdIncorrect
            }, {status:400})
        }

        const {password:UserPass, ...rest} = findUser._doc;
        // Generar tokens para la sesion
        const accsessToken = jwt.sign({data:rest},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})
        const refreshToken = jwt.sign({data:rest},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d',})        

        const response = NextResponse.json({
            success:message.sucess.UserLogged,
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

    } catch (error) {
        return NextResponse.json({
            msg:message.error.genericError,error
        },{status:500})
    }
}