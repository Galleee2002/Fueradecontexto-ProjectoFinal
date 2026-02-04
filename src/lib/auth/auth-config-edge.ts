import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth configuration for middleware
 * This config MUST NOT import Prisma or any Node.js-only dependencies
 * as it runs in Edge Runtime
 */
export const authConfigEdge = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add custom fields to JWT
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.isActive = user.isActive
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      // Expose custom fields to client session
      if (session.user) {
        (session.user as any).id = token.userId as string
        (session.user as any).role = token.role as string
        (session.user as any).isActive = token.isActive as boolean
        (session.user as any).emailVerified = token.emailVerified as boolean
      }
      return session
    },
  },
  providers: [], // Providers are set in auth.ts
} satisfies NextAuthConfig
