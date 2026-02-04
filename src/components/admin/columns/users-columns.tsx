"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Eye, UserCog, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserRoleDialog } from "@/components/admin/user-role-dialog"
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

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Nombre",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.fullName}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as User["role"]
      return <StatusBadge type="user-role" value={role} />
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return <StatusBadge type="user-status" value={isActive} />
    },
  },
  {
    accessorKey: "ordersCount",
    header: "Pedidos",
    cell: ({ row }) => {
      const count = row.getValue("ordersCount") as number
      return <span>{count || 0}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registro",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return format(new Date(date), "dd/MM/yyyy", { locale: es })
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
]

function UserActions({ user }: { user: User }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleToggleActive = async (checked: boolean) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: checked }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete user")
      }

      router.refresh()
    } catch (error: any) {
      alert(error.message || "Error al eliminar usuario")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={user.isActive}
          onCheckedChange={handleToggleActive}
          disabled={isUpdating}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRoleDialog(true)}
        >
          <UserCog className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/usuarios/${user.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <UserRoleDialog
          user={user}
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar a &quot;{user.fullName}&quot; ({user.email})?
              Esta acción eliminará permanentemente todos sus datos, incluyendo
              direcciones. Los pedidos se mantendrán para historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
