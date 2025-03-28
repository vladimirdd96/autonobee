import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require NFT ownership
const NFT_PROTECTED_ROUTES = [
  '/content-creation',
  '/chat',
];

// Routes that require both NFT and X auth
const DUAL_PROTECTED_ROUTES = [
  '/analytics',
  '/trends',
];

// Routes that should be accessible without NFT
const PUBLIC_ROUTES = [
  '/',
  '/mint',
  '/about',
  '/privacy',
  '/terms',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Get auth state from cookies
  const hasNFT = request.cookies.get('has_nft')?.value === 'true';
  const nftTier = request.cookies.get('nft_tier')?.value;
  const isXAuthorized = request.cookies.get('x_authorized')?.value === 'true';

  // Check NFT protected routes
  if (NFT_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!hasNFT) {
      const response = NextResponse.redirect(new URL('/mint', request.url));
      response.cookies.set('redirect_after_mint', pathname, { path: '/' });
      return response;
    }
  }

  // Check dual protected routes
  if (DUAL_PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!hasNFT) {
      const response = NextResponse.redirect(new URL('/mint', request.url));
      response.cookies.set('redirect_after_mint', pathname, { path: '/' });
      return response;
    }
    if (!isXAuthorized) {
      const response = NextResponse.redirect(new URL('/dashboard?auth=x', request.url));
      response.cookies.set('redirect_after_x_auth', pathname, { path: '/' });
      return response;
    }
  }

  // For dashboard, check if we need to show the mint prompt
  if (pathname === '/dashboard' && !hasNFT) {
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