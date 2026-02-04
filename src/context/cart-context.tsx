"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CartItem, Product, ProductColor, Size } from "@/types"

export interface CartContextType {
  items: CartItem[]
  addItem: (
    product: Product,
    size: Size,
    color: ProductColor,
    quantity?: number
  ) => void
  removeItem: (productId: string, size: Size, colorName: string) => void
  updateQuantity: (
    productId: string,
    size: Size,
    colorName: string,
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

export const CartContext = createContext<CartContextType | null>(null)

function getCartKey(productId: string, size: Size, colorName: string) {
  return `${productId}-${size}-${colorName}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { data: session, status } = useSession()

  const userId = session?.user?.id

  // Effect 1: Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("fdc-cart")
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        localStorage.removeItem("fdc-cart")
      }
    }
    setLoaded(true)
  }, [])

  // Effect 2: Sync on login
  useEffect(() => {
    if (!loaded || status === "loading") return

    if (userId && items.length > 0 && !syncing) {
      // User logged in with local cart → sync to DB
      syncToDatabase()
    } else if (userId && items.length === 0) {
      // User logged in with no local cart → fetch from DB
      fetchFromDatabase()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loaded, status])

  // Effect 3: Save to localStorage (fallback)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("fdc-cart", JSON.stringify(items))
    }
  }, [items, loaded])

  // Sync localStorage to database (merge strategy)
  const syncToDatabase = async () => {
    if (!userId || syncing) return

    setSyncing(true)
    try {
      const response = await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
        // Clear localStorage after successful sync
        localStorage.removeItem("fdc-cart")
      }
    } catch (error) {
      console.error("[Cart] Sync to database failed:", error)
      // Degrade gracefully - keep using localStorage
    } finally {
      setSyncing(false)
    }
  }

  // Fetch cart from database
  const fetchFromDatabase = async () => {
    if (!userId) return

    try {
      const response = await fetch("/api/cart")

      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      }
    } catch (error) {
      console.error("[Cart] Fetch from database failed:", error)
      // Degrade gracefully - continue with empty cart
    }
  }

  // Sync individual operations to database (background)
  const syncItemToDatabase = async (
    action: "add" | "update" | "remove",
    params: any
  ) => {
    if (!userId) return // Guest user, skip

    try {
      switch (action) {
        case "add":
          await fetch("/api/cart/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: params.productId,
              size: params.size,
              color: params.color,
              quantity: params.quantity,
            }),
          })
          break

        case "update": {
          const key = getCartKey(params.productId, params.size, params.colorName)
          await fetch(`/api/cart/items/${key}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: params.quantity }),
          })
          break
        }

        case "remove": {
          const key = getCartKey(params.productId, params.size, params.colorName)
          await fetch(`/api/cart/items/${key}`, {
            method: "DELETE",
          })
          break
        }
      }
    } catch (error) {
      console.error(`[Cart] Background sync failed (${action}):`, error)
      // Don't throw - localStorage is the fallback
    }
  }

  const addItem = useCallback(
    (product: Product, size: Size, color: ProductColor, quantity = 1) => {
      // 1. Optimistic update
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor.name === color.name
        )
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id &&
            item.selectedSize === size &&
            item.selectedColor.name === color.name
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [
          ...prev,
          { product, quantity, selectedSize: size, selectedColor: color },
        ]
      })

      // 2. Sync to database if authenticated (background)
      syncItemToDatabase("add", {
        productId: product.id,
        size,
        color,
        quantity,
      })
    },
    [userId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const removeItem = useCallback(
    (productId: string, size: Size, colorName: string) => {
      // 1. Optimistic update
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedSize === size &&
              item.selectedColor.name === colorName
            )
        )
      )

      // 2. Sync to database if authenticated (background)
      syncItemToDatabase("remove", { productId, size, colorName })
    },
    [userId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const updateQuantity = useCallback(
    (productId: string, size: Size, colorName: string, quantity: number) => {
      if (quantity < 1) return

      // 1. Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.name === colorName
            ? { ...item, quantity }
            : item
        )
      )

      // 2. Sync to database if authenticated (background)
      syncItemToDatabase("update", { productId, size, colorName, quantity })
    },
    [userId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const clearCart = useCallback(async () => {
    // 1. Optimistic update
    setItems([])

    // 2. Sync to database if authenticated
    if (userId) {
      try {
        await fetch("/api/cart", { method: "DELETE" })
      } catch (error) {
        console.error("[Cart] Clear cart failed:", error)
      }
    }
  }, [userId])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
