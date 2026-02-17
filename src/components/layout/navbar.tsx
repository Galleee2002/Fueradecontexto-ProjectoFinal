"use client"

import Link from "next/link"
import { Heart, User, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchBar } from "@/components/shared/search-bar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { CartIcon } from "@/components/shared/cart-icon"
import { MobileNav } from "@/components/layout/mobile-nav"
import { categories } from "@/data/categories"
import { SITE_NAME } from "@/lib/constants"

function UserNav() {
  const { data: session } = useSession()

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Mi cuenta">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || ""} />
              <AvatarFallback>
                {session.user?.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/mi-cuenta">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Cuenta</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/mi-cuenta/pedidos">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Mis Pedidos</span>
            </Link>
          </DropdownMenuItem>
          {session.user.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button variant="ghost" size="icon" asChild aria-label="Iniciar sesión">
      <Link href="/auth/login">
        <User className="h-5 w-5" />
      </Link>
    </Button>
  )
}


export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-3 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="shrink-0 font-heading text-lg font-bold uppercase">
            {SITE_NAME}
          </Link>
        </div>

        {/* Centered Search Bar (Desktop) */}
        <div className="absolute left-1/2 top-1/2 hidden w-1/3 min-w-[300px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 md:block">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Categorias
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link href={`/catalogo?category=${cat.slug}`}>
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/catalogo" className="font-medium">
                    Ver Todo
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex"
            aria-label="Lista de deseos"
          >
            <Link href="/mi-cuenta/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <CartIcon />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
