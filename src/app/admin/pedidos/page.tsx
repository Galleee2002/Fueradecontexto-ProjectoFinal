import { getOrders } from "@/lib/db/orders"
import { DataTable } from "@/components/admin/data-table"
import { ordersColumns } from "@/components/admin/columns/orders-columns"
import { OrderFilters } from "@/components/admin/order-filters"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  // Parse search params to filters
  const filters = {
    search: (params.search as string) || "",
    status: params.status as any,
    startDate: params.startDate as string,
    endDate: params.endDate as string,
    page: Number(params.page) || 1,
    limit: 20,
  }

  const { orders, total } = await getOrders(filters)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona los pedidos de la tienda ({total} total)
        </p>
      </div>

      <OrderFilters />

      <DataTable columns={ordersColumns} data={orders} />
    </div>
  )
}
