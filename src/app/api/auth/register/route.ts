import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail, onlyLetters, onlyLastNames, passwordRestrict } from "util/patterns";
import User, {IUserDocument} from "models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request:NextRequest) {
    try{
        await connectMD();

        const body = await request.json();
        const {firstname, lastname, email, password, confirmPwd, role} = body

        // Primero se valida si tiene todos los campos rellenados:
        if(!firstname|| !lastname || !email || !password || !confirmPwd){
            return NextResponse.json({
                error:message.error.notFull
            },{
                status:400
            })
        }

        // Comprueba si el email ya sido registrado 
        const findUser = await User.findOne({email:email});

        if(findUser){
            return NextResponse.json({
                msg: message.error.alreadyExist.msg,
                rediUrl:message.error.alreadyExist.rediUrl,
                linkMsg:message.error.alreadyExist.linkmsg
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

        // Comrprueba si el password cumple con las retsriciones:
        if(passwordRestrict(password)){
            return NextResponse.json({
                error: message.error.passwordRestrict
            },{
                status:400
            })
        }

        // Comprueba si los pwds se coninciden: 
        if(password!==confirmPwd){
            return NextResponse.json({
                error: message.error.notMatchPwd
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

        const pwdEncrypted = await bcrypt.hash(password,10);
        const newUser:IUserDocument = new User({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:pwdEncrypted,
            role:role
        });
        await newUser.save();

        //Extraer el pwd de usuario y almacena en userPass(porq password esta utilizado como 
        // un constante ya), y asi, usamos restos datos para generar token. (Seguridad))
        const {password:userPass, ...rest} = newUser.toObject();

        // despues de registrar, debemos generar tokens para la sesion
        const accsessToken = jwt.sign({data:rest},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})
        const refreshToken = jwt.sign({data:rest},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d',})

        // datas de response
        const response = NextResponse.json({
            newUser: rest,
            sucess:message.sucess.UserCreated
        },{status:200})

        // guardar en los cookies
        response.cookies.set("acessTokenCookie",accsessToken,{
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

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}