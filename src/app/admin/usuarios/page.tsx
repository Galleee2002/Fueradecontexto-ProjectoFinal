import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona los usuarios de la tienda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Próximamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La gestión de usuarios estará disponible próximamente. Aquí podrás
            ver y gestionar todos los usuarios registrados, sus roles y
            permisos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
