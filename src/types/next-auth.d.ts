import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      isActive: boolean
      emailVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    role: string
    isActive: boolean
    emailVerified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: string
    isActive: boolean
    emailVerified: boolean
  }
}
