import { getCurrentSession } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentSession()

  // Backup check (middleware already handles this)
  if (!session || session.user.role !== "admin") {
    redirect("/auth/login?error=admin-required")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <div className="text-sm text-muted-foreground">
          {session.user.email}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-56 shrink-0">
          <AdminSidebar />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
