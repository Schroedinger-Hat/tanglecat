import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected here
const protectedPaths = ['/dashboard', '/award', '/challenge']
const adminPaths = ['/admin']

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the current path should be protected
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix))
  const isAdminPath = adminPaths.some(prefix => path.startsWith(prefix))
  const isHomePath = path === '/'
  // Check for the user_token cookie
  const userToken = request.cookies.get('user_token')
  const supervisorToken = request.cookies.get('supervisor_token')

  if (isProtectedPath && !userToken) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  if (isAdminPath && !supervisorToken) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (isHomePath && userToken) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 