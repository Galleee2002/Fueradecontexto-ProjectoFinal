# Plan de Proyecto: Fueradecontexto E-Commerce

## Información General

**Nombre del Proyecto:** Fueradecontexto
**Tipo:** E-commerce de ropa personalizada
**Productos:** Buzos, Gorras, Camperas, Remeras y accesorios
**Moneda:** ARS (Pesos Argentinos)
**Fase Actual:** Backend en Desarrollo - Admin Panel (Products Management Completado)

---

## Stack Tecnológico

### Framework & Lenguaje
- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **React 19**

### Estilos & UI
- **Tailwind CSS v4** (con `@theme inline`)
- **ShadCN/UI** (estilo New York)
- **next-themes** (toggle dark/light mode)
- **Lucide React** (iconos)

### Carruseles & Animaciones
- **Embla Carousel** (hero banner, flash sale)
- **tw-animate-css** (animaciones Tailwind)

### Estado & Persistencia
- **React Context API** (Cart & Wishlist)
- **localStorage** (persistencia client-side)
- **Zustand** (estado global para admin panel)

### Backend & Database
- **Prisma ORM 7.3.0** (ORM)
- **PostgreSQL** (Railway - base de datos)
- **NextAuth.js** (autenticación - pendiente implementar)

### Formularios & Validación
- **react-hook-form** (manejo de formularios)
- **zod** (validación de schemas)
- **@hookform/resolvers** (integración RHF + Zod)

### Admin Panel
- **@tanstack/react-table** (tablas interactivas)

### Utilidades
- **clsx** + **tailwind-merge** (cn utility)
- **class-variance-authority** (variantes de componentes)

---


## Páginas y Funcionalidades

### 1. Home (`/`)
**Secciones:**
- Hero Banner (carousel automático con 3 slides)
- Category Row (6 categorías clicables)
- Flash Sale Section (con countdown timer)
- Today's Picks (con tabs: Más Vendidos, Novedades, Ofertas, Destacados)
- Best Sellers (top 4 productos)
- Quote Banner (frase inspiracional)

**Funcionalidades:**
- Carousel con autoplay
- Filtrado dinámico de productos por tabs
- Links a categorías específicas

---

### 2. Catálogo (`/catalogo`)
**Funcionalidades:**
- **Filtros:**
  - Por categoría (checkboxes)
  - Por rango de precio (inputs min/max)
  - Por talles (toggle group)
  - Por colores (círculos clicables)
- **Ordenamiento:**
  - Relevancia
  - Precio: Menor a Mayor
  - Precio: Mayor a Menor
  - Más Recientes
  - Más Vendidos
- **Paginación:** Load more (12 productos por página)
- **Responsive:** Sidebar en desktop, Sheet en móvil
- **Active Filters:** Chips removibles de filtros activos

**Estado:**
- Todo client-side con `useState`
- Sin persistencia en URL (puede agregarse con searchParams)

---

### 3. Producto (`/producto/[slug]`)
**Funcionalidades:**
- **Galería:** Imagen principal + thumbnails (hasta 3 imágenes)
- **Selección de Variantes:**
  - Talle (con guía de talles en Dialog)
  - Color (círculos con preview)
  - Cantidad (con stock máximo)
- **Agregar al Carrito:**
  - Validación: requiere talle y color
  - Feedback visual (check temporal)
  - Integración con CartContext
- **Tabs:**
  - Descripción
  - Detalles técnicos (tabla)
  - Reseñas (3 reseñas mock)
- **Productos Relacionados:** Scroll horizontal de productos de la misma categoría

---

### 4. Carrito (`/carrito`)
**Funcionalidades:**
- Lista de items con:
  - Imagen, nombre, talle, color
  - Quantity selector
  - Precio unitario y total
  - Botón eliminar
- **Resumen:**
  - Subtotal
  - Cálculo de envío (gratis > $50.000)
  - Input cupón (UI only)
  - Total
  - CTA "Ir al Checkout"
- **Estado Vacío:** Ilustración + CTA explorar catálogo

