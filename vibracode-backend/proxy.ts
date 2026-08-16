import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname

  // Public API routes
  if (
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/api/preview-proxy') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // Protect session routes
  if (pathname.startsWith('/session')) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
