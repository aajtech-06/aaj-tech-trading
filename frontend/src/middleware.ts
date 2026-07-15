import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // If already logged in, redirect away from login page
  if (pathname === '/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      } catch {
        // Token invalid, stay on login page
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
