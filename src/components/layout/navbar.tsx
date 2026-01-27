"use client"

import Link from "next/link"
import { Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/shared/search-bar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { CartIcon } from "@/components/shared/cart-icon"
import { MobileNav } from "@/components/layout/mobile-nav"
import { categories } from "@/data/categories"
import { SITE_NAME } from "@/lib/constants"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Mobile menu */}
        <MobileNav />

        {/* Logo */}
        <Link href="/" className="font-bold text-lg shrink-0">
          {SITE_NAME}
        </Link>

        {/* Desktop categories dropdown */}
        <nav className="hidden md:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Categorias
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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

        {/* Search bar - desktop */}
        <div className="hidden md:block flex-1">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
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
          <Button variant="ghost" size="icon" asChild aria-label="Mi cuenta">
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
