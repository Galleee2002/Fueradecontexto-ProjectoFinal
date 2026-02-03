"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

type VerifyStatus = "loading" | "success" | "error"

export default function VerifyPage() {
  const [status, setStatus] = useState<VerifyStatus>("loading")
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setError("Token no encontrado en la URL")
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          toast.success("Email verificado exitosamente")

          // Auto-redirect after 5 seconds
          setTimeout(() => {
            router.push("/auth/login")
          }, 5000)
        } else {
          setStatus("error")
          setError(data.error || "Error al verificar el email")
        }
      } catch (err) {
        setStatus("error")
        setError("Error de conexión. Intenta nuevamente.")
        console.error("Verification error:", err)
      }
    }

    verifyToken()
  }, [token, router])

  const handleResendEmail = async () => {
    if (!token) return

    setResending(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        toast.success("Email de verificación reenviado")
      } else {
        const data = await response.json()
        toast.error(data.error || "Error al reenviar email")
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
            {status === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>

          <CardTitle>
            {status === "loading" && "Verificando tu email..."}
            {status === "success" && "¡Email verificado!"}
            {status === "error" && "Error de verificación"}
          </CardTitle>

          <CardDescription>
            {status === "loading" &&
              "Estamos verificando tu dirección de email. Esto solo tomará un momento."}
            {status === "success" &&
              "Tu cuenta ha sido verificada exitosamente. Serás redirigido al inicio de sesión en 5 segundos..."}
            {status === "error" && error}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {status === "success" && (
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Ir al inicio de sesión
            </Button>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full"
                variant="default"
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar email de verificación
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.push("/auth/login")}
                variant="outline"
                className="w-full"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
