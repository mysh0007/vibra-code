import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname

  // Public API routes - skip Clerk protection
  if (
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/preview-proxy') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // Protect /session and everything under it
  if (pathname.startsWith('/session')) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
