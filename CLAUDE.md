# CLAUDE.md

**Fuera de Contexto** - E-commerce platform for custom clothing built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, NextAuth.js v5, Prisma + PostgreSQL.

## Tech Stack Decisions

### Estado Global
- **Cart & Wishlist:** Context API con **sincronización híbrida a base de datos**
  - Guest users: localStorage únicamente
  - Authenticated users: Database (primary) + localStorage (fallback)
  - Auto-sync en login con merge strategy
- **Nuevos estados:** Usar **Zustand** para cualquier estado global adicional
- NO crear nuevos Context APIs, migrar a Zustand cuando sea necesario

### Formularios
- **Stack obligatorio:** `react-hook-form` + `zod`
- Usar en todos los formularios (filtros, búsqueda, edición, etc.)
- Validación con schemas de Zod

### API Layer
- **Usar:** Route Handlers (`app/api/*/route.ts`)
- **NO usar:** Server Actions
- Todas las mutaciones y queries van por API routes explícitas

### UI Patterns
- **NO usar:** Modales para crear/editar recursos
- **Usar:** Páginas dedicadas con URLs propias
- Ejemplo: `/admin/productos/nuevo` en lugar de modal

### Autenticación (✅ Completado)
- NextAuth.js v5 (beta.30), JWT (7 días), Bcrypt (12 rounds)
- Routes: `/auth/login`, `/auth/registro`, `/auth/verify`, `/auth/forgot-password`, `/auth/reset-password`
- Protection: `src/middleware.ts`, `requireAdmin()`, `requireAuth()` from `src/lib/auth/auth-utils.ts`
- Email: Resend via `src/lib/email/email-service.ts`

### Data Layer
- PostgreSQL (Railway) + Prisma ORM
- Images: Cloudinary via `next-cloudinary` (client-side uploads)
- Cart/Wishlist: Hybrid (localStorage for guests, database for authenticated)
- Database functions in `src/lib/db/` (products, cart, wishlist, orders, users, stock)
- API routes: `/api/products`, `/api/cart`, `/api/wishlist`, `/api/orders`, `/api/users`

## Architecture

### App Router Structure
- `/` - Homepage
- `/catalogo` - Product catalog
- `/producto/[slug]` - Product details
- `/carrito` - Cart
- `/checkout` - Checkout (protected)
- `/mi-cuenta` - User account (protected)
- `/auth/*` - Login, registro, verify, forgot-password, reset-password
- `/admin/*` - Admin panel (admin-only): dashboard, productos, pedidos, usuarios

### State Management
- **Cart/Wishlist:** Context API with hybrid storage (guest=localStorage, authenticated=database)
  - Optimistic updates, auto-sync on login, merge strategy for duplicates
  - Cart items identified by: `productId-size-colorName`
  - Files: `src/context/cart-context.tsx`, `src/context/wishlist-context.tsx`
- **Admin filters:** Zustand stores in `src/store/admin-store.ts` (synced with URL)
- **New global state:** Use Zustand (DO NOT create new Context APIs)

### Component Organization
`src/components/`: `home/`, `layout/`, `product/`, `catalog/`, `cart/`, `checkout/`, `account/`, `admin/`, `shared/`, `ui/`
- Use shadcn CLI for `ui/` components: `npx shadcn@latest add [component-name]`

### Type System (`src/types/index.ts`)
- **Product:** id, slug, name, price, images[], category, sizes[], colors[], stock, weight, length, width, height
- **CartItem:** product, quantity, selectedSize, selectedColor (unique key: `productId-size-colorName`)
- **Categories:** `buzos | gorras | camperas | remeras | accesorios`
- **Sizes:** `XS | S | M | L | XL | XXL | Unico`

### Configuration
- Tailwind CSS 4 + shadcn/ui ("new-york" theme)
- Path alias: `@/*` → `src/*`
- Images: placehold.co, res.cloudinary.com allowed

### Key Patterns
1. **Cart items** uniquely identified by: `productId-size-colorName` (NOT just productId)
2. **Hybrid storage:** Guests use localStorage, authenticated users use database + optimistic updates
3. **localStorage keys:** `fdc-cart`, `fdc-wishlist`
4. **Client Components:** Cart/Wishlist contexts require `"use client"`
5. **Images:** Use Next.js `<Image>` component
6. **Responsive:** Use `useMobile` hook from `src/hooks/use-mobile.ts`

## Admin Panel (✅ Completado)
- Routes: `/admin` (dashboard), `/admin/productos`, `/admin/pedidos`, `/admin/usuarios`
- Protection: Middleware + `requireAdmin()` from `src/lib/auth/auth-utils.ts`
- Patterns: Server Components for data, Client Components for forms/filters
- Database: `src/lib/db/` (products, orders, users - NEVER returns password)
- Validation: `src/lib/validations/admin.ts` (used in frontend + backend)
- Security: Bcrypt (12 rounds), JWT (7 days), no self-deletion, no last admin deletion

## NextAuth v5 Notes
- Files: `src/auth.ts`, `src/lib/auth/`, `src/middleware.ts`
- Custom session: `user.id`, `user.role`, `user.isActive`, `user.emailVerified` (boolean)
- Types: `src/types/next-auth.d.ts`
- Middleware uses `req.auth.user` for session access

