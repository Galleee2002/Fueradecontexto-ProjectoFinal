import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getStats() {
  const [productsCount, ordersCount, usersCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ])

  // Calculate total sales (sum of order totals)
  const totalSales = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  })

  return {
    products: productsCount,
    orders: ordersCount,
    users: usersCount,
    sales: totalSales._sum.total || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statsCards = [
    {
      title: "Total Productos",
      value: stats.products.toString(),
      icon: Package,
      description: "En el catálogo",
    },
    {
      title: "Pedidos",
      value: stats.orders.toString(),
      icon: ShoppingCart,
      description: "Total de órdenes",
    },
    {
      title: "Usuarios",
      value: stats.users.toString(),
      icon: Users,
      description: "Registrados",
    },
    {
      title: "Ventas",
      value: `$${stats.sales.toFixed(2)}`,
      icon: TrendingUp,
      description: "Total",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Resumen General</h2>
        <p className="text-sm text-muted-foreground">
          Vista general de tu e-commerce
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido al Panel Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aquí podrás gestionar productos, pedidos y usuarios de tu tienda.
            Usa la navegación lateral para acceder a cada sección.
          </p>
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Funcionalidades Disponibles:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>✅ Gestión completa de productos (crear, editar, eliminar)</li>
              <li>⏳ Gestión de pedidos (próximamente)</li>
              <li>⏳ Gestión de usuarios (próximamente)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
