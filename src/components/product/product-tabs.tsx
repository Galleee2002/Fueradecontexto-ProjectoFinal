import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product } from "@/types"

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">Descripcion</TabsTrigger>
        <TabsTrigger value="details">Detalles</TabsTrigger>
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
    </Tabs>
  )
}
