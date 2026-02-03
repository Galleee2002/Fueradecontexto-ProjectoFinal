"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { X, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function VerificationBanner() {
  const { data: session } = useSession()
  const [dismissed, setDismissed] = useState(false)
  const [resending, setResending] = useState(false)

  // Don't show banner if:
  // - User not logged in
  // - Email already verified
  // - User dismissed banner
  // - User is admin (exempt from verification requirement)
  if (
    !session?.user ||
    session.user.emailVerified ||
    dismissed ||
    session.user.role === "admin"
  ) {
    return null
  }

  const handleResend = async () => {
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
    <div className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Mail className="h-4 w-4 text-yellow-800 dark:text-yellow-200 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Tu email no está verificado.{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100 disabled:opacity-50"
            >
              {resending ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Reenviar email de verificación"
              )}
            </button>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 flex-shrink-0"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
