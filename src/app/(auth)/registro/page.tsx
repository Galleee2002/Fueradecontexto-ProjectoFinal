import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { SITE_NAME } from "@/lib/constants"

export default function RegistroPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{SITE_NAME}</h1>
          <p className="text-muted-foreground mt-1">Crea tu cuenta</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Nombre</label>
            <Input placeholder="Juan Perez" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Contrasena</label>
            <Input type="password" placeholder="Min. 8 caracteres" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Confirmar Contrasena
            </label>
            <Input type="password" placeholder="Repetir contrasena" />
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <Checkbox className="mt-0.5" />
            <span className="text-sm text-muted-foreground">
              Acepto los{" "}
              <Link href="#" className="text-primary hover:underline">
                terminos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="#" className="text-primary hover:underline">
                politica de privacidad
              </Link>
            </span>
          </label>
          <Button className="w-full" size="lg">
            Crear Cuenta
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Ya tenes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  )
}
