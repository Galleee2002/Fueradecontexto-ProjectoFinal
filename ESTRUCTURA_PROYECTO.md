# Estructura del Proyecto - Fuera de Contexto

## Overview
Este es un e-commerce de ropa personalizada desarrollado con Next.js 16, TypeScript y Tailwind CSS. El proyecto se enfoca en la venta de prendas personalizadas como buzos, gorras, camperas, remeras y accesorios.

## Stack Tecnológico

### Frontend
- **Next.js 16.1.5** - Framework React con App Router
- **React 19.2.3** - Biblioteca principal de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Lucide React** - Iconos

### UI Components
- **Radix UI** - Componentes accesibles:
  - Avatar, Checkbox, Dialog, Dropdown Menu
  - Navigation Menu, Select, Separator, Slot
  - Tabs, Toggle, Toggle Group, Tooltip

### Características Adicionales
- **next-themes** - Soporte para dark/light mode
- **embla-carousel** - Carousel para imágenes
- **class-variance-authority** - Gestión de variantes de componentes
- **clsx & tailwind-merge** - Utilidades de CSS

---

## Estructura de Directorios

```
fueradecontexto/
├── public/                     # Archivos estáticos
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── checkout/
│   │   │   └── page.tsx        # Página de checkout
│   │   ├── carrito/
│   │   │   └── page.tsx        # Página del carrito
│   │   ├── catalogo/
│   │   │   └── page.tsx        # Catálogo de productos
│   │   ├── producto/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Detalle de producto dinámico
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Estilos globales
│   │   └── favicon.ico         # Favicon
│   ├── components/             # Componentes React
│   │   ├── home/               # Componentes de homepage
│   │   │   ├── hero-banner.tsx
│   │   │   ├── category-row.tsx
│   │   │   ├── flash-sale-section.tsx
│   │   │   ├── todays-picks-section.tsx
│   │   │   ├── best-sellers-section.tsx
│   │   │   └── quote-banner.tsx
│   │   ├── layout/             # Componentes de layout
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── top-banner.tsx
│   │   ├── product/            # Componentes de producto
│   │   │   ├── product-info.tsx
│   │   │   ├── image-gallery.tsx
│   │   │   ├── color-selector.tsx
│   │   │   ├── size-selector.tsx
│   │   │   ├── product-tabs.tsx
│   │   │   └── related-products.tsx
│   │   ├── catalog/             # Componentes de catálogo
│   │   │   └── sort-dropdown.tsx
│   │   ├── shared/             # Componentes compartidos
│   │   │   ├── product-card.tsx
│   │   │   ├── quantity-selector.tsx
│   │   │   ├── countdown-timer.tsx
│   │   │   ├── category-icon.tsx
│   │   │   ├── wishlist-button.tsx
│   │   │   ├── rating-stars.tsx
│   │   │   ├── price-display.tsx
│   │   │   ├── cart-icon.tsx
│   │   │   ├── search-bar.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── ui/                 # Componentes UI base (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── carousel.tsx
│   │   │   └── pagination.tsx
│   │   └── theme-provider.tsx  # Provider de tema
│   ├── context/                # React Context
│   │   ├── cart-context.tsx    # Estado del carrito
│   │   └── wishlist-context.tsx # Estado de wishlist
│   ├── hooks/                  # Custom React Hooks
│   │   ├── use-mobile.ts       # Detección de móvil
│   │   ├── use-cart.ts         # Hook del carrito
│   │   └── use-wishlist.ts     # Hook de wishlist
│   ├── data/                   # Datos estáticos
│   │   ├── products.ts         # Catálogo de productos
│   │   ├── categories.ts       # Categorías
│   │   └── banners.ts          # Banners promocionales
│   ├── lib/                    # Utilidades
│   │   ├── utils.ts            # Funciones helper
│   │   ├── constants.ts        # Constantes
│   │   └── formatters.ts       # Formateo de datos
│   └── types/                  # Definiciones TypeScript
│       └── index.ts            # Tipos principales
├── components.json              # Configuración shadcn/ui
├── next.config.ts              # Configuración Next.js
├── tsconfig.json               # Configuración TypeScript
├── tailwind.config.js          # Configuración Tailwind
├── postcss.config.mjs          # Configuración PostCSS
├── eslint.config.mjs           # Configuración ESLint
├── package.json                # Dependencias y scripts
├── package-lock.json           # Lock de dependencias
└── README.md                   # Documentación básica
```

---

## Pages y Rutas

### 1. Homepage (`/`)
- **Componente**: `src/app/page.tsx`
- **Secciones**:
  - Hero Banner
  - Fila de Categorías
  - Flash Sale (con countdown)
  - Picks del Día
  - Más Vendidos
  - Banner con Cita

### 2. Catálogo (`/catalogo`)
- **Componente**: `src/app/catalogo/page.tsx`
- **Funcionalidades**:
  - Grid de productos
  - Filtros por categoría, precio, talla, color
  - Ordenamiento (relevancia, precio, novedad, más vendidos)
  - Paginación

### 3. Detalle de Producto (`/producto/[slug]`)
- **Componente**: `src/app/producto/[slug]/page.tsx`
- **Características**:
  - Galería de imágenes
  - Selector de colores y tallas
  - Información detallada
  - Productos relacionados
  - Reviews y calificaciones
  - Botones de carrito y wishlist

