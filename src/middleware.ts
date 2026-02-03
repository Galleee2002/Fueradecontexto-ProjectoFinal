import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const token = req.auth
  const user = token?.user as any
  const isAdmin = user?.role === "admin" && user?.isActive === true
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

    // Verify email is verified (except for admins)
    if (user && !user.emailVerified && user.role !== "admin") {
      const verifyUrl = new URL("/auth/verify-required", req.url)
      verifyUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(verifyUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/mi-cuenta/:path*",
    "/checkout/:path*",
  ]
}
