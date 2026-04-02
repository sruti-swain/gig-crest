// lib/auth.ts
// Simple JWT-based authentication
// Uses 'jose' library (works in Edge runtime too)
// Mock OTP: always "1234" for demo purposes

import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Secret key for JWT signing — loaded from environment
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gigcrest-fallback-secret-key-2024'
);

// Token expires in 7 days (good for demo)
const TOKEN_EXPIRY = '7d';

// Mock OTP — in production this would be sent via SMS
export const MOCK_OTP = '1234';

/**
 * Generate a JWT token for a worker/admin
 */
export async function generateToken(payload: {
  workerId: string;
  phone: string;
  role: 'worker' | 'admin';
}): Promise<string> {
  const token = await new SignJWT({
    workerId: payload.workerId,
    phone: payload.phone,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 * Returns the payload or null if invalid
 */
export async function verifyToken(token: string): Promise<{
  workerId: string;
  phone: string;
  role: 'worker' | 'admin';
} | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      workerId: payload.workerId as string,
      phone: payload.phone as string,
      role: payload.role as 'worker' | 'admin',
    };
  } catch {
    // Token expired or invalid
    return null;
  }
}

/**
 * Extract token from request headers
 * Expects: Authorization: Bearer <token>
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
}

/**
 * Full auth check — extract + verify token from request
 * Returns decoded payload or null
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  workerId: string;
  phone: string;
  role: 'worker' | 'admin';
} | null> {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Hash a password using bcrypt
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Compare a password with its hash
 */
export function comparePassword(
  password: string,
  hash: string
): boolean {
  return bcrypt.compareSync(password, hash);
}

/**
 * Verify mock OTP
 * In production, this would check against a sent SMS code
 */
export function verifyOtp(inputOtp: string): boolean {
  return inputOtp === MOCK_OTP;
}