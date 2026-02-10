import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@/lib/constants";

const JWT_SECRET_STR = process.env.JWT_SECRET;
if (!JWT_SECRET_STR && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is not defined in production environment");
}

const JWT_SECRET = new TextEncoder().encode(
  JWT_SECRET_STR || "dresscode-laundry-development-secret-key-only"
);

const COOKIE_NAME = "dc_auth_token";
const TOKEN_EXPIRY = "24h";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

/** Create a signed JWT token */
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/** Verify a JWT token and return the payload */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Set auth cookie (HttpOnly, Secure in production) */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/** Remove the auth cookie */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Get and verify the current user from cookies */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Middleware helper — check if user has required role */
export async function requireRole(
  ...allowedRoles: UserRole[]
): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}
