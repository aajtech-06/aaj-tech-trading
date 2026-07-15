import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export interface Session extends JWTPayload {
  email: string;
  role: string;
  name?: string;
  id?: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only'
);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed);
}

export async function createToken(payload: Record<string, any>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Session;
  } catch {
    return null;
  }
}

export async function getSession(req?: Request) {
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('admin_token')?.value;
  } catch (error) {
    console.error('Error reading cookies from cookies():', error);
  }

  // Fallback: parse from Request headers if not found via cookies()
  if (!token && req) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;)\s*admin_token\s*=\s*([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) return null;
  return await verifyToken(token);
}
