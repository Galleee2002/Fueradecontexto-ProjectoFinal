"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { signInSchema } from "@/lib/validations/auth"

type SignInFormValues = z.infer<typeof signInSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/mi-cuenta"
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInFormValues) {
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (result?.error) {
        setError("Las credenciales no son correctas. Por favor, inténtalo de nuevo.")
        setIsSubmitting(false)
      } else {
        router.push(callbackUrl)
        router.refresh(); // To update the navbar
      }
    } catch (error) {
      console.error("Sign in error", error)
      setError("Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede a tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error de Autenticación</AlertTitle>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/registro" className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}