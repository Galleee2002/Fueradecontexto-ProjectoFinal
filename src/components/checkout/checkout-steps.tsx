import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = ["Informacion", "Envio", "Pago", "Confirmacion"]

interface CheckoutStepsProps {
  currentStep: number
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                i < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === currentStep
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              )}
            >
              {i < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "text-sm hidden sm:block",
                i <= currentStep
                  ? "font-medium"
                  : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-12 h-0.5 mx-2",
                i < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
