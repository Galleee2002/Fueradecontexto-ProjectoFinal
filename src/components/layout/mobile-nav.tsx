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
import { categories } from "@/data/categories"
import { SITE_NAME } from "@/lib/constants"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold">
            {SITE_NAME}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          <Link
            href="/"
            onClick={close}
            className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            onClick={close}
            className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Catalogo
          </Link>
          <Separator className="my-2" />
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categorias
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogo?category=${cat.slug}`}
              onClick={close}
              className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Separator className="my-2" />
          <Link
            href="/login"
            onClick={close}
            className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/mi-cuenta"
            onClick={close}
            className="px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Mi Cuenta
          </Link>
        </nav>
        <div className="mt-6 px-3">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}
