import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authConfigEdge } from "./auth-config-edge"

/**
 * Full auth configuration with Prisma adapter
 * This is used by API routes and server-side functions
 * DO NOT import this in middleware - use authConfigEdge instead
 */
export const authConfig = {
  ...authConfigEdge,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Dynamic import to avoid loading Prisma in Edge Runtime
        const { prisma } = await import("@/lib/prisma")
        const { verifyPassword } = await import("./password-utils")

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            emailVerified: true,
            avatar: true,
          }
        })

        if (!user) {
          throw new Error("Credenciales inválidas")
        }

        if (!user.isActive) {
          throw new Error("Cuenta desactivada. Contacta a soporte.")
        }

        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) {
          throw new Error("Credenciales inválidas")
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user
        return {
          ...userWithoutPassword,
          name: `${user.firstName} ${user.lastName}`,
        }
      }
    })
  ],
  callbacks: {
    ...authConfigEdge.callbacks,
    async jwt({ token, user, trigger }) {
      // On sign in, add custom fields to JWT
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.isActive = user.isActive
        token.emailVerified = user.emailVerified
      }

      // On token update, re-fetch user data to check for role/status changes
      if (trigger === "update") {
        const { prisma } = await import("@/lib/prisma")
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { role: true, isActive: true, emailVerified: true }
        })
        if (dbUser) {
          token.role = dbUser.role
          token.isActive = dbUser.isActive
          token.emailVerified = dbUser.emailVerified
        }
      }

      return token
    },
  }
} satisfies NextAuthConfig
