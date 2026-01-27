import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockAddresses = [
  {
    id: "1",
    label: "Casa",
    fullName: "Juan Perez",
    street: "Av. Corrientes 1234, Piso 3, Dpto A",
    city: "CABA",
    province: "Buenos Aires",
    postalCode: "1000",
    phone: "11 1234-5678",
    isDefault: true,
  },
  {
    id: "2",
    label: "Trabajo",
    fullName: "Juan Perez",
    street: "Av. Rivadavia 5678, Oficina 12",
    city: "CABA",
    province: "Buenos Aires",
    postalCode: "1002",
    phone: "11 9876-5432",
    isDefault: false,
  },
]

export default function DireccionesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Mis Direcciones</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Direccion
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockAddresses.map((addr) => (
          <div key={addr.id} className="bg-card rounded-lg p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{addr.label}</span>
                {addr.isDefault && <Badge variant="secondary">Principal</Badge>}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>{addr.fullName}</p>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.province} - CP {addr.postalCode}
              </p>
              <p>Tel: {addr.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
