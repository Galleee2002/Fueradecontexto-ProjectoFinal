import { Package, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const stats = [
  { label: "Pedidos", value: "3", icon: Package },
  { label: "Direcciones", value: "2", icon: MapPin },
  { label: "Favoritos", value: "5", icon: Heart },
]

export default function MiCuentaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-1">Hola, Juan</h2>
        <p className="text-sm text-muted-foreground">
          Desde tu cuenta podes ver tus pedidos, gestionar tus direcciones y
          actualizar tu informacion personal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-card rounded-lg p-4 text-center"
          >
            <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Informacion Personal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="text-sm font-medium mb-1 block">Nombre</label>
            <Input defaultValue="Juan Perez" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input defaultValue="juan@email.com" type="email" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Telefono</label>
            <Input defaultValue="11 1234-5678" type="tel" />
          </div>
        </div>
        <Button className="mt-4">Guardar Cambios</Button>
      </div>
    </div>
  )
}
