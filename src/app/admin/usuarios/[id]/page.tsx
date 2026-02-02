import { getUserById } from "@/lib/db/users"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { UserStatusToggle } from "@/components/admin/user-status-toggle"
import { UserRoleEditor } from "@/components/admin/user-role-editor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  // Get initials for avatar fallback
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {user.fullName}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <UserStatusToggle userId={user.id} isActive={user.isActive} />
          <UserRoleEditor
            userId={user.id}
            currentRole={user.role}
            userName={user.fullName}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rol</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge type="user-role" value={user.role} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge type="user-status" value={user.isActive} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.orders?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Teléfono</p>
            <p className="text-sm text-muted-foreground">
              {user.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Email Verificado</p>
            <p className="text-sm text-muted-foreground">
              {user.emailVerified ? "Sí" : "No"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Último Inicio de Sesión</p>
            <p className="text-sm text-muted-foreground">
              {user.lastLoginAt
                ? format(new Date(user.lastLoginAt), "PPpp", { locale: es })
                : "Nunca"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Registrado</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(user.createdAt), "PPpp", { locale: es })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      {user.addresses && user.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Direcciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 rounded-lg border bg-muted/50"
              >
                <p className="font-medium">{address.label}</p>
                <p className="text-sm text-muted-foreground">
                  {address.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.street}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.province} {address.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      {user.orders && user.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="order" value={order.status} />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "dd/MM/yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Ver detalles
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
