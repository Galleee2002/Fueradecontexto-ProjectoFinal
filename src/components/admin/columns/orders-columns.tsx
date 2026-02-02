"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Número de Pedido",
    cell: ({ row }) => {
      const orderNumber = row.getValue("orderNumber") as string
      return (
        <Link
          href={`/admin/pedidos/${row.original.id}`}
          className="font-medium hover:underline"
        >
          #{orderNumber}
        </Link>
      )
    },
  },
  {
    accessorKey: "userName",
    header: "Cliente",
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{order.userName}</span>
          <span className="text-xs text-muted-foreground">
            {order.userEmail}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"]
      return <StatusBadge type="order" value={status} />
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as number
      return <span className="font-medium">${total.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date
      return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es })
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
]

function OrderActions({ order }: { order: Order }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

  return (
    <div className="flex items-center gap-2">
      <Select
        value={order.status}
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="shipped">Enviado</SelectItem>
          <SelectItem value="delivered">Entregado</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/pedidos/${order.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
