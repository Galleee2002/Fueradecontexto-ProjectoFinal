import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/shared/rating-stars"
import { Separator } from "@/components/ui/separator"
import { Product } from "@/types"

const mockReviews = [
  { name: "Martin L.", rating: 5, comment: "Excelente calidad, el estampado es increible. Muy conforme con la compra.", date: "15 ene 2026" },
  { name: "Camila R.", rating: 4, comment: "Buena tela y terminaciones. El talle es fiel a la guia. Recomiendo.", date: "10 ene 2026" },
  { name: "Lucas P.", rating: 5, comment: "Ya es mi segunda compra, siempre superan las expectativas. El envio fue rapido.", date: "5 ene 2026" },
]

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Descripcion</TabsTrigger>
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="reviews">
          Resenas ({mockReviews.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          {product.description}
        </p>
      </TabsContent>

      <TabsContent value="details" className="mt-6">
        <div className="max-w-md">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium">Material</td>
                <td className="py-3 text-muted-foreground">100% Algodon Premium</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Gramaje</td>
                <td className="py-3 text-muted-foreground">280 gr/m2</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Estampado</td>
                <td className="py-3 text-muted-foreground">DTF Alta Definicion</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">Cuidado</td>
                <td className="py-3 text-muted-foreground">Lavar a maquina a 30°C. No usar secadora.</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Origen</td>
                <td className="py-3 text-muted-foreground">Argentina</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6 max-w-2xl">
          {mockReviews.map((review, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-sm">{review.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {review.date}
                  </span>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
              {i < mockReviews.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
