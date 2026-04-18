import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication (public)
const publicRoutes = [
  '/',
  '/landing',
  '/auth/login',
  '/auth/signup',
  '/api/chat',  // Our API route needs to be accessible
]

// Routes that require authentication (protected)
const protectedRoutes = [
  '/dashboard',
  '/itinerary',
  '/flights',
  '/hotels',
  '/restaurants',
  '/transport',
  '/visa',
  '/currency',
  '/weather',
  '/emergency',
  '/guides',
  '/couchsurfing',
  '/passport',
  '/saved',
  '/packing',
  '/budget',
  '/chat',
  '/traveliq',
  '/settings',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes and API routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'))) {
    return NextResponse.next()
  }

  // Check if it's a protected route
  const isProtected = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  // Check for Firebase session cookie
  // Firebase sets a session cookie after login
  const sessionCookie = request.cookies.get('firebase-session')

  if (!sessionCookie) {
    // Not logged in - redirect to landing page
    const loginUrl = new URL('/landing', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Run middleware only on matching routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}