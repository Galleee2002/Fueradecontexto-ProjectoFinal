# Plan de Proyecto: Fueradecontexto E-Commerce

## Información General

**Nombre del Proyecto:** Fueradecontexto
**Tipo:** E-commerce de ropa personalizada
**Productos:** Buzos, Gorras, Camperas, Remeras y accesorios
**Moneda:** ARS (Pesos Argentinos)
**Fase Actual:** Optimizaciones y Mejoras (Checkout completado)

---

## Stack Tecnológico

### Framework & Lenguaje
- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **React 19**

### Estilos & UI
- **Tailwind CSS v4**
- **ShadCN/UI** (estilo New York)
- **sonner** (Notificaciones/Toasts)
- **next-themes** (toggle dark/light mode)
- **Lucide React** (iconos)

### Carruseles & Animaciones
- **Embla Carousel**

### Estado & Persistencia
- **React Context API** (Cart & Wishlist)
- **localStorage** (persistencia client-side)
- **Zustand** (estado global para admin panel)

### Backend & Database
- **Prisma ORM 7.3.0**
- **PostgreSQL** (Railway)
- **NextAuth.js v5** (Autenticación)

### Formularios & Validación
- **react-hook-form**
- **zod**
- **@hookform/resolvers**

### Admin Panel
- **@tanstack/react-table**

---

## Páginas y Funcionalidades

(... secciones 1 a 5 sin cambios ...)

### 6. Autenticación (`/login`, `/registro`, `/recuperar`)
**Estado: ✅ Funcional con NextAuth.js**
- **Login (`/auth/login`):** Formulario de inicio de sesión con email/contraseña.
- **Registro (`/auth/registro`):** Formulario para crear nuevas cuentas.
- **Verificación (`/auth/verify`):** Página para verificar el email del usuario.
- **Recuperación (`/auth/forgot-password`, `/auth/reset-password`):** Flujo completo para reseteo de contraseña.
- **Error (`/auth/error`):** Página para mostrar errores de autenticación.
- **Navbar:** El menú de navegación es dinámico y cambia según el estado de la sesión del usuario.

---

(... secciones 7 a 8 sin cambios ...)

---

## Estado de Implementación Backend

### ✅ Fase 2: Base de Datos (COMPLETADO)
(... sin cambios ...)

### ✅ Fase 2.5: Admin Panel (COMPLETADO)
- El panel de administración para Productos, Pedidos y Usuarios es funcional.
- La autenticación ahora es manejada por NextAuth.js en lugar de un sistema temporal.

**Documentación detallada:** `docs/ADMIN-DASHBOARD.md`

---

### ✅ Fase 3: Autenticación (COMPLETADO)
**Prioridad: Alta** (100% completado)

**Tareas completadas:**
- ✅ Instalación y configuración de NextAuth.js + Prisma Adapter.
- ✅ Providers: Credentials para login con email/contraseña.
- ✅ Session management con JWT.
- ✅ Protección de rutas (`/mi-cuenta/*`, `/admin/*`) con middleware.
- ✅ Verificación de `role="admin"` en todas las rutas y APIs del panel de admin.
- ✅ **UI Funcional**: Creadas las páginas de Login, Registro, Error, Verificación y Reseteo de contraseña.
- ✅ **Navbar Dinámica**: Implementado el menú de usuario y botón de logout.
- ✅ **Emails Transaccionales**: Integrado `Resend` para verificación de email y recuperación de contraseña.
- ✅ **Testing Completo**: Realizadas pruebas manuales de todos los flujos de autenticación, confirmando su correcto funcionamiento.

**Tareas pendientes:**
- ⏳ **Provider Opcional**: Añadir Google como proveedor de OAuth (baja prioridad).

---

### ✅ Fase 4: Checkout y Pagos (COMPLETADO)
**Prioridad: Alta** (100% completado)

**Resumen:**
Se implementó el flujo completo de checkout integrado con **Mercado Pago Checkout Pro** (redirect), incluyendo gestión de stock, webhooks para actualización de estados, y emails de confirmación.

**Tareas completadas:**

**1. Base de Datos:**
- ✅ Migración Prisma con campos de Mercado Pago al modelo `Order`:
  - `mpPreferenceId`, `mpPaymentId`, `mpStatus`, `mpPaymentType`, `mpMerchantOrder`, `paidAt`
  - Índice en `mpPaymentId` para búsquedas rápidas

**2. Validación:**
- ✅ Schemas Zod en `src/lib/validations/checkout.ts`:
  - `shippingAddressSchema` - Validación completa de dirección (24 provincias argentinas)
  - `shippingMethodSchema` - Métodos de envío (Standard/Express)
  - `createOrderSchema` - Validación del checkout completo

