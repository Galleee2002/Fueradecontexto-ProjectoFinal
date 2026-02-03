import { auth } from "@/auth"

export async function getCurrentSession() {
  const session = await auth()
  return session
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
