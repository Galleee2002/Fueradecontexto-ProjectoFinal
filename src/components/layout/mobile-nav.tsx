"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { SearchBar } from "@/components/shared/search-bar"
import { categories } from "@/data/categories"
import { SITE_NAME } from "@/lib/constants"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold uppercase">
            {SITE_NAME}
          </SheetTitle>
        </SheetHeader>

        <div className="my-4">
          <SearchBar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1 pr-4">
            <Link
              href="/"
              onClick={close}
              className="rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              onClick={close}
              className="rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Catalogo
            </Link>
            <Separator className="my-2" />
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Categorias
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?category=${cat.slug}`}
                onClick={close}
                className="rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-1">
          <Link
            href="/mi-cuenta"
            onClick={close}
            className="rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Mi Cuenta
          </Link>
          <Link
            href="/auth/login"
            onClick={close}
            className="rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Iniciar Sesion
          </Link>
        </nav>

        <div className="mt-6">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}

