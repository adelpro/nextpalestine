import { CookieOptions } from 'express';

export const getCookieOptions = (COOKIE_JWT_TTL_MS: number): CookieOptions => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: COOKIE_JWT_TTL_MS,
  };
};
