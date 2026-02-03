# Configuración de Base de Datos - PostgreSQL + Prisma

## 📋 Requisitos Previos

- Docker Desktop instalado en Windows
- Node.js 20+ instalado
- Git Bash o PowerShell

---

## 🚀 Inicio Rápido

### 1. Levantar PostgreSQL con Docker

Abre una terminal (PowerShell o Git Bash) en el directorio del proyecto y ejecuta:

```bash
# Levantar contenedores de PostgreSQL y pgAdmin
docker compose up -d

# Verificar que los contenedores estén corriendo
docker compose ps
```

**Servicios disponibles:**
- PostgreSQL: `localhost:5432`
- pgAdmin (UI): `http://localhost:5050`

**Credenciales PostgreSQL:**
- Database: `fueradecontexto`
- User: `fdc_user`
- Password: `fdc_password`

**Credenciales pgAdmin:**
- Email: `admin@fueradecontexto.com`
- Password: `admin`

---

### 2. Ejecutar Migraciones de Prisma

```bash
# Crear las tablas en la base de datos
npm run db:migrate

# Cuando te pida un nombre, usa: init
```

Este comando creará todas las tablas definidas en `prisma/schema.prisma`:
- Product, ProductImage, ProductSize, ProductColor, ProductTag
- CartItem, Wishlist
- User, Address
- Order, OrderItem

---

### 3. Poblar la Base de Datos (Seed)

```bash
# Migrar los 33 productos existentes a la base de datos
npm run db:seed
```

Esto insertará:
- ✅ 33 productos del catálogo
- ✅ Todas sus imágenes, tallas, colores y tags
- ✅ Datos organizados por categoría

---

### 4. Explorar la Base de Datos

#### Opción A: Prisma Studio (Recomendado)

```bash
npm run db:studio
```

Se abrirá una interfaz web en `http://localhost:5555` donde puedes:
- Ver y editar datos
- Crear nuevos registros
- Ejecutar queries visuales

#### Opción B: pgAdmin

1. Accede a `http://localhost:5050`
2. Login con `admin@fueradecontexto.com` / `admin`
3. Add New Server:
   - Name: `Fueradecontexto`
   - Host: `postgres` (nombre del contenedor)
   - Port: `5432`
   - Database: `fueradecontexto`
   - Username: `fdc_user`
   - Password: `fdc_password`

---

## 🛠️ Comandos Útiles

### Database

```bash
# Crear migración nueva
npm run db:migrate

# Ver datos en Prisma Studio
npm run db:studio

# Resetear BD y ejecutar seed
npm run db:reset

# Generar cliente de Prisma
npx prisma generate
```

### Docker

```bash
# Ver logs
docker compose logs -f postgres

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: borra todos los datos)
docker compose down -v

# Reiniciar servicios
docker compose restart
```

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

**Productos:**
- `Product` - Productos del catálogo
- `ProductImage` - Imágenes de productos (relación 1:N)
- `ProductSize` - Tallas disponibles
- `ProductColor` - Colores disponibles
- `ProductTag` - Tags/keywords

**Carrito y Favoritos:**
- `CartItem` - Items en el carrito
- `Wishlist` - Lista de deseos

**Usuarios (futuro):**
- `User` - Usuarios registrados
- `Address` - Direcciones de envío

**Órdenes (futuro):**
- `Order` - Órdenes de compra
- `OrderItem` - Items de cada orden

---

## 🔄 Usar Prisma en Next.js

### 1. Crear Cliente de Prisma

Crea `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. Usar en API Routes

```typescript
// app/api/products/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      sizes: true,
      colors: true,
      tags: true,
    },
  })

  return NextResponse.json(products)
}
```

### 3. Usar en Server Components

```typescript
// app/catalogo/page.tsx
import { prisma } from '@/lib/prisma'

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    where: { category: 'buzos' },
    include: {
      images: true,
      colors: true,
      sizes: true,
    },
  })

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## 🔍 Queries Comunes

```typescript
// Obtener producto por slug
const product = await prisma.product.findUnique({
  where: { slug: 'buzo-oversize-negro-estampado' },
  include: {
    images: { orderBy: { order: 'asc' } },
    sizes: true,
    colors: true,
    tags: true,
  },
})

// Buscar productos por categoría
const buzos = await prisma.product.findMany({
  where: { category: 'buzos' },
  include: { images: true },
})

// Productos en oferta flash
const flashSale = await prisma.product.findMany({
  where: { isFlashSale: true },
  include: { images: { take: 1 } },
  orderBy: { discount: 'desc' },
})

// Productos más vendidos
const bestSellers = await prisma.product.findMany({
  orderBy: { soldCount: 'desc' },
  take: 10,
  include: { images: { take: 1 } },
})

// Buscar productos
const results = await prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: query } } } },
    ],
  },
})
```

---

## ⚠️ Troubleshooting

### Error: "Can't reach database server"

```bash
# Verificar que Docker esté corriendo
docker compose ps

# Ver logs de PostgreSQL
docker compose logs postgres

# Reiniciar contenedores
docker compose restart
```

### Error: "Environment variable not found: DATABASE_URL"

Verifica que el archivo `.env` exista en la raíz del proyecto con:
```
DATABASE_URL="postgresql://fdc_user:fdc_password@localhost:5432/fueradecontexto"
```

### Resetear completamente la BD

```bash
# Opción 1: Reset de Prisma (recomendado)
npm run db:reset

# Opción 2: Eliminar volúmenes de Docker
docker compose down -v
docker compose up -d
npm run db:migrate
npm run db:seed
```

---

## 📚 Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js + Prisma](https://www.prisma.io/nextjs)
- [Modelo de Datos del Proyecto](./docs/DATA-MODEL.md)

---

**Última actualización:** 2026-01-27