## Important Notes
- **Environment:** `NEXTAUTH_URL` REQUIRED in production (use `getBaseUrl()` from `src/lib/env.ts`)
- **Zod 4.x:** Use `message` instead of `errorMap` in `z.enum()`
- **Database:** Singleton pattern in `src/lib/prisma.ts` (max 10 connections)
- **Auth routes:** NOT a route group (actual path is `/auth/*`, not `/(auth)/*`)

## Mercado Pago Integration (✅ Completado)
- Checkout Pro (redirect flow): Order → Reserve stock → MP redirect → Webhook → Email
- Files: `src/lib/mercadopago/` (client, preference, payment, webhooks), `src/lib/db/stock.ts`
- Webhook: `/api/mercadopago/webhook` (setup in MP dashboard)
- Order fields: `mpPreferenceId`, `mpPaymentId`, `mpStatus`, `mpPaymentType`, `paidAt`
- Status mapping: approved→paid, rejected/cancelled→failed, pending→pending, refunded→refunded
- Security: Atomic stock transactions, server-side price calculation, payment verification via MP API

## Cloudinary Images (✅ Completado)
- Client-side uploads via `CldUploadWidget` (no backend processing)
- Component: `src/components/admin/image-upload.tsx`
- Env vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- Config: Upload Preset in Cloudinary Dashboard (Unsigned mode)
- Deletion: Only removes DB reference, images persist in Cloudinary

## Cart & Wishlist (✅ Completado)
- Hybrid: localStorage (guests) + Database (authenticated) with optimistic updates
- Merge on login: Cart quantities sum, wishlist no duplicates
- Unique constraint: `[userId, productId, selectedSize, colorName]`
- Files: `src/lib/db/cart.ts`, `src/lib/db/wishlist.ts`, `src/lib/validations/cart.ts`
- API: `/api/cart/*`, `/api/wishlist/*`, POST `/api/cart/sync`, POST `/api/wishlist/sync`
- Graceful degradation: localStorage fallback if DB sync fails

## 🚧 Correo Argentino Shipping (17% - Fase 1/6)

### Status
**✅ Fase 1: Database Preparation (Completada)**
- Product dimensions: weight, length, width, height (nullable Float)
- Order tracking: caTrackingNumber, caServiceType, caServiceName, caLabelUrl, caEstimatedDays, caShippedAt, caDeliveredAt, caPackageWeight
- Admin form updated with dimension inputs
- Types and validations updated

**🔄 Fase 2: API Client Implementation (Next)**

### Schema Changes (✅ Applied)
**Product:** Added `weight` (g), `length` (cm), `width` (cm), `height` (cm) - all nullable Float
**Order:** Added 8 CA fields - `caTrackingNumber`, `caServiceType`, `caServiceName`, `caLabelUrl`, `caEstimatedDays`, `caShippedAt`, `caDeliveredAt`, `caPackageWeight`
**Validation:** `src/lib/validations/admin.ts` - positive numbers, optional/nullable
**Form:** `src/components/admin/product-form.tsx` - "Dimensiones de Envío" section

### Environment Variables (Pending)
See `.env.example` for full list (USERNAME, PASSWORD, API_URL, API_URL_TEST, WAREHOUSE_* fields)
**Credentials:** Register at correoargentino.com.ar/MiCorreo/public/primeros-pasos (approval 3-5 days)

### Roadmap (6 Phases)
**✅ Fase 1:** Database prep (Product dimensions, Order CA fields, admin form) - DONE
**📋 Fase 2:** API Client (`src/lib/shipping/correo-argentino/` - client, quote, label, tracking services)
**📋 Fase 3:** Checkout integration (Replace hardcoded shipping, `/api/shipping/quote`, `ShippingMethodSelector`)
**📋 Fase 4:** Label generation (`ShippingLabelGenerator`, `/api/admin/orders/[id]/generate-label`, upload to Cloudinary)
**📋 Fase 5:** Tracking (`/mi-cuenta/pedidos/[id]/tracking`, `TrackingTimeline`, admin widget, emails)
**📋 Fase 6:** Testing & deployment (test credentials, production config)

### Planned Flows
**Checkout:** Address → Calculate weight → API quote → Display options (Clásico/Expreso/Prioritario) → User selects → Payment
**Label:** Admin opens order → Click "Generar Etiqueta" → API call → PDF with barcode + tracking → Upload to Cloudinary → Save to order
**Tracking:** Customer/Admin page → API call with tracking → Display timeline

## Current Status (Updated: 2026-02-09)

**✅ Completado (100%):**
- Frontend UI, Database, Admin Panel (productos, pedidos, usuarios)
- Authentication (NextAuth v5, email verification, password reset)
- Cart & Wishlist (hybrid storage, optimistic updates)
- Checkout & Payment (Mercado Pago Checkout Pro, webhooks, stock management)
- Images (Cloudinary client-side uploads)
- Production Deployment (Vercel)

**🚧 En Progreso:**
- **Correo Argentino Shipping (17% - Fase 1/6):** Real-time quotes, label generation, tracking
  - ✅ Fase 1: Database prep (dimensions, CA fields)
  - 📋 Fase 2-6: API client, checkout integration, labels, tracking, testing

**Deployment Checklist:**
- [x] `NEXTAUTH_URL`, `DATABASE_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` configured
- [ ] Mercado Pago credentials + webhook URL in production
- [ ] Cloudinary credentials in production
- [ ] Create first admin (seed script no longer auto-creates admin)

**Optional Enhancements:**
Reviews, coupons, cart expiration, stock validation before checkout, price change alerts
