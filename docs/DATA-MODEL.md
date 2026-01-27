# Modelo de Datos - Fuera de Contexto E-commerce

> Documentación técnica de la estructura de datos del proyecto

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura Actual](#arquitectura-actual)
3. [Entidades Principales](#entidades-principales)
4. [Contextos de Estado](#contextos-de-estado)
5. [Relaciones](#relaciones)
6. [Persistencia](#persistencia)
7. [Validaciones](#validaciones)
8. [Migración a Base de Datos](#migración-a-base-de-datos)
9. [Estado de Implementación](#estado-de-implementación)

---

## Introducción

Este documento describe el modelo de datos completo del e-commerce **Fuera de Contexto**, especializado en ropa personalizada (buzos, gorras, camperas, remeras, accesorios).

**Stack actual:**
- Frontend: Next.js 16 + React 19 + TypeScript
- Estado: React Context API
- Persistencia: Datos estáticos (TS files) + localStorage
- Futura migración: PostgreSQL + Prisma

---

## Arquitectura Actual

### Capas de Datos

```
┌─────────────────────────────────────────┐
│          Componentes React              │
│   (ProductCard, Cart, Checkout, etc)    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│        Context API (Estado Global)       │
│   • CartContext  • WishlistContext      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│          Capa de Persistencia           │
│   • localStorage (cart, wishlist)       │
│   • Archivos estáticos (products)       │
└─────────────────────────────────────────┘
```

### Ubicación de Archivos

```
src/
├── types/
│   └── index.ts                  # Todas las definiciones de tipos
├── data/
│   ├── products.ts              # 33 productos
│   ├── categories.ts            # 5 categorías
│   └── banners.ts               # Banners promocionales
├── context/
│   ├── cart-context.tsx         # Gestión del carrito
│   └── wishlist-context.tsx     # Gestión de favoritos
└── hooks/
    ├── use-cart.ts              # Hook para acceder al carrito
    └── use-wishlist.ts          # Hook para acceder a wishlist
```

---

## Entidades Principales

### 1. Product (Producto)

Representa un producto del catálogo.

```typescript
interface Product {
  id: string                    // Identificador único (ej: "buzo-001")
  slug: string                  // URL-friendly para rutas dinámicas
  name: string                  // Nombre del producto
  description: string           // Descripción detallada (multi-línea)

  // Pricing
  price: number                 // Precio actual en pesos argentinos
  originalPrice?: number        // Precio original (antes de descuento)
  discount?: number             // Porcentaje de descuento (0-100)

  // Media
  images: string[]              // Array de URLs de imágenes (mínimo 1)

  // Categorización
  category: CategorySlug        // Categoría del producto
  tags: string[]                // Etiquetas/keywords para búsqueda

  // Variantes
  sizes: Size[]                 // Tallas disponibles
  colors: ProductColor[]        // Colores disponibles

  // Métricas
  rating: number                // Calificación promedio (0-5)
  reviewCount: number           // Cantidad de reseñas
  soldCount: number             // Productos vendidos (histórico)
  stock: number                 // Stock disponible actual

  // Flags
  isNew?: boolean               // Badge "Nuevo"
  isFeatured?: boolean          // Destacado en homepage
  isFlashSale?: boolean         // En oferta flash
}
```

**Ejemplo real:**
```json
{
  "id": "buzo-001",
  "slug": "buzo-oversize-negro-estampado",
  "name": "Buzo Oversize Negro Estampado",
  "description": "Buzo oversize de algodon premium con estampado DTF de alta definicion...",
  "price": 45000,
  "originalPrice": 55000,
  "discount": 18,
  "images": [
    "https://placehold.co/600x600/111111/E91E8C?text=Buzo+Negro+1",
    "https://placehold.co/600x600/111111/FFFFFF?text=Buzo+Negro+2"
  ],
  "category": "buzos",
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "colors": [
    { "name": "Negro", "hex": "#000000" },
    { "name": "Gris Oscuro", "hex": "#333333" }
  ],
  "rating": 4.8,
  "reviewCount": 124,
  "soldCount": 2340,
  "isFeatured": true,
  "isFlashSale": true,
  "stock": 45,
  "tags": ["oversize", "estampado", "urbano"]
}
```

**Reglas de validación:**
- `price` > 0
- `discount` entre 0 y 100
- `rating` entre 0 y 5
- `stock` >= 0
- Si `isFlashSale === true`, debe tener `discount` y `originalPrice`
- `images.length` >= 1
- `sizes.length` >= 1
- `colors.length` >= 1

**Datos actuales:**
- **Total:** 33 productos
- **Rango de precios:** $9,000 - $82,000
- **Stock promedio:** 20-150 unidades
- **Distribución:**
  - Buzos: 5 productos
  - Remeras: 6 productos
  - Camperas: 4 productos
  - Gorras: 4 productos
  - Accesorios: 4 productos

---

### 2. Category (Categoría)

Agrupa productos por tipo.

```typescript
interface Category {
  slug: CategorySlug            // Identificador único
  name: string                  // Nombre display
  icon: string                  // Nombre del ícono (Lucide React)
  description: string           // Descripción corta
  productCount: number          // Cantidad de productos (calculado)
}

type CategorySlug =
  | "buzos"
  | "gorras"
  | "camperas"
  | "remeras"
  | "accesorios"
```

**Categorías existentes:**

| Slug | Nombre | Productos | Descripción |
|------|--------|-----------|-------------|
| `buzos` | Buzos | 8 | Buzos y hoodies personalizados |
| `remeras` | Remeras | 10 | Remeras de algodón premium |
| `camperas` | Camperas | 5 | Camperas y abrigos personalizados |
| `gorras` | Gorras | 6 | Gorras trucker y snapback bordadas |
| `accesorios` | Accesorios | 4 | Accesorios y complementos |

---

### 3. ProductColor (Color de Producto)

Define los colores disponibles de un producto.

```typescript
interface ProductColor {
  name: string                  // Nombre descriptivo del color
  hex: string                   // Código hexadecimal
}
```

**Ejemplos:**
```typescript
{ name: "Negro", hex: "#000000" }
{ name: "Gris Oscuro", hex: "#333333" }
{ name: "Violeta Tie Dye", hex: "#7B2D8E" }
{ name: "Beige", hex: "#C9B99A" }
```

**Colores más usados:**
- Negro (#000000) - 80% de productos
- Blanco (#FFFFFF) - 40% de productos
- Gris (#808080 y variantes) - 35% de productos

---

### 4. Size (Talla)

Tallas estándar disponibles.

```typescript
type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Unico"
```

**Uso:**
- **XS-XXL:** Buzos, remeras, camperas
- **Unico:** Gorras, accesorios (talle único)
- **S-L:** Medias, algunos accesorios

**Distribución más común:**
- Buzos/Remeras: `["S", "M", "L", "XL", "XXL"]`
- Camperas: `["S", "M", "L", "XL"]`
- Gorras: `["Unico"]`

---

### 5. CartItem (Item del Carrito)

Representa un producto agregado al carrito con variantes seleccionadas.

```typescript
interface CartItem {
  product: Product              // Producto completo (embedded)
  quantity: number              // Cantidad seleccionada (>= 1)
  selectedSize: Size            // Talla elegida
  selectedColor: ProductColor   // Color elegido
}
```

**Clave única:**
```typescript
const uniqueKey = `${product.id}-${selectedSize}-${selectedColor.name}`
// Ejemplo: "buzo-001-L-Negro"
```

**¿Por qué esta clave?**
- El mismo producto con diferentes tallas/colores son items **separados**
- Usuario puede tener "Buzo Negro L" y "Buzo Negro XL" simultáneamente
- Facilita actualización de cantidad y eliminación

**Ejemplo:**
```json
{
  "product": {
    "id": "buzo-001",
    "name": "Buzo Oversize Negro Estampado",
    "price": 45000,
    // ... resto de campos
  },
  "quantity": 2,
  "selectedSize": "L",
  "selectedColor": {
    "name": "Negro",
    "hex": "#000000"
  }
}
```

**Validaciones:**
- `quantity` >= 1
- `quantity` <= `product.stock`
- `selectedSize` ∈ `product.sizes`
- `selectedColor` ∈ `product.colors`

---

### 6. WishlistItem (Favorito)

Producto guardado en lista de deseos.

```typescript
interface WishlistItem {
  productId: string             // ID del producto
  addedAt: Date                 // Fecha de agregado
}
```

**Implementación actual:**
- Solo se guardan los IDs: `string[]`
- No se guardan variantes (size/color)
- Persistencia en localStorage

**Ejemplo:**
```json
["buzo-001", "remera-003", "gorra-001"]
```

---

### 7. Address (Dirección) - NO IMPLEMENTADO

Dirección de envío del usuario.

```typescript
interface Address {
  id: string                    // UUID
  label: string                 // "Casa", "Trabajo", "Casa de mamá"
  fullName: string              // Nombre completo del receptor
  street: string                // Calle y número
  city: string                  // Ciudad/Localidad
  province: string              // Provincia
  postalCode: string            // Código postal
  phone: string                 // Teléfono de contacto
  isDefault: boolean            // Dirección predeterminada
}
```

**Estado:** Tipo definido pero sin implementación en UI/backend

---

### 8. OrderSummary (Resumen de Orden) - NO IMPLEMENTADO

Orden de compra del usuario.

```typescript
interface OrderSummary {
  id: string                    // UUID de la orden
  date: string                  // Fecha de creación
  status: OrderStatus           // Estado actual
  items: CartItem[]             // Items comprados
  total: number                 // Total pagado
}

type OrderStatus =
  | "pending"                   // Pendiente de pago
  | "processing"                // En preparación
  | "shipped"                   // Enviada
  | "delivered"                 // Entregada
```

**Estado:** Tipo definido pero sin implementación en UI/backend

---

### 9. FilterState (Estado de Filtros)

Estado de los filtros en el catálogo.

```typescript
interface FilterState {
  categories: CategorySlug[]    // Categorías seleccionadas
  priceRange: [number, number]  // [min, max] en pesos
  sizes: Size[]                 // Tallas seleccionadas
  colors: string[]              // Nombres de colores
  sortBy: SortOption            // Criterio de ordenamiento
}

type SortOption =
  | "relevance"                 // Por relevancia (default)
  | "price-asc"                 // Precio: menor a mayor
  | "price-desc"                // Precio: mayor a menor
  | "newest"                    // Más nuevos primero (isNew)
  | "best-selling"              // Más vendidos (soldCount)
```

**Implementación:** Estado local en componente de catálogo

---

### 10. Banner (Banner Promocional)

Banners para homepage y secciones.

```typescript
interface Banner {
  id: string                    // Identificador único
  title: string                 // Título principal
  subtitle: string              // Subtítulo/descripción
  ctaText: string               // Texto del botón (Call to Action)
  ctaLink: string               // URL del botón
  image: string                 // URL de imagen de fondo
  backgroundColor: string       // Color de fondo (hex)
}
```

**Ubicación:** `src/data/banners.ts`

---

## Contextos de Estado

### CartContext

**Ubicación:** `src/context/cart-context.tsx`

**Responsabilidad:** Gestión global del carrito de compras

**Estado:**
```typescript
interface CartContextType {
  items: CartItem[]             // Items en el carrito
  totalItems: number            // Cantidad total (suma de quantities)
  subtotal: number              // Suma total en pesos

  // Métodos
  addItem: (product, size, color, quantity?) => void
  removeItem: (productId, size, colorName) => void
  updateQuantity: (productId, size, colorName, quantity) => void
  clearCart: () => void
}
```

**Funcionalidades:**

1. **addItem(product, size, color, quantity = 1)**
   - Si el item existe (misma combinación producto-size-color): incrementa cantidad
   - Si no existe: crea nuevo item
   - Actualiza localStorage automáticamente

2. **removeItem(productId, size, colorName)**
   - Elimina item específico del carrito
   - Usa la clave única para identificar

3. **updateQuantity(productId, size, colorName, quantity)**
   - Actualiza cantidad de un item
   - Valida que `quantity >= 1`

4. **clearCart()**
   - Vacía completamente el carrito

**Cálculos automáticos:**
```typescript
totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
```

**Persistencia:**
- **Clave:** `fdc-cart`
- **Formato:** JSON string de `CartItem[]`
- **Sincronización:** Automática en cada cambio de `items`
- **Carga inicial:** En mount del provider

**Hook de uso:**
```typescript
import { useCart } from '@/hooks/use-cart'

function MyComponent() {
  const { items, addItem, totalItems, subtotal } = useCart()
  // ...
}
```

---

### WishlistContext

**Ubicación:** `src/context/wishlist-context.tsx`

**Responsabilidad:** Gestión de lista de favoritos

**Estado:**
```typescript
interface WishlistContextType {
  items: string[]               // Array de product IDs

  // Métodos
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}
```

**Funcionalidades:**

1. **toggleWishlist(productId)**
   - Si está en favoritos: lo remueve
   - Si no está: lo agrega
   - Toggle simple

2. **isInWishlist(productId)**
   - Retorna `true/false`
   - Usado para el ícono de corazón

3. **clearWishlist()**
   - Vacía toda la wishlist

**Persistencia:**
- **Clave:** `fdc-wishlist`
- **Formato:** JSON string de `string[]`
- **Sincronización:** Automática en cada cambio

**Hook de uso:**
```typescript
import { useWishlist } from '@/hooks/use-wishlist'

function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist()

  return (
    <button onClick={() => toggleWishlist(product.id)}>
      {isInWishlist(product.id) ? '❤️' : '🤍'}
    </button>
  )
}
```

---

## Relaciones

### Diagrama de Entidades

```
┌──────────────┐
│   Category   │
│              │
│ - slug       │
│ - name       │
└──────┬───────┘
       │
       │ 1:N
       │
┌──────▼───────┐         ┌──────────────┐
│   Product    │ 1:N     │  CartItem    │
│              ├────────▶│              │
│ - id         │         │ - product    │
│ - name       │         │ - quantity   │
│ - price      │         │ - size       │
│ - category   │         │ - color      │
└──────┬───────┘         └──────────────┘
       │
       │ 1:N
       │
┌──────▼───────┐
│ WishlistItem │
│              │
│ - productId  │
└──────────────┘

┌──────────────┐
│ ProductColor │───┐
│              │   │
│ - name       │   │ N:1
│ - hex        │   │
└──────────────┘   │
                   │
              ┌────▼─────┐
              │ Product  │
              └────┬─────┘
                   │
┌──────────────┐   │ N:1
│     Size     │───┘
│              │
│ (type union) │
└──────────────┘
```

### Relaciones Detalladas

1. **Product → Category (N:1)**
   - Cada producto pertenece a UNA categoría
   - Una categoría contiene MUCHOS productos
   - Clave foránea: `product.category`

2. **Product → ProductColor (1:N)**
   - Cada producto tiene MÚLTIPLES colores
   - Relación embedded (no tabla separada actualmente)
   - Array: `product.colors[]`

3. **Product → Size (1:N)**
   - Cada producto tiene MÚLTIPLES tallas
   - Relación embedded
   - Array: `product.sizes[]`

4. **Product → CartItem (1:N)**
   - Un producto puede estar en MÚLTIPLES items del carrito
   - Diferenciados por combinación size-color
   - Relación: `cartItem.product`

5. **Product → WishlistItem (1:N)**
   - Un producto puede estar en MÚLTIPLES wishlists
   - Actualmente solo guarda IDs (relación simple)

---

## Persistencia

### Datos Estáticos (Development)

**Productos:** `src/data/products.ts`
```typescript
export const products: Product[] = [
  { id: "buzo-001", name: "...", /* ... */ },
  { id: "buzo-002", name: "...", /* ... */ },
  // ... 33 productos
]
```

**Pros:**
- ✅ Simple para desarrollo
- ✅ No requiere servidor/BD
- ✅ Type-safe con TypeScript
- ✅ Performance inmediata (sin queries)

**Contras:**
- ❌ Datos estáticos, no dinámicos
- ❌ Requiere rebuild para actualizar
- ❌ No escalable para producción
- ❌ No permite admin panel

---

### localStorage (Client-side)

**Carrito:** `fdc-cart`
```typescript
// Estructura guardada
{
  items: [
    {
      product: { /* Product completo */ },
      quantity: 2,
      selectedSize: "L",
      selectedColor: { name: "Negro", hex: "#000000" }
    },
    // ...
  ]
}
```

**Wishlist:** `fdc-wishlist`
```typescript
["buzo-001", "remera-003", "gorra-001"]
```

**Pros:**
- ✅ Persistencia entre sesiones
- ✅ No requiere autenticación
- ✅ Performance instant
- ✅ Funciona offline

**Contras:**
- ❌ Solo accesible desde el mismo navegador/dispositivo
- ❌ Se pierde si se limpia el caché
- ❌ No sincroniza entre dispositivos
- ❌ Límite de 5-10MB

---

### Migración Futura: Base de Datos

Para producción se recomienda migrar a **PostgreSQL + Prisma ORM**.

Ver sección [Migración a Base de Datos](#migración-a-base-de-datos) para detalles.

---

## Validaciones

### Validaciones de Producto

```typescript
// Precio
price > 0 && Number.isFinite(price)

// Descuento
discount >= 0 && discount <= 100

// Rating
rating >= 0 && rating <= 5

// Stock
stock >= 0 && Number.isInteger(stock)

// Flash Sale
if (isFlashSale) {
  originalPrice !== undefined
  discount !== undefined
  discount > 0
}

// Arrays
images.length >= 1
sizes.length >= 1
colors.length >= 1

// Slug
slug.match(/^[a-z0-9-]+$/)  // Solo minúsculas, números y guiones
```

### Validaciones de Cart

```typescript
// Quantity
quantity >= 1 && Number.isInteger(quantity)
quantity <= product.stock

// Variantes
product.sizes.includes(selectedSize)
product.colors.find(c => c.name === selectedColor.name) !== undefined

// Clave única
const key = `${product.id}-${selectedSize}-${selectedColor.name}`
// No debe haber duplicados con la misma clave
```

### Validaciones de Address (futuro)

```typescript
// Campos requeridos
fullName.trim().length > 0
street.trim().length > 0
city.trim().length > 0
province.trim().length > 0
postalCode.match(/^\d{4}$/)  // 4 dígitos
phone.match(/^\+?[\d\s-]{10,15}$/)  // Teléfono válido
```

---

## Migración a Base de Datos

### Esquema Prisma Propuesto

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// PRODUCTOS
// ============================================

model Product {
  id            String   @id @default(uuid())
  slug          String   @unique
  name          String
  description   String   @db.Text

  price         Float
  originalPrice Float?
  discount      Int?     @db.SmallInt

  category      String
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  soldCount     Int      @default(0)
  stock         Int

  isNew         Boolean  @default(false)
  isFeatured    Boolean  @default(false)
  isFlashSale   Boolean  @default(false)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relaciones
  images        ProductImage[]
  sizes         ProductSize[]
  colors        ProductColor[]
  tags          ProductTag[]
  cartItems     CartItem[]
  wishlistItems Wishlist[]

  @@index([category])
  @@index([slug])
  @@index([isFlashSale, isFeatured])
}

model ProductImage {
  id        String  @id @default(uuid())
  url       String
  order     Int     @default(0)
  productId String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductSize {
  id        String  @id @default(uuid())
  size      String  // "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Unico"
  productId String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductColor {
  id        String  @id @default(uuid())
  name      String
  hex       String
  productId String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}

model ProductTag {
  id        String  @id @default(uuid())
  tag       String
  productId String

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@index([tag])
}

// ============================================
// CARRITO
// ============================================

model CartItem {
  id            String   @id @default(uuid())

  // Usuario (null para no logueados)
  userId        String?
  sessionId     String?  // Para usuarios no logueados

  // Producto
  productId     String
  quantity      Int

  // Variantes seleccionadas
  selectedSize  String
  selectedColor Json     // { name: string, hex: string }

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  // Un usuario no puede tener el mismo item duplicado
  @@unique([userId, productId, selectedSize, selectedColor])
  @@index([userId])
  @@index([sessionId])
  @@index([productId])
}

// ============================================
// WISHLIST
// ============================================

model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  productId String
  addedAt   DateTime @default(now())

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
}

// ============================================
// USUARIOS (futuro)
// ============================================

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String    // Hash bcrypt
  firstName     String
  lastName      String
  phone         String?
  avatar        String?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  orders        Order[]

  @@index([email])
}

model Address {
  id         String  @id @default(uuid())
  userId     String
  label      String
  fullName   String
  street     String
  city       String
  province   String
  postalCode String
  phone      String
  isDefault  Boolean @default(false)

  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// ============================================
// ÓRDENES (futuro)
// ============================================

model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  userId          String

  status          String      // "pending" | "confirmed" | "shipped" | "delivered"
  paymentStatus   String      // "pending" | "paid" | "failed"

  subtotal        Float
  discount        Float       @default(0)
  shippingCost    Float
  tax             Float       @default(0)
  total           Float

  shippingAddress Json        // Address snapshot
  billingAddress  Json        // Address snapshot

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]

  @@index([userId])
  @@index([orderNumber])
  @@index([status])
}

model OrderItem {
  id              String  @id @default(uuid())
  orderId         String
  productId       String

  // Snapshot del producto al momento de compra
  productSnapshot Json    // { name, price, image }

  quantity        Int
  unitPrice       Float
  subtotal        Float

  selectedSize    String
  selectedColor   Json

  order           Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}
```

### Comandos de Migración

```bash
# 1. Instalar dependencias
npm install prisma @prisma/client

# 2. Inicializar Prisma
npx prisma init

# 3. Configurar DATABASE_URL en .env
DATABASE_URL="postgresql://user:password@localhost:5432/fueradecontexto"

# 4. Crear migración inicial
npx prisma migrate dev --name init

# 5. Seed de datos
npx prisma db seed

# 6. Generar cliente
npx prisma generate
```

### Script de Seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { products } from '../src/data/products'

const prisma = new PrismaClient()

async function main() {
  // Migrar productos existentes
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        category: product.category,
        rating: product.rating,
        reviewCount: product.reviewCount,
        soldCount: product.soldCount,
        stock: product.stock,
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        isFlashSale: product.isFlashSale || false,

        images: {
          create: product.images.map((url, index) => ({
            url,
            order: index
          }))
        },

        sizes: {
          create: product.sizes.map(size => ({
            size
          }))
        },

        colors: {
          create: product.colors.map(color => ({
            name: color.name,
            hex: color.hex
          }))
        },

        tags: {
          create: product.tags.map(tag => ({
            tag
          }))
        }
      }
    })
  }

  console.log('✅ Seed completado')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Estado de Implementación

| Entidad | Tipo | Implementación | Persistencia | API | Estado |
|---------|------|----------------|--------------|-----|--------|
| **Product** | ✅ | ✅ Completo | Estático (.ts) | ❌ | Funcional |
| **Category** | ✅ | ✅ Completo | Estático (.ts) | ❌ | Funcional |
| **ProductColor** | ✅ | ✅ Embebido | Estático | ❌ | Funcional |
| **Size** | ✅ | ✅ Type union | Estático | ❌ | Funcional |
| **CartItem** | ✅ | ✅ Completo | localStorage | ❌ | Funcional |
| **WishlistItem** | ✅ | ✅ Simplificado | localStorage | ❌ | Funcional |
| **FilterState** | ✅ | ✅ Local state | Memoria | ❌ | Funcional |
| **Banner** | ✅ | ✅ Completo | Estático (.ts) | ❌ | Funcional |
| **Address** | ✅ | ❌ Pendiente | - | ❌ | No implementado |
| **OrderSummary** | ✅ | ❌ Pendiente | - | ❌ | No implementado |
| **User** | ❌ | ❌ Pendiente | - | ❌ | No implementado |
| **Order** | ❌ | ❌ Pendiente | - | ❌ | No implementado |
| **Payment** | ❌ | ❌ Pendiente | - | ❌ | No implementado |
| **Review** | ❌ | ❌ Pendiente | - | ❌ | No implementado |

**Leyenda:**
- ✅ = Implementado
- ❌ = No implementado
- **Tipo** = Definición TypeScript
- **Implementación** = Lógica/componentes
- **Persistencia** = Dónde se guarda
- **API** = Endpoints REST/GraphQL

---

## Próximos Pasos

### Fase 1: Base de Datos (Prioridad Alta)
1. Configurar PostgreSQL + Prisma
2. Crear schema completo
3. Migrar productos a BD
4. Crear API routes para productos
5. Actualizar componentes para usar APIs

### Fase 2: Autenticación y Usuarios (Prioridad Alta)
1. Implementar NextAuth.js
2. Crear modelo User
3. Páginas de registro/login
4. Migrar carrito/wishlist a usuarios logueados
5. Gestión de direcciones

### Fase 3: Órdenes y Checkout (Prioridad Alta)
1. Implementar modelo Order/OrderItem
2. Flujo de checkout completo
3. Gestión de stock
4. Historial de órdenes

### Fase 4: Pagos (Prioridad Alta)
1. Integración con Mercado Pago
2. Webhooks de notificación
3. Páginas de éxito/error

### Fase 5: Personalización (Prioridad Alta - Requisito clave)
1. Sistema de upload de diseños
2. Editor de texto personalizado
3. Preview de productos
4. Pricing de personalizaciones

### Fase 6: Reviews y Extras (Prioridad Media)
1. Sistema de reseñas
2. Notificaciones
3. Cupones de descuento
4. Admin panel

---

## Notas Finales

- Este modelo está diseñado para **escalar** de desarrollo (estático) a producción (BD)
- La estructura actual es **suficiente para MVP** pero requiere migración para producción
- **Prioridad:** Implementar autenticación, órdenes y personalización primero
- Mantener **type-safety** con TypeScript en toda la aplicación
- Documentar cambios significativos en este archivo

---

**Última actualización:** 2026-01-27
**Versión:** 1.0 - Estado actual del proyecto
