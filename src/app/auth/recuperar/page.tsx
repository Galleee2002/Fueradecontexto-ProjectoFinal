import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SITE_NAME } from "@/lib/constants"

export default function RecuperarPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{SITE_NAME}</h1>
          <p className="text-muted-foreground mt-1">Recuperar contrasena</p>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Ingresa tu email y te enviaremos un enlace para restablecer tu
          contrasena.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" placeholder="tu@email.com" />
          </div>
          <Button className="w-full" size="lg">
            Enviar Enlace de Recuperacion
          </Button>
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Iniciar Sesion
        </Link>
      </div>
    </div>
  )
}