**Persistencia:** localStorage

---

### 5. Checkout (`/checkout`)
**Flujo de 4 Pasos:**

#### Paso 1: Información de Envío
- Formulario con: nombre, email, teléfono, dirección, ciudad, provincia, CP
- Checkbox "guardar dirección"

#### Paso 2: Método de Envío
- Radio buttons: Estándar ($2.500) vs Express ($5.000)

#### Paso 3: Método de Pago
- Radio buttons:
  - Tarjeta (form con número, vencimiento, CVV, titular)
  - MercadoPago (mock)
  - Transferencia (muestra datos bancarios)

#### Paso 4: Confirmación
- Pantalla de éxito
- Número de pedido mock
- Links a "Ver Pedidos" y "Volver al Inicio"

**Componentes:**
- `CheckoutSteps`: stepper visual con pasos completados
- `OrderSummary`: sidebar sticky con resumen del pedido

---

### 6. Autenticación (`/login`, `/registro`, `/recuperar`)
**Solo UI - Sin lógica real:**
- **Login:** Email/password + botón Google mock
- **Registro:** Nombre, email, password, confirmar password, checkbox términos
- **Recuperar:** Email + enviar enlace mock

**Diseño:** Cards centradas, minimalistas

---

### 7. Mi Cuenta (`/mi-cuenta/*`)
**Layout con Sidebar:**
- Navegación: Perfil, Mis Pedidos, Direcciones, Lista de Deseos, Cerrar Sesión

#### Dashboard (`/mi-cuenta`)
- Stats cards (pedidos, direcciones, favoritos)
- Form editable de perfil (nombre, email, teléfono)

#### Pedidos (`/mi-cuenta/pedidos`)
- Cards de pedidos con:
  - Número de orden (formato: FDC-2026-00142)
  - Fecha
  - Badge de estado (Pendiente, En Proceso, Enviado, Entregado)
  - Total

#### Direcciones (`/mi-cuenta/direcciones`)
- Grid de direcciones guardadas
- Badge "Principal" en dirección default
- Botones editar/eliminar

#### Wishlist (`/mi-cuenta/wishlist`)
- Grid de ProductCards
- Integración con WishlistContext
- Estado vacío con CTA

---

### 8. Panel de Administración (`/admin/*`)

**Estado: Parcialmente Implementado** ✅
**Autenticación:** Temporal (hardcoded "user-test-001", pendiente NextAuth)

**Layout:**
- Sidebar con navegación (Dashboard, Productos, Pedidos, Usuarios)
- Header con título de sección
- Responsive design

---

#### Dashboard (`/admin`)
**Estado: Completado** ✅

- **Stats Cards:**
  - Total de productos (con conteo real de DB)
  - Total de pedidos (con conteo real de DB)
  - Total de usuarios (con conteo real de DB)
  - Total de ventas (suma de orders.total)
- **Info Card:** Bienvenida y lista de funcionalidades disponibles

---

#### Productos (`/admin/productos`)
**Estado: Completado** ✅

**Funcionalidades:**
- **Lista de productos** con tabla interactiva (TanStack Table)
  - Columnas: Imagen, Nombre/Categoría, Precio, Stock, Vendidos, Estados, Acciones
  - Botón "Nuevo Producto"
- **Crear producto** (`/admin/productos/nuevo`)
  - Formulario completo con react-hook-form + zod
  - Campos: nombre, slug, descripción, precio, precio original, descuento
  - Categoría, stock
  - Múltiples imágenes (con orden)
  - Múltiples talles (toggle buttons)
  - Múltiples colores (nombre + hex picker)
  - Tags opcionales
  - Flags: isNew, isFeatured, isFlashSale
  - Validación en tiempo real
  - Manejo de errores
- **Editar producto** (`/admin/productos/[id]/editar`)
  - Mismo formulario precargado con datos
  - Actualización completa de producto
- **Eliminar producto**
  - Botón en tabla con icono
  - Diálogo de confirmación
  - Eliminación de DB con cascade (relaciones)

