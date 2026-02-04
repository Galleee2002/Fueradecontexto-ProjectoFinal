"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { passwordResetRequestSchema, PasswordResetRequestData } from "@/lib/validations/auth"

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<PasswordResetRequestData>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: PasswordResetRequestData) {
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar solicitud")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Error al enviar solicitud")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh] py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Revisa tu email</CardTitle>
            <CardDescription>
              Si el email está registrado, recibirás instrucciones para
              restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos instrucciones para restablecer tu
            contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar instrucciones"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
