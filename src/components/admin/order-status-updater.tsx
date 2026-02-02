"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: "pending" | "confirmed" | "shipped" | "delivered"
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    if (status === currentStatus) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error al actualizar el estado")
      setStatus(currentStatus) // Revert on error
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(value) =>
          setStatus(value as "pending" | "confirmed" | "shipped" | "delivered")
        }
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="shipped">Enviado</SelectItem>
          <SelectItem value="delivered">Entregado</SelectItem>
        </SelectContent>
      </Select>

      {status !== currentStatus && (
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? "Actualizando..." : "Guardar"}
        </Button>
      )}
    </div>
  )
}
