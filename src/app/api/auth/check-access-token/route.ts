import jwt from 'jsonwebtoken';
import { message } from 'util/message';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(){
    try{
        const headerList = await headers();
        const token = headerList.get('authorization');

        if(!token){
            return NextResponse.json({
                error:message.error.noToken
            },{status:400})
        }

        if(token.startsWith('Bearer ')){
            const accessToken = token.split(' ')[1];
            try{
                //@ts-ignore
                const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

                return NextResponse.json({
                    authorized:true, success:message.sucess.UserAuthorized
                },{status:200})

            }catch(e){
                return NextResponse.json({
                    error:message.error.invalidToken, e
                },{status:401})

            }
        }
    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}