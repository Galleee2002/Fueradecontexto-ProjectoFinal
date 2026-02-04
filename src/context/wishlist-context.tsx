"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export interface WishlistContextType {
  items: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { data: session, status } = useSession()

  const userId = session?.user?.id

  // Effect 1: Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("fdc-wishlist")
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        localStorage.removeItem("fdc-wishlist")
      }
    }
    setLoaded(true)
  }, [])

  // Effect 2: Sync on login
  useEffect(() => {
    if (!loaded || status === "loading") return

    if (userId && items.length > 0 && !syncing) {
      // User logged in with local wishlist → sync to DB
      syncToDatabase()
    } else if (userId && items.length === 0) {
      // User logged in with no local wishlist → fetch from DB
      fetchFromDatabase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loaded, status])

  // Effect 3: Save to localStorage (fallback)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("fdc-wishlist", JSON.stringify(items))
    }
  }, [items, loaded])

  // Sync localStorage to database (merge strategy)
  const syncToDatabase = async () => {
    if (!userId || syncing) return

    setSyncing(true)
    try {
      const response = await fetch("/api/wishlist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
        // Clear localStorage after successful sync
        localStorage.removeItem("fdc-wishlist")
      }
    } catch (error) {
      console.error("[Wishlist] Sync to database failed:", error)
      // Degrade gracefully - keep using localStorage
    } finally {
      setSyncing(false)
    }
  }

  // Fetch wishlist from database
  const fetchFromDatabase = async () => {
    if (!userId) return

    try {
      const response = await fetch("/api/wishlist")

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error("[Wishlist] Fetch from database failed:", error)
      // Degrade gracefully - continue with empty wishlist
    }
  }

  // Sync individual operations to database (background)
  const syncItemToDatabase = async (
    action: "add" | "remove",
    productId: string
  ) => {
    if (!userId) return // Guest user, skip

    try {
      switch (action) {
        case "add":
          await fetch("/api/wishlist/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })
          break

        case "remove":
          await fetch(`/api/wishlist/items/${productId}`, {
            method: "DELETE",
          })
          break
      }
    } catch (error) {
      console.error(`[Wishlist] Background sync failed (${action}):`, error)
      // Don't throw - localStorage is the fallback
    }
  }

  const toggleWishlist = useCallback((productId: string) => {
    const isCurrentlyInWishlist = items.includes(productId)

    // 1. Optimistic update
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )

    // 2. Sync to database if authenticated (background)
    syncItemToDatabase(isCurrentlyInWishlist ? "remove" : "add", productId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, userId])

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  )

  const clearWishlist = useCallback(async () => {
    // 1. Optimistic update
    setItems([])

    // 2. Sync to database if authenticated
    if (userId) {
      try {
        await fetch("/api/wishlist", { method: "DELETE" })
      } catch (error) {
        console.error("[Wishlist] Clear wishlist failed:", error)
      }
    }
  }, [userId])

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
