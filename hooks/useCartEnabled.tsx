'use client'

import { useMemo } from 'react'

import { useMenuData } from '@/contexts/MenuDataProvider'

/**
 * Hook to check if cart functionality should be enabled based on restaurant metadata
 * @returns boolean indicating if cart functionality is enabled
 */
export function useCartEnabled() {
  const { restaurant } = useMenuData()

  const isCartEnabled = useMemo(() => !!restaurant?.hasCart, [restaurant?.hasCart])

  return isCartEnabled
}
