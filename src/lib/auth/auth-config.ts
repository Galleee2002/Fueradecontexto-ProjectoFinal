import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "./password-utils"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
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
          credentials.password,
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
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
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
    async session({ session, token }) {
      // Expose custom fields to client session
      if (session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.isActive = token.isActive as boolean
        session.user.emailVerified = token.emailVerified as boolean
      }
      return session
    }
  }
}
