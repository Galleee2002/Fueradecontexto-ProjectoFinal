import { getUsers } from "@/lib/db/users"
import { DataTable } from "@/components/admin/data-table"
import { usersColumns } from "@/components/admin/columns/users-columns"
import { UserFilters } from "@/components/admin/user-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  // Parse search params to filters
  const filters = {
    search: (params.search as string) || "",
    role: params.role as any,
    isActive:
      params.isActive === "true"
        ? true
        : params.isActive === "false"
        ? false
        : undefined,
    page: Number(params.page) || 1,
    limit: 20,
  }

  const { users, total } = await getUsers(filters)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios de la tienda ({total} total)
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/usuarios/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <UserFilters />

      <DataTable columns={usersColumns} data={users} />
    </div>
  )
}
