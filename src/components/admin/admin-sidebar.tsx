"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CreditCard,
  LayoutGrid,
  Package,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Productos",
    href: "/admin/productos",
    icon: Package,
  },
  {
    label: "Pagos",
    href: "/admin/pagos",
    icon: CreditCard,
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-fit rounded-xl border border-sidebar-border bg-sidebar p-4 text-sidebar-foreground lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Administracion
          </p>
          <p className="text-lg font-semibold">Panel</p>
        </div>
      </div>
      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-sidebar-border bg-card px-3 py-3 text-sm">
        <p className="text-muted-foreground">Ambiente</p>
        <p className="font-medium">Produccion</p>
      </div>
    </aside>
  )
}
