"use client"

import { createContext, useCallback, useEffect, useState } from "react"
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

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("fdc-cart", JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = useCallback(
    (product: Product, size: Size, color: ProductColor, quantity = 1) => {
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
    },
    []
  )

  const removeItem = useCallback(
    (productId: string, size: Size, colorName: string) => {
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
    },
    []
  )

  const updateQuantity = useCallback(
    (productId: string, size: Size, colorName: string, quantity: number) => {
      if (quantity < 1) return
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.name === colorName
            ? { ...item, quantity }
            : item
        )
      )
    },
    []
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

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
