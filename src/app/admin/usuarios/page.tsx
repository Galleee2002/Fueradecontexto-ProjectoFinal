import { getUsers } from "@/lib/db/users"
import { DataTable } from "@/components/admin/data-table"
import { usersColumns } from "@/components/admin/columns/users-columns"
import { UserFilters } from "@/components/admin/user-filters"

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona los usuarios de la tienda ({total} total)
        </p>
      </div>

      <UserFilters />

      <DataTable columns={usersColumns} data={users} />
    </div>
  )
}
