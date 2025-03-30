import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should be accessible without NFT
const PUBLIC_ROUTES = [
  '/',
  '/mint',
  '/about',
  '/privacy',
  '/terms',
  '/analytics',
  '/trends',
  '/content-creation',
  '/chat',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Get auth state from cookies
  const isXAuthorized = request.cookies.get('x_authorized')?.value === 'true';

  // For dashboard, check if we need to show the mint prompt
  if (pathname === '/dashboard') {
    const url = new URL(request.url);
    url.searchParams.set('show_mint_prompt', 'true');
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 