**3. Gestión de Stock:**
- ✅ Creado `src/lib/db/stock.ts` con transacciones atómicas:
  - `reserveStock()` - Reserva stock al crear orden
  - `restoreStock()` - Devuelve stock si pago falla
  - `checkStockAvailability()` - Verifica disponibilidad antes de reservar

**4. Integración Mercado Pago:**
- ✅ Instalado SDK de Mercado Pago
- ✅ Creada carpeta `src/lib/mercadopago/`:
  - `client.ts` - Cliente SDK con lazy initialization
  - `preference.ts` - Creación de preferencias de pago
  - `payment.ts` - Consulta de pagos desde API de MP
  - `webhooks.ts` - Validación de webhooks
  - `types.ts` - Definiciones de tipos TypeScript

**5. Database Layer:**
- ✅ Expandido `src/lib/db/orders.ts`:
  - `createOrder()` - Crea orden con status pending
  - `updateOrderMpPreference()` - Guarda ID de preferencia MP
  - `updateOrderPaymentStatus()` - Actualiza desde webhook
  - `generateOrderNumber()` - Formato: `FDC-2026-XXXXX`
  - `getUserOrders()` - Historial de pedidos del usuario

**6. API Routes:**
- ✅ `POST /api/checkout/create-order`:
  - Validación de datos (Zod)
  - Verificación de stock disponible
  - Reserva de stock atómica
  - Creación de orden en BD
  - Creación de preferencia MP
  - Retorno de checkout URL
  - Rollback automático en errores
- ✅ `POST /api/mercadopago/webhook`:
  - Procesamiento de notificaciones de pago
  - Actualización de estado de orden
  - Envío de email (si aprobado)
  - Restauración de stock (si rechazado)

**7. Email Service:**
- ✅ Creado `src/lib/email/order-confirmation.ts`:
  - Template HTML completo
  - Resumen de productos con imágenes
  - Dirección de envío
  - Número de orden y total
  - Link a historial de pedidos
  - Integrado con Resend

**8. Frontend:**
- ✅ `src/components/checkout/shipping-form.tsx`:
  - Migrado a react-hook-form + Zod
  - Validación en tiempo real
  - Dropdown de 24 provincias
  - Mensajes de error claros
- ✅ `src/app/checkout/page.tsx`:
  - Flujo de 3 pasos (dirección → envío → confirmación)
  - Integración con API de creación de orden
  - Limpieza de carrito antes de redirect
  - Manejo de errores con toast notifications
- ✅ `src/app/checkout/success/[orderId]/page.tsx`:
  - Página de confirmación de pago
  - Muestra número de orden y total
  - Validación de propiedad del pedido
- ✅ `src/app/checkout/failure/page.tsx`:
  - Página de error de pago
  - Explicación de causas comunes
  - Links para reintentar o volver

**9. UI Components:**
- ✅ Instalado `sonner` para notificaciones toast
- ✅ Actualizado `OrderSummary` para costo de envío dinámico

**Arquitectura Implementada:**

**Flujo de Checkout:**
```
1. Usuario llena formulario de envío (validado)
2. Usuario selecciona método de envío
3. Usuario confirma pedido
4. Backend crea orden y reserva stock
5. Backend crea preferencia en MP
6. Usuario redirigido a Mercado Pago
7. Usuario completa pago
8. MP envía webhook
9. Backend actualiza estado y envía email
10. Usuario ve página de éxito
```

**Flujo de Stock:**
```
Crear Orden → Reservar Stock → Crear Preferencia MP
                    ↓ (en error)
                Restaurar Stock
```

**Configuración Requerida:**
- Variables de entorno: `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_PUBLIC_KEY`
- Webhook configurado en panel de MP
- Para desarrollo local: usar ngrok

**Estado del Build:**
- ✅ Build exitoso sin errores
- ✅ TypeScript sin errores
- ✅ 62 rutas generadas

**Tareas pendientes:**
- ⏳ Configurar credenciales de producción en Mercado Pago
- ⏳ Configurar webhook URL en dashboard de MP
- ⏳ Probar flujo completo con credenciales sandbox
- ⏳ Monitorear logs de webhook en producción

**Documentación:**
- Instrucciones completas en `.env.example`
- Arquitectura documentada en `CLAUDE.md`
- Guía de implementación en `docs/NEXT-STEPS.md`

---

## Estructura del Proyecto

### Directorios Clave

```
src/
├── app/
│   ├── (auth)/                 # Grupo de rutas de autenticación ✅
│   │   ├── login/
│   │   ├── registro/
│   │   └── error/
│   ├── admin/                  # Panel de administración ✅
...
├── components/
...
│   ├── ui/                     # ShadCN UI components
│   │   ├── sonner.tsx          # Componente de notificaciones ✅
...
```

---
(... resto del archivo sin cambios ...)