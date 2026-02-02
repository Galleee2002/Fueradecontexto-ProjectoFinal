"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface UserStatusToggleProps {
  userId: string
  isActive: boolean
}

export function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const [checked, setChecked] = useState(isActive)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleToggle = async (newChecked: boolean) => {
    setChecked(newChecked)
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newChecked }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error al actualizar el estado")
      setChecked(isActive) // Revert on error
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        id="user-status"
      />
      <Label htmlFor="user-status">{checked ? "Activo" : "Inactivo"}</Label>
    </div>
  )
}
