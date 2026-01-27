# Modelo de Datos - Fuera de Contexto E-commerce

## Estado Actual del Proyecto

### ✅ Entidades Implementadas

#### 1. Product (Producto)
```typescript
{
  id: string                    // Identificador único
  slug: string                  // URL amigable
  name: string                  // Nombre del producto
  description: string           // Descripción detallada
  price: number                 // Precio actual
  originalPrice?: number        // Precio original (para descuentos)
  discount?: number             // Porcentaje de descuento
  images: string[]              // Array de URLs de imágenes
  category: CategorySlug        // Categoría del producto
  sizes: Size[]                 // Tallas disponibles
  colors: ProductColor[]        // Colores disponibles
  rating: number                // Calificación promedio (0-5)
  reviewCount: number           // Cantidad de reseñas
  soldCount: number             // Cantidad vendida
  isNew?: boolean               // Producto nuevo
  isFeatured?: boolean          // Producto destacado
  isFlashSale?: boolean         // En oferta flash
  stock: number                 // Stock disponible
  tags: string[]                // Etiquetas/palabras clave
}
```

#### 2. Category (Categoría)
```typescript
{
  slug: CategorySlug            // buzos | gorras | camperas | remeras | accesorios
  name: string                  // Nombre de la categoría
  icon: string                  // Ícono de la categoría
  description: string           // Descripción
  productCount: number          // Cantidad de productos
}
```

#### 3. CartItem (Item del Carrito)
```typescript
{
  product: Product              // Producto completo
  quantity: number              // Cantidad seleccionada
  selectedSize: Size            // Talla seleccionada
  selectedColor: ProductColor   // Color seleccionado
}
```
**Clave única**: `productId-size-colorName`
**Storage**: localStorage con clave `fdc-cart`

#### 4. WishlistItem (Item de Favoritos)
```typescript
{
  productId: string             // ID del producto
  addedAt: Date                 // Fecha de agregado
}
```
**Storage**: localStorage con clave `fdc-wishlist` (actualmente solo array de IDs)

#### 5. Address (Dirección)
```typescript
{
  id: string
  label: string                 // "Casa", "Trabajo", etc.
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  phone: string
  isDefault: boolean
}
```
**Estado**: Tipo definido, NO implementado

#### 6. OrderSummary (Resumen de Orden)
```typescript
{
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered"
  items: CartItem[]
  total: number
}
```
**Estado**: Tipo definido, NO implementado

---

## 🚀 Modelo de Datos Extendido (Propuesto)

### A. Sistema de Usuarios y Autenticación

#### User (Usuario)
```typescript
{
  id: string
  email: string
  password: string              // Hash bcrypt
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date

  // Relaciones
  addresses: Address[]
  orders: Order[]
  reviews: Review[]
  wishlist: string[]            // Product IDs

  // Preferencias
  preferences: {
    newsletter: boolean
    notifications: boolean
    language: string
  }
}
```

#### Session (Sesión)
```typescript
{
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}
```

---

### B. Sistema de Órdenes Completo

#### Order (Orden)
```typescript
{
  id: string
  orderNumber: string           // Ej: "FDC-2024-001234"
  userId: string

  // Items
  items: OrderItem[]

  // Información de facturación
  billingAddress: Address
  shippingAddress: Address

  // Pricing
  subtotal: number              // Suma de items
  discount: number              // Descuentos aplicados
  shippingCost: number          // Costo de envío
  tax: number                   // Impuestos
  total: number                 // Total final

  // Cupones/descuentos
  couponCode?: string
  couponDiscount?: number

  // Estado
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingStatus: ShippingStatus

  // Tracking
  trackingNumber?: string
  estimatedDelivery?: Date
  deliveredAt?: Date

  // Metadata
  notes?: string
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancelReason?: string
}

type OrderStatus =
  | "pending"           // Pendiente de pago
  | "confirmed"         // Confirmada
  | "processing"        // En preparación
  | "shipped"           // Enviada
  | "delivered"         // Entregada
  | "cancelled"         // Cancelada
  | "refunded"          // Reembolsada

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"

type ShippingStatus =
  | "pending"
  | "processing"
  | "in_transit"
  | "delivered"
  | "returned"
```

#### OrderItem
```typescript
{
  id: string
  orderId: string
  productId: string
  productSnapshot: {            // Snapshot del producto al momento de la compra
    name: string
    image: string
    price: number
  }
  size: Size
  color: ProductColor
  quantity: number
  unitPrice: number             // Precio unitario al momento de compra
  subtotal: number              // quantity * unitPrice
}
```

