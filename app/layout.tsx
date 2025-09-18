import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/contexts/AuthContextProvider'
import { CartProvider } from '@/contexts/CartProvider'
import CartWrapper from '@/components/cart/CartWrapper'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import '@/lib/env' // Validate environment on startup

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Menu - Digital Restaurant Menu',
  description: 'A modern digital menu solution with QR code ordering and payment integration',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QR Menu',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06b6d4',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <CartWrapper />
              <ServiceWorkerRegistration />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
