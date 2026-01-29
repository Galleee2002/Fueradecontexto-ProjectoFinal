import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/db/products"
import { DataTable } from "@/components/admin/data-table"
import { productsColumns } from "@/components/admin/columns/products-columns"

export default async function ProductsPage() {
  const { products } = await getProducts({ limit: 100 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Productos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      <DataTable columns={productsColumns} data={products} />

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay productos en el catálogo
          </p>
        </div>
      )}
    </div>
  )
}
