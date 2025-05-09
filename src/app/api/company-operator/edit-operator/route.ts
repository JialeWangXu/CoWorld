import {connectMD} from "lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import jwt from 'jsonwebtoken';
import Operator from "models/Operator";
import { onlyLetters, onlyLastNames } from "util/patterns";

export async function POST(request:NextRequest) {

    try{

        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;
        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const body = await request.json();
            const {id, firstname, lastname, isDelete} = body;

            const operator = await Operator.findOne({_id: id});
            
            if(!operator){
                return NextResponse.json({
                    error:message.error.jobsLoadError
                }, {status:400})
            }

            if(isDelete){
                await Operator.deleteOne({_id: id});
                return NextResponse.json({
                    sucess:message.sucess.OperatorDeleted
                },{status:200})
            }else{
                if(!onlyLetters(firstname)){
                    return NextResponse.json({
                        error: message.error.onlyLetterName
                    }, {status:400})
                }
                if(!onlyLastNames(lastname)){
                    return NextResponse.json({
                        error: message.error.onlyLetterSpace
                    }, {status:400})
                }                
                operator.firstname = firstname;
                operator.lastname = lastname;
                await operator.save();
                return NextResponse.json({
                    sucess:message.sucess.OperatorModified
                },{status:200})
            }
            
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