**API Endpoints Implementados:**
- `POST /api/products` - Crear producto (Admin only)
- `GET /api/products/[slug]?byId=true` - Obtener por ID
- `PUT /api/products/[slug]?byId=true` - Actualizar (Admin only)
- `DELETE /api/products/[slug]?byId=true` - Eliminar (Admin only)

**Validación:**
- Frontend: react-hook-form + zod schema
- Backend: zod validation en API routes
- Mensajes en español

**Componentes:**
- `AdminSidebar` - Navegación lateral
- `DataTable` - Tabla genérica reutilizable
- `ConfirmationDialog` - Diálogo de confirmación
- `ProductForm` - Formulario completo de producto
- `products-columns.tsx` - Definición de columnas

**Database Layer:**
- `src/lib/db/products.ts` - Funciones CRUD:
  - `createProduct(data)` - Crear con relaciones
  - `updateProduct(id, data)` - Actualizar con relaciones
  - `deleteProduct(id)` - Eliminar (cascade)
  - `getProductById(id)` - Obtener por ID
  - `updateProductStock(id, stock)` - Actualizar stock

---

#### Pedidos (`/admin/pedidos`)
**Estado: Placeholder** ⏳

- Pantalla "Próximamente"
- Pendiente implementar:
  - Lista de pedidos con tabla
  - Detalle de pedido
  - Actualización de estado
  - Filtros (status, fecha, búsqueda)

---

#### Usuarios (`/admin/usuarios`)
**Estado: Placeholder** ⏳

- Pantalla "Próximamente"
- Pendiente implementar:
  - Lista de usuarios con tabla
  - Detalle de usuario
  - Activar/desactivar usuarios
  - Cambiar roles
  - Filtros (role, status, búsqueda)

---

## Estado Global

### CartContext
**API:**
```typescript
{
  items: CartItem[]
  addItem: (product, size, color, quantity?) => void
  removeItem: (productId, size, colorName) => void
  updateQuantity: (productId, size, colorName, quantity) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}
```

**Persistencia:** `localStorage` key `fdc-cart`

---

### WishlistContext
**API:**
```typescript
{
  items: string[]  // product IDs
  toggleWishlist: (productId) => void
  isInWishlist: (productId) => boolean
  clearWishlist: () => void
}
```

**Persistencia:** `localStorage` key `fdc-wishlist`

---

### Admin Stores (Zustand)

**Ubicación:** `src/store/admin-store.ts`

#### useProductFilters
```typescript
{
  filters: {
    search: string
    category: string
    status: "all" | "inStock" | "outOfStock" | "featured"
  }
  setSearch: (search: string) => void
  setCategory: (category: string) => void
  setStatus: (status: ...) => void
  resetFilters: () => void
}
```

#### useOrderFilters
```typescript
{
  filters: {
    search: string
    status: "all" | "pending" | "confirmed" | "shipped" | "delivered"
    dateRange: { from: Date | null, to: Date | null }
  }
  setSearch: (search: string) => void
  setStatus: (status: ...) => void
  setDateRange: (from, to) => void
  resetFilters: () => void
}
```

#### useUserFilters
```typescript
{
  filters: {
    search: string
    role: "all" | "customer" | "admin"
    status: "all" | "active" | "inactive"
  }
  setSearch: (search: string) => void
  setRole: (role: ...) => void
  setStatus: (status: ...) => void
  resetFilters: () => void
}
```

**Sin persistencia** - Estado en memoria durante la sesión

---

## Datos del Sistema

### Productos (Base de Datos - PostgreSQL)
**Estado: Producción** ✅

**Fuente de datos:**
- Base de datos PostgreSQL en Railway
- 23 productos seedeados inicialmente
- CRUD completo implementado en admin panel

**Distribución por categoría (inicial):**
- Buzos: 5 productos
- Remeras: 6 productos
- Camperas: 4 productos
- Gorras: 4 productos
- Accesorios: 4 productos

