import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContextProvider'
import { CartProvider } from '@/contexts/CartProvider'
import CartWrapper from '@/components/cart/CartWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Menu - Digital Restaurant Menu',
  description: 'A modern digital menu solution with QR code ordering and payment integration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <CartWrapper />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
