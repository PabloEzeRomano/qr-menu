'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContextProvider'
import { MenuDataProvider } from './MenuDataProvider'
import { MenuProvider } from './MenuContextProvider'
import { CartProvider } from './CartProvider'
import { ErrorProvider } from './ErrorProvider'
import CartWrapper from '@/components/cart/CartWrapper'

interface AppProviderProps {
  children: ReactNode
}

/**
 * Consolidated provider that wraps all app-level contexts
 * This reduces the provider nesting and makes the context hierarchy clearer
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorProvider>
      <AuthProvider>
        <MenuDataProvider>
          <MenuProvider>
            <CartProvider>
              {children}
              <CartWrapper />
            </CartProvider>
          </MenuProvider>
        </MenuDataProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}
