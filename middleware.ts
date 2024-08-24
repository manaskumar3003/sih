import { NextResponse } from 'next/server';

interface Request {
  nextUrl: {
    pathname: string;
  };
  cookies: {
    get(name: string): {
      value: string;
    };
  };
}

export function middleware(request: Request): NextResponse | void {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get("token")?.value || "";

  console.log(isPublicPath, token);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(`${path}`, request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ['/','/login', '/register', '/profile'],
};