**Características:**
- Precios: $15.000 - $85.000 ARS
- Algunos con descuentos (originalPrice)
- Ratings: 4.3 - 5.0
- Sold counts: 340 - 5200
- Flags: isNew, isFeatured, isFlashSale
- Múltiples talles y colores
- 2-3 imágenes placeholder por producto

**Acceso:**
- Frontend: Server Components usan `getProducts()`, `getProductBySlug()`
- Client Components: API route `GET /api/products`
- Admin: CRUD completo via admin panel

**Modelos Relacionados:**
- `ProductImage` - Múltiples imágenes con orden
- `ProductSize` - Talles disponibles
- `ProductColor` - Colores con nombre y hex
- `ProductTag` - Tags opcionales

### Categorías (5)
```typescript
[
  { slug: "buzos", name: "Buzos", icon: "Shirt", productCount: 8 },
  { slug: "remeras", name: "Remeras", icon: "Shirt", productCount: 10 },
  { slug: "camperas", name: "Camperas", icon: "Jacket", productCount: 5 },
  { slug: "gorras", name: "Gorras", icon: "HardHat", productCount: 6 },
  { slug: "accesorios", name: "Accesorios", icon: "Watch", productCount: 4 }
]
```

### Banners (3)
- "Nueva Colección Invierno 2026" (40% OFF)
- "Buzos Oversize"
- "Envío Gratis" (> $50.000)

---

## Componentes Clave

### ProductCard (3 variantes)
**Default:**
- Aspect square image
- Wishlist button (top-right)
- Badge descuento/NUEVO (top-left)
- Nombre (line-clamp-2)
- Rating + sold count
- Precio con descuento
- Hover: shadow-lg

**Horizontal:** Para flash sale scroll
- Width fijo 192px
- Versión compacta

**Compact:** Para productos relacionados
- Width fijo 160px
- Solo imagen + nombre + precio

---

### FilterSidebar
**Filtros:**
1. Categorías (checkboxes con product count)
2. Rango de precio (2 inputs)
3. Talles (toggle buttons)
4. Colores (círculos con color real)

**Estado:** Controlado por padre (CatalogoPage)

**Responsive:**
- Desktop: sidebar fijo w-64
- Mobile: Sheet desde izquierda

---

### ImageGallery
- Imagen principal con hover zoom
- Thumbnails debajo (máx 4)
- Click thumbnail → cambia imagen principal
- Selected thumbnail → border primary

---

## Utilidades

### formatPrice()
```typescript
formatPrice(45000) // "$45.000"
```
Usa `Intl.NumberFormat("es-AR", { currency: "ARS" })`

### calculateDiscount()
```typescript
calculateDiscount(55000, 45000) // 18
```
Retorna porcentaje entero

### formatSoldCount()
```typescript
formatSoldCount(2340) // "2.3k vendidos"
formatSoldCount(890)  // "890 vendidos"
```

---

## Constantes del Sitio

```typescript
export const SITE_NAME = "Fueradecontexto"
export const SITE_DESCRIPTION = "Ropa personalizada que habla por vos"
export const CURRENCY = "ARS"
export const FREE_SHIPPING_THRESHOLD = 50000
export const FLASH_SALE_END_DATE = new Date("2026-02-15T23:59:59")
export const PRODUCTS_PER_PAGE = 12
```

---

## Responsive Design

### Breakpoints (Tailwind defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

### Estrategia Mobile-First
**Navbar:**
- Mobile: Hamburger → Sheet
- Desktop: Horizontal nav + dropdowns

**Product Grid:**
- Mobile: 2 cols
- Tablet: 3 cols
- Desktop: 4 cols
- XL: 5 cols

**Filter Sidebar:**
- Mobile: Sheet (bottom-up)
- Desktop: Fixed sidebar

**Footer:**
- Mobile: 1 col
- Tablet: 2 cols
- Desktop: 4 cols

---

## Accesibilidad

