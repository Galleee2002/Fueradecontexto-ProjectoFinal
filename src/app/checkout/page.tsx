"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import type {
  ShippingAddressData,
  ShippingMethodData,
} from "@/lib/validations/checkout"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [shippingData, setShippingData] = useState<ShippingAddressData | null>(
    null
  )
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodData>({
    method: "standard",
    cost: 2500,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const { items, clearCart } = useCart()
  const router = useRouter()

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push("/carrito")
    }
  }, [items.length, isProcessing, router])

  const handleShippingNext = (data: ShippingAddressData) => {
    // Remove saveAddress as it's not used in API
    const { saveAddress, ...addressData } = data
    setShippingData(addressData)
    setStep(1)
  }

  const handleShippingMethodNext = () => {
    setStep(2)
  }

  const handlePayment = async () => {
    if (!shippingData) {
      toast.error("Falta información de envío")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: shippingData,
          shippingMethod,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la orden")
      }

      // Clear cart before redirecting
      clearCart()

      // Redirect to Mercado Pago
      window.location.href = data.checkoutUrl
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast.error(error.message || "Error al procesar el pago. Por favor, intentá nuevamente")
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Shipping Address */}
          {step === 0 && <ShippingForm onNext={handleShippingNext} />}

          {/* Step 1: Shipping Method */}
          {step === 1 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-semibold mb-4">Método de Envío</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    shippingMethod.method === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod.method === "standard"}
                    onChange={() =>
                      setShippingMethod({ method: "standard", cost: 2500 })
                    }
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-medium text-sm">Envío Estándar</p>
                    <p className="text-xs text-muted-foreground">
                      5-7 días hábiles
                    </p>
                  </div>
                  <span className="ml-auto font-medium text-sm">$2.500</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    shippingMethod.method === "express"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod.method === "express"}
                    onChange={() =>
                      setShippingMethod({ method: "express", cost: 5000 })
                    }
                    className="accent-primary"
                  />
                  <div>
                    <p className="font-medium text-sm">Envío Express</p>
                    <p className="text-xs text-muted-foreground">
                      1-3 días hábiles
                    </p>
                  </div>
                  <span className="ml-auto font-medium text-sm">$5.000</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Volver
                </Button>
                <Button onClick={handleShippingMethodNext}>Continuar</Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Confirmation */}
          {step === 2 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-semibold mb-4">
                Confirmar y Pagar
              </h2>

              {/* Shipping Summary */}
              {shippingData && (
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium text-sm mb-2">Dirección de envío</h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingData.fullName}
                    <br />
                    {shippingData.street}
                    <br />
                    {shippingData.city}, {shippingData.province}
                    <br />
                    CP: {shippingData.postalCode}
                  </p>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-medium text-sm mb-2">Método de pago</h3>
                <p className="text-sm text-muted-foreground">
                  Serás redirigido a Mercado Pago para completar el pago de
                  forma segura.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                >
                  Volver
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isProcessing ? "Procesando..." : "Confirmar y Pagar"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <OrderSummary shippingCost={shippingMethod.cost} />
        </div>
      </div>
    </div>
  )
}
