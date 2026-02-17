"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Product } from "@/types"
import { DataTable } from "@/components/admin/data-table"
import { productsColumns } from "@/components/admin/columns/products-columns"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"

interface ProductsDataTableProps {
  data: Product[]
}

export function ProductsDataTable({ data }: ProductsDataTableProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingSelected, setPendingSelected] = useState<Product[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const handleBulkDeleteClick = (selected: Product[]) => {
    setPendingSelected(selected)
    setShowDeleteDialog(true)
  }

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true)
    try {
      const ids = pendingSelected.map((p) => p.id)
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete products")
      }

      const count = pendingSelected.length
      toast.success(
        count === 1
          ? `"${pendingSelected[0].name}" eliminado correctamente`
          : `${count} productos eliminados correctamente`
      )
      router.refresh()
    } catch (error) {
      console.error("Error deleting products:", error)
      toast.error("Error al eliminar los productos. Intentá de nuevo.")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <DataTable
        columns={productsColumns}
        data={data}
        getRowId={(row) => row.id}
        renderBulkActions={(selected) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkDeleteClick(selected)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar{" "}
            {selected.length === 1
              ? "1 producto"
              : `${selected.length} productos`}
          </Button>
        )}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`¿Eliminar ${pendingSelected.length === 1 ? "este producto" : `estos ${pendingSelected.length} productos`}?`}
        description={
          pendingSelected.length === 1
            ? `¿Estás seguro de que deseas eliminar "${pendingSelected[0]?.name}"? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que deseas eliminar ${pendingSelected.length} productos? Esta acción no se puede deshacer.`
        }
        confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
        onConfirm={handleConfirmBulkDelete}
        variant="destructive"
      />
    </>
  )
}
