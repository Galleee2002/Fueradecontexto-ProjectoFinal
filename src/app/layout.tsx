import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { TopBanner } from "@/components/layout/top-banner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Toaster } from "@/components/ui/sonner";
import { VerificationBanner } from "@/components/auth/verification-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Fueradecontexto | Ropa Personalizada",
  description:
    "Tienda de ropa personalizada - Buzos, Gorras, Camperas, Remeras y mas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <WishlistProvider>
                <TopBanner />
                <VerificationBanner />
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <ScrollToTop />
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
