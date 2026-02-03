import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered"
type PaymentStatus = "pending" | "paid" | "failed"
type UserRole = "customer" | "admin"

interface StatusBadgeProps {
  type: "order" | "payment" | "user-role" | "user-status"
  value: OrderStatus | PaymentStatus | UserRole | boolean
  className?: string
}

const orderStatusConfig = {
  pending: { variant: "secondary" as const, label: "Pendiente", className: undefined },
  confirmed: { variant: "default" as const, label: "Confirmado", className: undefined },
  shipped: { variant: "outline" as const, label: "Enviado", className: undefined },
  delivered: {
    variant: "default" as const,
    label: "Entregado",
    className: "bg-green-500",
  },
}

const paymentStatusConfig = {
  pending: { variant: "secondary" as const, label: "Pendiente", className: undefined },
  paid: {
    variant: "default" as const,
    label: "Pagado",
    className: "bg-green-500",
  },
  failed: { variant: "destructive" as const, label: "Fallido", className: undefined },
}

const userRoleConfig = {
  customer: { variant: "secondary" as const, label: "Cliente", className: undefined },
  admin: { variant: "default" as const, label: "Admin", className: undefined },
}

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  if (type === "order") {
    const config = orderStatusConfig[value as OrderStatus]
    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, className)}
      >
        {config.label}
      </Badge>
    )
  }

  if (type === "payment") {
    const config = paymentStatusConfig[value as PaymentStatus]
    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, className)}
      >
        {config.label}
      </Badge>
    )
  }

  if (type === "user-role") {
    const config = userRoleConfig[value as UserRole]
    return (
      <Badge variant={config.variant} className={className}>
        {config.label}
      </Badge>
    )
  }

  if (type === "user-status") {
    const isActive = value as boolean
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={cn(isActive && "bg-green-500", className)}
      >
        {isActive ? "Activo" : "Inactivo"}
      </Badge>
    )
  }

  return null
}
