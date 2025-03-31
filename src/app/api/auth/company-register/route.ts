import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import { isEmail, onlyLetters, onlyLastNames, passwordRestrict, cifValidator } from "util/patterns";
import Company, {ICompanyDocument} from "models/Company";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CompanyProfile, { ICompanyProfile, ICompanyProfileDocument } from "models/CompanyProfile";

export async function POST(request:NextRequest) {
    try{
        await connectMD();

        const body = await request.json();
        const {firstname, lastname, email, password, role, companyName, cif } = body

        // Primero se valida si tiene todos los campos rellenados:
        if(!firstname|| !lastname || !email || !password || !companyName || !cif){
            return NextResponse.json({
                error:message.error.notFull
            },{
                status:400
            })
        }

        // Comprueba si el email ya sido registrado 
        const findCompany = await Company.findOne({email:email});

        if(findCompany){
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

        // Comrprueba si el password cumple con las retsriciones:
        if(passwordRestrict(password)){
            return NextResponse.json({
                error: message.error.passwordRestrict
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

        // validar cif
        if(!cifValidator(cif)){
            return NextResponse.json({
                error: message.error.notValidCif
            }, {status:400})
        }

        // Finalmente, crea empresa con pwd cifrado:

        const pwdEncrypted = await bcrypt.hash(password,10);
        const newCompany:ICompanyDocument = new Company({
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:pwdEncrypted,
            role:role,
            companyName: companyName,
            cif: cif
        });
        await newCompany.save();

        const profile: ICompanyProfileDocument = new CompanyProfile({
                company_id: newCompany._id,
                industry: "",
                city: "",
                scale: "",
                url: "",
                logo: "",
                description: ""
        })

        await profile.save()

        //Extraer el pwd de usuario y almacena en userPass(porq password esta utilizado como 
        // un constante ya), y asi, usamos restos datos para generar token. (Seguridad))
        const {password:companyPass, ...rest} = newCompany.toObject();

        // despues de registrar, debemos generar tokens para la sesion
        const accsessToken = jwt.sign({data:rest},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m',})
        const refreshToken = jwt.sign({data:rest},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d',})

        // datas de response
        const response = NextResponse.json({
            newCompany: rest,
            sucess:message.sucess.CompanyCreated
        },{status:200})

        // guardar en los cookies
        response.cookies.set("accessTokenCookie",accsessToken,{
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
            maxAge:7200, //2H 2x60x60
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