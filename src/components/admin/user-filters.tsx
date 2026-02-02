"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserFilters } from "@/store/admin-store"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function UserFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, setSearch, setRole, setStatus, resetFilters } =
    useUserFilters()

  // Sync URL → Zustand on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    const urlRole = (searchParams.get("role") || "all") as any
    const urlStatus = searchParams.get("isActive")

    if (urlSearch !== filters.search) setSearch(urlSearch)
    if (urlRole !== filters.role) setRole(urlRole)
    if (urlStatus && urlStatus !== filters.status) {
      setStatus(urlStatus === "true" ? "active" : "inactive")
    }
  }, [])

  // Sync Zustand → URL on filter change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.role && filters.role !== "all") params.set("role", filters.role)
    if (filters.status && filters.status !== "all") {
      params.set("isActive", filters.status === "active" ? "true" : "false")
    }

    router.push(`/admin/usuarios?${params.toString()}`)
  }, [filters.search, filters.role, filters.status, router])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={filters.role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="customer">Clientes</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
