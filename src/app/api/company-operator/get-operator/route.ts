import {connectMD} from "lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import jwt from 'jsonwebtoken';
import Operator from "models/Operator";

export async function POST(request:NextRequest) {

    try{

    await connectMD();

    const accessToken = request.cookies.get('accessTokenCookie').value;
    console.log("He cogido access"+accessToken)
    try{
        //@ts-ignore
        const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        console.log("Access aprobado")
        console.log(data._id)
        const body = await request.json();
        const {id} = body;

        const operator = await Operator.findOne({_id: id});

        console.log("He encontrado el operador")
        console.log(operator)
        if(!operator){
            return NextResponse.json({
                error:message.error.jobsLoadError
            }, {status:400})
        }
        console.log("He encontrado sus operadores")
        return NextResponse.json({
            operator:operator
        },{status:200})
    
        } catch (e) {
            console.log(e)
            return NextResponse.json({
                error:message.error.genericError,e
            },{status:401})
        }
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500}) 
    }
}