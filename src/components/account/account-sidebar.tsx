"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, MapPin, Heart, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/mi-cuenta", label: "Perfil", icon: User },
  { href: "/mi-cuenta/pedidos", label: "Mis Pedidos", icon: Package },
  { href: "/mi-cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/mi-cuenta/wishlist", label: "Lista de Deseos", icon: Heart },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            pathname === href
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full">
        <LogOut className="h-4 w-4" />
        Cerrar Sesion
      </button>
    </nav>
  )
}
