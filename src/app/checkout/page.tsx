"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentMethod } from "@/components/checkout/payment-method"
import { OrderSummary } from "@/components/checkout/order-summary"

export default function CheckoutPage() {
  const [step, setStep] = useState(0)

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Pedido Confirmado</h1>
        <p className="text-muted-foreground mb-2">
          Gracias por tu compra en Fueradecontexto
        </p>
        <div className="bg-card rounded-lg p-6 my-6 inline-block">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Package className="h-4 w-4" />
            Numero de pedido
          </div>
          <p className="text-2xl font-bold font-mono">FDC-2026-00142</p>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Vas a recibir un email con los detalles de tu pedido y el seguimiento
          del envio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/mi-cuenta/pedidos">Ver Mis Pedidos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 0 && <ShippingForm onNext={() => setStep(1)} />}
          {step === 1 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Metodo de Envio</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer">
                  <input type="radio" name="shipping" defaultChecked className="accent-primary" />
                  <div>
                    <p className="font-medium text-sm">Envio Estandar</p>
                    <p className="text-xs text-muted-foreground">5-7 dias habiles</p>
                  </div>
                  <span className="ml-auto font-medium text-sm">$2.500</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-muted-foreground/30 cursor-pointer">
                  <input type="radio" name="shipping" className="accent-primary" />
                  <div>
                    <p className="font-medium text-sm">Envio Express</p>
                    <p className="text-xs text-muted-foreground">1-3 dias habiles</p>
                  </div>
                  <span className="ml-auto font-medium text-sm">$5.000</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Volver
                </Button>
                <Button onClick={() => setStep(2)}>Continuar</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <PaymentMethod
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
