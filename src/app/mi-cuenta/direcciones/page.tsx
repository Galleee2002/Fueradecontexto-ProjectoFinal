import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DireccionesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Mis Direcciones</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dirección
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <MapPin className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-base">No tienes direcciones guardadas</p>
        <p className="text-sm mt-1">Agrega una dirección para agilizar tus próximas compras.</p>
      </div>
    </div>
  )
}
