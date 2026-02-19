import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protect seller routes
  if (pathname.startsWith('/seller')) {
    if (!token || token.role !== 'seller') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Protect buyer routes
  if (pathname.startsWith('/buyer')) {
    if (!token || token.role !== 'buyer') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/seller/:path*', '/buyer/:path*'],
};