---

### C. Sistema de Pagos

#### Payment (Pago)
```typescript
{
  id: string
  orderId: string

  // Información de pago
  method: PaymentMethod
  amount: number
  currency: string              // "ARS", "USD"

  // Estado
  status: PaymentStatus

  // Gateway de pago (Mercado Pago, Stripe, etc.)
  provider: string              // "mercadopago", "stripe", "bank_transfer"
  transactionId?: string        // ID de transacción del proveedor

  // Detalles
  cardLast4?: string
  cardBrand?: string            // "visa", "mastercard"

  // Metadata
  metadata?: Record<string, any>
  failureReason?: string

  createdAt: Date
  paidAt?: Date
}

type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "mercadopago"
  | "cash_on_delivery"
```

---

### D. Sistema de Reseñas y Calificaciones

#### Review (Reseña)
```typescript
{
  id: string
  productId: string
  userId: string
  orderId?: string              // Reseña verificada si viene de una compra

  // Contenido
  rating: number                // 1-5 estrellas
  title: string
  comment: string
  images?: string[]             // Fotos del usuario

  // Verificación
  isVerifiedPurchase: boolean

  // Moderación
  status: "pending" | "approved" | "rejected"
  moderatedBy?: string
  moderatedAt?: Date

  // Engagement
  helpfulCount: number          // Votos "útil"

  createdAt: Date
  updatedAt: Date
}
```

#### ReviewVote (Voto de utilidad)
```typescript
{
  id: string
  reviewId: string
  userId: string
  isHelpful: boolean
  createdAt: Date
}
```

---

### E. Sistema de Descuentos y Cupones

#### Coupon (Cupón)
```typescript
{
  id: string
  code: string                  // "VERANO2024"

  // Tipo de descuento
  type: "percentage" | "fixed_amount"
  value: number                 // 20 (%) o 5000 (pesos)

  // Restricciones
  minPurchaseAmount?: number    // Compra mínima
  maxDiscountAmount?: number    // Descuento máximo
  usageLimit?: number           // Cantidad de usos totales
  usagePerUser?: number         // Usos por usuario

  // Validez
  validFrom: Date
  validUntil: Date

  // Aplicabilidad
  applicableCategories?: CategorySlug[]
  applicableProducts?: string[]  // Product IDs

  // Estado
  isActive: boolean
  timesUsed: number

  createdAt: Date
  updatedAt: Date
}
```

#### CouponUsage (Uso de cupón)
```typescript
{
  id: string
  couponId: string
  userId: string
  orderId: string
  discountAmount: number
  createdAt: Date
}
```

---

### F. Sistema de Envíos

#### ShippingMethod (Método de envío)
```typescript
{
  id: string
  name: string                  // "Envío estándar", "Envío express"
  description: string

  // Pricing
  baseCost: number
  freeShippingThreshold?: number // Envío gratis sobre $X

  // Tiempos
  estimatedDays: {
    min: number
    max: number
  }

  // Disponibilidad
  availableProvinces?: string[]

  isActive: boolean
}
```

#### Shipment (Envío)
```typescript
{
  id: string
  orderId: string

  // Método
  shippingMethodId: string
  carrier?: string              // "Correo Argentino", "Andreani"

  // Tracking
  trackingNumber?: string
  trackingUrl?: string

  // Estado
  status: ShippingStatus

  // Timeline
  shippedAt?: Date
  estimatedDelivery?: Date
  deliveredAt?: Date

  // Detalles
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }

  createdAt: Date
  updatedAt: Date
}
```

---

### G. Sistema de Notificaciones

#### Notification (Notificación)
```typescript
{
  id: string
  userId: string

  // Contenido
  type: NotificationType
  title: string
  message: string
  actionUrl?: string

  // Estado
  isRead: boolean
  readAt?: Date

  // Metadata
  metadata?: Record<string, any>

  createdAt: Date
}

type NotificationType =
  | "order_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "payment_received"
  | "price_drop"
  | "back_in_stock"
  | "review_reminder"
  | "coupon_expiring"
```

---

### H. Sistema de Stock e Inventario

