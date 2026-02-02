"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from "@/types"

interface UserRoleDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserRoleDialog({
  user,
  open,
  onOpenChange,
}: UserRoleDialogProps) {
  const [role, setRole] = useState<User["role"]>(user.role)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    if (role === user.role) {
      onOpenChange(false)
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Error al actualizar el rol")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cambiar Rol de Usuario</AlertDialogTitle>
          <AlertDialogDescription>
            Estás cambiando el rol de <strong>{user.fullName}</strong>. Los
            admins tienen acceso completo al panel de administración.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Select
            value={role}
            onValueChange={(v) => setRole(v as User["role"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Cliente</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isUpdating}>
            {isUpdating ? "Actualizando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
