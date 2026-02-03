# Plan de Proyecto: Fueradecontexto E-Commerce

## Información General

**Nombre del Proyecto:** Fueradecontexto
**Tipo:** E-commerce de ropa personalizada
**Productos:** Buzos, Gorras, Camperas, Remeras y accesorios
**Moneda:** ARS (Pesos Argentinos)
**Fase Actual:** Implementación de Checkout

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

(... resto de fases y secciones sin cambios significativos en su estado general, solo en el contexto de que Auth ya está más avanzado ...)

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