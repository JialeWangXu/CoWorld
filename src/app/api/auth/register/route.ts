import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail, onlyLetters, onlyLastNames } from "util/patterns";
import User, {IUserDocument} from "models/User";
import { CANDIDATE } from "util/constants";
import bcrypt from 'bcryptjs';

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
        //@ts-ignore
        const findUser = await User.findOne({email:email});

        if(findUser){
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
            role:CANDIDATE
        });
        await newUser.save();

    }catch(e){
        console.log("Error registering", e);
    }
}