### 4. Carrito (`/carrito`)
- **Componente**: `src/app/carrito/page.tsx`
- **Funcionalidades**:
  - Lista de items del carrito
  - Modificación de cantidades
  - Cálculo de totales
  - Checkout redirect

### 5. Checkout (`/checkout`)
- **Componente**: `src/app/checkout/page.tsx`
- **Proceso**:
  - Formulario de envío
  - Método de pago
  - Resumen del pedido
  - Confirmación

---

## Estado Global (Context API)

### 1. Cart Context
- **Ubicación**: `src/context/cart-context.tsx`
- **Funcionalidades**:
  - Agregar/eliminar productos
  - Modificar cantidades
  - Calcular totales
  - Persistencia en localStorage

### 2. Wishlist Context
- **Ubicación**: `src/context/wishlist-context.tsx`
- **Funcionalidades**:
  - Agregar/eliminar productos
  - Verificar si un producto está en wishlist
  - Persistencia en localStorage

---

## Tipos de Datos Principales

### Product (`src/types/index.ts`)
```typescript
interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  category: CategorySlug
  sizes: Size[]
  colors: ProductColor[]
  rating: number
  reviewCount: number
  soldCount: number
  isNew?: boolean
  isFeatured?: boolean
  isFlashSale?: boolean
  stock: number
  tags: string[]
}
```

### Categorías Disponibles
- `buzos` - Buzos personalizados
- `gorras` - Gorras y gorros
- `camperas` - Camperas y jackets
- `remeras` - Remeras y t-shirts
- `accesorios` - Accesorios varios

### CartItem
```typescript
interface CartItem {
  product: Product
  quantity: number
  selectedSize: Size
  selectedColor: ProductColor
}
```

---

## Custom Hooks

### 1. useCart (`src/hooks/use-cart.ts`)
- Abstrae las operaciones del carrito
- Métodos: addItem, removeItem, updateQuantity, clearCart, getTotal

### 2. useWishlist (`src/hooks/use-wishlist.ts`)
- Gestiona operaciones de wishlist
- Métodos: addItem, removeItem, isInWishlist, toggle

### 3. useMobile (`src/hooks/use-mobile.ts`)
- Detección responsive
- Retorna boolean para breakpoint móvil

---

## Componentes UI Reutilizables

### Base UI (`src/components/ui/`)
Implementación de shadcn/ui con:
- Buttons con variantes (default, destructive, outline, secondary, ghost, link)
- Cards con header, content, footer
- Badges para status y categorías
- Inputs formateados
- Dialogs modales
- Sheets para mobile navigation
- Dropdown menus
- Navigation menus
- Selects personalizados
- Checkboxes
- Tabs
- Skeletons para loading states
- Tooltips
- Toggles y Toggle Groups
- Carousel con Embla
- Pagination

### Shared Components (`src/components/shared/`)
- **ProductCard**: Card estándar para productos
- **QuantitySelector**: Selector de cantidad con +/-
- **CountdownTimer**: Timer para ofertas
- **CategoryIcon**: Iconos de categorías
- **WishlistButton**: Botón corazón para wishlist
- **RatingStars**: Display de calificación
- **PriceDisplay**: Formateo de precios
- **CartIcon**: Icono del carrito con contador
- **SearchBar**: Barra de búsqueda
- **ThemeToggle**: Switch dark/light mode

---

## Utilidades y Helpers

### Formatters (`src/lib/formatters.ts`)
- Formateo de precios (moneda local)
- Formateo de fechas
- Truncamiento de texto

### Constants (`src/lib/constants.ts`)
- URLs de API
- Configuración de la app
- Límites y valores por defecto

### Utils (`src/lib/utils.ts`)
- Funciones de utilidad general
- Combinación de clases CSS
- Validaciones

---

## Scripts Disponibles

```json
{
  "dev": "next dev",        // Servidor de desarrollo
  "build": "next build",    // Build para producción
  "start": "next start",    // Servidor producción
  "lint": "eslint"          // Linting del código
}
```

---

## Características Técnicas

### 1. Responsive Design
- Mobile-first approach
- Breakpoints personalizados
- Componentes adaptativos

### 2. Performance
- Imágenes optimizadas con Next.js Image
- Component loading lazy
- Bundle splitting

### 3. SEO
- Metadatos dinámicos
- URLs amigables
- Structured data

### 4. Accesibilidad
- Componentes Radix UI (WCAG compliant)
- Navegación por teclado
- Screen reader support

### 5. Theme System
- Dark/Light mode
- Persistencia de preferencias
- Transiciones suaves

---

## Datos de Ejemplo

Los productos, categorías y banners están definidos en archivos estáticos en `src/data/` para facilitar el desarrollo y testing.

---

## Configuración de Desarrollo

1. **Instalación**:
   ```bash
   npm install
   ```

2. **Desarrollo**:
   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Linting**:
   ```bash
   npm run lint
   ```

---

## Notas Adicionales

- **Path Alias**: `@/*` apunta a `src/*`
- **Variables de Entorno**: Configurar según necesidad para producción
- **Deploy**: Optimizado para Vercel
- **Imágenes**: Utilizar formato webp para mejor performance
- **Fuentes**: Geist Sans y Geist Mono optimizadas con next/font