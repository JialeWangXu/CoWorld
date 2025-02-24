import { NextRequest,NextResponse } from "next/server";
import axiosInstance from './lib/axiosInterceptor'

export async function middleware(request:NextRequest){
    try{

        const accessToken = request.cookies.get('accessTokenCookie')

        if(!accessToken){
            return NextResponse.redirect(new URL('/',request.url))
        }

        const response = await axiosInstance.get('/auth/check-access-token', {
                headers: {
                'authorization': `Bearer ${accessToken.value}`,
                },
                withCredentials:true
        })

            if(!response.data.authorized){
                console.log('no autorizado')
                return NextResponse.redirect(new URL('/',request.url))
            }
            return NextResponse.next()
    }catch(e){
        return NextResponse.redirect(new URL('/',request.url))
    }
}
export const config={
    matcher: '/home'
}