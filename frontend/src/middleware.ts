import { NextResponse, NextRequest } from 'next/server';

import { decodeJwtToken } from './utils/decodeJWT';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const authRoutes = ['/signin', '/signup'];
  const token = cookies().get('token')?.value;
  const decodedToken = token ? decodeJwtToken(token) : null;
  if (request.nextUrl.pathname.startsWith('/me') && !decodedToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (authRoutes.includes(request.nextUrl.pathname) && decodedToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // Account activation ( Applay only on /me routes)
  // Logic in include me/account-activation/[token]
  if (
    !decodedToken?.isActivated &&
    !request.nextUrl.pathname.startsWith('/me/account-activation') &&
    request.nextUrl.pathname.startsWith('/me')
  ) {
    return NextResponse.redirect(
      new URL('/me/account-activation', request.url),
    );
  }

  // Account-activation page guard
  if (
    decodedToken?.isActivated &&
    request.nextUrl.pathname.startsWith('/me/account-activation')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Applay 2FA guard only for /me routes

  // 2FA verification for non trusted devices only
  if (
    decodedToken?.isTwoFAEnabled &&
    !decodedToken?.isDeviceTrusted &&
    request.nextUrl.pathname.startsWith('/me') &&
    request.nextUrl.pathname !== '/me/two-fa/verify'
  ) {
    return NextResponse.redirect(new URL('/me/two-fa/verify', request.url));
  }

  // 2FA verification guard
  // 2FA verification for trusted devices only

  if (
    decodedToken?.isTwoFAEnabled &&
    decodedToken?.isDeviceTrusted &&
    request.nextUrl.pathname.startsWith('/me/two-fa/verify')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
