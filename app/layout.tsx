import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./(platform)/cart/context/cart-context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Suspense>
            <CartProvider>
              <div className="overflow-hidden">{children}</div>
              <Toaster />
            </CartProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
