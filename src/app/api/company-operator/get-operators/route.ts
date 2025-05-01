import {connectMD} from "lib/mongodb";
import {  NextRequest,NextResponse } from "next/server";
import { message } from "util/message";
import jwt from 'jsonwebtoken';
import Operator from "models/Operator";

export async function POST(request:NextRequest) {

    try{
        await connectMD();

        const accessToken = request.cookies.get('accessTokenCookie').value;

        try{
            //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const body = await request.json();
            const {page} = body;

            const operators = await Operator.find({company_id: data._id}).populate('company_id').lean();

            if(!operators){
                return NextResponse.json({
                    error:message.error.jobsLoadError
                }, {status:400})
            }
            const totalPage = Math.ceil(operators.length/5);
            const start= (parseInt(page)-1)*5;
            const slicedOperatorList = operators.slice(start,start+5);
            return NextResponse.json({
                operators:slicedOperatorList,
                totalPage:totalPage
            },{status:200})
        
        } catch (e) {
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