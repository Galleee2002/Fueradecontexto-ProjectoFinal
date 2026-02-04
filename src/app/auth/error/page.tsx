"use client"

import { useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Terminal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React, { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: { [key: string]: { title: string; description: string } } = {
    CredentialsSignin: {
      title: "Error de Credenciales",
      description:
        "El correo electrónico o la contraseña no son válidos. Por favor, inténtalo de nuevo.",
    },
    default: {
      title: "Error de Autenticación",
      description:
        "Ha ocurrido un error inesperado. Por favor, vuelve a intentarlo.",
    },
  }

  const { title, description } =
    error && errorMessages[error]
      ? errorMessages[error]
      : errorMessages.default

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            {title}
          </CardTitle>
          <CardDescription>
            Hubo un problema al intentar iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Alert variant="destructive" className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Detalles del Error</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/auth/login">Volver a Intentar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <AuthErrorContent />
        </Suspense>
    )
}
