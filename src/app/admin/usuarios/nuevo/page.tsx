"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserForm } from "@/components/admin/user-form"
import { CreateUserFormData } from "@/lib/validations/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewUserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create user")
      }

      router.push("/admin/usuarios")
      router.refresh()
    } catch (error: any) {
      alert(error.message || "Error al crear el usuario")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Usuario</h1>
        <p className="text-muted-foreground">
          Crea una nueva cuenta de usuario o administrador
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}
