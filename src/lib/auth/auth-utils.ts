import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-config"

export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user?.id || null
}

export async function isAdmin(): Promise<boolean> {
  const session = await getCurrentSession()
  return session?.user?.role === "admin" && session?.user?.isActive === true
}

export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Unauthorized: Admin access required")
  }
}

export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error("Unauthorized: Authentication required")
  }
  return userId
}
