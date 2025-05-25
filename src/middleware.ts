import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

  // EL middleware solo tiene la responsabildiad de comprobar la existencia de accessToken

  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessTokenCookie');

  if (!accessToken && (path.startsWith('/home') || path.startsWith('/company-home'))) { // sino, significa el usuario esta en la paginas relacionados con la autenticacion 
    const url = request.nextUrl.clone(); // hacer una copia del objeto Request actual para modificar el url a pagina de logear
    if (path.startsWith('/company-home')) {
      url.pathname = '/company-login'; // si esta en la pagina de empresa, redirigir a login de empresa 
    }else{
      url.pathname = '/';
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  //matcher: ['/home/:path*']
  matcher: ['/((?!api|_next/static|_next/image).*)','/home/:path*','/company-home/:path*' ] 
  // recomendacion de documentacion oficial, hace que el middleware ignora estos reques
};

