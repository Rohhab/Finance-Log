import { Response } from 'express';

export const setAuthCookies = (
  res: Response,
  refreshToken: string,
  options?: Partial<CookieOptions>,
) => {
  const defaultOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...options,
  };

  res.cookie('refresh_token', refreshToken, defaultOptions);
};

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  maxAge?: number;
}
