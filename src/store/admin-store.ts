import { create } from "zustand"

// ============================================
// PRODUCT FILTERS
// ============================================

interface ProductFilters {
  search: string
  category: string
  status: "all" | "inStock" | "outOfStock" | "featured"
}

interface ProductFiltersStore {
  filters: ProductFilters
  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setStatus: (status: ProductFilters["status"]) => void
  resetFilters: () => void
}

const defaultProductFilters: ProductFilters = {
  search: "",
  category: "all",
  status: "all",
}

export const useProductFilters = create<ProductFiltersStore>((set) => ({
  filters: defaultProductFilters,
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  setCategory: (category) =>
    set((state) => ({ filters: { ...state.filters, category } })),
  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
  resetFilters: () => set({ filters: defaultProductFilters }),
}))

// ============================================
// ORDER FILTERS
// ============================================

interface OrderFilters {
  search: string
  status: "all" | "pending" | "confirmed" | "shipped" | "delivered"
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

interface OrderFiltersStore {
  filters: OrderFilters
  setSearch: (search: string) => void
  setStatus: (status: OrderFilters["status"]) => void
  setDateRange: (from: Date | null, to: Date | null) => void
  resetFilters: () => void
}

const defaultOrderFilters: OrderFilters = {
  search: "",
  status: "all",
  dateRange: {
    from: null,
    to: null,
  },
}

export const useOrderFilters = create<OrderFiltersStore>((set) => ({
  filters: defaultOrderFilters,
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
  setDateRange: (from, to) =>
    set((state) => ({
      filters: { ...state.filters, dateRange: { from, to } },
    })),
  resetFilters: () => set({ filters: defaultOrderFilters }),
}))

// ============================================
// USER FILTERS
// ============================================

interface UserFilters {
  search: string
  role: "all" | "customer" | "admin"
  status: "all" | "active" | "inactive"
}

interface UserFiltersStore {
  filters: UserFilters
  setSearch: (search: string) => void
  setRole: (role: UserFilters["role"]) => void
  setStatus: (status: UserFilters["status"]) => void
  resetFilters: () => void
}

const defaultUserFilters: UserFilters = {
  search: "",
  role: "all",
  status: "all",
}

export const useUserFilters = create<UserFiltersStore>((set) => ({
  filters: defaultUserFilters,
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  setRole: (role) =>
    set((state) => ({ filters: { ...state.filters, role } })),
  setStatus: (status) =>
    set((state) => ({ filters: { ...state.filters, status } })),
  resetFilters: () => set({ filters: defaultUserFilters }),
}))
