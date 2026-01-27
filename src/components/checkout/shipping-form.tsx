"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const provinces = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Cordoba",
  "Corrientes",
  "Entre Rios",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquen",
  "Rio Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucuman",
]

interface ShippingFormProps {
  onNext: () => void
}

export function ShippingForm({ onNext }: ShippingFormProps) {
  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Datos de Envio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Nombre Completo
          </label>
          <Input placeholder="Juan Perez" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input type="email" placeholder="juan@email.com" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Telefono</label>
          <Input type="tel" placeholder="11 1234-5678" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">Direccion</label>
          <Input placeholder="Av. Corrientes 1234, Piso 3, Dpto A" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Ciudad</label>
          <Input placeholder="Buenos Aires" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Provincia</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Codigo Postal
          </label>
          <Input placeholder="1000" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox />
        <span className="text-sm">Guardar direccion para proximas compras</span>
      </label>
      <Button onClick={onNext} className="w-full sm:w-auto" size="lg">
        Continuar
      </Button>
    </div>
  )
}
