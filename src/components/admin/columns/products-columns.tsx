"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "images",
    header: "Imagen",
    cell: ({ row }) => {
      const images = row.getValue("images") as string[]
      return (
        <div className="relative h-12 w-12">
          <Image
            src={images[0] || "/placeholder.png"}
            alt={row.original.name}
            fill
            className="object-cover rounded"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{row.getValue("name")}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.category}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return <span className="font-medium">${price.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock > 0 ? `${stock} unid.` : "Agotado"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "soldCount",
    header: "Vendidos",
    cell: ({ row }) => {
      return <span>{row.getValue("soldCount")}</span>
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Estado",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex gap-1 flex-wrap">
          {product.isFeatured && (
            <Badge variant="secondary" className="text-xs">
              Destacado
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="outline" className="text-xs">
              Nuevo
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const product = row.original
      return (
        <ProductActions product={product} />
      )
    },
  },
]

function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products/${product.id}?byId=true`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      toast.success(`"${product.name}" eliminado correctamente`)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Error al eliminar el producto. Intentá de nuevo.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/productos/${product.id}/editar`}>
            <Edit className="h-4 w-4" />
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
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="¿Eliminar producto?"
        description={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  )
}
