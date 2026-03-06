import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "admin_session";
const TOKEN_TTL = "8h";

type AdminJwtPayload = {
  email: string;
  role: "admin";
};

export function createAdminToken(email: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");

  return jwt.sign({ email, role: "admin" } satisfies AdminJwtPayload, secret, {
    expiresIn: TOKEN_TTL,
  });
}

export async function verifyPassword(input: string) {
  const plain = process.env.ADMIN_PASSWORD;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (hash) {
    return bcrypt.compare(input, hash);
  }

  if (plain) {
    return input === plain;
  }

  return false;
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getTokenFromRequest(req: Request) {
  return req.cookies?.[COOKIE_NAME] as string | undefined;
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return jwt.verify(token, secret) as AdminJwtPayload;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    (req as Request & { admin?: AdminJwtPayload }).admin = payload;
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid session" });
  }
}

export const adminCookieName = COOKIE_NAME;

