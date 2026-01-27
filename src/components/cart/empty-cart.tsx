import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyCart() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center">
      <ShoppingBag className="h-24 w-24 text-muted-foreground/20 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Tu carrito esta vacio</h2>
      <p className="text-muted-foreground mb-6">
        Descubri nuestros productos y arma tu look unico
      </p>
      <Button asChild size="lg">
        <Link href="/catalogo">Explorar Catalogo</Link>
      </Button>
    </div>
  )
}
