import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "admin" && token?.isActive === true
    const isAuth = !!token
    const path = req.nextUrl.pathname

    // Protect admin routes
    if (path.startsWith("/admin")) {
      if (!isAdmin) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("error", "admin-required")
        loginUrl.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Protect account routes
    if (path.startsWith("/mi-cuenta")) {
      if (!isAuth) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Protect checkout
    if (path.startsWith("/checkout")) {
      if (!isAuth) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Handle in middleware function above
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/mi-cuenta/:path*",
    "/checkout/:path*",
  ]
}
