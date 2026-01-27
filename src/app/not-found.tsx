import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Pagina no encontrada</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        La pagina que buscas no existe o fue movida. Proba volviendo al inicio o
        explorando nuestro catalogo.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/catalogo">Ver Catalogo</Link>
        </Button>
      </div>
    </div>
  )
}
