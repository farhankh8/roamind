import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/settings',
  '/saved',
  '/packing',
  '/budget',
  '/chat',
  '/passport',
  '/itinerary',
]

const authRoutes = [
  '/auth/login',
  '/auth/signup',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (isProtectedRoute) {
    const firebaseToken = request.cookies.get('firebase-token')?.value
    
    if (!firebaseToken) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  if (isAuthRoute) {
    const firebaseToken = request.cookies.get('firebase-token')?.value
    
    if (firebaseToken) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/saved/:path*',
    '/packing/:path*',
    '/budget/:path*',
    '/chat/:path*',
    '/passport/:path*',
    '/itinerary/:path*',
    '/auth/:path*',
  ],
}