#### Inventory (Inventario)
```typescript
{
  id: string
  productId: string
  size: Size
  color: ProductColor

  // Stock
  quantity: number
  reserved: number              // En carritos/órdenes pendientes
  available: number             // quantity - reserved

  // Límites
  lowStockThreshold: number     // Alerta de stock bajo

  // Ubicación (para múltiples almacenes)
  warehouse?: string

  updatedAt: Date
}
```

#### StockMovement (Movimiento de stock)
```typescript
{
  id: string
  inventoryId: string

  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string                // "sale", "return", "restock", "damaged"

  // Referencias
  orderId?: string
  userId?: string

  notes?: string
  createdAt: Date
}
```

---

### I. Sistema de Personalización

#### CustomDesign (Diseño personalizado)
```typescript
{
  id: string
  userId: string
  productId: string

  // Diseño
  designType: "upload" | "text" | "template"

  // Archivos
  uploadedFile?: string         // URL del archivo subido

  // Texto personalizado
  customText?: {
    text: string
    font: string
    color: string
    position: "front" | "back" | "sleeve"
  }

  // Preview
  previewImage?: string

  // Estado
  status: "draft" | "pending_review" | "approved" | "rejected"
  reviewNotes?: string

  // Pricing
  additionalCost: number        // Costo adicional por personalización

  createdAt: Date
  updatedAt: Date
}
```

---

### J. Analytics y Métricas

#### ProductView (Vista de producto)
```typescript
{
  id: string
  productId: string
  userId?: string               // null si no está logueado
  sessionId: string

  // Metadata
  source?: string               // "search", "category", "recommendation"
  referrer?: string

  createdAt: Date
}
```

#### CartAbandonment (Carrito abandonado)
```typescript
{
  id: string
  userId?: string
  sessionId: string

  items: CartItem[]
  totalValue: number

  // Recovery
  emailSent: boolean
  emailSentAt?: Date
  recovered: boolean
  recoveredAt?: Date

  createdAt: Date
}
```

---

## 📊 Relaciones del Modelo

```
User (1) ──── (N) Order
User (1) ──── (N) Review
User (1) ──── (N) Address
User (1) ──── (N) Notification

Order (1) ──── (N) OrderItem
Order (1) ──── (1) Payment
Order (1) ──── (1) Shipment
Order (N) ──── (1) User
Order (N) ──── (1) Coupon

Product (1) ──── (N) Review
Product (1) ──── (N) Inventory
Product (1) ──── (N) OrderItem

Review (N) ──── (1) Product
Review (N) ──── (1) User

Inventory (N) ──── (1) Product
Inventory (1) ──── (N) StockMovement
```

---

## 💾 Estrategia de Persistencia

### Datos Estáticos (Actual)
- **Productos**: `src/data/products.ts`
- **Categorías**: `src/data/categories.ts`

### localStorage (Actual)
- **Carrito**: `fdc-cart`
- **Wishlist**: `fdc-wishlist`

### Base de Datos (Recomendado para producción)

**Opción 1: PostgreSQL + Prisma**
- Relacional, robusto, escalable
- ORM con type-safety
- Migraciones automáticas

**Opción 2: MongoDB + Mongoose**
- NoSQL, flexible
- Bueno para datos no estructurados
- Escalabilidad horizontal

**Opción 3: Supabase**
- PostgreSQL + Auth + Storage
- Backend as a Service
- APIs automáticas

**Opción 4: Firebase/Firestore**
- NoSQL en tiempo real
- Auth integrada
- Hosting incluido

---

## 🔑 Índices Recomendados

```typescript
// Products
Index: slug (unique)
Index: category
Index: [category, price]
Index: [isFeatured, isFlashSale]

// Users
Index: email (unique)
Index: createdAt

// Orders
Index: userId
Index: orderNumber (unique)
Index: [userId, status]
Index: createdAt

// Reviews
Index: productId
Index: [productId, status]
Index: userId
```

---

## 🔒 Consideraciones de Seguridad

1. **Passwords**: Hasheadas con bcrypt (min 10 rounds)
2. **Sessions**: JWT con expiración
3. **Payment data**: NUNCA almacenar CVV
4. **PII**: Encriptar datos sensibles
5. **API**: Rate limiting en endpoints públicos
6. **Validación**: Sanitizar inputs del usuario

---

## 📈 Escalabilidad

### Caché
- Redis para sesiones
- Cache de productos frecuentes
- Cache de queries pesadas

### CDN
- Imágenes de productos
- Assets estáticos

### Búsqueda
- Elasticsearch/Algolia para búsqueda de productos
- Filtros avanzados
- Búsqueda semántica
