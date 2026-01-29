# Prisma Database Setup

Este directorio contiene la configuración de Prisma ORM para el proyecto Fuera de Contexto.

## Archivos

- `schema.prisma` - Schema de la base de datos con todos los modelos
- `migrations/` - Historial de migraciones de la base de datos (generado automáticamente)
- `seed.ts` - Script para poblar la base de datos con datos iniciales (por crear)

## Stack

- **ORM:** Prisma 7.3.0 ✅
- **Base de datos:** PostgreSQL 16 ✅
- **Hosting:** Railway (cloud PostgreSQL) ✅
- **Adapter:** @prisma/adapter-pg con pg driver ✅
- **Estado:** Configurado y funcionando con 23 productos

## Modelos Principales

### Productos
- `Product` - Productos del catálogo
- `ProductImage` - Imágenes de productos
- `ProductSize` - Tallas disponibles
- `ProductColor` - Colores disponibles
- `ProductTag` - Tags/etiquetas para búsqueda

### Carrito y Favoritos
- `CartItem` - Items en el carrito (usuarios logueados y sesiones)
- `Wishlist` - Lista de deseos

### Usuarios y Órdenes (Futuros)
- `User` - Usuarios registrados
- `Address` - Direcciones de envío
- `Order` - Órdenes de compra
- `OrderItem` - Items de cada orden

## Setup Inicial - ✅ COMPLETADO

**Estado:** Base de datos configurada y operativa

Lo que ya se completó:
1. ✅ **Dependencias instaladas** (prisma, @prisma/client, @prisma/adapter-pg, pg, dotenv)
2. ✅ **Variables de entorno configuradas** (.env con DATABASE_URL de Railway)
3. ✅ **Cliente Prisma generado** con adapter de PostgreSQL
4. ✅ **Migraciones ejecutadas** en Railway
5. ✅ **Base de datos poblada** con 23 productos

Verificar el setup:
```bash
# Ver datos en interfaz visual
npm run db:studio

# Re-ejecutar seed si es necesario
npm run db:seed
```

## Comandos Comunes

```bash
# Generar cliente después de cambios en schema
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name descripcion_del_cambio

# Ver estado de migraciones
npx prisma migrate status

# Abrir Prisma Studio (explorador visual de datos)
npx prisma studio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (¡BORRA TODOS LOS DATOS!)
npx prisma migrate reset

# Formatear schema.prisma
npx prisma format

# Validar schema
npx prisma validate
```

## Desarrollo

### Modificar el Schema

1. Edita `schema.prisma`
2. Ejecuta `npx prisma migrate dev --name nombre_descriptivo`
3. Prisma generará automáticamente la migración SQL
4. Revisa la migración en `migrations/`
5. Confirma y aplica

### Agregar Seed Data

Crea `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Tu código de seed aquí
  await prisma.product.create({
    data: {
      name: "Ejemplo",
      // ...
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Luego agrega a `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Conexión en la App

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Uso en API routes:
```typescript
// app/api/products/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      sizes: true,
      colors: true,
    }
  })

  return Response.json(products)
}
```

## Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [DATA-MODEL.md](../docs/DATA-MODEL.md) - Documentación completa del modelo de datos
- [RAILWAY-SETUP.md](../docs/RAILWAY-SETUP.md) - Guía de configuración de Railway

## ⚠️ Cambios Importantes en Prisma 7

### Nueva Configuración de Datasource

En Prisma 7, la URL de conexión YA NO va en `schema.prisma`:

**❌ ANTIGUO (Prisma 6):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ❌ No usar en Prisma 7
}
```

**✅ NUEVO (Prisma 7):**
```prisma
datasource db {
  provider = "postgresql"
  // Sin url - se configura en prisma.config.ts
}
```

La URL ahora se configura en `prisma.config.ts`:
```typescript
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
})
```

### Cliente con Adapter

Para Railway y conexiones directas, usa el adapter de PostgreSQL:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
```

### Preview Features

La feature `driverAdapters` ya no es necesaria en Prisma 7:

**❌ NO USAR:**
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // ❌ Obsoleto
}
```

**✅ USAR:**
```prisma
generator client {
  provider = "prisma-client-js"
  // Sin preview features
}
```

## Notas Importantes

- **NUNCA** commitees el archivo `.env` al repositorio
- Usa `prisma migrate dev` solo en desarrollo
- Usa `prisma migrate deploy` en producción
- Siempre revisa las migraciones generadas antes de aplicarlas
- Haz backups antes de ejecutar `prisma migrate reset`
- En Prisma 7, el cliente debe usar adapter para Railway/PostgreSQL directo

---

Para más información sobre el modelo de datos, consulta [docs/DATA-MODEL.md](../docs/DATA-MODEL.md).
