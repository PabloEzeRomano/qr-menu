'use client'

import { ReactNode } from 'react'

import CartWrapper from '@/components/cart/CartWrapper'

import { AuthProvider } from './AuthContextProvider'
import { CartProvider } from './CartProvider'
import { ErrorProvider } from './ErrorProvider'
import { FiltersProvider } from './FiltersProvider'
import { MenuProvider } from './MenuContextProvider'
import { MenuDataProvider } from './MenuDataProvider'
import { TagsProvider } from './TagsProvider'

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
        <TagsProvider>
          <FiltersProvider>
            <MenuDataProvider>
              <MenuProvider>
                <CartProvider>
                  {children}
                  <CartWrapper />
                </CartProvider>
              </MenuProvider>
            </MenuDataProvider>
          </FiltersProvider>
        </TagsProvider>
      </AuthProvider>
    </ErrorProvider>
  )
}
