import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  const needsAuth =
    path.startsWith('/checkout') ||
    path.startsWith('/orders') ||
    path.startsWith('/account') ||
    path.startsWith('/wishlist') ||
    path.startsWith('/admin') ||
    path.startsWith('/driver');

  if (needsAuth && !token) {
    const login = new URL('/login', request.url);
    login.searchParams.set('redirect', path);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/account/:path*', '/wishlist', '/wishlist/:path*', '/admin/:path*', '/driver/:path*'],
};
