"use client"

import { useState } from "react"
import { CreditCard, Wallet, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const methods = [
  { id: "card", label: "Tarjeta de Credito/Debito", icon: CreditCard },
  { id: "mercadopago", label: "MercadoPago", icon: Wallet },
  { id: "transfer", label: "Transferencia Bancaria", icon: Building },
] as const

type MethodId = (typeof methods)[number]["id"]

interface PaymentMethodProps {
  onNext: () => void
  onBack: () => void
}

export function PaymentMethod({ onNext, onBack }: PaymentMethodProps) {
  const [selected, setSelected] = useState<MethodId>("card")

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Metodo de Pago</h2>

      <div className="space-y-3">
        {methods.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-colors text-left",
              selected === id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="font-medium text-sm">{label}</span>
          </button>
        ))}
      </div>

      {selected === "card" && (
        <div className="space-y-3 mt-4 p-4 rounded-lg bg-secondary">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Numero de Tarjeta
            </label>
            <Input placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Vencimiento
              </label>
              <Input placeholder="MM/AA" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">CVV</label>
              <Input placeholder="123" type="password" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Titular de la Tarjeta
            </label>
            <Input placeholder="JUAN PEREZ" />
          </div>
        </div>
      )}

      {selected === "mercadopago" && (
        <div className="mt-4 p-4 rounded-lg bg-secondary text-sm text-muted-foreground">
          Seras redirigido a MercadoPago para completar el pago de forma
          segura.
        </div>
      )}

      {selected === "transfer" && (
        <div className="mt-4 p-4 rounded-lg bg-secondary text-sm space-y-2">
          <p className="font-medium">Datos bancarios:</p>
          <p className="text-muted-foreground">
            Banco: Banco Nacion Argentina
            <br />
            CBU: 0110012345678901234567
            <br />
            Alias: FUERADECONTEXTO.TIENDA
            <br />
            Titular: Fueradecontexto SRL
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onNext}>Confirmar Pago</Button>
      </div>
    </div>
  )
}
