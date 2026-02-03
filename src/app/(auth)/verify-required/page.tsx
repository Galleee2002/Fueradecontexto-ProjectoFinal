"use client"

import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Mail, Loader2, ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

export default function VerifyRequiredPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [resending, setResending] = useState(false)
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleResend = async () => {
    if (!session?.user?.email) return

    setResending(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Email de verificación enviado", {
          description: "Revisa tu bandeja de entrada.",
        })
      } else {
        toast.error(data.error || "Error al enviar email")
      }
    } catch (err) {
      toast.error("Error de conexión")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle>Verificación de email requerida</CardTitle>
          <CardDescription>
            Debes verificar tu email para acceder al checkout y completar tu
            compra.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {session?.user?.email && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Email registrado:
              </p>
              <p className="font-medium">{session.user.email}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={resending}
              className="w-full"
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Reenviar email de verificación
                </>
              )}
            </Button>

            <Button
              onClick={() => router.push(callbackUrl)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            ¿No recibiste el email? Revisa tu carpeta de spam o reenvía el
            email de verificación.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
