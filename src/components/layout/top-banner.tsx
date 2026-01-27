"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants"
import { formatPrice } from "@/lib/formatters"

export function TopBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4 relative">
      <p>
        ENVIO GRATIS en compras mayores a{" "}
        {formatPrice(FREE_SHIPPING_THRESHOLD)} | Hasta 6 cuotas sin interes
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Cerrar banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
