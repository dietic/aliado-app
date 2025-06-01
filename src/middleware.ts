import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from './lib/handleApi';

const RATE_LIMIT = 100; // requests
const WINDOW = 60 * 1000; // 1 minute

// Simple in-memory store (for demo/dev only, use Redis for production)
const ipStore = new Map<string, { count: number; lastRequest: number }>();

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();

  const entry = ipStore.get(ip) || { count: 0, lastRequest: now };
  if (now - entry.lastRequest > WINDOW) {
    entry.count = 1;
    entry.lastRequest = now;
  } else {
    entry.count += 1;
  }
  ipStore.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return handleApiError('RATE_LIMIT_EXCEEDED');
  }
  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return handleApiError('BAD_REQUEST');
    }
  }
  return NextResponse.next();
}

// Optionally, only apply to API routes
export const config = {
  matcher: ['/api/:path*'],
};