### Implementado
- ✅ `lang="es"` en html
- ✅ `aria-label` en botones sin texto (theme toggle, wishlist, cart)
- ✅ Keyboard navigation (todos los componentes ShadCN)
- ✅ Focus states con ring-primary
- ✅ Alt text en imágenes
- ✅ Semantic HTML (nav, main, footer, article)
- ✅ ARIA attributes en Radix UI primitives

### Por Implementar (con backend)
- Screen reader announcements para cart updates
- Skip to content link
- ARIA live regions para loading states

---

## Performance

### Optimizaciones Actuales
- ✅ Next.js Image con lazy loading
- ✅ Server Components (default en App Router)
- ✅ Static generation donde es posible
- ✅ CSS-in-JS evitado (Tailwind puro)
- ✅ Iconos tree-shakeable (Lucide)

### Métricas Esperadas (Lighthouse)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 90+

---

## Estado de Implementación Backend

### ✅ Fase 2: Base de Datos (COMPLETADO)
**Tecnologías:**
- Prisma ORM 7.3.0 ✅
- PostgreSQL (Railway) ✅
- Schema diseñado y creado ✅
- Migraciones completadas ✅
- Seed ejecutado ✅ (23 productos creados)

**Estado:**
- ✅ Schema creado con 10 modelos principales
- ✅ Migraciones ejecutadas en Railway
- ✅ Base de datos poblada con productos
- ✅ Campos admin agregados a User (role, isActive, lastLoginAt)
- ✅ Database layer implementada (`src/lib/db/products.ts`)
- ✅ API routes para productos (GET, POST, PUT, DELETE)

**Modelos implementados:**
```prisma
Product, ProductImage, ProductSize, ProductColor, ProductTag
CartItem, Wishlist
User, Address
Order, OrderItem
```

---

### ✅ Fase 2.5: Admin Panel (EN PROGRESO)

#### Phase 1: Foundation ✅
- ✅ Dependencias instaladas (react-hook-form, zod, zustand, @tanstack/react-table)
- ✅ Layout admin con sidebar
- ✅ Dashboard con estadísticas reales
- ✅ Sistema de auth temporal
- ✅ Validaciones con Zod
- ✅ Stores Zustand para filtros

#### Phase 2: Products Management ✅
- ✅ CRUD completo de productos
- ✅ Formulario avanzado con react-hook-form
- ✅ Tabla interactiva con TanStack Table
- ✅ API Routes (POST, PUT, DELETE)
- ✅ Database layer functions
- ✅ Validación frontend y backend

#### Phase 3: Orders Management ⏳
- ⏳ Lista de pedidos con tabla
- ⏳ Detalle de pedido
- ⏳ Actualización de estados
- ⏳ Filtros y búsqueda
- ⏳ API Routes para orders
- ⏳ Database layer para orders

#### Phase 4: Users Management ⏳
- ⏳ Lista de usuarios con tabla
- ⏳ Detalle de usuario
- ⏳ Activar/desactivar usuarios
- ⏳ Cambiar roles
- ⏳ API Routes para users
- ⏳ Database layer para users

**Documentación detallada:** `docs/ADMIN-DASHBOARD.md`

---

### Fase 3: Autenticación (PENDIENTE)
**Prioridad: Alta**

**Tareas:**
- ⏳ Instalar NextAuth.js + @auth/prisma-adapter
- ⏳ Configurar `app/api/auth/[...nextauth]/route.ts`
- ⏳ Providers: Google, Credentials
- ⏳ Session management
- ⏳ Protected routes (`/mi-cuenta/*`, `/admin/*`)
- ⏳ Verificación de role="admin" en rutas admin
- ⏳ **CRÍTICO:** Reemplazar auth temporal en todos los API routes

**Archivos con TODOs de auth temporal:**
- `src/lib/auth.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[slug]/route.ts`
- Futuros API routes de orders y users

---

### Fase 4: API Routes (EN PROGRESO)

**Implementado:**
- ✅ `GET /api/products` - Lista con filtros
- ✅ `POST /api/products` - Crear (Admin)
- ✅ `GET /api/products/[slug]` - Por slug
- ✅ `GET /api/products/[slug]?byId=true` - Por ID
- ✅ `PUT /api/products/[slug]?byId=true` - Actualizar (Admin)
- ✅ `DELETE /api/products/[slug]?byId=true` - Eliminar (Admin)

