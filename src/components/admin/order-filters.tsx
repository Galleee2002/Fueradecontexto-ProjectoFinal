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
import { useOrderFilters } from "@/store/admin-store"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, setSearch, setStatus, resetFilters } = useOrderFilters()

  // Sync URL → Zustand on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    const urlStatus = (searchParams.get("status") || "all") as any

    if (urlSearch !== filters.search) setSearch(urlSearch)
    if (urlStatus !== filters.status) setStatus(urlStatus)
  }, [])

  // Sync Zustand → URL on filter change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status)
    }

    router.push(`/admin/pedidos?${params.toString()}`)
  }, [filters.search, filters.status, router])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por número o cliente..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={filters.status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
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
