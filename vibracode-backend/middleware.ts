import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/session(.*)'])

const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks(.*)',
  '/api/preview-proxy(.*)',
  '/api/auth(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk entirely for public API routes
  if (isPublicApiRoute(req)) {
    return NextResponse.next()
  }

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
