import { CreditCard, Truck, Percent } from "lucide-react"
import { Card } from "@/components/ui/card"

export function InfoBanner() {
  const infoCards = [
    {
      icon: CreditCard,
      title: "Medios de Pago",
      description: "Mercado Pago, Tarjetas y Transferencia",
    },
    {
      icon: Truck,
      title: "Envíos a Todo el País",
      description: "Envío gratis en compras +$50.000",
    },
    {
      icon: Percent,
      title: "10% OFF",
      description: "Pagando por transferencia bancaria",
    },
  ]

  return (
    <section className="bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {infoCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card
                key={index}
                className="flex flex-col items-center p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
