"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  return (
    <>
      <nav className="flex flex-row overflow-x-auto gap-1 pb-1 md:flex-col md:overflow-visible md:space-y-1 md:pb-0">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin"
            ? pathname === href
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </nav>

      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="¿Cerrar sesión?"
        description="¿Estás seguro de que deseas cerrar tu sesión actual de administrador?"
        confirmText="Cerrar Sesión"
        onConfirm={() => signOut({ callbackUrl: "/auth/login" })}
      />
    </>
  )
}
