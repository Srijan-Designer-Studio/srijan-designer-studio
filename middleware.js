import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

 
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

 
  if (pathname.startsWith('/account')) {
     if (token && token.role === 'admin') {
       return NextResponse.redirect(new URL('/admin', req.url));
     }
  }

  return NextResponse.next();
}