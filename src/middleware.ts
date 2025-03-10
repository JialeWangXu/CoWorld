import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

  // EL middleware solo tiene la responsabildiad de comprobar la existencia de accessToken

  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessTokenCookie');

  if (!accessToken && path.startsWith('/home')) { // sino, significa el usuario esta en la paginas relacionados con la autenticacion 
    const url = request.nextUrl.clone(); // hacer una copia del objeto Request actual para modificar el url a pagina de logear
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log('Middleware triggered for:', request.nextUrl.pathname); // ELIMINA CUANDO TERMINAMOS!
  return NextResponse.next();
}

export const config = {
  //matcher: ['/home/:path*'],
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] 
  // recomendacion de documentacion oficial, hace que el middleware ignora estos reques
};

