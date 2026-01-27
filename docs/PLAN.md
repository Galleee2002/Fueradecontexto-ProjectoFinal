# Plan de Proyecto: Fueradecontexto E-Commerce

## Información General

**Nombre del Proyecto:** Fueradecontexto
**Tipo:** E-commerce de ropa personalizada
**Productos:** Buzos, Gorras, Camperas, Remeras y accesorios
**Moneda:** ARS (Pesos Argentinos)
**Fase Actual:** Frontend UI (Sin backend)

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

## Datos Mock

### Productos (25 total)
**Distribución por categoría:**
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

## Próximos Pasos (Backend)

### Fase 2: Base de Datos
**Tecnologías Planeadas:**
- Prisma ORM
- PostgreSQL
- Schema diseñado:
  ```prisma
  model Product { ... }
  model User { ... }
  model Order { ... }
  model CartItem { ... }
  ```

### Fase 3: Autenticación
- NextAuth.js
- Providers: Google, Credentials
- Session management
- Protected routes

### Fase 4: API Routes
- `/api/products` (CRUD)
- `/api/cart` (sync con DB)
- `/api/orders` (create, list, get)
- `/api/checkout` (integración pagos)

### Fase 5: Pagos Reales
- MercadoPago integration
- Webhook handling
- Order confirmation emails

### Fase 6: Admin Panel
- Product management
- Order management
- Analytics dashboard

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

## Variables de Entorno (Futuras)

```env
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="..."
MERCADOPAGO_PUBLIC_KEY="..."

# Email
RESEND_API_KEY="..."
EMAIL_FROM="noreply@fueradecontexto.com"

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


