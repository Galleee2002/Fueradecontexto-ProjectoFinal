# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fuera de Contexto** - E-commerce platform for custom clothing (buzos, gorras, camperas, remeras, accesorios) built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Build
npm run build        # Production build
npm start            # Start production server

# Linting
npm run lint         # Run ESLint on codebase
```

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

### Autenticación
- **Sistema:** NextAuth.js v5 (beta.30) con Credentials Provider
- **Session Strategy:** JWT (7 días de expiración)
- **Providers:** Email/Password (OAuth puede agregarse después)
- **Route Protection:** Middleware en `src/middleware.ts`
- **API Protection:** `requireAdmin()` y `requireAuth()` desde `src/lib/auth/auth-utils.ts`
- **Password Security:** Bcrypt con 12 salt rounds
- **Email Service:** Resend (integrado y funcional)
  - Servicio: `src/lib/email/email-service.ts`
  - Funciones: `sendVerificationEmail()`, `sendPasswordResetEmail()`, `sendWelcomeEmail()`
- **Estado:** 100% completado (Phases 1-6)
- **UI Funcional:** Páginas de Login, Registro, Error, Verificación y Reseteo de contraseña.
- **Navbar Dinámica:** Menú de usuario con logout implementado

### Data Layer
- **Base de datos:** PostgreSQL (Railway) + Prisma ORM
- **Imágenes:** **Cloudinary** (vía `next-cloudinary`)
- **Productos:** Migrados a base de datos (23 productos)
- **Cart & Wishlist:** Sincronización híbrida con base de datos (guest = localStorage, authenticated = database)
- **API Routes:** `/api/products`, `/api/cart`, `/api/wishlist` para Client Components
- **Server Components:** Acceso directo a Prisma cuando sea posible
- **Database Functions:** `src/lib/db/` para todas las queries (products, cart, wishlist, orders, users, stock)

## Architecture

### App Router Structure (Next.js 16)

The application uses Next.js App Router with the following key routes:
- `/` - Homepage with hero, categories, flash sales, featured products
- `/catalogo` - Product catalog with filters and sorting
- `/producto/[slug]` - Dynamic product detail pages
- `/carrito` - Shopping cart
- `/checkout` - Checkout flow (protected, requires auth)
- `/mi-cuenta` - User account pages (protected)
- `/auth` - Authentication routes (NOT a route group):
  - `/auth/login` - Login page
  - `/auth/registro` - Registration page
  - `/auth/error` - Authentication error page
  - `/auth/verify` - Email verification
  - `/auth/verify-required` - Email verification required
  - `/auth/forgot-password` - Password recovery
  - `/auth/reset-password` - Password reset
- `/admin` - Admin panel (protected, admin-only)

### State Management

**Cart Context** (`src/context/cart-context.tsx`):
- **Hybrid storage strategy:** Database for authenticated users, localStorage for guests
- **Auto-sync on login:** Merges localStorage cart with database (sums quantities for duplicates)
- **Optimistic updates:** UI updates immediately, database sync in background
- Cart items identified by unique combination: `productId-size-colorName`
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Tracks `totalItems` and `subtotal`
- **Persistence:** Cart survives logout (stored in database for authenticated users)

**Wishlist Context** (`src/context/wishlist-context.tsx`):
- **Hybrid storage strategy:** Database for authenticated users, localStorage for guests
- **Auto-sync on login:** Merges localStorage wishlist with database
- **Optimistic updates:** UI updates immediately, database sync in background
- Methods: `toggleWishlist`, `isInWishlist`, `clearWishlist`
- **Persistence:** Wishlist survives logout (stored in database for authenticated users)

**Database Layer:**
- `src/lib/db/cart.ts` - CRUD operations for cart items
- `src/lib/db/wishlist.ts` - CRUD operations for wishlist items
- Both use Prisma with proper type transformations and error handling

**API Routes:**
- Cart: `/api/cart`, `/api/cart/items`, `/api/cart/items/[key]`, `/api/cart/sync`
- Wishlist: `/api/wishlist`, `/api/wishlist/items`, `/api/wishlist/items/[productId]`, `/api/wishlist/sync`
- All routes protected with `requireAuth()` for authenticated users

Both contexts use client components ("use client") and provide data to the entire app via providers in the root layout.

### Component Organization

```
src/components/
├── home/        # Homepage sections (hero, categories, flash-sale, etc.)
├── layout/      # Navigation, footer, mobile-nav, top-banner
├── product/     # Product detail components (gallery, selectors, tabs)
├── catalog/     # Catalog-specific (filters, sort-dropdown)
├── cart/        # Cart-related components
├── checkout/    # Checkout flow components
├── account/     # User account components
├── shared/      # Reusable components (ProductCard, QuantitySelector, etc.)
└── ui/          # shadcn/ui base components (Button, Card, Badge, etc.)
```

**Important**: Components in `ui/` are generated by shadcn/ui. Use the shadcn CLI to add/modify them rather than manual edits when possible.

### Type System

Core types defined in `src/types/index.ts`:

**Product**:
- Includes: id, slug, name, description, price, originalPrice, discount, images[], category, sizes[], colors[], rating, reviewCount, soldCount, stock
- Flags: isNew, isFeatured, isFlashSale

**CartItem**:
- Contains: product, quantity, selectedSize, selectedColor
- Cart items are uniquely identified by the combination of product ID + size + color

**Categories**: `buzos | gorras | camperas | remeras | accesorios`

**Sizes**: `XS | S | M | L | XL | XXL | Unico`

### Data Layer

Static data is stored in `src/data/`:
- `products.ts` - Product catalog
- `categories.ts` - Category definitions
- `banners.ts` - Promotional banners

This is for development/demo purposes. In production, replace with API calls or database queries.

### Styling

- **Tailwind CSS 4** with PostCSS
- **shadcn/ui** components styled with "new-york" theme
- CSS variables for theming in `src/app/globals.css`
- Dark/light mode support via `next-themes`
- Path aliases: `@/*` maps to `src/*`

### Configuration

- **components.json**: shadcn/ui config with aliases for components, utils, hooks
- **next.config.ts**: Configured to allow images from `placehold.co`
- **tsconfig.json**: Path alias `@/*` → `src/*`, strict mode enabled

### Key Patterns

1. **Cart Item Identity**: When working with cart operations, remember items are uniquely identified by `productId-size-colorName` combination, not just product ID.

2. **Hybrid Cart/Wishlist Storage**:
   - **Guest users**: Data stored in localStorage only
   - **Authenticated users**: Database is primary source, localStorage is fallback
   - **Auto-sync on login**: localStorage data automatically merges with database
   - **Merge strategy**: For duplicate cart items, quantities are summed together
   - **Optimistic updates**: UI updates immediately, database syncs in background
   - **Error handling**: If database sync fails, localStorage continues to work (graceful degradation)
   - **Logout behavior**: Data persists in database, localStorage is cleared

3. **Client Components**: Cart and Wishlist contexts require "use client" directive. Components using these contexts also need "use client".

4. **localStorage Keys**:
   - Cart: `fdc-cart` (used for guest users and as temporary storage during sync)
   - Wishlist: `fdc-wishlist` (used for guest users and as temporary storage during sync)

5. **Database Schema - CartItem**:
   ```prisma
   model CartItem {
     userId        String?
     productId     String
     quantity      Int
     selectedSize  String
     selectedColor Json     // { name: string, hex: string }
     colorName     String   // Extracted for unique constraint
     colorHex      String   // Extracted for display

     @@unique([userId, productId, selectedSize, colorName])
   }
   ```

6. **Image Optimization**: Use Next.js `<Image>` component with proper width/height. Remote patterns configured for placehold.co.

7. **Responsive Design**: Mobile-first approach. Use `useMobile` hook from `src/hooks/use-mobile.ts` for responsive behavior in components.

## Adding New Features

**Adding UI Components**:
Use shadcn CLI to add components to maintain consistency:
```bash
npx shadcn@latest add [component-name]
```

**Adding Product Features**:
1. Update type definitions in `src/types/index.ts`
2. Update product data in `src/data/products.ts`
3. Update relevant UI components

**Cart/Wishlist Modifications**:
When modifying cart logic, ensure the unique key pattern (`productId-size-colorName`) is maintained across all operations to prevent duplicate entries or incorrect updates.

## Admin Panel

### Structure
- **Location:** `/admin/*`
- **Routes:**
  - `/admin` - Dashboard with statistics
  - `/admin/productos` - Products management (full CRUD)
  - `/admin/pedidos` - Orders management (read + status updates)
  - `/admin/usuarios` - Users management (full CRUD: create, read, update status/role, delete)
- **Auth:** NextAuth.js con middleware protection y session checks
- **Patterns:** Server Components for data fetching, Client Components for interactions

### Architecture Patterns
- **Server Components:** Use for list pages that fetch data from database
- **Client Components:** Use for forms, filters, and interactive elements
- **Database Layer:** Functions in `src/lib/db/` for all queries
- **API Routes:** All mutations go through `/api/*` endpoints
- **Validation:** Zod schemas in `src/lib/validations/admin.ts` used in both frontend and backend
- **State:** Zustand stores in `src/store/admin-store.ts` for filters (synced with URL)

### Key Files
- `src/lib/db/products.ts` - Product queries (CRUD operations)
- `src/lib/db/orders.ts` - Order queries (list, detail, status updates)
- `src/lib/db/users.ts` - User queries (CRUD: create, list, detail, status/role updates, delete, **NEVER returns password**)
- `src/lib/validations/admin.ts` - Zod validation schemas (includes createUserSchema)
- `src/store/admin-store.ts` - Zustand stores for filters
- `src/components/admin/user-form.tsx` - User creation form component
- `src/app/admin/usuarios/nuevo/page.tsx` - New user page
- `src/auth.ts` - NextAuth v5 initialization (exports auth, signIn, signOut, handlers)
- `src/lib/auth/auth-config.ts` - NextAuth configuration (providers, callbacks, JWT) using NextAuthConfig
- `src/lib/auth/auth-utils.ts` - NextAuth helper functions (requireAdmin, requireAuth, getCurrentSession)
- `src/lib/auth/password-utils.ts` - Password hashing and validation utilities
- `src/middleware.ts` - Route protection middleware using NextAuth v5 auth()

### API Endpoints
- **Products:** GET/POST `/api/products`, GET/PATCH/DELETE `/api/products/[slug]`
- **Orders:** GET `/api/orders`, GET/PATCH `/api/orders/[id]`
- **Users:** GET/POST `/api/users`, GET/PATCH/DELETE `/api/users/[id]`
  - POST: Create user with email uniqueness validation
  - DELETE: Prevents self-deletion and last admin deletion

### Security Notes
- **Users API:** NEVER expose password field (excluded in `transformUser` function)
- **Admin Routes:** Protected with NextAuth middleware (`src/middleware.ts`) and `requireAdmin()` checks
- **API Routes:** All admin mutations require `await requireAdmin()` call
- **Password Security:** Bcrypt hashing with 12 salt rounds, strength validation enforced
- **Session:** JWT strategy with 7-day expiration, includes role and status in token
- **Validation:** Always validate in both frontend (react-hook-form + Zod) and backend (API routes + Zod)
- **User Deletion:** Cannot delete self, cannot delete last admin, cascade deletes addresses but preserves orders

## NextAuth v5 Implementation Details

### Migration from v4 to v5
The project uses NextAuth v5 (beta.30), which has breaking changes from v4:

**Key Changes:**
- `NextAuthOptions` → `NextAuthConfig`
- `withAuth()` middleware → `auth()` function
- `getServerSession()` → `auth()` from `src/auth.ts`

**File Structure:**
```
src/
├── auth.ts                          # NextAuth v5 initialization
│   └── Exports: { auth, signIn, signOut, handlers }
├── lib/auth/
│   ├── auth-config.ts              # NextAuthConfig (providers, callbacks, session)
│   ├── auth-utils.ts               # Helper functions (requireAdmin, requireAuth)
│   └── password-utils.ts           # Bcrypt utilities
├── middleware.ts                    # Route protection using auth()
└── app/api/auth/[...nextauth]/     # API route handlers
```

**Authentication Flow:**
1. User submits credentials via `/auth/login`
2. NextAuth validates via `CredentialsProvider` in `auth-config.ts`
3. JWT token created with custom fields (userId, role, isActive, emailVerified)
4. Session exposed to client with custom user fields
5. Middleware protects routes by checking `req.auth.user.role` and `req.auth.user.isActive`

**Custom Session Fields:**
The session is extended to include:
- `user.id` - User ID from database
- `user.role` - "customer" | "admin"
- `user.isActive` - Account status
- `user.emailVerified` - Email verification status (boolean, not Date)

**Type Definitions:**
Custom types are declared in `src/types/next-auth.d.ts` to extend NextAuth's default types.

**Important Notes:**
- Use type assertions (`as any`, `as string`) when accessing custom session fields due to NextAuth v5 beta type limitations
- `emailVerified` is stored as boolean in Prisma (not Date as in default NextAuth)
- All credentials must be cast to `string` in authorize function
- Middleware uses `req.auth.user` (not `req.nextauth.token`) to access session data

## Known Issues & Fixes

### Production Errors Fixed (2026-02-04)
**Critical fixes for Vercel deployment:**

1. **Environment Validation (`src/lib/env.ts`)**
   - Created `getBaseUrl()` utility that validates `NEXTAUTH_URL` exists in production
   - Throws error during build if `NEXTAUTH_URL` not configured in production
   - All dynamic URLs now use this validated base URL instead of localhost fallbacks

2. **Localhost Fallback Removal**
   - `src/lib/mercadopago/preference.ts` - Uses `getBaseUrl()` for callback URLs
   - `src/app/api/checkout/create-order/route.ts` - Uses dynamic base URL from request headers
   - `src/lib/email/email-service.ts` - Uses `getBaseUrl()` for all email links
   - `src/lib/email/order-confirmation.ts` - Uses `getBaseUrl()` for order confirmation links
   - **Fixed**: ERR_CONNECTION_REFUSED errors when redirecting after payment

3. **Route Structure Fix**
   - Renamed `src/app/(auth)/` → `src/app/auth/` (removed route group)
   - Route groups `(name)` don't appear in URL paths, causing 404s
   - All auth routes now properly accessible at `/auth/login`, `/auth/registro`, etc.
   - **Fixed**: 404 errors on all authentication routes

4. **Image URL Cleanup**
   - Removed `?text=...` query parameters from all placehold.co URLs
   - `src/data/products.ts` - 48 URLs cleaned
   - `src/data/banners.ts` - 3 URLs cleaned
   - Next.js Image Optimization requires clean URLs without query strings
   - **Fixed**: 400 Bad Request errors on product and banner images

5. **Database Connection Pool**
   - Implemented singleton pattern in `src/lib/prisma.ts`
   - Limited connection pool to max 10 connections
   - Prevents connection exhaustion during Vercel builds
   - **Fixed**: "Too many database connections" build errors

6. **Dynamic Product Pages**
   - Changed from static generation to dynamic rendering (`force-dynamic`)
   - Added 60-second revalidation for better performance
   - Ensures real-time stock updates
   - Prevents build-time connection pool exhaustion

**Environment Variables Required in Vercel:**
- `NEXTAUTH_URL` - **CRITICAL**: Must be set to production URL (e.g., `https://your-domain.vercel.app`)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `RESEND_API_KEY` - Email service API key
- `EMAIL_FROM` - Email sender address
- `MERCADO_PAGO_ACCESS_TOKEN` - Payment processor token
- `MERCADO_PAGO_PUBLIC_KEY` - Payment processor public key

### Build Errors Fixed (2026-02-03)
1. **middleware.ts**: Updated from `withAuth` to `auth()` pattern
2. **layout.tsx**: Fixed corrupted file with `...` literal
3. **Type errors**: Fixed various TypeScript issues related to NextAuth v5 types
4. **Zod schemas**: Updated `errorMap` to `message` for Zod 4.x compatibility
5. **Filter functions**: Changed to accept `Partial<FilterData>` types

### Zod 4.x Breaking Changes
When using `z.enum()`, use `message` instead of `errorMap`:
```typescript
// ❌ Old (Zod 3.x)
z.enum(["value1", "value2"], {
  errorMap: () => ({ message: "Invalid value" })
})

// ✅ New (Zod 4.x)
z.enum(["value1", "value2"], {
  message: "Invalid value"
})
```

## Mercado Pago Integration

### Overview
Complete checkout implementation using **Mercado Pago Checkout Pro** (redirect flow). Customers are redirected to Mercado Pago's hosted checkout page to complete payment securely.

### Architecture

**Checkout Flow:**
1. User fills shipping form (validated with react-hook-form + Zod)
2. User selects shipping method (Standard/Express)
3. User confirms order
4. Backend creates order and reserves stock
5. Backend creates MP preference
6. User is redirected to Mercado Pago
7. User completes payment
8. MP sends webhook notification
9. Backend updates order status
10. User sees success page + receives email

**Stock Management:**
- Stock is reserved when order is created (atomic transaction)
- Stock is restored if payment fails or is cancelled
- Stock check before order creation prevents overselling

### Key Files

**Backend:**
- `src/lib/mercadopago/client.ts` - MP SDK client (lazy initialization)
- `src/lib/mercadopago/preference.ts` - Creates payment preferences
- `src/lib/mercadopago/payment.ts` - Fetches payment info from MP API
- `src/lib/mercadopago/webhooks.ts` - Webhook validation
- `src/lib/db/stock.ts` - Stock management (reserve/restore/check)
- `src/app/api/checkout/create-order/route.ts` - Order creation endpoint
- `src/app/api/mercadopago/webhook/route.ts` - Webhook handler

**Frontend:**
- `src/components/checkout/shipping-form.tsx` - Validated shipping form
- `src/app/checkout/page.tsx` - Checkout flow orchestration
- `src/app/checkout/success/[orderId]/page.tsx` - Success page
- `src/app/checkout/failure/page.tsx` - Failure page

**Validation:**
- `src/lib/validations/checkout.ts` - Zod schemas for checkout

**Email:**
- `src/lib/email/order-confirmation.ts` - Order confirmation email template

### Environment Variables

Required for checkout to work:

```env
MERCADO_PAGO_ACCESS_TOKEN="APP_USR-xxxxx"
MERCADO_PAGO_PUBLIC_KEY="APP_USR-xxxxx"
```

### Webhook Configuration

1. Go to: https://www.mercadopago.com.ar/developers/panel/webhooks
2. Create webhook with URL: `https://your-domain.com/api/mercadopago/webhook`
3. Select events: `payment.created`, `payment.updated`
4. For local development, use ngrok: `ngrok http 3000`

### Database Schema

Order model includes MP fields:
- `mpPreferenceId` - Mercado Pago preference ID
- `mpPaymentId` - Payment ID from MP
- `mpStatus` - Payment status from MP
- `mpPaymentType` - Payment method used
- `mpMerchantOrder` - Merchant order ID
- `paidAt` - Timestamp when payment was confirmed

### Payment Status Mapping

| MP Status | Internal Status |
|-----------|----------------|
| approved | paid |
| rejected | failed |
| cancelled | failed |
| pending | pending |
| refunded | refunded |

### Security Notes

- Stock operations use Prisma transactions (atomic)
- Payment verification via MP API (not just webhook)
- Webhook always returns 200 to prevent retries
- Order validation checks user ownership
- All prices calculated server-side (never trust client)

## Cloudinary Image Integration

### Overview
Complete image management solution using **Cloudinary** for all product images in the admin panel. Implements client-side direct uploads via the **Cloudinary Upload Widget** for optimal performance and UX.

### Architecture

**Upload Flow:**
1. Admin clicks "Subir Imagen" button in product form
2. Cloudinary Upload Widget opens (supports drag & drop, camera, URL import)
3. Image uploads directly to Cloudinary servers (bypasses Next.js backend)
4. Cloudinary returns `secure_url` with optimized image
5. URL is stored in database with product
6. Next.js Image component loads from Cloudinary CDN

**Key Benefits:**
- **No backend processing**: Images upload directly to Cloudinary, saving server resources
- **Automatic optimization**: Cloudinary applies compression and format conversion
- **CDN delivery**: Fast image loading worldwide
- **Transformation support**: Can apply on-the-fly transformations via URL parameters
- **Security**: Uses unsigned upload preset (client-side uploads without signature)

### Key Files

**Components:**
- `src/components/admin/image-upload.tsx` - Custom upload component using CldUploadWidget
- `src/components/admin/product-form.tsx` - Product form with ImageUpload integration

**Configuration:**
- `next.config.ts` - Remote pattern for `res.cloudinary.com` hostname
- `.env.example` - Environment variable template

### Environment Variables

Required for image uploads:

```env
# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Note**: Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are strictly required for uploads. API Key and Secret are for server-side operations (if needed in future).

### Cloudinary Dashboard Configuration

To enable uploads, configure in Cloudinary Dashboard:

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload**
3. Create new **Upload Preset**
4. Set **Signing Mode** to `Unsigned` (allows client-side uploads)
5. (Optional) Set folder name for organization (e.g., `fuera-de-contexto/products`)
6. Copy the **Upload Preset** name
7. Copy your **Cloud Name** from dashboard
8. Add both to `.env` file

### Implementation Details

**ImageUpload Component:**
```typescript
// src/components/admin/image-upload.tsx
import { CldUploadWidget } from "next-cloudinary"

export function ImageUpload({ value, onChange, onRemove }) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url)  // Get Cloudinary URL
  }

  return (
    <CldUploadWidget
      onSuccess={onUpload}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ maxFiles: 5 }}
    >
      {({ open }) => (
        <Button onClick={() => open()}>
          Subir Imagen
        </Button>
      )}
    </CldUploadWidget>
  )
}
```

**Product Form Integration:**
```typescript
// Integrates seamlessly with react-hook-form
<ImageUpload
  value={images.map((img) => img.url)}
  onChange={(url) => form.setValue("images", [...images, { url, order: images.length }])}
  onRemove={(url) => form.setValue("images", images.filter((img) => img.url !== url))}
/>
```

**Next.js Image Support:**
```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
```

### Image Management

**Display:**
- All uploaded images are displayed as thumbnails (200x200px)
- Each thumbnail has a delete button
- Images stored in database with order index

**Deletion:**
- Removing image only deletes reference from database
- Images remain in Cloudinary account (manual cleanup if needed)
- Consider implementing server-side deletion API for cleanup

### Performance Considerations

**Client-Side Upload:**
- Uploads don't block Next.js server
- No bandwidth consumed from app server
- Better UX with progress indicators from widget

**CDN Delivery:**
- Images served from Cloudinary CDN
- Automatic format conversion (WebP, AVIF support)
- Responsive image support via URL transformations

**Optimization:**
- Cloudinary auto-optimizes images on upload
- Can add quality/format parameters to URLs
- Lazy loading supported via Next.js Image component

### Future Enhancements

- Add server-side image deletion endpoint (Cloudinary Admin API)
- Implement image transformations (resize, crop, filters)
- Add image validation (file size, dimensions, format)
- Add bulk upload support
- Add image gallery/library for reusing images
- Implement automatic alt text generation

## Cart & Wishlist Database Migration

### Overview
Hybrid storage system that uses **localStorage for guest users** and **database for authenticated users**, with automatic synchronization on login and optimistic updates for instant UI feedback.

### Architecture

**Storage Strategy:**
```
Guest User Flow:
  Add to cart → localStorage only

Authenticated User Flow:
  Add to cart → Update UI (optimistic)
              → Save to localStorage (fallback)
              → Sync to database (background)

Login Flow:
  Has localStorage data? → POST /api/cart/sync (merge with DB)
  No localStorage data?  → GET /api/cart (fetch from DB)
  After sync            → Clear localStorage
```

**Merge Strategy:**
- **Cart items**: If same item exists in both localStorage and database, **sum quantities**
- **Wishlist items**: If item exists in both, keep it (no duplicates)
- **Rationale**: User may have added items on multiple devices before logging in

### Database Schema

**CartItem Model:**
```prisma
model CartItem {
  id            String   @id @default(uuid())
  userId        String?
  productId     String
  quantity      Int
  selectedSize  String
  selectedColor Json     // { name: string, hex: string }
  colorName     String   // Extracted for unique constraint
  colorHex      String   // Extracted for display
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  product       Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId, selectedSize, colorName])
  @@index([userId])
  @@index([productId])
}
```

**Wishlist Model:**
```prisma
model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  productId String
  addedAt   DateTime @default(now())

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@index([userId])
}
```

### Key Files

**Database Layer:**
- `src/lib/db/cart.ts` - CRUD operations, transformations, sync logic
  - `getUserCart(userId)` - Fetch cart from database
  - `addCartItem(params)` - Add or update cart item
  - `updateCartItemQuantity(params)` - Update item quantity
  - `removeCartItem(params)` - Remove item from cart
  - `clearUserCart(userId)` - Clear entire cart
  - `syncCartFromLocalStorage(userId, items)` - Merge localStorage with database
- `src/lib/db/wishlist.ts` - Wishlist CRUD operations
  - `getUserWishlist(userId)` - Fetch wishlist product IDs
  - `addWishlistItem(userId, productId)` - Add to wishlist
  - `removeWishlistItem(userId, productId)` - Remove from wishlist
  - `clearUserWishlist(userId)` - Clear entire wishlist
  - `syncWishlistFromLocalStorage(userId, items)` - Merge localStorage with database

**Validation Schemas:**
- `src/lib/validations/cart.ts` - Zod schemas for all cart/wishlist operations
  - `addCartItemSchema` - Validate add to cart
  - `updateQuantitySchema` - Validate quantity updates
  - `syncCartSchema` - Validate sync payload
  - `addWishlistItemSchema` - Validate add to wishlist
  - `syncWishlistSchema` - Validate wishlist sync

**API Routes - Cart:**
- `GET /api/cart` - Fetch cart for authenticated user
- `DELETE /api/cart` - Clear cart for authenticated user
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/[key]` - Update item quantity (key format: `productId-size-colorName`)
- `DELETE /api/cart/items/[key]` - Remove item from cart
- `POST /api/cart/sync` - Sync localStorage cart to database (login flow)

**API Routes - Wishlist:**
- `GET /api/wishlist` - Fetch wishlist for authenticated user
- `DELETE /api/wishlist` - Clear wishlist for authenticated user
- `POST /api/wishlist/items` - Add item to wishlist
- `DELETE /api/wishlist/items/[productId]` - Remove item from wishlist
- `POST /api/wishlist/sync` - Sync localStorage wishlist to database (login flow)

**Context Modifications:**
- `src/context/cart-context.tsx` - Added `useSession()`, sync functions, optimistic updates
- `src/context/wishlist-context.tsx` - Added `useSession()`, sync functions, optimistic updates

### Implementation Details

**Optimistic Updates:**
```typescript
// Example: addItem in cart context
const addItem = (product, size, color, quantity) => {
  // 1. Update UI immediately (optimistic)
  setItems(prev => [...prev, newItem])

  // 2. Sync to database in background (don't await)
  syncItemToDatabase("add", { productId, size, color, quantity })
}
```

**Error Handling:**
- All database sync operations wrapped in try-catch
- Errors logged to console but **not shown to user**
- If sync fails, localStorage continues to work (graceful degradation)
- On next page reload or login, sync will be attempted again

**Logout Behavior:**
- Cart/Wishlist data **persists in database** for authenticated users
- localStorage is **cleared** on logout
- On re-login, data is **restored from database**

**Concurrent Sessions:**
- If user modifies cart on multiple devices: **last write wins**
- Unique constraint in database prevents duplicate items
- Next sync operation will fetch latest state from database

### Testing Checklist

**Guest User:**
- [ ] Add items to cart → verify in localStorage
- [ ] Add items to wishlist → verify in localStorage
- [ ] Navigate between pages → data persists

**Login with localStorage:**
- [ ] Add items as guest → login → verify merge in Prisma Studio
- [ ] Verify quantities sum for duplicate items
- [ ] Verify localStorage cleared after sync

**Authenticated Operations:**
- [ ] Add to cart → verify in Prisma Studio
- [ ] Update quantity → verify in database
- [ ] Remove item → verify deletion
- [ ] Clear cart → verify empty in database

**Logout/Login:**
- [ ] Logout → verify data persists in database
- [ ] Re-login → verify data restored from database

**Error Scenarios:**
- [ ] Simulate network error → verify localStorage fallback works
- [ ] Check console for error logs (should not crash UI)

### Performance Considerations

**Optimistic Updates:**
- UI responds **instantly** to user actions
- No waiting for database confirmation
- Better UX, feels faster

**Background Sync:**
- Database operations don't block UI
- Errors don't interrupt user experience
- localStorage acts as buffer/cache

**Database Queries:**
- All cart/wishlist queries include proper indexes
- `@@index([userId])` for fast user-based queries
- Unique constraints prevent duplicates at database level

## Current Project Status

**Last Updated:** 2026-02-04

**Completion Status:**
- ✅ Frontend UI (100%)
- ✅ Database Layer (100%)
- ✅ Admin Panel (100%)
- ✅ Authentication (100%)
- ✅ Checkout Flow (100%)
- ✅ Payment Integration (100%)
- ✅ Production Deployment (100%)
- ✅ Cart & Wishlist Database Migration (100%)
- ✅ Cloudinary Image Integration (100%)
  - ✅ Installation and configuration of `next-cloudinary`
  - ✅ Custom `ImageUpload` component for Admin
  - ✅ Direct client-side uploads (Upload Widget)
  - ✅ Auto-optimization and secure URLs
- ✅ **User Management (100%)**
  - ✅ Create users from admin panel with full validation
  - ✅ Delete users with safety checks (no self-deletion, no last admin)
  - ✅ Update user status (active/inactive)
  - ✅ Update user roles (customer/admin)
  - ✅ Password strength validation and hashing
  - ✅ Email uniqueness validation

**Deployment Checklist:**
- [x] Configure `NEXTAUTH_URL` in Vercel (set to production domain)
- [x] Configure `DATABASE_URL` in Vercel
- [x] Configure `NEXTAUTH_SECRET` in Vercel
- [x] Configure email credentials (`RESEND_API_KEY`, `EMAIL_FROM`)
- [ ] Configure Mercado Pago credentials in production
- [ ] Configure Cloudinary credentials in production (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, etc.)
- [ ] Set up Mercado Pago webhook URL in dashboard
- [ ] Test complete checkout flow in production
- [ ] Create first admin user:
  - Option 1: Use `npm run admin:create` script (if available)
  - Option 2: Direct database insert with hashed password
  - Option 3: After first customer registers, promote to admin via database

**First Admin Creation:**
The seed script NO LONGER creates an admin user automatically. To create the first admin:
1. Run `npm run db:seed` to populate products
2. Create first admin using one of the methods above
3. Login at `/auth/login` with admin credentials
4. Navigate to `/admin/usuarios/nuevo` to create additional users

**Optional Enhancements:**
1. Add order tracking functionality
2. Add customer reviews and ratings system
3. Add promotional codes/coupons system
4. Add cart expiration (cleanup old items automatically)
5. Add stock validation in cart before checkout
6. Add price change alerts for cart items