**Pendiente:**
- ⏳ `/api/cart` - CRUD de carrito (sync con DB)
- ⏳ `/api/wishlist` - CRUD de wishlist (sync con DB)
- ⏳ `/api/orders` - Crear, listar, obtener
- ⏳ `/api/orders/[id]/status` - Actualizar estado
- ⏳ `/api/users` - Listar, obtener, actualizar
- ⏳ `/api/checkout` - Flujo de checkout completo

---

### Fase 5: Sistema de Órdenes (PENDIENTE)
**Prioridad: Media-Alta**

**Tareas:**
- ⏳ Conectar checkout con API real
- ⏳ Crear orden desde carrito
- ⏳ Generar número único (FDC-2026-XXXXX)
- ⏳ Guardar snapshot de productos
- ⏳ Calcular totales (subtotal, envío, impuestos)
- ⏳ Limpiar carrito post-orden
- ⏳ Emails de confirmación (Resend)
- ⏳ Actualizar `/mi-cuenta/pedidos` con órdenes reales

---

### Fase 6: Pagos Reales (PENDIENTE)
**Prioridad: Media**

**Tareas:**
- ⏳ Configurar Mercado Pago
- ⏳ Webhook handling
- ⏳ Order confirmation emails
- ⏳ Manejo de estados de pago

---

### Fase 7: Features Adicionales (FUTURO)
- ⏳ Sistema de reviews
- ⏳ Personalización de productos
- ⏳ Analytics dashboard avanzado
- ⏳ Exportación de datos
- ⏳ Notificaciones push

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## Variables de Entorno

### Actuales (Configuradas)
```env
# Base de datos (Railway PostgreSQL)
DATABASE_URL="postgresql://..." ✅
```

### Pendientes de Configurar
```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..." # Generar con: openssl rand -base64 32

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="..."
MERCADOPAGO_PUBLIC_KEY="..."

# Email (Resend)
RESEND_API_KEY="..."
EMAIL_FROM="noreply@fueradecontexto.com"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---


## Testing (Planeado)

### Unit Tests
- Jest + React Testing Library
- Coverage mínimo: 70%
- Tests de: utils, hooks, components shared

### E2E Tests
- Playwright
- Flujos críticos:
  - Add to cart → checkout
  - Filter products
  - Wishlist toggle

---

## SEO (Implementado)

### Metadata Actual
```typescript
{
  title: "Fueradecontexto | Ropa Personalizada",
  description: "Tienda de ropa personalizada - Buzos, Gorras, Camperas, Remeras y mas"
}
```

### Por Agregar
- Open Graph tags
- Twitter cards
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt
- Canonical URLs

---

## Estructura del Proyecto

### Directorios Clave

```
src/
├── app/
│   ├── (auth)/                 # Grupo de rutas de autenticación
│   ├── admin/                  # Panel de administración ✅
│   │   ├── layout.tsx          # Layout con sidebar
│   │   ├── page.tsx            # Dashboard con stats
│   │   ├── productos/          # Gestión de productos ✅
│   │   │   ├── page.tsx        # Lista de productos
│   │   │   ├── nuevo/          # Crear producto
│   │   │   └── [id]/editar/    # Editar producto
│   │   ├── pedidos/            # Gestión de pedidos ⏳
│   │   └── usuarios/           # Gestión de usuarios ⏳
│   ├── api/
│   │   ├── products/           # API de productos ✅
│   │   │   ├── route.ts        # GET (lista), POST (crear)
│   │   │   └── [slug]/route.ts # GET, PUT, DELETE
│   │   ├── orders/             # API de pedidos ⏳
│   │   └── users/              # API de usuarios ⏳
│   ├── catalogo/               # Página de catálogo
│   ├── carrito/                # Carrito de compras
│   ├── checkout/               # Flujo de checkout
│   ├── mi-cuenta/              # Páginas de cuenta de usuario
│   └── producto/[slug]/        # Página de detalle de producto
├── components/
│   ├── admin/                  # Componentes admin ✅
│   │   ├── admin-sidebar.tsx
│   │   ├── confirmation-dialog.tsx
│   │   ├── data-table.tsx
│   │   ├── product-form.tsx
│   │   └── columns/            # Definiciones de columnas
│   ├── account/                # Componentes de cuenta
│   ├── cart/                   # Componentes de carrito
│   ├── catalog/                # Componentes de catálogo
│   ├── checkout/               # Componentes de checkout
│   ├── home/                   # Componentes de home
│   ├── layout/                 # Layout (nav, footer)
│   ├── product/                # Componentes de producto
│   ├── shared/                 # Componentes compartidos
│   └── ui/                     # ShadCN UI components
├── context/
│   ├── cart-context.tsx        # Context de carrito
│   └── wishlist-context.tsx    # Context de wishlist
├── lib/
│   ├── auth.ts                 # Utilidades de auth ✅
│   ├── prisma.ts               # Cliente de Prisma
│   ├── utils.ts                # Utilidades generales
│   ├── db/                     # Database layer ✅
│   │   ├── products.ts         # Queries de productos
│   │   ├── orders.ts           # Queries de pedidos ⏳
│   │   └── users.ts            # Queries de usuarios ⏳
│   └── validations/
│       └── admin.ts            # Schemas Zod admin ✅
├── store/
│   └── admin-store.ts          # Zustand stores ✅
├── data/                       # Datos mock (legado)
└── types/
    └── index.ts                # Type definitions
