'use client'

import { useCallback } from 'react'
import { useMenuData } from '@/contexts/MenuDataProvider'
import { useAuth } from '@/contexts/AuthContextProvider'
import { useErrorHandler } from './useErrorHandler'

export function useSharedOperations() {
  const { refreshItems, refreshCategories, refreshFilters, refreshDailyMenu, refreshRestaurant } =
    useMenuData()
  const { isAdmin } = useAuth()
  const { handleError } = useErrorHandler()

  // Shared refresh logic
  const refreshData = useCallback(() => {
    refreshItems(isAdmin) // isAdmin determines if we show hidden items
  }, [refreshItems, isAdmin])

  return {
    refreshData,
    handleError,
    refreshItems,
    refreshCategories,
    refreshFilters,
    refreshDailyMenu,
    refreshRestaurant,
  }
}