```

---

## Convenciones de Desarrollo

### Patrón de Rutas Admin
- **Listados:** Server Component → fetch directo de Prisma
- **Formularios:** Client Component → POST/PUT a API route
- **Eliminaciones:** Client Component → DELETE a API route
- **NO usar modales** para crear/editar (usar páginas dedicadas)

### Validación
- **Frontend:** react-hook-form + zod resolver
- **Backend:** zod parse en API routes
- **Mensajes:** Siempre en español

### Autenticación (Temporal)
```typescript
// TODO: Replace with real auth
const userId = getCurrentUserId() // Returns "user-test-001"
requireAdmin(userId) // Throws if not admin
```
Todos los archivos con auth temporal están marcados con `// TODO`

### Manejo de Errores en API Routes
```typescript
try {
  // ... código
} catch (error: any) {
  // Validation errors (ZodError)
  if (error.name === "ZodError") {
    return NextResponse.json(
      { error: "Validation failed", details: error.errors },
      { status: 400 }
    )
  }

  // Auth errors
  if (error.message?.includes("Unauthorized")) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }

  // Generic errors
  return NextResponse.json(
    { error: "Failed to ..." },
    { status: 500 }
  )
}
```

### Database Layer Pattern
```typescript
// Siempre usar el include estándar
export const productInclude = { ... }

// Transformar Prisma types a frontend types
export function transformProduct(p: PrismaProduct): Product { ... }

// Queries con filtros y paginación
export async function getProducts(filters: Filters): Promise<{ products, total }> { ... }

// Mutations con validación
export async function createProduct(data: CreateData): Promise<Product> { ... }
```

### Estado Global
- **Cart/Wishlist:** Context API (mantener)
- **Admin filters:** Zustand stores (nuevo patrón)
- **Nuevos estados globales:** Usar Zustand

---

## Archivos de Documentación

- 📄 `docs/PLAN.md` - Este archivo (plan general del proyecto)
- 📄 `docs/DATA-MODEL.md` - Modelo de datos detallado
- 📄 `docs/NEXT-STEPS.md` - Próximos pasos y tareas pendientes
- 📄 `docs/ADMIN-DASHBOARD.md` - Documentación detallada del admin panel ✅
- 📄 `CLAUDE.md` - Instrucciones para Claude Code
- 📄 `README.md` - Información general del proyecto

---


